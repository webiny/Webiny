<?php

namespace Apps\Webiny\Php\DevTools\ApiCache;

use Webiny\Component\Entity\EntityDataExtractor;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Hrc\Hrc;

trait ApiCacheEntityTrait
{
    use StdLibTrait;

    /**
     * Registers the required callbacks on entities.
     */
    private function apiCacheRegisterCallbacks()
    {

        $this->onAfterUpdate(function () {
            $this->apiCacheUpdateRecord();
        });


        $this->onAfterDelete(function () {
            $this->apiCacheDeleteRecord();
        });
    }

    /**
     * On  update we extract all the cache entries matching cache id of this entity. Then we update all those cache entries
     * with the new values. Note: ttl is not refreshed, as that would cause that in some cases a single list entry record expires
     * before the other linked records.
     */
    private function apiCacheUpdateRecord()
    {
        /**
         * @var $hrc Hrc
         */
        $hrc = $this->wService('Hrc');

        // get the list cache objects for the current entity
        $entries = $hrc->readByTags(['entityCache', $this->id]);

        if ($entries) {
            // update the data inside each of the given entries
            foreach ($entries as $cacheKey => $entry) {
                // update values on all levels
                $entry['content'] = self::jsonDecode($entry['content'], true);

                $updatedEntry = $entry['content'];
                // we need to to toArray on every cache entry as we need to explicitly define which fields to return
                foreach ($entry['content'] as $k => $v) {
                    if (($val = $this->getAttribute($k)->getValue())) {
                        $dataExtractor = new EntityDataExtractor($this);
                        //$dataExtractor->buildEntityFields()
                        $updatedEntry[$k] = $val;
                    } else {
                        unset($updatedEntry[$k]);
                    }
                }

                // re-store the updated entry into cache
                $hrc->updateByCacheKey($cacheKey, self::jsonEncode($updatedEntry), $entry['ttl']);
            }
        }
    }

    private function apiCacheGetFieldList($cachedEntry, $MAXDEPTH = INF, $depth = 0, $arrayKeys = [])
    {
        if ($depth < $MAXDEPTH) {
            $depth++;
            $keys = array_keys($cachedEntry);
            foreach ($keys as $key) {
                if (is_array($cachedEntry[$key])) {
                    $subKeys = $this->apiCacheGetFieldList($cachedEntry[$key], $MAXDEPTH, $depth);
                    if (count($subKeys) > 0) {
                        $arrayKeys[] = $key . '[' . implode(',', $subKeys) . ']';
                    } else {
                        $arrayKeys[] = $key;
                    }
                } else {
                    $arrayKeys[] = $key;
                }
            }
        }

        return $arrayKeys;
    }

    /**
     * When a record is deleted, we purge all cache entries that have this record id linked
     */
    private function apiCacheDeleteRecord()
    {
        /**
         * @var $hrc Hrc
         */
        $hrc = $this->wService('Hrc');
        $hrc->purgeByTag($this->id);
    }

}