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

import {$WP.MainComponentAlias} from '{$WP.MainComponentPath}';
{foreach from=$WP.Modules item=module}
import {$module.alias} from '{$module.path}';
{/foreach}

/**
 * Instantiate the router
 */
window.components = [];

/**
 * Instantiate modules
 */
{foreach from=$WP.Modules item=module}
var {$module.alias|lcfirst} = new {$module.alias}();
{/foreach}

var mainComponent = React.createElement({$WP.MainComponentAlias}.createInstance());
React.render(mainComponent, document.getElementById('app'));
Router.start();