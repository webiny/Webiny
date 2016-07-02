<?php
namespace Apps\Core\Php\DevTools\Reports;

/**
 * Interface ReportInterface
 */
interface ReportInterface
{
    public function getReport($asFile = false);
}