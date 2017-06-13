<?php

namespace Apps\Webiny\Php\DevTools\ApiCache;

use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Hrc\CacheRules\CacheRule;

trait ApiCacheEntityTrait
{
    use StdLibTrait;

    /**
     * Registers the required callbacks on entities.
     */
    private function apiCacheRegisterCallbacks()
    {
        $this->onAfterUpdate(function () {
            $this->apiCacheUpdateAction();
        });


        $this->onAfterDelete(function () {
            $this->apiCachePurgeRecord();
        });
    }

    /**
     * Unlike the purge on update, which only purges the record inside the given cache rule, this method does a purge across all cache rules.
     */
    protected function apiCachePurgeRecord()
    {
        // we need to get the cache rule from the item we want to purge, so that in case of a list, we also purge the items linked to the same list
        $entries = self::wApiCache()->hrc()->readByTags(['entityCache', $this->id]);
        if (!$entries) {
            return false;
        }

        foreach ($entries as $cacheKey => $entry) {
            $content = self::jsonDecode($entry['content'], true);

            // purge linked items
            self::wApiCache()->hrc()->purgeByTag($content['data']['meta']['cacheKey']);
        }

        // purge everything else
        self::wApiCache()->hrc()->purgeByTag($this->id);
    }

    /**
     * On  update we extract all the cache entries matching cache id of this entity. Then we update all those cache entries
     * with the new values. Note: ttl is not refreshed, as that would cause that in some cases a single list entry record expires
     * before the other linked records.
     */
    protected function apiCacheUpdateAction()
    {
        // get the list cache objects for the current entity
        $entries = self::wApiCache()->hrc()->readByTags(['entityCache', $this->id]);
        if (!$entries) {
            return false;
        }

        foreach ($entries as $cacheKey => $entry) {
            // open up the entry content (content contains the thing we cached)
            $entry['content'] = self::jsonDecode($entry['content'], true);

            // get the cache rule configuration
            $cr = $this->apiCacheGetCacheRule($entry);

            // check if the rule was deleted from the yaml config
            if (!$cr) {
                continue; // the ttl should naturally expire
            }

            // check the update action for that rule
            $action = $this->apiCacheGetUpdateAction($cr);

            if ($action == 'update') {
                // check if skip fields are defined in the config
                $skipFields = $this->apiCacheGetSkipFields($cr);

                // get the new updated record with the required fields
                $updatedRecord = $this->apiCacheGetEntityData($entry, $cr);

                // we need to loop through the cache entry as we need to explicitly define which fields to skip and which to update
                $updatedEntry = $entry['content']['data']['entity'];
                foreach ($entry['content']['data']['entity'] as $k => $v) {
                    // skip fields
                    if (in_array($k, $skipFields)) {
                        continue;
                    }

                    // we update only records that are available in the updatedRecord
                    if (isset($updatedRecord[$k])) {
                        $updatedEntry[$k] = $updatedRecord[$k];
                    } else {
                        // if a record is no longer available, we remove it
                        unset($updatedEntry[$k]);
                    }
                }

                $entry['content']['data']['entity'] = $updatedEntry;

                // re-store the updated entry into cache
                // note: we can't change the ttl, as this might cause that some records inside a list expire later than others - would cause problems
                self::wApiCache()->hrc()->updateByCacheKey($cacheKey, self::jsonEncode($entry['content']), $entry['ttl']);
            } else {
                // if we don't update, then we purge

                // this purge clears all the lists that contain this entity id inside the current rule
                self::wApiCache()->hrc()->purgeByTag([$this->id, $cr->getName()]);
            }
        }

    }

    /**
     * Returns current entity up-to-date array, based on previously cached fields
     * @param           $entry
     * @param CacheRule $cr
     *
     * @return mixed
     */
    private function apiCacheGetEntityData($entry, CacheRule $cr)
    {
        // get fields for the current entry
        $fields = $this->apiCacheExtractFields($entry);

        // get the new updated record with the required fields
        return $this->toArray($fields);
    }

    /**
     * Check which fields need to be returned.
     *
     * @param $entry
     *
     * @return string
     */
    private function apiCacheExtractFields($entry)
    {
        return isset($entry['content']['data']['meta']['fields']) ? $entry['content']['data']['meta']['fields'] : '*';
    }

    /**
     * @param $entry
     *
     * @return bool|\Webiny\Hrc\CacheRules\CacheRule
     */
    private function apiCacheGetCacheRule($entry)
    {
        return self::wApiCache()->hrc()->getCacheRule($entry['content']['data']['meta']['cacheRule']);
    }

    /**
     * Check which purge action is defined inside the entity update action.
     * If none is set, the default is purge.
     *
     * @param CacheRule $cr
     *
     * @return string
     */
    private function apiCacheGetUpdateAction(CacheRule $cr)
    {
        return isset($cr->getConfig()['Entity']['Update']['Action']) ? $cr->getConfig()['Entity']['Update']['Action'] : 'purge';
    }

    /**
     * Checks if any fields shouldn't be updated on the update action.
     * This is often used on dynamic fields and fields that are populated based on user permissions.
     *
     * @param CacheRule $cr
     *
     * @return array
     */
    private function apiCacheGetSkipFields(CacheRule $cr)
    {
        return isset($cr->getConfig()['Entity']['Update']['SkipFields']) ? $cr->getConfig()['Entity']['Update']['SkipFields'] : [];
    }
}