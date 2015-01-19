import EventManager from '/Core/EventManager';
import Router from '/Core/Router/Router';
import Http from '/Core/Http';
import Q from '/Core/Queue';

/* For development purposes */
window.router = Router;
window.EventManager = EventManager;

/* Expose these often used components so we don't need to import them all the time */
window.Http = Http;
window.Q = Q;

import MainComponent from '/Apps/Core/View/Js/Components/Layout/Layout';
import CoreViewModule from '/Apps/Core/View/Js/Module';
import TodoTodoModule from '/Apps/Todo/Todo/Js/Module';

/**
 * Instantiate the router
 */
window.components = [];

/**
 * Instantiate modules
 */
var coreViewModule = new CoreViewModule();
var todoTodoModule = new TodoTodoModule();

var mainComponent = React.createElement(MainComponent.createInstance());
React.render(mainComponent, document.getElementById('app'));
Router.start();