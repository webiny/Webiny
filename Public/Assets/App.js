import EventManager from '/Core/EventManager';
import Router from '/Core/Router/Router';
import MainComponent from '/Apps/Core/View/Js/Components/Layout/Layout';
import CoreViewModule from '/Apps/Core/View/Js/Module';
import WebMongoDatabaseModule from '/Apps/WebMongo/Database/Js/Module';
import WebMongoLayoutModule from '/Apps/WebMongo/Layout/Js/Module';

/**
 * Instantiate the router
 */
window.components = [];

/**
 * Instantiate modules
 */
var coreViewModule = new CoreViewModule();
var webMongoDatabaseModule = new WebMongoDatabaseModule();
var webMongoLayoutModule = new WebMongoLayoutModule();

var mainComponent = React.createElement(MainComponent.createInstance());
React.render(mainComponent, document.getElementById('app'));

/* For development purposes */
window.router = Router;