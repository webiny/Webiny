<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Webiny\Php\RequestHandlers\ApiHandlers;

use Apps\Webiny\Php\Lib\Reports\ReportInterface;
use Apps\Webiny\Php\RequestHandlers\ApiEvent;

/**
 * Class ReportHandler
 *
 * This class checks if the response data implements ReportInterface and outputs the report.
 */
class ReportHandler extends AbstractApiHandler
{
    public function handle(ApiEvent $event)
    {
        $data = $event->getResponse()->getData();

        if ($data instanceof ReportInterface) {
            $data->getReport(false);
            die();
        }
    }
}