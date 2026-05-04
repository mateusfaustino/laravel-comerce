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
            'list_products',
            'register_product',
            'edit_product',
            'delete_product',
            'manage_color',
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
