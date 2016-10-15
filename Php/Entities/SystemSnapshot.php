<?php
namespace Apps\Core\Php\Entities;

use Apps\Core\Php\DevTools\Entity\AbstractEntity;
use Webiny\Component\Mongo\Index\SingleIndex;

/**
 * Class SystemSnapshot
 *
 * @property string $id
 * @property Arrat  $stats
 *
 * @package Apps\Core\Php\Entities
 *
 */
class SystemSnapshot extends AbstractEntity
{
    protected static $entityCollection = 'SystemSnapshots';

    public function __construct()
    {
        parent::__construct();
        $this->index(new SingleIndex('createdOn', 'createdOn', null, false, false, 5184000)); // delete records after 2 months
        $this->attributes->removeKey(['deletedOn', 'deletedBy', 'modifiedOn', 'modifiedBy']);
        $this->attr('stats')->object()->setToArrayDefault()->onGet(function ($value) {
            if (!$value->count()) {
                $value = $this->getSystemStats();
                $this->stats = $value;
            }

            return $value;
        });

        $this->api('GET', 'preset/{preset}', function ($preset) {
            $intervals = [
                '1h'  => 'PT1H',
                '2h'  => 'PT2H',
                '6h'  => 'PT6H',
                '24h' => 'PT24H',
                '7d'  => 'P7D',
                '30d' => 'P30D',
            ];

            $query = [
                'createdOn' => [
                    '$gte' => $this->datetime()->sub($intervals[$preset])->getMongoDate(),
                    '$lte' => $this->datetime()->getMongoDate()
                ]
            ];

            $snapshots = $this->find($query, ['createdOn' => 1]);
            return $this->apiFormatList($snapshots, '*');

        });
    }

    private function getSystemStats()
    {
        $top = [];
        exec('top -b -d3 -n2', $top);
        // Find last output
        $linesNumber = count($top);
        for ($i = $linesNumber - 1; $i >= 0; $i--) {
            if (strpos($top[$i], 'top -') === 0) {
                $top = array_slice($top, $i, 4);
                break;
            }
        }

        $stats = [
            'cpu'         => [
                'user'   => 0,
                'system' => 0,
                'nice'   => 0
            ],
            'loadAverage' => [
                '1'  => 0,
                '5'  => 0,
                '15' => 0
            ],
            'memory'      => [
                'total' => 0,
                'used'  => 0,
                'free'  => 0
            ],
            'disks'       => []
        ];

        // Load average
        $loads = $this->str($top[0])->explode('load average:')->last()->match('/[\d+\.]+/')->last()->val();
        $stats['loadAverage']['1'] = floatval($loads[0]);
        $stats['loadAverage']['5'] = floatval($loads[1]);
        $stats['loadAverage']['15'] = floatval($loads[2]);

        // CPU
        $loads = $this->str($top[2])->match('/[\d+\.]+/')->last()->val();
        $stats['cpu']['user'] = floatval($loads[0]);
        $stats['cpu']['system'] = floatval($loads[1]);
        $stats['cpu']['nice'] = floatval($loads[2]);

        // Memory
        $memory = $this->str($top[3])->match('/[\d+\.]+/')->last()->val();
        $stats['memory']['total'] = intval($memory[0]);
        $stats['memory']['used'] = intval($memory[1]);
        $stats['memory']['free'] = intval($memory[2]);

        // Disk usage
        $stats['disks'] = $this->getDiskUsage();

        return $stats;
    }

    private function getDiskUsage()
    {
        // Get disk usage
        $data = [];
        exec('df --local --output=source,size,used,avail,pcent -B K', $diskUsage);

        $mbToBytes = function ($mb) {
            return intval(rtrim($mb, 'M')) * 1024;
        };

        foreach ($diskUsage as $index => $line) {
            if ($index === 0) {
                continue;
            }

            $memData = array_filter(explode(" ", $line), function ($value) {
                return trim($value) !== '';
            });

            list($disk, $size, $used, $available, $percentage) = array_values($memData);

            if (!$this->str($disk)->startsWith('/dev/')) {
                continue;
            }

            $data[] = [
                'name'       => trim($disk),
                'size'       => $mbToBytes($size),
                'used'       => $mbToBytes($used),
                'available'  => $mbToBytes($available),
                'percentage' => intval(rtrim(trim($percentage), '%')),
            ];
        }

        return $data;
    }
}