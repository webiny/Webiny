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

    <title>Webiny Platform</title>
    <script src="/Assets/Google/traceur.js" type="text/javascript"></script>
    <script src="/Assets/Google/bootstrap.js" type="text/javascript"></script>
    <script src="/Assets/React/react.js"></script>
    <script src="/Assets/React/react-with-addons.js"></script>
    <script src="/Assets/Lib/q/q.js"></script>
    <script src="/Assets/Lib/axios/dist/axios.min.js"></script>
    <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,600,700' rel='stylesheet'
          type='text/css'>
    <!-- Bootstrap CSS -->
    <link rel="shortcut icon" href="/Assets/favicon.png" type="image/x-icon"/>
    <?php
    foreach ($data['assets']['css'] as $css) {
        echo '<link rel="stylesheet" href="' . $css . '">';
    }
    foreach ($data['assets']['js'] as $js) {
        echo '<script src="' . $js . '"></script>';
    } ?>
    <!-- Apps assets -->
    <script>
        traceur.options.experimental = true;
        var _appUrl = '<?php echo $data['App']->getConfig('Platform.WebPath');?>';
        var _apiUrl = '<?php echo $data['App']->getConfig('Platform.ApiPath');?>';
        var _backendPrefix = '<?php echo $data['App']->getConfig('Platform.Backend.Prefix');?>';
    </script>
    <script type="module" src="/Core/SystemLoader.js"></script>
    <script src="/Assets/Lib/history.js/native.history.js"></script>
    <script src="/Assets/Lib/Md5.js" type="text/javascript"></script>
    <!-- Bootstrap the entire platform -->
    <script src="/Assets/App.js" type="module"></script>
</head>
<body class="">
<div id="app"></div>
</body>
</html>