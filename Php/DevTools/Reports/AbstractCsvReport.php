<?php
namespace Apps\Core\Php\DevTools\Reports;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Apps\Core\Php\DevTools\Exceptions\AppException;
use League\Csv\Writer;
use League\Csv\Reader;

use SplTempFileObject;
use Webiny\Component\Entity\EntityCollection;
use Webiny\Component\Storage\File\File;

/**
 * Class AbstractPdfReport
 */
abstract class AbstractCsvReport extends AbstractReport
{
    private $data;

    function __construct(EntityCollection $collection)
    {
        $this->data = $collection;
    }

    /**
     * Get CSV header
     *
     * @return array Array of labels
     */
    abstract protected function getHeader();

    /**
     * Get CSV row
     *
     * @param AbstractEntity $entity
     *
     * @return array Array of values representing CSV table row
     */
    abstract protected function getRow(AbstractEntity $entity);

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
        // the CSV file will be created into a temporary File
        $writer = Writer::createFromFileObject(new SplTempFileObject());
        $writer->insertOne($this->getHeader())->setOutputBOM(Reader::BOM_UTF8);

        foreach ($this->data as $record) {
            $writer->insertOne($this->getRow($record));
        }

        if ($asFile) {
            $writer->output();
            $contents = ob_get_contents();
            ob_clean();
            $storage = $this->wStorage('Temp');
            $key = uniqid('csv-') . '.csv';
            $storage->setContents($key, $contents);

            return new File($key, $storage);
        }

        die($writer->output($this->getFileName() . '.csv'));
    }
}