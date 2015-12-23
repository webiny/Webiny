<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright (c) 2009-2014 Webiny LTD. (http://www.webiny.com/)
 * @license   http://www.webiny.com/platform/license
 */

namespace Apps\Core\Php\PackageManager;

use Webiny\Component\Config\ConfigObject;

/**
 * Description
 */
class Plugin extends PackageAbstract
{
    use ParsersTrait;

    /**
     * Plugin base constructor.
     *
     * @param ConfigObject $info Plugin information.
     * @param string       $path Absolute path to the plugin.
     * @param string       $type
     */
    public function __construct(ConfigObject $info, $path, $type = "plugin")
    {
        parent::__construct($info, $path, $type);

        $this->parseNamespace($path);
        $this->parseEvents($info);
        $this->parseRoutes($info);
    }

}