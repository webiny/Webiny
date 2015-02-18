<html>
<head>
    <title>Webiny ReactJS Platform</title>
    <script src="/Assets/Google/traceur.js" type="text/javascript"></script>
    <script src="/Assets/Google/bootstrap.js" type="text/javascript"></script>
    <script src="/Assets/React/react.js"></script>
    <script src="/Assets/React/react-with-addons.js"></script>
    <script src="/Assets/jquery-2.1.1.min.js" type="text/javascript"></script>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css">
    <!-- App style -->
    <link rel="stylesheet" href="/Assets/style.css">
    <!-- Apps assets -->
    <script>
        traceur.options.experimental = true;
        var _apiUrl = '{$App->getConfig('Platform.ApiPath')}';
        var _appUrl = '{$App->getConfig('Platform.WebPath')}';
    </script>
    <script type="module" src="/Core/SystemLoader.js"></script>
    <!--<script src="https://code.angularjs.org/1.2.25/angular.js"></script>-->
    <!-- The demo -->
    <script src="/Assets/Lib/history.js/native.history.js"></script>
    <script src="/Assets/Lib/Md5.js" type="text/javascript"></script>
    <!-- Bootstrap the entire platform -->
    <script src="/Assets/App.js" type="module"></script>
</head>

<body>
    <div id="app"></div>
    <div id="tmp" style="display:none"></div>
</body>
</html>