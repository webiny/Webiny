<html>
<head>
    <title>Webiny ReactJS Platform</title>
    <script src="Assets/Google/traceur.js"></script>
    <script src="Assets/Google/bootstrap.js"></script>
    <script src="Assets/React-0.12/JSXTransformer.js"></script>
    <script src="Assets/React-0.12/React.js"></script>
    <script src="Assets/React-0.12/ReactAddons.js"></script>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.0/css/bootstrap.min.css">
    <!-- App style -->
    <link rel="stylesheet" href="Assets/style.css">
    <script>
        traceur.options.experimental = true;
    </script>
    <!--<script src="https://code.angularjs.org/1.2.25/angular.js"></script>-->
    <!-- The demo -->
    <script src="Assets/Lib/history.js/native.history.js"></script>
    <script src="Assets/Lib/Router.js" type="text/javascript"></script>
    <script src="Assets/Lib/Md5.js" type="text/javascript"></script>
    {*<script src="Scripts/App.js" type="module"></script>*}
    <script src="https://code.jquery.com/jquery-2.1.1.min.js" type="text/javascript"></script>
</head>

<body class="container">
<br>
<button onclick="router.navigate('/')">Dashboard</button>
<button onclick="router.navigate('/posts')">Posts</button>
<hr/>
<div id="app"></div>
</body>

</html>