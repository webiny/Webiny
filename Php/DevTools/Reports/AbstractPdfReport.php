<?php
namespace Apps\Core\Php\DevTools\Reports;

use Apps\Core\Php\DevTools\Exceptions\AppException;
use mikehaertl\wkhtmlto\Pdf;
use Webiny\Component\Storage\File\File;

/**
 * Class AbstractPdfReport
 */
abstract class AbstractPdfReport extends AbstractReport
{
    /**
     * Get report as an instance of File or send it to browser
     *
     * @param bool|false $asFile
     *
     * @return File
     * @throws AppException
     */
    public function getReport($asFile = false)
    {
        return $this->getPdf($this->getTemplate(), $this->getData(), $this->getFileName(), $asFile);
    }

    private function getPdf($template, $data, $filename, $asFile)
    {
        $filename = $this->str($filename)->replace('/', '_')->val() . '.pdf';
        $data['fileName'] = $filename;
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