<?php
/**
 * Webiny Framework (http://www.webiny.com/framework)
 *
 * @link      http://www.webiny.com/wf-snv for the canonical source repository
 * @copyright Copyright (c) 2009-2013 Webiny LTD. (http://www.webiny.com)
 * @license   http://www.webiny.com/framework/license
 */

namespace Apps\Webiny\Php\DevTools\Entity\Export;

interface PdfExportableInterface
{
    public function getPdfName();

    public function getPdfTemplate();

    public function getPdfData();
}