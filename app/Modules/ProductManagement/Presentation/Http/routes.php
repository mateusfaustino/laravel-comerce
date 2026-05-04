<?php

use App\Modules\ProductManagement\Presentation\Http\Controllers\CorController;
use App\Modules\ProductManagement\Presentation\Http\Controllers\FotoController;
use App\Modules\ProductManagement\Presentation\Http\Controllers\ProductController;
use App\Modules\ProductManagement\Presentation\Http\Controllers\ProductVariationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin/products')
    ->name('admin.products.')
    ->group(function () {
        Route::get('/', [ProductController::class, 'index'])
            ->name('index')
            ->middleware('can:list_products');

        Route::get('/create', [ProductController::class, 'create'])
            ->name('create')
            ->middleware('can:register_product');

        Route::post('/', [ProductController::class, 'store'])
            ->name('store')
            ->middleware('can:register_product');

        Route::get('/{id}', [ProductController::class, 'show'])
            ->name('show')
            ->middleware('can:list_products');

        Route::get('/{id}/edit', [ProductController::class, 'edit'])
            ->name('edit')
            ->middleware('can:edit_product');

        Route::put('/{id}', [ProductController::class, 'update'])
            ->name('update')
            ->middleware('can:edit_product');

        Route::delete('/{id}', [ProductController::class, 'destroy'])
            ->name('destroy')
            ->middleware('can:delete_product');

        Route::delete('/{id}/force', [ProductController::class, 'forceDestroy'])
            ->name('force-destroy')
            ->middleware('can:delete_product');

        Route::put('/{id}/activate', [ProductController::class, 'activate'])
            ->name('activate')
            ->middleware('can:edit_product');

        Route::get('/{id}/variations', [ProductController::class, 'variations'])
            ->name('variations')
            ->middleware('can:list_products');

        // Variation nested routes
        Route::post('/{productId}/variations', [ProductVariationController::class, 'store'])
            ->name('variations.store')
            ->middleware('can:register_product');

        Route::put('/{productId}/variations/{id}', [ProductVariationController::class, 'update'])
            ->name('variations.update')
            ->middleware('can:edit_product');

        Route::delete('/{productId}/variations/{id}', [ProductVariationController::class, 'destroy'])
            ->name('variations.destroy')
            ->middleware('can:delete_product');
    });

Route::middleware(['auth', 'verified'])
    ->prefix('admin/cores')
    ->name('admin.cores.')
    ->group(function () {
        Route::get('/', [CorController::class, 'index'])
            ->name('index')
            ->middleware('can:manage_color');

        Route::get('/create', [CorController::class, 'create'])
            ->name('create')
            ->middleware('can:manage_color');

        Route::post('/', [CorController::class, 'store'])
            ->name('store')
            ->middleware('can:manage_color');

        Route::get('/{id}/edit', [CorController::class, 'edit'])
            ->name('edit')
            ->middleware('can:manage_color');

        Route::put('/{id}', [CorController::class, 'update'])
            ->name('update')
            ->middleware('can:manage_color');

        Route::delete('/{id}', [CorController::class, 'destroy'])
            ->name('destroy')
            ->middleware('can:manage_color');
    });

Route::middleware(['auth', 'verified'])
    ->prefix('admin/fotos')
    ->name('admin.fotos.')
    ->group(function () {
        Route::get('/', [FotoController::class, 'index'])
            ->name('index')
            ->middleware('can:list_products');

        Route::get('/create', [FotoController::class, 'create'])
            ->name('create')
            ->middleware('can:register_product');

        Route::post('/', [FotoController::class, 'store'])
            ->name('store')
            ->middleware('can:register_product');

        Route::put('/{id}', [FotoController::class, 'update'])
            ->name('update')
            ->middleware('can:edit_product');

        Route::delete('/{id}', [FotoController::class, 'destroy'])
            ->name('destroy')
            ->middleware('can:delete_product');
    });
