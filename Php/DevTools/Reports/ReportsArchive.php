<?php
namespace Apps\Core\Php\DevTools\Reports;

use Apps\Core\Php\DevTools\WebinyTrait;
use PHPZip\Zip\Stream\ZipStream;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Component\Storage\File\File;

/**
 * Class AbstractReport
 */
class ReportsArchive implements ReportInterface
{
    use StdLibTrait;

    function __construct($data, $reportGenerator, $fileName)
    {
        $this->data = $data;
        $this->reportGenerator = $reportGenerator;
        $this->fileName = $this->str($fileName)->replace('.zip', '')->append('.zip')->val();
    }

    // TODO: add handling of $asFile=true
    public function getReport($asFile = false)
    {
        // Create archive
        $zip = new ZipStream($this->fileName, 'application/zip', null, true);
        foreach ($this->data as $data) {
            /* @var AbstractReport $report */
            $report = call_user_func_array($this->reportGenerator, [$data]);
            /* @var $file File */
            $file = $report->getReport(true);
            $zip->addFile($file->getContents(), $file->getKey());
            $file->delete();
        }

        return $zip->finalize();
    }
}