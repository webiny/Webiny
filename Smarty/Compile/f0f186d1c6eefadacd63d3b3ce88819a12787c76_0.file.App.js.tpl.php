<?php /* Smarty version 3.1.22-dev/9, created on 2015-02-28 10:45:43
         compiled from "/var/www/projects/platform-sandbox/Vendors/Platform/Bootstrap/Generators/Templates/App.js.tpl" */ ?>
<?php
/*%%SmartyHeaderCode:67065963254f20cd7b8e1d5_25541526%%*/
if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'f0f186d1c6eefadacd63d3b3ce88819a12787c76' => 
    array (
      0 => '/var/www/projects/platform-sandbox/Vendors/Platform/Bootstrap/Generators/Templates/App.js.tpl',
      1 => 1425149141,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '67065963254f20cd7b8e1d5_25541526',
  'tpl_function' => 
  array (
  ),
  'variables' => 
  array (
    'WP' => 0,
    'app' => 0,
  ),
  'has_nocache_code' => false,
  'version' => '3.1.22-dev/9',
  'unifunc' => 'content_54f20cd7bd2035_12191226',
),false);
/*/%%SmartyHeaderCode%%*/
if ($_valid && !is_callable('content_54f20cd7bd2035_12191226')) {
function content_54f20cd7bd2035_12191226 ($_smarty_tpl) {
?>
<?php
$_smarty_tpl->properties['nocache_hash'] = '67065963254f20cd7b8e1d5_25541526';
?>
import EventManager from '/Core/EventManager';
import Router from '/Core/Router/Router';
import Http from '/Core/Http';
import Q from '/Core/Queue';

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
window.Q = Q;

<?php
$_from = $_smarty_tpl->tpl_vars['WP']->value['Apps'];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$_smarty_tpl->tpl_vars['app'] = new Smarty_Variable;
$_smarty_tpl->tpl_vars['app']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['app']->value) {
$_smarty_tpl->tpl_vars['app']->_loop = true;
$foreachItemSav = $_smarty_tpl->tpl_vars['app'];
?>
import <?php echo $_smarty_tpl->tpl_vars['app']->value['name'];?>
App from '<?php echo $_smarty_tpl->tpl_vars['app']->value['path'];?>
';
<?php
$_smarty_tpl->tpl_vars['app'] = $foreachItemSav;
}
?>

import <?php echo $_smarty_tpl->tpl_vars['WP']->value['MainComponent'];?>
 from '<?php echo $_smarty_tpl->tpl_vars['WP']->value['MainComponentPath'];?>
';

/**
 * Instantiate modules
 */
<?php
$_from = $_smarty_tpl->tpl_vars['WP']->value['Apps'];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$_smarty_tpl->tpl_vars['app'] = new Smarty_Variable;
$_smarty_tpl->tpl_vars['app']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['app']->value) {
$_smarty_tpl->tpl_vars['app']->_loop = true;
$foreachItemSav = $_smarty_tpl->tpl_vars['app'];
?>
var <?php echo lcfirst($_smarty_tpl->tpl_vars['app']->value['name']);?>
App = new <?php echo $_smarty_tpl->tpl_vars['app']->value['name'];?>
App();
<?php
$_smarty_tpl->tpl_vars['app'] = $foreachItemSav;
}
?>

Router.setActiveRoute(window.location.pathname);
var mainComponent = <?php echo $_smarty_tpl->tpl_vars['WP']->value['MainComponent'];?>
.createElement();
React.render(mainComponent, document.getElementById('app'));
Router.start(window.location.pathname);

$(document).on('click', 'a', function(e){
    e.preventDefault();
    Router.goTo(e.target.href);
});
<?php }
}
?>