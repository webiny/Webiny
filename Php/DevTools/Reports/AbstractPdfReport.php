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
     * Get report template
     * @return string
     */
    public function getTemplate()
    {
        $app = $this->str(get_called_class())->explode('\\', 3);

        return $app[1] . ':' . str_replace('\\', '/', $app[2]) . '.tpl';
    }

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
        $parts = $this->str($template)->explode(':');
        $templatesDir = $this->wApps($parts[0])->getPath(true) . '/' . $this->str($parts[1])->explode('/')->first();
        $this->wTemplateEngine()->setTemplateDir($templatesDir);
        $filename = $this->str($filename)->replace('/', '_')->val() . '.pdf';
        $data['fileName'] = $filename;
        $html = $this->wTemplateEngine()->fetch($template, $data);
        $storage = $this->wStorage('Temp');

        // Convert to PDF
        $pdf = new Pdf([
            'tmpDir' => $storage->getAbsolutePath(),
            'binary' => '/usr/local/bin/wkhtmltopdf',
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