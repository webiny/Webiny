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

    private $metaCache = [];

    function getFunctions()
    {
        return [
            new SmartySimplePlugin('webiny', 'function', [$this, 'webinyInclude']),
            new SmartySimplePlugin('webinyPreload', 'function', [$this, 'webinyPreload'])
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
        $jsConfig = $this->wConfig()->getConfig()->get('Js', new ConfigObject())->toArray();

        try {
            $meta = $this->getMeta('Webiny.Core');
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
            $metaConfig[$jsApp] = $this->getMeta($jsApp);
        }

        $flags = JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE;
        $config = json_encode($jsConfig, $flags);
        $appsMeta = json_encode($metaConfig, $flags);

        $browserSync = '';
        if (!$this->wIsProduction()) {
            $bsConfig = file_get_contents($this->wStorage('Root')->getAbsolutePath('webiny.json'));
            $bsConfig = $this->arr(json_decode($bsConfig, true));
            $bsPath = $this->url($this->wConfig()->get('Application.WebPath'))->setPort($bsConfig->keyNested('browserSync.port', 3000,
                true));
            $browserSync = '<script src="' . $bsPath . '/browser-sync/browser-sync-client.js?v=2.18.6"></script>';
        }

        return <<<EOT
    <script type="text/javascript">
        webinyConfig.Environment = '{$env}';
        webinyConfig.WebPath = '{$webPath}';
        webinyConfig.ApiPath = '{$apiPath}';
        webinyConfig.Js = {$config};
        webinyConfig.Meta = {$appsMeta};
    </script>
    <script src="{$meta['vendor']}" async></script> 
    {$browserSync}
    <webiny-app/>
EOT;
    }

    public function webinyPreload($params, $smarty)
    {
        $apps = array_filter(explode(',', $params['apps'] ?? ''));
        array_unshift($apps, 'Webiny.Core');

        $preload = [];
        foreach ($apps as $jsApp) {
            $meta = $this->getMeta($jsApp);
            $preload[] = ['src' => $meta['app'], 'as' => 'script'];
            if (isset($meta['vendor'])) {
                $preload[] = ['src' => $meta['vendor'], 'as' => 'script'];
            }

            if (isset($meta['bundles']['*'])) {
                $preload[] = ['src' => $meta['bundles']['*'], 'as' => 'script'];
            }

            if (isset($meta['css'])) {
                $preload[] = ['src' => $meta['css'], 'as' => 'style'];
            }
        }

        $links = array_map(function ($link) {
            return '<link rel="preload" href="' . $link['src'] . '" as="' . $link['as'] . '"/>';
        }, $preload);

        return join("\n\t", $links);
    }

    private function getMeta($jsApp)
    {
        if (!isset($this->metaCache[$jsApp])) {
            $appsHelper = new Apps();
            $this->metaCache[$jsApp] = $appsHelper->getAppsMeta($jsApp);
        }

        return $this->metaCache[$jsApp];
    }
}