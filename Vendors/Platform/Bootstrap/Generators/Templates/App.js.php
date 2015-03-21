import EventManager from '/Core/EventManager';
import Router from '/Core/Router/Router';
import Http from '/Core/Http';

/* Global classes */
import Tools from '/Core/Tools/Tools';
import BaseComponent from '/Core/Base/BaseComponent';
import ComponentLoader from '/Core/ComponentLoader';
window.Tools = Tools;
window.ComponentLoader = ComponentLoader;

/* For development purposes */
window.Router = Router;
window.EventManager = EventManager;
window.BaseComponent = BaseComponent;

/* Expose these often used components so we don't need to import them all the time */
window.Http = Http;

<?php
foreach($data['WP']['Apps'] as $app){
 echo "import {$app['name']}App from '{$app['path']}';\n";
}

echo "import {$data['WP']['MainComponent']} from '{$data['WP']['MainComponentPath']}';\n";

/**
 * Instantiate modules
 */
foreach($data['WP']['Apps'] as $app) {
    echo "var ".lcfirst($app['name'])."App = new {$app['name']}App();\n";
}
?>

Router.setActiveRoute(window.location.pathname);
var mainComponent = <?php echo $data['WP']['MainComponent'];?>.createElement();
React.render(mainComponent, document.getElementById('app'));
Router.start(window.location.pathname);

$(document).on('click', 'a', function(e){
    e.preventDefault();
    Router.goTo(e.target.href);
});
