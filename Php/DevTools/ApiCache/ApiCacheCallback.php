<?php

namespace Apps\Webiny\Php\DevTools\ApiCache;

use Apps\Webiny\Php\DevTools\Exceptions\AppException;
use Apps\Webiny\Php\DevTools\WebinyTrait;
use Webiny\Component\StdLib\StdLibTrait;
use Webiny\Hrc\CacheRules\CacheRule;
use Webiny\Hrc\Hrc;
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
        $list = $data['data'];
        if (is_array($list) && isset($list['list'])) {
            /**
             * @var $hrc Hrc
             */
            $hrc = $this->wService('Hrc');
            $cr = $payload->getRule()->getCacheRule();

            // prepare the entity cache rule
            $entityCacheRule = new CacheRule('_WebinyEntityCache', $cr->getTtl(), ['entityCache'], [], []);
            $hrc->appendRule($entityCacheRule);

            $tags = [];
            $cacheContent = [];
            foreach ($list['list'] as $item) {
                // compute item key
                $key = $this->computeApiCacheKey($cr, $item);

                // store entity as separate cache entry
                $key = $hrc->save('EntityCache' . $key, self::jsonEncode($item), '_WebinyEntityCache', [$item['id']]);
                $entityCacheRule->setTags(['entityCache']);
                $tags[] = $item['id'];

                // store item
                $cacheContent[] = $key;
            }

            // modify the cache content that should be stored
            $data['data']['list'] = ['cacheList' => $cacheContent];
            $payload->setContent(self::jsonEncode($data));
            $payload->getRule()->getCacheRule()->appendTags($tags);
        } else {
            // it's probably a single record
            $data = self::jsonDecode($payload->getContent(), true);
            if (isset($data['data']['id'])) {
                $payload->setContent(self::jsonEncode($data['data']));
                $payload->getRule()->getCacheRule()->appendTags(['entityCache', $data['data']['id']]);
            }
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
        $data = self::jsonDecode($payload->getContent(), true);
        if (is_array($data) && isset($data['data']['list']) && isset($data['data']['list']['cacheList'])) {
            $list = $data['data']['list']['cacheList'];

            /**
             * @var $hrc Hrc
             */
            $hrc = $this->wService('Hrc');

            // extract cache list items and replace them with actual items
            $items = [];
            foreach ($list as $cacheKey) {
                $itemData = $hrc->readByCacheKey($cacheKey);
                if (!$itemData) {
                    $hrc->purgeByCacheKey($payload->getRule()->getCacheKey());
                } else {
                    $items[] = self::jsonDecode($itemData);
                }
            }

            $data['data']['list'] = $items;
            $payload->setContent(self::jsonEncode($data));
        } else {
            // single item entry
            $payload->setContent(self::jsonEncode(['data' => $data]));
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
     *
     * @return string
     * @throws AppException
     */
    private function computeApiCacheKey(CacheRule $cr, $entity)
    {
        // extract key items
        if (isset($cr->getConfig()['Key'])) {
            $keyItems = $cr->getConfig()['Key'];
            $keyItems[] = 'id';
        } else {
            $keyItems[] = 'id';
        }

        // loop through the items and concatenate the key
        $key = '';
        foreach ($keyItems as $k) {
            if (!isset($entity[$k])) {
                throw new AppException('Webiny cache: Unable to compute cache key for rule ' . $cr->getName() . ' because key ".' . $k . '." is missing.');
            }

            $key .= $entity[$k];
        }

        // cache rule name is part of the key
        $key .= $cr->getName();

        // list of fields is part of the cache key
        $key .= implode(',', array_keys($entity));

        // hash and return
        return md5($key);
    }
}