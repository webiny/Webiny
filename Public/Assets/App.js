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

import CoreApp from '/Apps/Core/Build/Development/Backend/App.js';
import TodoApp from '/Apps/Todo/Build/Development/Backend/App.js';
import MainComponent from '/Apps/Core/Layout/Js/Components/Layout/Layout';
var coreApp = new CoreApp();
var todoApp = new TodoApp();

Router.setActiveRoute(window.location.pathname);
var mainComponent = MainComponent.createElement();
React.render(mainComponent, document.getElementById('app'));
Router.start(window.location.pathname);

$(document).on('click', 'a', function(e){
    e.preventDefault();
    Router.goTo(e.target.href);
});
