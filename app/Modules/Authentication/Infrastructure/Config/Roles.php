<?php

return [

    'ADMIN' => [
        'name' => 'Administrador',
        'permissions' => [
            'access_admin_panel',
            'create_category',
            'list_categories',
            'register_category',
            'edit_category',
            'order_category',
            'delete_category',
        ],
    ],

    'CUSTOMER' => [
        'name' => 'Cliente',
        'permissions' => [
            'access_customer_panel',
        ],
    ],

    'DEV' => [
        'name' => 'Desenvolvedor',
        'permissions' => [
            'access_dev_panel',
        ],
    ],
];
