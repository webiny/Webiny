<?php

namespace Apps\Webiny\Php\Lib\I18N;

use Apps\Webiny\Php\Lib\Apps\App;
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
    /**
     * @var App
     */
    private $app;

    private $texts = [];

    public function __construct(App $app, $texts = [])
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

    public function toJson()
    {
        return json_encode($this->texts);
    }
}