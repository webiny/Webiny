<?php

namespace Apps\Webiny\Php\View;

use Apps\Webiny\Php\DevTools\WebinyTrait;
use Apps\Webiny\Php\Services\Apps;
use Webiny\Component\Config\ConfigObject;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\StorageException;
use Webiny\Component\TemplateEngine\Drivers\Smarty\AbstractSmartyExtension;
use Webiny\Component\TemplateEngine\Drivers\Smarty\SmartySimplePlugin;

setlocale(LC_MONETARY, 'en_GB.UTF-8');

class SmartyExtension extends AbstractSmartyExtension
{
    use WebinyTrait, StdLibTrait;

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
        $webPath = $this->wConfig()->getConfig()->get('Application.WebPath');
        $apiPath = $this->wConfig()->getConfig()->get('Application.ApiPath');
        $assetsCssPath = $this->wConfig()->getConfig()->get('Application.CssPath');
        $assetsJsPath = $this->wConfig()->getConfig()->get('Application.JsPath');
        $jsConfig = $this->wConfig()->getConfig()->get('Js', new ConfigObject())->toArray();

        $appsHelper = new Apps();

        try {
            $meta = $appsHelper->getAppsMeta('Webiny.Core');
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

        $metaConfig = ['Webiny.Core' => $meta];

        $apps = array_filter(explode(',', $params['apps'] ?? ''));

        foreach ($apps as $jsApp) {
            // Get meta for given JS app
            $metaConfig[$jsApp] = $appsHelper->getAppsMeta($jsApp);
        }

        $flags = JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE;
        $config = json_encode($jsConfig, $flags);
        $appsMeta = json_encode($metaConfig, $flags);

        $bsConfig = file_get_contents($this->wStorage('Root')->getAbsolutePath('webiny.json'));
        $bsConfig = $this->arr(json_decode($bsConfig, true));
        $bsPath = $this->url($this->wConfig()->get('Application.WebPath'))->setPort($bsConfig->keyNested('browserSync.port', 3000, true));
        $browserSync = '<script src="' . $bsPath . '/browser-sync/browser-sync-client.js?v=2.18.6"></script>';
        $jsDomain = '';
        $cssDomain = '';
        if ($this->wIsProduction()) {
            $browserSync = '';
            $jsDomain = $assetsJsPath;
            $cssDomain = $assetsCssPath;
        }

        return <<<EOT
    <script type="text/javascript">
        var webinyEnvironment = '{$env}';
        var webinyWebPath = '{$webPath}';
        var webinyApiPath = '{$apiPath}';
        var webinyCssPath = '{$cssDomain}';
        var webinyJsPath = '{$jsDomain}';
        var webinyConfig = {$config};
        var webinyMeta = {$appsMeta};
    </script>
    <script src="{$jsDomain}{$meta['vendor']}" async></script> 
    {$browserSync}
    <webiny-app/>
EOT;
    }
}