<?php

namespace Apps\Webiny\Php\Lib\I18N\Parsers;

use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;

/**
 * Class SmartyParser
 * @package Apps\Webiny\Php\Lib\I18N\Parsers
 */
class SmartyParser extends AbstractParser
{
    use StdLibTrait, WebinyTrait, SingletonTrait;

    const REGEX = [
        'basic'     => '/{i18n/',
        'namespace' => '/\{i18n.*?namespace=[\'|"]([a-zA-Z0-9\.]*)[\'|"].*?\}/'
    ];

    /**
     * Parses Smarty templates located in /Templates folder, where i18n is used with a Smarty extension - function. It's not too hard,
     * but there is a difference when defining variables, delimiters are not { } but [ ], because Smarty complains.
     *
     * @param App $app
     *
     * @return array
     * @throws AppException
     */
    public function parse(App $app)
    {
        $texts = [];

        // Projects don't have to have Templates folder necessarily.
        if (!file_exists($app->getPath() . '/Templates')) {
            return [];
        }

        $di = new RecursiveDirectoryIterator($app->getPath() . '/Templates', RecursiveDirectoryIterator::SKIP_DOTS);
        $it = new RecursiveIteratorIterator($di);
        foreach ($it as $file) {
            /* @var SplFileInfo $file */
            if (in_array(pathinfo($file, PATHINFO_EXTENSION), ['tpl'])) {
                $content = file_get_contents($file->getPathname());
                $content = trim(preg_replace('/\s+/', ' ', $content));

                $parsed = self::parseTexts($content);
                foreach ($parsed as $text) {
                    $texts[] = [
                        'app'  => $app->getName(),
                        'key'  => $text['namespace'] . '.' . md5($text['base']),
                        'base' => $text['base'],
                        'meta' => ['scanned' => true]
                    ];
                }
            }
        }

        return $texts;
    }

    /**
     * @param             $content
     *
     * @return array
     */
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
            $remainingContent = substr($content, $index);
            $remainingContentLength = strlen($remainingContent);

            preg_match(self::REGEX['namespace'], $remainingContent, $namespace);
            $namespace = $namespace[1] ?? null;

            // Now let's get the full string, we must look forward until we reach the closing ')'.
            $base = null;
            $baseStartsAt = strpos($remainingContent, 'base=') + 5;

            for ($i = $baseStartsAt; $i < $remainingContentLength; $i++) {
                if (!$base) {
                    // If we have a delimiter, then let's assign a new part and process it fully with the following iterations.
                    if (in_array($remainingContent[$i], ['\'', '"'])) {
                        $base = ['delimiter' => $remainingContent[$i], 'start' => $i];
                    }
                    continue;
                }

                // We must recognize the last closing ' or ". The following examines three things:
                // 1) Is current character a delimiter
                // 2) Is it not-escaped - we just check the previous character, it must not be '\'
                if ($remainingContent[$i] !== $base['delimiter']) {
                    continue;
                }

                if ($remainingContent[$i - 1] === '\\') {
                    continue;
                }

                // Let's extract the part and remove "\" characters in there.
                $base = substr($remainingContent, $base['start'] + 1, $i - $base['start'] - 1);
                $base = str_replace('\\', '', $base);

                return ['namespace' => $namespace, 'base' => $base];
            }
        }, $positions);

    }
}