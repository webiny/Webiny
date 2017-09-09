<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Apps\JsApp;
use Apps\Webiny\Php\Lib\Entity\AbstractEntity;
use Apps\Webiny\Php\Lib\WebinyTrait;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class User
 *
 * @package Apps\Selecto\Php\Entities
 *
 * @property string      $key
 * @property string      $placeholder
 * @property ArrayObject $translations
 */
class I18NParser extends AbstractEntity
{
    use WebinyTrait;

    // With a simple regex, we first find all this.i18n usages in given source.
    const REGEX = [
        'key'     => '/this\.i18n\.key\s{0,}=\s{0,}[\'|"|`]([a-zA-Z0-9\.-_:]+)[\'|"|`]/',
        'basic'   => '/this\.i18n\([\'\`\"]/mi',
        'options' => [
            'basic'  => '/,.*?,[ ]*(\{.*?\})\)/',
            'params' => [
                'key' => '/key:([ `\'"a-zA-Z0-9.]*)/' // Custom keys can only have letters, numbers and a dot.
            ]
        ]
    ];

    /**
     * When matching code for usage of i18n, it's possible to have three types (ordered by most used):
     * 1) this.i18n('Some text')
     * 2) this.i18n('Some text and a {variable}', {variable: 'Variable Value'})
     * 3) this.i18n('Some text and a {variable}', {variable: 'Variable Value'}, {key: 'App.CustomKey', xyz: 'asd'})
     * 4) same as above, except instead of this.i18n, we have Webiny.i18n, which has a 'key' as a first parameter, so total of 4 parameters here.
     *
     * So these are the method definitions:
     *
     * this.i18n(placeholder, variables, options)
     * Webiny.i18n(key, placeholder, variables, options)
     *
     * Parsing is hard because user can type anything as a placeholder, delimiters could be ', ` or ", and inside the text developer
     * could've used an escaped version of the same character too. We could also have a combination of strings, like 'string1' + `string2`,
     * which adds another level of complexity to the whole feature.
     *
     * @param App $app
     *
     * @return array
     */
    public static function parseApp(App $app)
    {
        $return = [];
        // TODO: recursive search using Webiny Directory object?
        foreach ($app->getJsApps() as $jsApp) {
            /* @var JsApp $jsApp */

            $return[$jsApp->getName()] = [];

            $di = new RecursiveDirectoryIterator($jsApp->getDirectory()->getAbsolutePath(), RecursiveDirectoryIterator::SKIP_DOTS);
            $it = new RecursiveIteratorIterator($di);
            foreach ($it as $file) {
                /* @var SplFileInfo $file */
                if (in_array(pathinfo($file, PATHINFO_EXTENSION), ['jsx'])) {
                    $content = file_get_contents($file->getPathname());
                    $content = trim(preg_replace('/\s+/', ' ', $content));

                    $texts = self::parseTexts($content);

                    if (empty($texts)) {
                        continue;
                    }

                    $return[$jsApp->getName()][] = [
                        'file' => $file->getPathname(),
                        'key' => self::parseKey($content),
                        'text' => $texts
                    ];
                }
            }
        }

        return $return;
    }

    private static function parseKey($content)
    {
        preg_match_all(self::REGEX['key'], $content, $key);

        $key = null;
        if (!isset($key[1])) {
            return null;
        }

        return is_string($key[1]) ? $key[1] : null;
    }

    private static function parseTexts($content)
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
            $placeholder = ['part' => null, 'parts' => []];


            for ($i = $index + 10; $i < $contentLength; $i++) {
                if (!$placeholder['part']) {
                    // We don't have a part that we are working on.
                    // Did we then reach the end of placeholder ? If the next non-whitespace character is ',' or ')', we are done with matching
                    // the placeholder, otherwise we continue matching the rest. We only care about the rest if third parameter was set, as
                    // it may be an object that has 'key' field in it, which forces a custom key for the text.
                    $firstCharacterAfterLastlyProcessedPlaceholderPart = ltrim(substr($content, $i, 1));

                    if (in_array($firstCharacterAfterLastlyProcessedPlaceholderPart, [',', ')'])) {
                        $output = ['placeholder' => implode('', $placeholder['parts'])];

                        if ($firstCharacterAfterLastlyProcessedPlaceholderPart === ')') {
                            // This means no additional parameters were sent. We can immediately return the placeholder.
                            return $output;
                        }


                        // This means we have additional parameters set. Let's see if we have custom key defined.
                        // We try to match the last JSON with all possible options.
                        preg_match(self::REGEX['options']['basic'], substr($content, $i), $options);

                        if (isset($options[1])) {
                            // OK, we received an object as the third parameter. We are doing parsing of the last JSON here.
                            // Currently we only check if 'key' was set and assign it to the output. If more relevant options emerge,
                            // this is the place to add parsing of them. Also, if this becomes complicated, extract this part into
                            // a separate function for better readability.

                            // List of matched options
                            $matched = ['key' => null];
                            // key: regex.options.params.key.exec(options[1])

                            // Some day more options could be here.
                            preg_match(self::REGEX['options']['params']['key'], $options[1], $matched['key']);

                            if ($matched['key']) {
                                $output['key'] = $matched['key'][1];
                            }
                        }

                        return $output;
                    }

                    // If we have a delimiter, then let's assign a new part and process it fully with the following iterations.
                    if (in_array($content[$i], ['`', '\'', '"'])) {
                        $placeholder['part'] = ['delimiter' => $content[$i], 'start' => $i];
                    }
                    continue;
                }


                // We must recognize the last closing ', " or `. The following examines three things:
                // 1) Is current character a delimiter
                // 2) Is it not-escaped - we just check the previous character, it must not be '\'
                if ($content[$i] !== $placeholder['part']['delimiter']) {
                    continue;
                }

                if ($content[$i - 1] === '\\') {
                    continue;
                }

                // Okay, now we are at the end of the part, so let's add it to the parts.
                $placeholder['parts'][] = substr($content, $placeholder['part']['start'] + 1, $i - $placeholder['part']['start'] - 1);
                $placeholder['part'] = null;
            }

        }, $positions);
    }
}