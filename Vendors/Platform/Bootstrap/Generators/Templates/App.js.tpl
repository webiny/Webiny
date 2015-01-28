import EventManager from '/Core/EventManager';
import Router from '/Core/Router/Router';
import Http from '/Core/Http';
import Q from '/Core/Queue';

/* Global classes */
import Tools from '/Core/Tools/Tools';
import BaseComponent from '/Core/Base/BaseComponent';
import Link from '/Apps/Core/View/Js/Components/Link/Link';
import Input from '/Apps/Core/View/Js/Components/Input/Input';
import Checkbox from '/Apps/Core/View/Js/Components/Checkbox/Checkbox';
import Form from '/Apps/Core/View/Js/Components/Form/Form';


window.Tools = Tools;
window.Link = Link.createInstance();
window.Input = Input.createInstance();
window.Checkbox = Checkbox.createInstance();
window.Form = Form.createInstance();

/* For development purposes */
window.Router = Router;
window.EventManager = EventManager;
window.BaseComponent = BaseComponent;

/* Expose these often used components so we don't need to import them all the time */
window.Http = Http;
window.Q = Q;

import {$WP.MainComponentAlias} from '{$WP.MainComponentPath}';
{foreach from=$WP.Modules item=module}
import {$module.alias} from '{$module.path}';
{/foreach}

/**
 * Instantiate modules
 */
{foreach from=$WP.Modules item=module}
var {$module.alias|lcfirst} = new {$module.alias}();
{/foreach}

Router.setActiveRoute(window.location.pathname);
var mainComponent = React.createElement({$WP.MainComponentAlias}.createInstance());
React.render(mainComponent, document.getElementById('app'));
Router.start(window.location.pathname);

$(document).on('click', 'a', function(e){
    e.preventDefault();
    Router.goTo(e.target.href);
});
