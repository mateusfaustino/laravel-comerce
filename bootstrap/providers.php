<?php

use App\Modules\Authentication\Infrastructure\Providers\AuthenticationServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    AuthenticationServiceProvider::class,
];
