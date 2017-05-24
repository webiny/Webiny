<?php
namespace Apps\Webiny\Php\DevTools\Reports;

use Apps\Webiny\Php\DevTools\Exceptions\AppException;
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
        if (!count($this->data)) {
            throw new AppException('There were no files provided to add to ZIP archive!', 'WBY-REPORT_ARCHIVE_NO_FILES');
        }

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