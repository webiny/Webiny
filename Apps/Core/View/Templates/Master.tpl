<html>
<head>
    <title>Webiny ReactJS Platform</title>
    <script src="Assets/Google/traceur.js" type="text/javascript"></script>
    <script src="Assets/Google/bootstrap.js" type="text/javascript"></script>
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
    <script type="module">
        {literal}

        var TraceurLoader = traceur.runtime.TraceurLoader;
        var webLoader = traceur.runtime.webLoader;

        var traceurSystem = System;
        class SystemLoader extends TraceurLoader {
            constructor() {
                super(webLoader, window.location.href);
                this.componentsRegex = /(.*?\/Components)\/([\w+]*)\/([\w+]*)/;
            }

            normalize(name, referrerName, referrerAddress) {
                if (this.componentsRegex.exec(name)){
                    var newPath = name.replace(this.componentsRegex, '$1/$2/dist/$2');
                    console.log(name+" => ", newPath);
                    return newPath;
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