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
    <script type="module">
        {literal}
        traceur.options.experimental = true;

        import {TraceurLoader} from 'traceur@0.0/src/runtime/TraceurLoader';
        import {webLoader} from 'traceur@0.0/src/runtime/webLoader';

        var traceurSystem = System;
        class SystemLoader extends TraceurLoader {
            constructor() {
                super(webLoader, window.location.href);
            }

            normalize(name, referrerName, referrerAddress) {
                console.log(name);

                if (name == 'Foo/Bar'){
                    return 'App/Foo/Module/Bar';
                }

                return super.normalize(name, referrerName, referrerAddress);
            }
        }
        System = new SystemLoader();
        {/literal}
    </script>
    <!--<script src="https://code.angularjs.org/1.2.25/angular.js"></script>-->
    <!-- The demo -->
    <script src="Assets/Lib/history.js/native.history.js"></script>
    <script src="Assets/Lib/Md5.js" type="text/javascript"></script>
    <script src="https://code.jquery.com/jquery-2.1.1.min.js" type="text/javascript"></script>
    <!-- Bootstrap the entire platform -->
    <script src="Assets/App.js" type="module"></script>
</head>

<body>
    <div id="app"></div>
</body>
</html>