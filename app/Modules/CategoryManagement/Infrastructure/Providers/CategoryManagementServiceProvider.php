<?php

namespace App\Modules\CategoryManagement\Infrastructure\Providers;

use App\Modules\CategoryManagement\Domain\Repositories\CategoryRepositoryInterface;
use App\Modules\CategoryManagement\Infrastructure\Commands\SyncDefaultCategoriesCommand;
use App\Modules\CategoryManagement\Infrastructure\Persistence\Repositories\EloquentCategoryRepository;
use Illuminate\Support\ServiceProvider;

class CategoryManagementServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            CategoryRepositoryInterface::class,
            EloquentCategoryRepository::class
        );
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                SyncDefaultCategoriesCommand::class,
            ]);
        }
    }
}
