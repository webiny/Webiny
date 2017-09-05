<?php
namespace Apps\Webiny\Php\Lib\Reports;

use Apps\Webiny\Php\Lib\WebinyTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\File\File;

/**
 * Class AbstractReport
 */
abstract class AbstractReport implements ReportInterface
{
    use WebinyTrait, StdLibTrait;

    abstract public function getFileName();

    /**
     * @param bool|void|File $asFile
     *
     * @return mixed
     */
    abstract public function getReport($asFile = false);
}