<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Webiny</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <link href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,300" rel="stylesheet" type="text/css">
    {webiny}
</head>
<body>
<webiny-app/>
<script>
    WebinyBootstrap.run({
        app: 'Core.Backend',
        router: {
            baseUrl: '/admin',
            title: '%s | Webiny',
            defaultRoute: 'Users.List'
        },
        authentication: 'Core.Backend'
    });
</script>
</body>
</html>