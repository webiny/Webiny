<?php
// Reset OPCache for current php-fpm pool
die(json_encode(['flushed' => opcache_reset()]));