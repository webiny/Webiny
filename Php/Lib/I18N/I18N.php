<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Entities\I18NLocale;
use Apps\Webiny\Php\Entities\I18NText;
use Apps\Webiny\Php\Entities\I18NTextGroup;
use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\I18N\I18N\JsParser;
use Apps\Webiny\Php\Lib\I18N\I18N\PhpParser;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\StdLib\StdObject\ArrayObject\ArrayObject;

/**
 * Class I18N
 *
 * @property string      $key
 * @property string      $placeholder
 * @property ArrayObject $translations
 */
class I18N
{
    protected static $i18nNamespace = 'Webiny.Lib.I18N';

    private $locale;

    use StdLibTrait, WebinyTrait, SingletonTrait;

    public function isEnabled()
    {
        return true;
    }

    public function translate($base, $variables = [], $options = [])
    {
        $output = $base;
        $namespace = $options['namespace'] ?? null;
        if (!$namespace) {
            throw new AppException('Cannot translate - text namespace missing.');
        }

        if ($text = I18NText::findByKey($namespace . '.' . md5($base))) {
            $locale = $this->getLocale();
            /* @var I18NText $text */
            if ($text->hasText($locale)) {
                $output = $text->getText($locale);
            }
        }

        // Match variables
        preg_match_all('/\{(.*?)\}/', $output, $matches);
        $matches = $matches[1] ?? [];
        foreach ($matches as $match) {
            $variableName = '{' . $match . '}';
            if (isset($variables[$match]) && strpos($output, $variableName) !== -1) {
                $output = str_replace($variableName, $variables[$match], $output);
            }
        }

        return $output;
    }

    /**
     * @param string $language
     *
     * @return $this
     */
    public function setLocale($language)
    {
        $this->locale = $language;

        return $this;
    }

    public function getLocale()
    {
        if ($this->locale) {
            return $this->locale;
        }

        $this->locale = I18NLocale::findByKey($this->locale);

        return $this->locale;
    }

    /**
     * Scans given apps for i18n usages (both PHP and JS code).
     *
     * @param array $list
     *
     * @return I18NTextsCollection
     */
    public function scanApps(array $list)
    {
        // Normalize list of apps.
        $list = array_map(function ($app) {
            return is_string($app) ? self::wApps($app) : $app;
        }, $list);

        $textsCollection = new I18NTextsCollection();

        // Parse one-by-one.
        foreach ($list as $app) {
            /* @var App $app */
            $newCollection = self::getInstance()->scanApp($app);
            $textsCollection->appendTextsCollection($newCollection);
        }

        return $textsCollection;
    }

    /**
     * Scans given app for i18n usages (both PHP and JS code).
     *
     * @param App $app
     *
     * @return I18NTextsCollection
     */
    public function scanApp(App $app)
    {
        $texts = array_merge(PhpParser::getInstance()->parse($app), JsParser::getInstance()->parse($app));

        return new I18NTextsCollection($texts);
    }

    public function exportTexts(array $list)
    {
        // Normalize list of apps.
        $list = array_map(function ($app) {
            return $app instanceof App ? $app->getName() : $app;
        }, $list);

        $texts = self::wDatabase()->find(...[
            'I18NTexts',
            ['deletedOn' => null, 'app' => ['$in' => $list]],
            [],
            0,
            0,
            ['projection' => ['_id' => 0, 'app' => 1, 'group' => 1, 'key' => 1, 'base' => 1]]
        ]);

        $texts = new I18NTextsCollection($texts);
        $groups = I18NTextGroup::find(['app' => ['$in' => $list]])->toArray('id,name,app,description');

        return new I18NTextsExport($texts, $groups, $list);
    }

    /**
     * @param mixed $textsCollection
     *
     * @param array $options
     *
     * @return I18NTextsCollection|array
     * @throws AppException
     */
    public function importTexts(I18NTextsCollection $textsCollection, $options = [])
    {
        $options['overwriteExisting'] = $options['overwriteExisting'] ?? false;
        $stats = ['updated' => 0, 'created' => 0];

        // First iteration is just to make sure all data is valid.
        foreach ($textsCollection->getTexts() as $text) {
            if (!$text['key'] ?? null) {
                throw new AppException($this->wI18n('Invalid export format (text key missing).'));
            }

            if (!$text['base'] ?? null) {
                throw new AppException($this->wI18n('Invalid export format (base text missing).'));
            }
        }

        foreach ($textsCollection->get() as $text) {
            if (!$text['key'] ?? null) {
                throw new AppException($this->wI18n('Invalid export format (text key missing).'));
            }

            if (!$text['base'] ?? null) {
                throw new AppException($this->wI18n('Invalid export format (base text missing).'));
            }
        }

        // Now we know the data is valid, let's do the import.
        foreach ($textsCollection->getTexts() as $text) {
            // If text already exists in the database, we only update if overwriteExisting is set to true.
            $i18nText = I18NText::count(['key' => $text['key']]);
            if ($i18nText) {
                if ($options['overwriteExisting']) {
                    /* @var I18NText $i18nText */
                    $i18nText->populate($text)->save();
                    $stats['updated']++;
                }
                continue;
            }

            $i18nText = new I18NText();
            $i18nText->populate($text)->save();
            $stats['created']++;
        }

        return $stats;
    }

    public function importTextsFromZip($base64EncodedZipContent, $options = [])
    {
        $options['overwriteExisting'] = $options['overwriteExisting'] ?? false;

        if (!$base64EncodedZipContent) {
            throw new AppException($this->wI18n('Failed to import texts from ZIP archive - empty.'));
        }

        // Let's decode ZIP content first.
        $content = base64_decode(str_replace('data:application/zip;base64,', '', $base64EncodedZipContent));
        if (!$content) {
            throw new AppException($this->wI18n('Failed to decode received base64 encoded ZIP archive.'));
        }

        // To unzip, we must first store the file in temporary folder.
        $storage = $this->wStorage('Temp');
        $temp = ['folder' => uniqid(), 'file' => uniqid() . '.zip'];
        $storage->setContents($temp['file'], $content);

        // Let's extract it and import file by file.
        $zip = new \ZipArchive;
        $opened = $zip->open($storage->getAbsolutePath($temp['file']));
        if ($opened === true) {
            $zip->extractTo($storage->getAbsolutePath($temp['folder']));
            $zip->close();

            $stats = ['ignored' => 0, 'inserted' => 0];
            foreach ($storage->getKeys($temp['folder']) as $file) {
                $texts = new I18NTextsCollection();
                $importStats = I18N::getInstance()->importTexts($texts->fromJson($storage->getContents($file)), $options);
                $stats['ignored'] += $importStats['ignored'];
                $stats['inserted'] += $importStats['inserted'];
            }
        } else {
            throw new AppException($this->wI18n('Failed to open received ZIP archive.'));
        }

        return $stats;
    }

    public function importTranslations()
    {
    }

    public function importTranslationsFromZip()
    {
    }
}