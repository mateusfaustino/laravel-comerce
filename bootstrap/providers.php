<?php

use App\Modules\Authentication\Infrastructure\Providers\AuthenticationServiceProvider;
use App\Modules\CategoryManagement\Infrastructure\Providers\CategoryManagementServiceProvider;
use App\Modules\ProductManagement\Infrastructure\Providers\ProductManagementServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    AuthenticationServiceProvider::class,
    CategoryManagementServiceProvider::class,
    ProductManagementServiceProvider::class,
];
