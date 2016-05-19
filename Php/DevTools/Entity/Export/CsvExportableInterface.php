<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @link      http://www.webiny.com/wf-snv for the canonical source repository
 * @copyright Copyright (c) 2009-2013 Webiny LTD. (http://www.webiny.com)
 * @license   http://www.webiny.com/framework/license
 */

namespace Apps\Core\Php\DevTools\Entity\Export;

use Webiny\Component\Entity\EntityCollection;

interface CsvExportableInterface
{
    public function getCsvHeader();

    public function getCsvData();
}