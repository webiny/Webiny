<?php

namespace Apps\Webiny\Php\Lib\I18N\Parsers;

use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Apps\JsApp;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class JsParser
 * @package Apps\Webiny\Php\Lib\I18N\Parsers
 */
class JsParser extends AbstractParser
{
    use StdLibTrait, WebinyTrait, SingletonTrait;

    const REGEX = [
        'namespace'       => '/@i18n.namespace ([' . self::NAMESPACE_ALLOWED_CHARS . ']*)?/',
        'this.i18n'           => '/this\.i18n\([\'\`\"]/m',
        'Webiny.I18n'           => '/Webiny\.I18n\([\'\`\"]/m',
        'customNamespace' => '/\.i18n\([\'|"|`]{1}.*?[\'|"|`]{1},.*?, ?\{.*?[\'|"|`]?namespace[\'|"|`]? ?: ?[\'|"|`]{1}([' . self::NAMESPACE_ALLOWED_CHARS . ']*?)[\'|"|`]{1}.*?\}\)/',
    ];

    /**
     * When matching code for usage of i18n, it's possible to have many cases (ordered by most used):
     * 1) this.i18n('Some text')
     * 2) this.i18n('Some text and a {variable}', {variable: 'Variable Value'})
     * 3) this.i18n('Some text and a {variable}', {variable: 'Variable Value'}, {namespace: 'App.CustomNamespace'})
     * 4) same as all above, except instead of this.i18n, we have Webiny.I18n
     *
     * Parsing is hard because user can type anything as a base, delimiters could be ', ` or ", and inside the text developer
     * could've used an escaped version of the same character too. We could also have a combination of strings, like 'string1' + `string2`,
     * which adds another level of complexity to the whole feature.
     *
     * @param App $app
     *
     * @return array
     * @throws AppException
     */
    public function parse(App $app)
    {
        $texts = [];
        foreach ($app->getJsApps() as $jsApp) {
            /* @var JsApp $jsApp */

            $di = new RecursiveDirectoryIterator($jsApp->getDirectory()->getAbsolutePath(), RecursiveDirectoryIterator::SKIP_DOTS);
            $it = new RecursiveIteratorIterator($di);
            foreach ($it as $file) {
                /* @var SplFileInfo $file */
                if (in_array(pathinfo($file, PATHINFO_EXTENSION), ['js', 'jsx'])) {
                    $content = file_get_contents($file->getPathname());
                    $content = trim(preg_replace('/\s+/', ' ', $content));

                    $parsed = self::parseTexts($content, $file);
                    foreach ($parsed as $text) {
                        $texts[] = [
                            'app' => $app->getName(),
                            'key' => $text['namespace'] . '.' . md5($text['base']),
                            'group' => null,
                            'base'  => $text['base']
                        ];
                    }

                    $parsed = self::parseTexts($content, $file, 'Webiny.I18n');
                    foreach ($parsed as $text) {
                        $texts[] = [
                            'app' => $app->getName(),
                            'key' => $text['namespace'] . '.' . md5($text['base']),
                            'group' => null,
                            'base'  => $text['base']
                        ];
                    }
                }
            }
        }

        return $texts;
    }

    /**
     * Parses each JS i18n usage. We could not get it working with a regex, so we unfortunately had to manually go over the contents.
     * @param             $content
     * @param SplFileInfo $file
     * @param string      $type
     *
     * @return array
     */
    private function parseTexts($content, SplFileInfo $file, $type = 'this.i18n')
    {
        preg_match_all(self::REGEX[$type], $content, $positions, PREG_OFFSET_CAPTURE);
        if (empty($positions)) {
            return [];
        }

        $positions = array_map(function ($item) {
            return $item[1];
        }, $positions[0]);


        $contentLength = strlen($content);
        $namespaces = self::parseNamespaces($content);

        // Parsing this.i18n usages is hard. We must analyze each use thoroughly, one by one.
        return array_map(function ($index) use ($content, $contentLength, $file, $namespaces, $type) {
            // Now let's get the full string, we must look forward until we reach the closing ')'.
            $base = ['part' => null, 'parts' => []];

            $offset = $type === 'this.i18n' ? 10 : 12;

            for ($i = $index + $offset; $i < $contentLength; $i++) {
                if (!$base['part']) {
                    // We don't have a part that we are working on.
                    // Did we then reach the end of placeholder ? If the next non-whitespace character is ',' or ')', we are done with matching
                    // the placeholder, otherwise we continue matching the rest. We only care about the rest if third parameter was set, as
                    // it may be an object that has 'key' field in it, which forces a custom key for the text.
                    $firstCharacterAfterLastlyProcessedPlaceholderPart = ltrim(substr($content, $i, 1));

                    if (in_array($firstCharacterAfterLastlyProcessedPlaceholderPart, [',', ')'])) {
                        $output = [
                            'base'      => implode('', $base['parts']),
                            'namespace' => self::getNamespaceOnIndex($index, $namespaces)
                        ];

                        if (!$output['namespace']) {
                            throw new AppException('Missing text namespace for text "' . $output['text'] . '", in ' . $file->getPathname());
                        }

                        if ($firstCharacterAfterLastlyProcessedPlaceholderPart === ')') {
                            // This means no additional parameters were sent. We can immediately return the placeholder.
                            return $output;
                        }


                        // This means we have additional parameters set. Let's see if we have custom key defined.
                        // We try to match the last JSON with all possible options.
                        preg_match(self::REGEX['customNamespace'], substr($content, $index), $matchedCustomNamespace);
                        if (isset($matchedCustomNamespace[1])) {
                            $output['namespace'] = $matchedCustomNamespace[1];
                        }

                        return $output;
                    }

                    // If we have a delimiter, then let's assign a new part and process it fully with the following iterations.
                    if (in_array($content[$i], ['`', '\'', '"'])) {
                        $base['part'] = ['delimiter' => $content[$i], 'start' => $i];
                    }
                    continue;
                }


                // We must recognize the last closing ', " or `. The following examines three things:
                // 1) Is current character a delimiter
                // 2) Is it not-escaped - we just check the previous character, it must not be '\'
                if ($content[$i] !== $base['part']['delimiter']) {
                    continue;
                }

                if ($content[$i - 1] === '\\') {
                    continue;
                }

                // Let's extract the part and remove "\" characters in there.
                $part = substr($content, $base['part']['start'] + 1, $i - $base['part']['start'] - 1);
                $part = str_replace('\\', '', $part);

                // Okay, now we are at the end of the part, so let's add it to the parts.
                $base['parts'][] = $part;
                $base['part'] = null;
            }
        }, $positions);
    }

    /**
     * Returns an array with all detected namespaces in current file. Each namespace will have opening and closing tag positions.
     *
     * @param source
     *
     * @return array
     */
    private static function parseNamespaces($source)
    {
        $matches = [];
        preg_match_all('/@i18n\.namespace +([A-Za-z\.0-9]*)?/', $source, $occurrences, PREG_OFFSET_CAPTURE);

        if (empty($occurrences[1])) {
            return [];
        }

        $occurrences = $occurrences[1];
        foreach ($occurrences as $occurrence) {
            $matches[] = ['index' => $occurrence[1], 'name' => trim($occurrence[0])];
        }

        $matches = array_reverse($matches);
        $output = [];
        foreach ($matches as $match) {
            if (!$match['name']) {
                array_unshift($output, ['from' => null, 'name' => null, 'to' => $match['index']]);
                continue;
            }

            $index = -1;
            foreach ($output as $i => $namespace) {
                if (!$namespace['from']) {
                    $index = $i;
                    break;
                }
            }

            if ($index >= 0) {
                $output[$index]['from'] = $match['index'];
                $output[$index]['name'] = $match['name'];
            } else {
                array_unshift($output, ['name' => $match['name'], 'from' => $match['index'], 'to' => null]);
            }
        }

        usort($output, function ($item1, $item2) {
            return $item1['from'] <=> $item2['from'];
        });

        return $output;
    }

    /**
     * Tells us to which i18n namespace current index belongs to.
     *
     * @param index
     * @param namespaces
     * @returns {*}
     */
    private static function getNamespaceOnIndex($index, $namespaces)
    {
        $current = null;
        foreach (array_reverse($namespaces) as $namespace) {
            if (!$namespace['to'] && $namespace['from'] < $index) {
                return $namespace['name'];
            }

            if ($namespace['from'] < $index && (!$namespace['to'] || $namespace['to'] > $index)) {
                return $namespace['name'];
            }
        };

        return $current;
    }
}