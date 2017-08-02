<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Webiny</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <link rel="shortcut icon" href="{$Webiny->Assets('Webiny.Skeleton', 'images/public/favicon.ico')}"/>
    <link href="//fonts.googleapis.com/css?family=Source+Sans+Pro:400,700,300" rel="stylesheet" type="text/css">
    {webinyPreload apps="Webiny.Ui,Webiny.Skeleton,Webiny.Backend"}
    {literal}
        <script type="text/javascript">
            var webinyConfig = {
                apps: ['Webiny.Ui', 'Webiny.Skeleton', 'Webiny.Backend'],
                router: {baseUrl: '/admin', title: '%s | Webiny'},
                auth: 'Webiny.Skeleton'
            };
        </script>
    {/literal}
</head>
<body>
<style type="text/css">
    .preloader-wrap .box {
        background: #FA5A28 url('{$Webiny->Assets('Webiny.Skeleton', 'images/public/bg-login.png')}') repeat;
        top: 0;
        left: 0;
        z-index: 100000;
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .loader {
        background: url('{$Webiny->Assets('Webiny.Skeleton', 'images/public/preloader_2.png')}') no-repeat top left;
    }

    .loader3 {
        position: relative;
        width: 150px;
        height: 80px;
        top: 49%;
        left: 49%;
        background-size: 45px 45px;
        -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)";
        filter: alpha(opacity=50);
        -moz-opacity: 0.5;
        -khtml-opacity: 0.5;
        opacity: 0.5;
    }

    .loader4 {
        content: "";
        position: absolute;
        top: 49%;
        left: 49%;
        width: 150px;
        height: 80px;
        z-index: 0;
        opacity: 1;
        transform-origin: 100% 0%;
        animation: loader3 10s ease-in-out infinite;
        background-size: 45px 45px;
    }

    @-webkit-keyframes loader3 {
        0% {
            width: 0;
        }

        70% {
            width: 150px;
            opacity: 1;
        }

        90% {
            opacity: 0;
            width: 150px;
        }

        100% {
            opacity: 0;
            width: 0;
        }
    }

    @keyframes loader3 {
        0% {
            width: 0;
        }

        70% {
            width: 150px;
            opacity: 1;
        }

        90% {
            opacity: 0;
            width: 150px;
        }

        100% {
            opacity: 0;
            width: 0;
        }
    }
</style>
<div class="preloader-wrap">
    <div class="box">
        <div class="loader loader3"></div>
        <div class="loader loader4"></div>
    </div>
</div>
{webiny apps="Webiny.Ui,Webiny.Skeleton,Webiny.Backend"}
</body>
</html>