<!DOCTYPE html>
<html lang="en" class="no-js">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Webiny</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <link href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,300" rel="stylesheet" type="text/css">
    <link href="/build/dev/Core/Webiny/css/vendors.min.css" rel="stylesheet" type="text/css">
    <script src="/build/dev/Core/Webiny/scripts/vendors.min.js" type="text/javascript"></script>
</head>
<body>
<rad-app id="app" name="Core/Backend" base-url="/backend"></rad-app>
<script>
    WebinyBootstrap.setApiPath('/api').run();
</script>
</body>
</html>