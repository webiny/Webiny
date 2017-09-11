<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Entities\I18NLocale;
use Apps\Webiny\Php\Entities\I18NText;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\SingletonTrait;
use Webiny\Component\StdLib\StdLibTrait;
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
class I18N
{
    private $locale;

    use StdLibTrait, WebinyTrait, SingletonTrait;

    public function isEnabled()
    {
        return true;
    }

    public function translate($placeholder, $variables = [], $options = [])
    {
        $output = $placeholder;
        $namespace = $options['namespace'] ?? null;
        if (!$namespace) {
            throw new AppException('Cannot translate - text namespace missing.');
        }

        if ($text = I18NText::findByKey($namespace . '.' . md5($placeholder))) {
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
     * @param mixed $data
     *
     * @return array|I18NAppTexts
     */
    public function importTexts($data)
    {
        if (!is_array($data)) {
            $data = [$data];
        }

        $stats = ['ignored' => 0, 'inserted' => 0];

        foreach ($data as $appTexts) {
            /* @var I18NAppTexts $appTexts */
            foreach ($appTexts->getTexts() as $key => $texts) {
                foreach ($texts as $text) {
                    $textKey = $key . '.' . md5($text);
                    if (I18NText::count(['key' => $textKey])) {
                        $stats['ignored']++;
                        continue;
                    }

                    $i18nText = new I18NText();
                    $i18nText->key = $textKey;
                    $i18nText->app = $appTexts->getApp()->getName();
                    $i18nText->placeholder = $text;
                    $i18nText->save();

                    $stats['inserted']++;
                }
            }
        }

        return $stats;
    }

    public function importTextsFromZip($base64EncodedZipContent)
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
        $storage->setContents($temp['file'], $content);

        // Let's extract it and import file by file.
        $zip = new \ZipArchive;
        $opened = $zip->open($storage->getAbsolutePath($temp['file']));
        if ($opened === true) {
            $zip->extractTo($storage->getAbsolutePath($temp['folder']));
            $zip->close();

            $stats = ['ignored' => 0, 'inserted' => 0];
            foreach ($storage->getKeys($temp['folder']) as $file) {
                $texts = new I18NAppTexts();
                $importStats = I18N::getInstance()->importTexts($texts->fromJson($storage->getContents($file)));
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