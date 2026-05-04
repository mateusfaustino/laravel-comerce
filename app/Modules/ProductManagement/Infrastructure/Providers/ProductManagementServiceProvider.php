<?php

namespace App\Modules\ProductManagement\Infrastructure\Providers;

use App\Modules\ProductManagement\Domain\Repositories\CorRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\FotoRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductRepositoryInterface;
use App\Modules\ProductManagement\Domain\Repositories\ProductVariationRepositoryInterface;
use App\Modules\ProductManagement\Infrastructure\Persistence\Repositories\EloquentCorRepository;
use App\Modules\ProductManagement\Infrastructure\Persistence\Repositories\EloquentFotoRepository;
use App\Modules\ProductManagement\Infrastructure\Commands\SyncDefaultColorsCommand;
use App\Modules\ProductManagement\Infrastructure\Persistence\Repositories\EloquentProductRepository;
use App\Modules\ProductManagement\Infrastructure\Persistence\Repositories\EloquentProductVariationRepository;
use Illuminate\Support\ServiceProvider;

class ProductManagementServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            ProductRepositoryInterface::class,
            EloquentProductRepository::class
        );

        $this->app->bind(
            ProductVariationRepositoryInterface::class,
            EloquentProductVariationRepository::class
        );

        $this->app->bind(
            CorRepositoryInterface::class,
            EloquentCorRepository::class
        );

        $this->app->bind(
            FotoRepositoryInterface::class,
            EloquentFotoRepository::class
        );
    }

    public function boot(): void
    {
        $this->loadMigrationsFrom(
            __DIR__.'/../Persistence/Migrations'
        );

        if ($this->app->runningInConsole()) {
            $this->commands([
                SyncDefaultColorsCommand::class,
            ]);
        }
    }
}
