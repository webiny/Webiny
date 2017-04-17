<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Sandbox App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <link href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,300" rel="stylesheet" type="text/css">
    {literal}
        <script type="text/javascript">
            var Webiny = {
                apps: ['Core.Skeleton', 'Core.Sandbox'],
                router: {baseUrl: '/sandbox', title: '%s', defaultRoute: 'Sandbox.Dashboard'},
                auth: 'PortHop.Providers'
            };
        </script>
    {/literal}
</head>
<body>
{webiny apps="Core.Skeleton,Core.Sandbox"}
</body>
</html>