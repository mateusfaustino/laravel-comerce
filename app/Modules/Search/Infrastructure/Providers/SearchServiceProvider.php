<?php

namespace App\Modules\Search\Infrastructure\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class SearchServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Wrap routes in the 'web' middleware group so sessions and CSRF are active.
        Route::middleware('web')
            ->group(__DIR__.'/../../Presentation/Http/routes.php');
    }
}
