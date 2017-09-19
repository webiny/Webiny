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

    /**
     * Sets current locale.
     *
     * @param string $language
     *
     * @return $this
     */
    public function setLocale($language)
    {
        $this->locale = $language;

        return $this;
    }

    /**
     * Gets currently set locale.
     * @return I18NLocale|null
     */
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
     * @param array $options
     *
     * @return array
     */
    public function scanApps(array $list, $options = [])
    {
        // Normalize list of apps.
        $list = array_map(function ($app) {
            return is_string($app) ? self::wApps($app) : $app;
        }, $list);

        $stats = ['created' => 0, 'updated' => 0];

        // Parse one-by-one.
        foreach ($list as $app) {
            $scan = self::getInstance()->scanApp($app, $options);
            $stats['created'] += $scan['created'];
            $stats['updated'] += $scan['updated'];
        }

        return $stats;
    }

    /**
     * Scans given app for i18n usages (both PHP and JS code).
     *
     * @param App   $app
     * @param array $options
     *
     * @return array
     */
    public function scanApp(App $app, $options = [])
    {
        $texts = array_merge(PhpParser::getInstance()->parse($app), JsParser::getInstance()->parse($app));

        return $this->saveTextsToDb($texts, $options);
    }

    public function exportTranslations()
    {
    }

    public function importTranslations()
    {
    }

    /**
     * Returns export of all texts and text groups for given list of apps, which can be imported in another environment.
     *
     * @param array $list
     *
     * @return I18NTextsExport
     */
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

        $groups = I18NTextGroup::find(['app' => ['$in' => $list]])->toArray('id,name,app,description');

        return new I18NTextsExport($texts, $groups, $list);
    }

    /**
     * @param I18NTextsExport $export
     * @param array           $options
     *
     * @return array
     * @throws AppException
     */
    public function importTexts(I18NTextsExport $export, $options = [])
    {
        $options['overwriteExisting'] = $options['overwriteExisting'] ?? false;

        foreach ($export->getGroups() as $data) {
            $id = $data['id'] ?? null;
            $group = I18NTextGroup::findById($id);
            if (!$group) {
                $group = new I18NTextGroup();
                $group->id = $id;
            }

            /* @var I18NTextGroup $group */
            $group->name = $data['name'];
            $group->description = $data['description'];
            $group->app = $data['app'];
            $group->save();

        }

        return $this->saveTextsToDb($export->getTexts(), $options);
    }

    /**
     * Extracts ZIP archive that contains full texts export.
     *
     * @param $base64EncodedZipContent
     *
     * @return I18NTextsExport|array
     * @throws AppException
     */
    public function extractExportedTextsZip($base64EncodedZipContent)
    {
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
        $storage->setContents($temp['folder'] . '/' . $temp['file'], $content);

        // Let's extract it and import file by file.
        $zip = new \ZipArchive;
        $opened = $zip->open($storage->getAbsolutePath($temp['folder'] . '/' . $temp['file']));
        if ($opened === true) {
            $zip->extractTo($storage->getAbsolutePath($temp['folder']));
            $zip->close();

            $texts = new I18NTextsExport();
            $texts->fromJson($storage->getContents($temp['folder'] . '/export'));

            // Let's remove the folder completely.
            exec('rm -rf ' . $storage->getAbsolutePath($temp['folder']));

            return $texts;
        }

        throw new AppException($this->wI18n('Failed to open received ZIP archive.'));
    }

    /**
     * @param mixed $texts
     *
     * @param array $options
     *
     * @return array
     * @throws AppException
     */
    private function saveTextsToDb(array $texts = [], array $options = [])
    {
        // First iteration is just to make sure all data is valid.
        foreach ($texts as $text) {
            if (!$text['key'] ?? null) {
                throw new AppException($this->wI18n('Invalid export format (text key missing).'));
            }

            if (!$text['base'] ?? null) {
                throw new AppException($this->wI18n('Invalid export format (base text missing).'));
            }
        }

        $options['overwriteExisting'] = $options['overwriteExisting'] ?? false;
        $stats = ['updated' => 0, 'created' => 0];

        // Now we know the data is valid, let's do the import.
        foreach ($texts as $text) {
            // If text already exists in the database, we only update if overwriteExisting is set to true.
            $i18nText = I18NText::findOne(['key' => $text['key']]);
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

    /**********************************************************************************************************
     *                                                  TEST                                                  *
     **********************************************************************************************************/

    /**
     * Tells us whether I18N is enabled or not.
     * @return bool
     */
    public function isEnabled()
    {
        return true;
    }

    /**
     * @param       $base
     * @param array $variables
     * @param array $options
     *
     * @return $this|mixed|\Webiny\Component\StdLib\StdObject\StringObject\StringObject
     * @throws AppException
     */
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
}