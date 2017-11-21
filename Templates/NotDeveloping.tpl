<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Webiny Cli not ready for development</title>
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <link rel="shortcut icon" href="{$Webiny->Assets('Webiny.Skeleton', 'images/public/favicon.ico')}"/>
    <link href="//fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600" rel="stylesheet" type="text/css">
    <style type="text/css">
        body {
            background: #f2f2f2;
            width: 100%;
            overflow-x: hidden;
            padding: 0;
            margin: 0;
            font-family: 'Source Sans Pro', sans-serif;
            text-align: center;
            color: #646464;
            font-size: 16px;
        }

        .logo {
            text-align: center;
            width: 100%;
        }

        .box {
            background-color: #ffffff;
            padding: 50px 100px;
            max-width: 450px;
            max-height: 700px;
            margin: 100px auto 25px auto;
            text-align: left;
        }

        ol {
            list-style: none;
        }

        li {
            counter-increment: item;
            margin-bottom: 5px;
        }

        li:before {
            margin-right: 10px;
            content: counter(item);
            background: #FA5A28;
            border-radius: 100%;
            color: white;
            width: 25px;
            text-align: center;
            display: inline-block;
        }

        h2 {
            font-size: 28px;
            margin-bottom: 41px;
            position: relative;
            text-align: center;
            display: block;
            letter-spacing: -0.1px;
            color: #FA5A28;
            font-weight: 300;
            margin-top: 20px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
        }

        .item {
            margin-bottom: 20px;
            width: 100%;
            padding: 20px;
            background-color: #f7f8fa;
            line-height: 150%;
            box-sizing: border-box;
            font-weight: 400;
        }

        .footer {
            clear: both;
            margin-top: 40px;
            margin-bottom: 0;
            font-size: 14px;
            color: #FA5A28;
            line-height: 150%;
            font-weight: 600;
        }

        a, a:focus, a:hover, a:active {
            color: #FA5A28;
        }

        @media (max-width: 768px) {
            .box {
                margin-top: 0;
                padding: 50px 25px 25px 25px;
            }
        }
    </style>
</head>
<body>
<div class="box">
    <div class="logo">
        <img src="{$Webiny->Assets('Webiny.Skeleton', 'images/public/logo_orange.png')}" alt="Webiny Logo" height="58"/>
    </div>
    <h2>Not ready for development!</h2>
    <div class="item">
        <ol>
            <li>
                Open your terminal
            </li>
            <li>
                Navigate to your project folder
            </li>
            {if $environment === 'docker'}
                <li>
                    $ docker-compose exec webiny yarn webiny-cli
                </li>
            {/if}
            {if $environment === 'vagrant'}
                <li>
                    $ cd vagrant && vagrant ssh
                </li>
                <li>
                    $ cd app && yarn webiny-cli
                </li>
            {/if}
        </ol>
    </div>
</div>

<div class="footer">
    powered by <br>
    <a href="https://www.webiny.com" class="site">www.webiny.com</a>
</div>
</body>
</html>