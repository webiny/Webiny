<?php

namespace Apps\Webiny\Php\DevTools\ApiCache;

use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Hrc\CacheRules\CacheRule;
use Webiny\Hrc\ReadPayload;
use Webiny\Hrc\SavePayload;

class ApiCacheCallback implements \Webiny\Hrc\EventCallbackInterface
{
    use WebinyTrait, StdLibTrait;

    /**
     * Executes after a cache rule was matched, but before the entry was saved.
     * Modifying the SavePayload will effect how the cache will be saved.
     *
     * @param SavePayload $payload
     *
     * @return void
     * @throws AppException
     */
    public function beforeSave(SavePayload $payload)
    {
        if ($payload->getRule()->getCacheRule()->getName() == '_WebinyEntityCache') {
            return;
        }

        // if list, we need to extract entities
        $data = self::jsonDecode($payload->getContent(), true);

        // if it's not an array we consider it an invalid response - do not cache
        if (!$data || !is_array($data)) {
            $payload->setSaveFlag(false);

            return;
        }

        if (isset($data['data']['list'])) {
            $this->cacheList($payload, $data);
        } elseif (isset($data['data']['entity'])) {
            $this->cacheEntity($payload, $data);
        } else {
            // it's a custom response, in that case, no special processing is required
        }

    }

    /**
     * Executes after a successful cache save.
     *
     * @param SavePayload $payload
     *
     * @return void
     */
    public function afterSave(SavePayload $payload)
    {
        // TODO: Implement afterSave() method.
    }

    /**
     * Executes after a cache rule has matched, but before the check on the storage is performed for the given cache key.
     * You can use this callback to modify the cache key and to set the purge flag to purge the cache entry if one is found.
     * Note: the getContent method on payload will return null at this point.
     *
     * @param ReadPayload $payload
     *
     * @return void
     */
    public function beforeRead(ReadPayload $payload)
    {
        // TODO: Implement beforeRead() method.
    }

    /**
     * This callback is only performed when a storage returns the cached content.
     * At this point getContent will return the actual content.
     *
     * @param ReadPayload $payload
     *
     * @return void
     */
    public function afterRead(ReadPayload $payload)
    {
        // check if cacheList
        $rawContent = $payload->getContent();
        $data = self::jsonDecode($rawContent, true);

        if (is_array($data) && isset($data['data']['list']) && isset($data['data']['meta']['cacheList'])) {
            $list = $data['data']['list'];

            // extract cache list items and replace them with actual items
            foreach ($list as $cacheKey) {
                $itemData = self::wApiCache()->hrc()->readByCacheKey($cacheKey);
                if (!$itemData) {
                    self::wApiCache()->hrc()->purgeByCacheKey($payload->getRule()->getCacheKey());
                } else {
                    $itemData = self::jsonDecode($itemData, true);
                    $rawContent = str_replace('"' . $cacheKey . '"', self::jsonEncode($itemData['data']['entity']), $rawContent);
                }
            }

            $payload->setContent($rawContent);
        }
    }

    /**
     * Computes the cache key for the entity.
     * A cache key by default contains:
     *  - entity id
     *  - cache rule name
     *  - list of all fields (just field names) inside the given entity object
     *
     * @param CacheRule $cr
     * @param array     $entity
     * @param string    $fields List of fields as a string
     *
     * @return string
     * @throws AppException
     */
    private function computeApiCacheKey(CacheRule $cr, $entity, $fields)
    {
        // cache rule name is part of the key
        $key = $cr->getName();

        // list of fields is part of the cache key
        $key .= $fields;

        // extract key items
        if (isset($cr->getConfig()['Entity']['CacheIdFields'])) {
            $keyItems = $cr->getConfig()['Entity']['CacheIdFields'];
            $keyItems[] = 'id';
        } else {
            $keyItems[] = 'id';
        }

        // loop through the items and concatenate the key
        foreach ($keyItems as $k) {
            if (!isset($entity[$k])) {
                // If key doesn't exist, just ignore it
                continue;
            }

            $key .= $entity[$k];
        }

        // hash and return
        return md5($key);
    }

    /**
     * When caching a list response, we extract the entities inside the list and cache them separately to the actual list.
     *
     * @param SavePayload $payload
     * @param             $data
     */
    private function cacheList(SavePayload $payload, $data)
    {
        $cr = $payload->getRule()->getCacheRule();

        // prepare the entity cache rule
        $entityCacheRule = new CacheRule('_WebinyEntityCache', $cr->getTtl(), ['entityCache'], [], []);
        self::wApiCache()->hrc()->appendRule($entityCacheRule);

        // add the list cache key to meta, so we can share it across all linked entities
        $data['data']['meta']['cacheKey'] = $payload->getRule()->getCacheKey();

        // add cache rule to the key
        $data['data']['meta']['cacheRule'] = $payload->getRule()->getCacheRule()->getName();

        $tags = [];
        $cacheContent = [];
        foreach ($data['data']['list'] as $item) {
            // compute item key
            $key = $this->computeApiCacheKey($cr, $item, $data['data']['meta']['fields']);

            // change the structure of the item so it matches an entity record - this way we can have an unified process when updating
            // the cache records
            $itemId = $item['id'];
            $item = [
                'data' => [
                    'entity' => $item,
                    'meta'   => $data['data']['meta']
                ],
            ];

            // store entity as separate cache entry
            $entityTags = [
                $itemId,
                $payload->getRule()->getCacheRule()->getName()
            ];

            $key = self::wApiCache()->hrc()->save('EntityCache' . $key, self::jsonEncode($item), '_WebinyEntityCache', $entityTags);
            $entityCacheRule->setTags(['entityCache']);
            $tags[] = $itemId;

            // store item
            $cacheContent[] = $key;
        }

        // modify the cache content that should be stored
        $data['data']['meta']['cacheList'] = true;
        $data['data']['list'] = $cacheContent;
        $payload->setContent(self::jsonEncode($data));

        // add cache key and cache name to tags
        $tags[] = $payload->getRule()->getCacheRule()->getName();
        $payload->getRule()->getCacheRule()->appendTags($tags);
    }

    /**
     * When caching an entity, we just save it as it was returned by the api layer.
     *
     * @param SavePayload $payload
     * @param             $data
     */
    private function cacheEntity(SavePayload $payload, $data)
    {
        // we can only cache an entity that has an id
        if (isset($data['data']['entity']['id'])) {
            $data['data']['meta']['cacheRule'] = $payload->getRule()->getCacheRule()->getName();
            $data['data']['meta']['cacheKey'] = $payload->getRule()->getCacheKey();

            $payload->setContent(self::jsonEncode($data));
            $payload->getRule()->getCacheRule()->appendTags([
                'entityCache',
                $data['data']['entity']['id'],
                $payload->getRule()->getCacheRule()->getName()
            ]);
        }
    }
}