import EventManager from '/Core/EventManager';
import {$WP.MainComponentAlias} from '{$WP.MainComponentPath}';
{foreach from=$WP.Modules item=module}
import {$module.alias} from '{$module.path}';
{/foreach}

/**
 * Instantiate the router
 */
window.components = [];
window.router = new Router();
window.activeRoute = {literal}{url: '/'}{/literal};

/**
 * Instantiate modules
 */
{foreach from=$WP.Modules item=module}
new {$module.alias}();
{/foreach}

var mainComponent = React.createElement({$WP.MainComponentAlias});
React.render(mainComponent, document.getElementById('app'));

{literal}
/**
 * Define some routes with their respective callback function
 */
router.route('/', function () {
	EventManager.getInstance().emit('renderRoute');
});

router.route('/posts', function () {
	EventManager.getInstance().emit('renderRoute');
});
{/literal}