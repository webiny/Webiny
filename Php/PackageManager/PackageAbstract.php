<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\PackageManager;

use Webiny\Component\Config\ConfigObject;

/**
 * Holds information about the defined package.
 */
abstract class PackageAbstract
{
    /**
     * @var string Name of the package.
     */
    protected $name;

    /**
     * @var string Package version.
     */
    protected $version;

    /**
     * @var string Link to the package on Webiny Store.
     */
    private $link;

    /**
     * @var string Package description.
     */
    protected $description;

    /**
     * @var string Author name.
     */
    protected $authorName;

    /**
     * @var string Link to authors website.
     */
    protected $authorLink;

    /**
     * @var string Authors email.
     */
    protected $authorEmail;

    /**
     * @var string Path to the package (relative to application root).
     */
    protected $path;

    /**
     * @var string Can be 'app' or 'plugin'.
     */
    protected $type;

    /**
     * Package config object
     *
     * @var ConfigObject
     */
    protected $config;

    /**
     * Base constructor.
     *
     * @param ConfigObject $info Package information.
     * @param string       $path Path to the package (relative to app root).
     * @param string       $type Can be app, plugin or theme.
     *
     * @throws \Exception
     */
    public function __construct(ConfigObject $info, $path, $type)
    {
        $this->populateProperties($info);
        $this->config = $info;
        $possibleTypes = ['app', 'plugin'];
        if (!in_array($type, $possibleTypes)) {
            throw new \Exception("Invalid package type: " . $type);
        }
        $this->type = $type;
        $this->path = $path;
    }

    /**
     * Get app name.
     * @return string App name.
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get package config
     *
     * @return ConfigObject
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Get link to the package on Webiny Store.
     *
     * @return string Url
     */
    public function getLink()
    {
        return $this->link;
    }

    /**
     * Version number.
     *
     * @return string Version number.
     */
    public function getVersion()
    {
        return $this->version;
    }

    /**
     * Short package description.
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Author name.
     *
     * @return string
     */
    public function getAuthorName()
    {
        return $this->authorName;
    }

    /**
     * Get the link to the author website.
     *
     * @return string
     */
    public function getAuthorLink()
    {
        return $this->authorLink;
    }

    /**
     * Get author email.
     *
     * @return string
     */
    public function getAuthorEmail()
    {
        return $this->authorEmail;
    }

    /**
     * Get the path to the component. Path is relative to the app root.
     *
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Populates object properties from the provided ConfigObject.
     *
     * @param ConfigObject $data Object from which to thake the properties.
     */
    private function populateProperties(ConfigObject $data)
    {
        $properties = get_object_vars($this);

        foreach ($properties as $k => $v) {
            $pName = ucfirst(substr($k, 1));
            if (property_exists($this, $k)) {
                $this->$k = $data->get($pName, '');
            }
        }
    }
}