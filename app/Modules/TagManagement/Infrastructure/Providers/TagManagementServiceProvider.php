<?php

namespace App\Modules\TagManagement\Infrastructure\Providers;

use App\Modules\TagManagement\Domain\Repositories\TagRepositoryInterface;
use App\Modules\TagManagement\Infrastructure\Persistence\Repositories\EloquentTagRepository;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class TagManagementServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            TagRepositoryInterface::class,
            EloquentTagRepository::class
        );
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(
            __DIR__.'/../Persistence/Migrations'
        );

        // Wrap routes in the 'web' middleware group so session-based auth
        // (and CSRF) is active. Without it, 'auth' returns Unauthenticated.
        Route::middleware('web')
            ->group(__DIR__.'/../../Presentation/Http/routes.php');
    }
}
