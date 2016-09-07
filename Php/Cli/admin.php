<?php
use Apps\Core\Php\Entities\User;
use Apps\Core\Php\Entities\UserRole;
use Webiny\Component\StdLib\Exception\AbstractException;

if (php_sapi_name() !== 'cli') {
    die('Invalid invocation!');
}

$autoloader = require_once getcwd() . '/vendor/autoload.php';
$autoloader->addPsr4('Apps\\Core\\', getcwd() . '/Apps/Core');

$publicUserGroup = [
    'name'        => 'Public',
    'slug'         => 'public',
    'permissions' => [
        'entities' => [
            'Apps\\Core\\Php\\Entities\\User' => [
                'login'          => [
                    'post' => true
                ],
                'reset-password' => [
                    'post' => true
                ],
                'set-password'   => [
                    'post' => true
                ]
            ]
        ],
        'services' => [
            'Apps\\Core\\Php\\Services\\Apps' => [
                '{appName}' => [
                    'get' => true
                ]
            ]
        ]
    ]
];
$adminUserGroup = [
    'name'        => 'Administrators',
    'slug'         => 'administrators',
    'permissions' => [
        'entities' => [
            'Apps\\Core\\Php\\Entities\\User'             => [
                'crudCreate' => true,
                'crudRead'   => true,
                'crudUpdate' => true,
                'crudDelete' => true,
                'me'         => [
                    'get'   => true,
                    'patch' => true
                ]
            ],
            'Apps\\Core\\Php\\Entities\\UserRole'         => [
                'crudCreate' => true,
                'crudRead'   => true,
                'crudUpdate' => true,
                'crudDelete' => true
            ],
            'Apps\\Core\\Php\\Entities\\UserPermission'   => [
                'crudCreate' => true,
                'crudRead'   => true,
                'crudUpdate' => true,
                'crudDelete' => true
            ],
            'Apps\\Core\\Php\\Entities\\ApiToken'         => [
                'crudCreate' => true,
                'crudRead'   => true,
                'crudUpdate' => true,
                'crudDelete' => true
            ],
            'Apps\\Core\\Php\\Entities\\ApiTokenLog'      => [
                'crudCreate' => true,
                'crudRead'   => true,
                'crudUpdate' => true,
                'crudDelete' => true
            ],
            'Apps\\Core\\Php\\Entities\\File'             => [
                'crudCreate' => true,
                'crudRead'   => true,
                'crudUpdate' => true,
                'crudDelete' => true
            ],
            'Apps\\Core\\Php\\Entities\\LoggerEntry'      => [
                'crudCreate' => true,
                'crudRead'   => true,
                'crudUpdate' => true,
                'crudDelete' => true
            ],
            'Apps\\Core\\Php\\Entities\\LoggerErrorGroup' => [
                'crudCreate'  => true,
                'crudRead'    => true,
                'crudUpdate'  => true,
                'crudDelete'  => true,
                'save-report' => [
                    'post' => true
                ]
            ],
            'Apps\\Core\\Php\\Entities\\Setting'          => [
                'key/{key}' => [
                    'get'   => true,
                    'patch' => true
                ]
            ]
        ],
        'services' => [
            'Apps\\Core\\Php\\Services\\Entities' => [
                '/'          => [
                    'get' => true
                ],
                'attributes' => [
                    'get' => true
                ],
                'methods'    => [
                    'get' => true
                ]
            ],
            'Apps\\Core\\Php\\Services\\Services' => [
                '/' => [
                    'get' => true
                ]
            ]
        ]
    ]
];

$usersUserGroup = [
    'name'        => 'Users',
    'slug'         => 'users',
    'permissions' => [
        'entities' => [
            'Apps\\Core\\Php\\Entities\\User' => [
                'me' => [
                    'get'   => true,
                    'patch' => true
                ]
            ]
        ]
    ]
];

$_SERVER = [];
$_SERVER['SERVER_NAME'] = $argv[1];

\Apps\Core\Php\Bootstrap\Bootstrap::getInstance();

// Create 'public', 'users' and 'administrators' user groups
try {
    $publicGroup = new UserRole();
    $publicGroup->populate($publicUserGroup)->save();
} catch (AbstractException $e) {
    // Public group exists
}

try {
    $publicGroup = new UserRole();
    $publicGroup->populate($usersUserGroup)->save();
} catch (AbstractException $e) {
    // Users group exists
}

try {
    $adminGroup = new UserRole();
    $adminGroup->populate($adminUserGroup)->save();
} catch (AbstractException $e) {
    // Admin group exists
    $adminGroup = UserRole::findOne(['slug' => 'administrators']);
}

// Create admin user
try {
    $user = new User();
    $user->email = $argv[2];
    $user->password = $argv[3];
    $user->groups = [$adminGroup->id];
    $user->firstName = '';
    $user->lastName = '';
    $user->save();
    echo('created');
} catch (AbstractException $e) {
    echo('exists');
}
