<?php

namespace Apps\Webiny\Php\Lib\I18N\I18NParser;

use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;

class PhpParser
{
    use StdLibTrait, WebinyTrait, SingletonTrait;

    // With a simple regex, we first find all this.i18n usages in given source.
    const REGEX = [
        'namespace'         => '/i18nNamespace\s{0,}=\s{0,}[\'|"]([a-zA-Z0-9\.-_:]+)[\'|"|`]/',
        'basic'       => '/wI18n\([\'|"]/mi',
        'customNamespace' => '/wI18n\([\'|"]{1}.*?[\'|"]{1},.*?, ?\[.*?[\'|"]namespace[\'|"] ?=> ?[\'|"]{1}([A-Za-z\.]*?)[\'|"]{1}.*?\]\)/'
    ];

    /**
     * @param App $app
     *
     * @return array
     * @throws AppException
     */
    public function parse(App $app)
    {
        $texts = [];

        $di = new RecursiveDirectoryIterator($app->getPath() . '/Php', RecursiveDirectoryIterator::SKIP_DOTS);
        $it = new RecursiveIteratorIterator($di);
        foreach ($it as $file) {
            /* @var SplFileInfo $file */
            if (in_array(pathinfo($file, PATHINFO_EXTENSION), ['php'])) {
                $content = file_get_contents($file->getPathname());
                $content = trim(preg_replace('/\s+/', ' ', $content));

                $parsed = ['namespace' => self::parseNamespace($content), 'texts' => self::parseTexts($content)];
                if (empty($parsed['texts'])) {
                    continue;
                }

                // If we don't have a global i18n namespace, we must ensure each text has it's own namespace in the file.
                foreach ($parsed['texts'] as $text) {
                    $namespace = $text['namespace'] ?? $parsed['namespace'];
                    if (!$namespace) {
                        throw new AppException('Missing text namespace for text "' . $text['base'] . '", in ' . $file->getPathname());
                    }

                    $texts[] = [
                        'key' => $namespace . '.' . md5($text['base']),
                        'group' => null,
                        'base' => $text['base']
                    ];
                }
            }
        }

        return $texts;
    }

    private function parseNamespace($content)
    {
        preg_match_all(self::REGEX['namespace'], $content, $namespace);

        return self::arr($namespace)->keyNested('1.0');
    }

    private function parseTexts($content)
    {
        preg_match_all(self::REGEX['basic'], $content, $positions, PREG_OFFSET_CAPTURE);
        if (empty($positions)) {
            return [];
        }

        $positions = array_map(function ($item) {
            return $item[1];
        }, $positions[0]);


        $contentLength = strlen($content);

        // Parsing this.i18n usages is hard. We must analyze each use thoroughly, one by one.
        return array_map(function ($index) use ($content, $contentLength) {
            // Now let's get the full string, we must look forward until we reach the closing ')'.
            $base = ['part' => null, 'parts' => []];


            for ($i = $index + 6; $i < $contentLength; $i++) {
                if (!$base['part']) {
                    // We don't have a part that we are working on.
                    // Did we then reach the end of base ? If the next non-whitespace character is ',' or ')', we are done with matching
                    // the base, otherwise we continue matching the rest. We only care about the rest if third parameter was set, as
                    // it may be an object that has 'key' field in it, which forces a custom key for the text.
                    $firstCharacterAfterLastlyProcessedPlaceholderPart = ltrim(substr($content, $i, 1));

                    if (in_array($firstCharacterAfterLastlyProcessedPlaceholderPart, [',', ')'])) {
                        $output = ['base' => implode('', $base['parts'])];

                        if ($firstCharacterAfterLastlyProcessedPlaceholderPart === ')') {
                            // This means no additional parameters were sent. We can immediately return the placeholder.
                            return $output;
                        }

                        // Check if custom key passed. We must loop until we reach 2nd ','  after which we have a custom key.
                        preg_match(self::REGEX['customNamespace'], substr($content, $index), $matchedCustomNamespace);
                        if (isset($matchedCustomNamespace[1])) {
                            $output['key'] = $matchedCustomNamespace[1];
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

                // Okay, now we are at the end of the part, so let's add it to the parts.
                $base['parts'][] = substr($content, $base['part']['start'] + 1, $i - $base['part']['start'] - 1);
                $base['part'] = null;
            }

        }, $positions);
    }
}