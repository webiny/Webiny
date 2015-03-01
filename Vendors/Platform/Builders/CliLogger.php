<?php
namespace Webiny\Platform\Builders;

use Webiny\Component\StdLib\SingletonTrait;

class CliLogger
{
    use SingletonTrait;

    private $foregroundColors = [];
    private $backgroundColors = [];

    public function init()
    {
        // Set up shell colors
        $this->foregroundColors['blue'] = '0;34';
        $this->foregroundColors['lightBlue'] = '1;34';
        $this->foregroundColors['green'] = '0;32';
        $this->foregroundColors['red'] = '0;31';
        $this->foregroundColors['purple'] = '0;35';
        $this->foregroundColors['yellow'] = '1;33';
        $this->foregroundColors['white'] = '1;37';

        $this->backgroundColors['black'] = '40';
        $this->backgroundColors['red'] = '41';
        $this->backgroundColors['green'] = '42';
        $this->backgroundColors['yellow'] = '43';
        $this->backgroundColors['blue'] = '44';
        $this->backgroundColors['magenta'] = '45';
        $this->backgroundColors['cyan'] = '46';
        $this->backgroundColors['lightGray'] = '47';
    }

    // Returns colored string
    public function log($string, $foregroundColor = null, $backgroundColor = null)
    {
        $message = "";

        // Check if given foreground color found
        if (isset($this->foregroundColors[$foregroundColor])) {
            $message .= "\033[" . $this->foregroundColors[$foregroundColor] . "m";
        }
        // Check if given background color found
        if (isset($this->backgroundColors[$backgroundColor])) {
            $message .= "\033[" . $this->backgroundColors[$backgroundColor] . "m";
        }

        // Add string and end coloring
        $message .= $string . "\033[0m";

        if (php_sapi_name() == 'cli') {
            echo $message . "\n";
        }
    }
}