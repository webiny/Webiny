<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Lib\Apps\App;
use Apps\Webiny\Php\Lib\Exceptions\AppException;
use Apps\Webiny\Php\Lib\WebinyTrait;
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
class I18NAppTexts
{
    use WebinyTrait;

    protected static $i18nNamespace = 'Webiny.Lib.I18N';

    /**
     * @var App
     */
    private $app;

    private $texts = [];

    public function __construct(App $app = null, $texts = [])
    {
        $this->app = $app;
        $this->texts = $texts;
    }

    public function getApp()
    {
        return $this->app;
    }

    public function getTexts()
    {
        return $this->texts;
    }

    public function fromJson($content)
    {
        $content = json_decode($content, true);

        if (!is_array($content)) {
            throw new AppException($this->wI18n('Received an invalid JSON file.'));
        }

        $app = $content['app'] ?? null;
        if (!$app) {
            throw new AppException($this->wI18n('JSON file structure invalid, app not defined.'));
        }

        $app = $this->wApps($app);
        if (!$app) {
            throw new AppException($this->wI18n('App "{app}" not found.', ['app' => $content['app']]));
        }

        $this->app = $app;

        $this->texts = $content['texts'] ?? [];

        return $this;
    }

    public function toJson()
    {
        return json_encode([
            'app'   => $this->app->getName(),
            'texts' => $this->texts
        ]);
    }
}