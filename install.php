<?php
$pDir = getcwd();

require_once $pDir . '/vendor/autoload.php';

\cli\line('Installing Webiny Platform :)');
\cli\line('Creating necessary folder structure in %g' . $pDir . '%n');
exec('cp -R ./install/structure/* ' . $pDir);
mkdir($pDir . '/Apps');
mkdir($pDir . '/Configs');
mkdir($pDir . '/Cache');
mkdir($pDir . '/Temp');

// TODO: create wizard for config setup

\cli\line('That\'s it! Happy developing!');

