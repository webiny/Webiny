<?php
/**
 * Webiny Platform (http://www.webiny.com/)
 *
 * @copyright Copyright Webiny LTD
 */

namespace Apps\Core\Php\Dispatchers\Flows;

use Apps\Core\Php\DevTools\Entity\EntityAbstract;
use Apps\Core\Php\DevTools\Entity\Export\CsvExportableInterface;
use Apps\Core\Php\DevTools\Entity\Export\PdfExportableInterface;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use Apps\Core\Php\Dispatchers\AbstractFlow;
use Apps\Core\Php\RequestHandlers\ApiException;
use League\Csv\Writer;
use mikehaertl\wkhtmlto\Pdf;
use PHPZip\Zip\Stream\ZipStream;
use SplTempFileObject;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Storage\File\File;

/**
 * Class ExportFlow
 * @package Apps\Core\Php\Dispatchers
 */
class ExportFlow extends AbstractFlow
{
    public function handle(EntityAbstract $entity, $params)
    {
        if (!$this->wAuth()->canRead($entity)) {
            throw new ApiException('You don\'t have a READ permission on ' . get_class($entity), 'WBY-AUTHORIZATION', 401);
        }

        if ($params[0] === 'export') {
            // Load list of entities
            $filters = $this->wRequest()->getFilters();
            $sorter = $this->wRequest()->getSortFields();
            $entities = $entity->find($filters, $sorter, $this->wRequest()->getPerPage(), $this->wRequest()->getPage());
            if ($params[1] === 'csv') {
                $this->exportCsv($entity, $entities);

                return true;
            }
            if ($params[1] === 'pdf') {
                $this->exportListPdf($entity, $entities);

                return true;
            }
            throw new ApiException('No export method was triggered!');
        } else {
            // Load single entity
            $entity = $entity->findById($params[0]);
            $this->exportSinglePdf($entity);
        }
    }

    /**
     * Only handle URLs that look like this:
     * /entities/users/export/csv/
     * /entities/users/571b9c32ff58720d7425ebf2/export/pdf
     *
     * @param $httpMethod
     * @param $params
     *
     * @return bool
     */
    public function canHandle($httpMethod, $params)
    {
        if(count($params) < 2){
            return false;
        }

        $exportable = ($params[0] === 'export' || ($this->mongo()->isId($params[0]) && $params[1] === 'export'));

        return in_array($httpMethod, ['GET', 'POST']) && $exportable;
    }

    protected function exportCsv(EntityAbstract $entity, EntityCollection $entities)
    {
        if (!$entity instanceof CsvExportableInterface) {
            throw new ApiException(get_class($entity) . ' must implement CsvExportableInterface');
        }

        //the CSV file will be created into a temporary File
        $writer = Writer::createFromFileObject(new SplTempFileObject());
        $writer->setDelimiter(";");
        $writer->setNewline("\r\n");
        $writer->setEncodingFrom("utf-8");
        $writer->insertOne($entity->getCsvHeader());

        /* @var $ent CsvExportableInterface */
        foreach ($entities as $ent) {
            $writer->insertOne($ent->getCsvData());
        }

        die($writer->output($entity::getEntityCollection() . '-' . date('Ymd') . '.csv'));
    }

    protected function exportListPdf(EntityAbstract $entity, EntityCollection $entities)
    {
        if (!$entity instanceof PdfExportableInterface) {
            throw new ApiException(get_class($entity) . ' must implement PdfExportableInterface');
        }

        // Create archive
        $zip = new ZipStream($entity::getEntityCollection() . '-' . date('Ymd') . '.zip', 'application/zip', null, true);

        /* @var $ent PdfExportableInterface */
        foreach ($entities as $ent) {
            $pdf = $this->getPdf($ent->getPdfTemplate(), $ent->getPdfData(), $ent->getPdfName(), true);
            $zip->addFile($pdf->getContents(), $pdf->getKey());
            $pdf->delete();
        }

        $zip->finalize();
    }

    protected function exportSinglePdf(EntityAbstract $entity)
    {
        if (!$entity instanceof PdfExportableInterface) {
            throw new ApiException(get_class($entity) . ' must implement PdfExportableInterface');
        }

        $this->getPdf($entity->getPdfTemplate(), $entity->getPdfData(), $entity->getPdfName());
    }

    private function getPdf($template, $data, $filename, $asFile = false)
    {
        $filename = $this->str($filename)->replace('/', '_')->val() . '.pdf';
        $html = $this->wTemplateEngine()->fetch($template, $data);
        $storage = $this->wStorage('Temp');

        // Convert to PDF
        $pdf = new Pdf([
            'tmpDir' => $storage->getAbsolutePath(),
            'binary' => 'wkhtmltopdf',
            'print-media-type'
        ]);
        $pdf->addPage($html);

        // Store PDF
        $path = $storage->getAbsolutePath($filename);
        if (!$pdf->saveAs($path)) {
            throw new AppException($pdf->getError());
        }

        $file = new File($filename, $storage);

        if ($asFile) {
            return $file;
        }

        // Send output to browser
        $this->sendToBrowser($file, $filename);
    }

    private function sendToBrowser(File $file, $filename)
    {
        header('Pragma: public');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Content-Type: application/pdf');
        header('Content-Transfer-Encoding: binary');
        header('Content-Disposition: inline; filename="' . $filename . '"');
        readfile($file->getAbsolutePath());
        $file->delete();
        die();
    }
}