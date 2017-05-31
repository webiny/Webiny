<?php
namespace Apps\Webiny\Php\DevTools\Reports;

/**
 * Interface ReportInterface
 */
interface ReportInterface
{
    public function getReport($asFile = false);
}