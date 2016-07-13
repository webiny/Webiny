<?php
namespace Apps\Core\Php\View;

use Apps\Core\Php\DevTools\DevToolsTrait;
use Apps\Core\Php\Services\Apps;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\StorageException;
use Webiny\Component\TemplateEngine\Drivers\Smarty\AbstractSmartyExtension;
use Webiny\Component\TemplateEngine\Drivers\Smarty\SmartySimplePlugin;

setlocale(LC_MONETARY, 'en_GB.UTF-8');

class SmartyExtension extends AbstractSmartyExtension
{
    use DevToolsTrait, StdLibTrait;

    function getFunctions()
    {
        return [
            new SmartySimplePlugin('webiny', 'function', [$this, 'webinyInclude'])
        ];
    }

    /**
     * Returns the name of the plugin.
     *
     * @return string
     */
    function getName()
    {
        return 'webiny_extension';
    }

    public function webinyInclude($params, $smarty)
    {
        $env = $this->wConfig()->get('Application.Environment', 'production');
        $apiPath = $this->wConfig()->getConfig()->get('Application.ApiPath');
        $jsConfig = $this->wConfig()->getConfig()->get('Js', new ConfigObject())->toArray();
        $apps = new Apps();
        try {
            $meta = $apps->getAppsMeta('Core.Webiny');
        } catch (StorageException $e) {
            ob_end_clean();
            echo '<h2>Meta files are not available!</h2>';
            echo '<p>
                    This can be caused by one of the following things:
                    <ul>
                        <li>Build was never started</li>
                        <li>Build is currently in progress</li>
                    </ul>
                    Start a new build or wait until build process is finished, then refresh the page!
                </p>';
            die();
        }
        $cssPath = '';
        $jsPath = '';

        foreach ($meta['assets']['js'] as $file) {
            if ($this->str($file)->contains('/vendors')) {
                $jsPath = $file;
            }
        }

        foreach ($meta['assets']['css'] as $file) {
            if ($this->str($file)->contains('/vendors')) {
                $cssPath = $file;
            }
        }

        $config = json_encode($jsConfig, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);

        return <<<EOT
    <script type="text/javascript">
        var webinyEnvironment = '{$env}';
        var webinyApiUrl = '{$apiPath}';
        var webinyConfig = {$config};
    </script>
    <link href="{$cssPath}" rel="stylesheet" type="text/css"/>
    <script src="{$jsPath}" type="text/javascript"></script>
EOT;
    }
}