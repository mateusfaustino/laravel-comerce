<?php

namespace App\Modules\Storefront\Infrastructure\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class StorefrontServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Route::middleware('web')
            ->group(__DIR__.'/../../Presentation/Http/routes.php');
    }
}
