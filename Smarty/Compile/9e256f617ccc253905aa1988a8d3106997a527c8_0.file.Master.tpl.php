<?php /* Smarty version 3.1.22-dev/9, created on 2015-02-28 15:24:00
         compiled from "/var/www/projects/platform-sandbox/Apps/Core/Backend/Layout/Templates/Master.tpl" */ ?>
<?php
/*%%SmartyHeaderCode:47629884154f24e10706459_86922201%%*/
if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '9e256f617ccc253905aa1988a8d3106997a527c8' => 
    array (
      0 => '/var/www/projects/platform-sandbox/Apps/Core/Backend/Layout/Templates/Master.tpl',
      1 => 1425165641,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '47629884154f24e10706459_86922201',
  'tpl_function' => 
  array (
  ),
  'variables' => 
  array (
    'assets' => 0,
    'css' => 0,
    'js' => 0,
    'App' => 0,
  ),
  'has_nocache_code' => false,
  'version' => '3.1.22-dev/9',
  'unifunc' => 'content_54f24e10739197_15296946',
),false);
/*/%%SmartyHeaderCode%%*/
if ($_valid && !is_callable('content_54f24e10739197_15296946')) {
function content_54f24e10739197_15296946 ($_smarty_tpl) {
?>
<?php
$_smarty_tpl->properties['nocache_hash'] = '47629884154f24e10706459_86922201';
?>
<!DOCTYPE html>
<!--[if IE 6]>
<html class="ie-all ie-6" lang="en-US" prefix="og: http://ogp.me/ns#">
<![endif]-->
<!--[if IE 7]>
<html class="ie-all ie-7" lang="en-US" prefix="og: http://ogp.me/ns#">
<![endif]-->
<!--[if IE 8]>
<html class="ie-all ie-8" prefix="og: http://ogp.me/ns#">
<![endif]-->
<!--[if IE 9]>
<html class="ie-all ie-9" prefix="og: http://ogp.me/ns#">
<![endif]-->
<!--[if !(IE 6) | !(IE 7) | !(IE 8)  ]><!-->
<html xmlns="http://www.w3.org/1999/xhtml">
<!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=1">

    <title>Webiny ReactJS Platform</title>
    <?php echo '<script'; ?>
 src="/Assets/Google/traceur.js" type="text/javascript"><?php echo '</script'; ?>
>
    <?php echo '<script'; ?>
 src="/Assets/Google/bootstrap.js" type="text/javascript"><?php echo '</script'; ?>
>
    <?php echo '<script'; ?>
 src="/Assets/React/react.js"><?php echo '</script'; ?>
>
    <?php echo '<script'; ?>
 src="/Assets/React/react-with-addons.js"><?php echo '</script'; ?>
>
    <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,600,700' rel='stylesheet'
          type='text/css'>
    <!-- Bootstrap CSS -->
    <link rel="shortcut icon" href="/Assets/favicon.png" type="image/x-icon"/>
    <?php
$_from = $_smarty_tpl->tpl_vars['assets']->value['css'];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$_smarty_tpl->tpl_vars['css'] = new Smarty_Variable;
$_smarty_tpl->tpl_vars['css']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['css']->value) {
$_smarty_tpl->tpl_vars['css']->_loop = true;
$foreachItemSav = $_smarty_tpl->tpl_vars['css'];
?>
    <link rel="stylesheet" href="<?php echo $_smarty_tpl->tpl_vars['css']->value;?>
">
    <?php
$_smarty_tpl->tpl_vars['css'] = $foreachItemSav;
}
?>
    <?php
$_from = $_smarty_tpl->tpl_vars['assets']->value['js'];
if (!is_array($_from) && !is_object($_from)) {
settype($_from, 'array');
}
$_smarty_tpl->tpl_vars['js'] = new Smarty_Variable;
$_smarty_tpl->tpl_vars['js']->_loop = false;
foreach ($_from as $_smarty_tpl->tpl_vars['js']->value) {
$_smarty_tpl->tpl_vars['js']->_loop = true;
$foreachItemSav = $_smarty_tpl->tpl_vars['js'];
?>
    <?php echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['js']->value;?>
"><?php echo '</script'; ?>
>
    <?php
$_smarty_tpl->tpl_vars['js'] = $foreachItemSav;
}
?>
    <!-- Apps assets -->
    <?php echo '<script'; ?>
>
        traceur.options.experimental = true;
        var _apiUrl = '<?php echo $_smarty_tpl->tpl_vars['App']->value->getConfig('Platform.ApiPath');?>
';
        var _appUrl = '<?php echo $_smarty_tpl->tpl_vars['App']->value->getConfig('Platform.WebPath');?>
';
        var _backendPrefix = '<?php echo $_smarty_tpl->tpl_vars['App']->value->getConfig('Platform.Backend.Prefix');?>
';
    <?php echo '</script'; ?>
>
    <?php echo '<script'; ?>
 type="module" src="/Core/SystemLoader.js"><?php echo '</script'; ?>
>
    <?php echo '<script'; ?>
 src="/Assets/Lib/history.js/native.history.js"><?php echo '</script'; ?>
>
    <?php echo '<script'; ?>
 src="/Assets/Lib/Md5.js" type="text/javascript"><?php echo '</script'; ?>
>
    <!-- Bootstrap the entire platform -->
    <?php echo '<script'; ?>
 src="/Assets/App.js" type="module"><?php echo '</script'; ?>
>
</head>
<body class="">
<div id="app"></div>
</body>
</html><?php }
}
?>