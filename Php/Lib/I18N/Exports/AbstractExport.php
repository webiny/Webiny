<?php

namespace Apps\Webiny\Php\Lib\I18N\Exports;

use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;

abstract class AbstractExport
{
    use WebinyTrait;

    protected static $i18nNamespace = 'Webiny.Lib.AbstractExport';

    /**
     * Holds current data, whether it came from db, yaml, json or another source.
     * @var array
     */
    protected $texts = [];

    /**
     * @var array
     */
    protected $apps = [];

    abstract public function fromDb();

    abstract public function toDb($options = null);

    public abstract function fromJson($content);

    public abstract function toJson($options = null);

    /**
     * Returns contents from a base64 encoded file.
     *
     * @param $file
     *
     * @return $this
     * @throws AppException
     */
    protected function fromBase64EncodedFile($file)
    {
        $file = $file['src'] ?? null;
        if (!$file) {
            throw new AppException($this->wI18n('Failed to import base64 encoded file - file empty.'));
        }

        $file = preg_replace('/data:.*?,/', '', $file, 1);
        if (!$file) {
            throw new AppException($this->wI18n('Failed to import base 64 encoded file - file empty.'));
        }

        // Let's decode ZIP content first.
        $file = base64_decode($file);
        if (!$file) {
            throw new AppException($this->wI18n('Failed to decode received base64 encoded content.'));
        }

        return $file;
    }

    public function fromJsonFile($data)
    {
        $data = $this->fromBase64EncodedFile($data);
        $this->fromJson($data);

        return $this;
    }

    public function downloadJson()
    {
        header('Content-disposition: attachment; filename=i18n_' . time() . '.json');
        header('Content-type: application/json');
        die($this->toJson(JSON_PRETTY_PRINT));
    }

    /**
     * @return array
     */
    public function getApps()
    {
        return $this->apps;
    }

    /**
     * @param array $apps
     *
     * @return $this
     */
    public function setApps($apps)
    {
        // Normalize list of apps.
        $this->apps = array_map(function ($app) {
            if (!$app instanceof App) {
                $name = $app;
                $app = $this->wApps()->getApp($name);
                if (!$app) {
                    throw new AppException($this->wI18n('Export failed, app {app} not found.', ['app' => $name]));
                }
            }

            return $app;
        }, $apps);

        return $this;
    }

    /**
     * @return array
     */
    public function getData()
    {
        return $this->texts;
    }

    /**
     * @param array $data
     *
     * @return $this
     */
    public function setData($data)
    {
        $this->texts = $data;

        return $this;
    }
}