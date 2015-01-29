import EventManager from '/Core/EventManager';
import Router from '/Core/Router/Router';
import Http from '/Core/Http';
import Q from '/Core/Queue';

/* Global classes */
import Tools from '/Core/Tools/Tools';
import BaseComponent from '/Core/Base/BaseComponent';
window.Tools = Tools;

/* For development purposes */
window.Router = Router;
window.EventManager = EventManager;
window.BaseComponent = BaseComponent;

/* Expose these often used components so we don't need to import them all the time */
window.Http = Http;
window.Q = Q;

import MainComponent from '/Apps/Core/View/Js/Components/Layout/Layout';
import CoreViewModule from '/Apps/Core/View/Js/Module';
import TodoTodoModule from '/Apps/Todo/Todo/Js/Module';

/**
 * Instantiate modules
 */
var coreViewModule = new CoreViewModule();
var todoTodoModule = new TodoTodoModule();

Router.setActiveRoute(window.location.pathname);
var mainComponent = React.createElement(MainComponent.createInstance());
React.render(mainComponent, document.getElementById('app'));
Router.start(window.location.pathname);

$(document).on('click', 'a', function(e){
    e.preventDefault();
    Router.goTo(e.target.href);
});
