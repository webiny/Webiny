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
 * Class that holds information about an application.
 */
class App extends PackageAbstract
{
    use ParsersTrait;

    /**
     * Application base constructor.
     *
     * @param ConfigObject $info Application information object.
     * @param string       $path Absolute path to the application.
     * @param string       $type
     *
     * @throws \Exception
     */
    public function __construct(ConfigObject $info, $path, $type = "app")
    {
        parent::__construct($info, $path, $type);

        $this->name = $info->get('Name', '');
        $this->version = $info->get('Version', '');

        if ($this->name == '' || $this->version == '') {
            throw new \Exception("A component must have both name and version properties defined.");
        }
        
        $this->parseNamespace($path);
        $this->parseEvents($info);
        $this->parseStorages($info);
        $this->parseServices($info);
        $this->parseRoutes($info);
    }
}