<?php
$pDir = getcwd();

require_once $pDir . '/vendor/autoload.php';

\cli\line('Installing Webiny Platform :)');
\cli\line('Creating necessary folder structure in %C%5' . $pDir . '%n');
exec('cp -R ./install/structure/* ' . $pDir);

\cli\line('Tweaking your config might be a good idea!');

