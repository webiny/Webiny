<?php
namespace Apps\Webiny\Php\Lib\Reports;

/**
 * Interface ReportInterface
 */
interface ReportInterface
{
    public function getReport($asFile = false);
}