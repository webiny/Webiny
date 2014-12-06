import EventManager from '/Core/EventManager';
import Router from '/Core/Router/Router';
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
new {$module.alias}();
{/foreach}

var mainComponent = React.createElement({$WP.MainComponentAlias}.createInstance());
React.render(mainComponent, document.getElementById('app'));

/* For development purposes */
window.router = Router;