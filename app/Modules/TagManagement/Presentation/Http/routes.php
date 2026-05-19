<?php

use App\Modules\TagManagement\Presentation\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin/tags')
    ->name('admin.tags.')
    ->group(function () {
        Route::get('/', [TagController::class, 'index'])
            ->name('index')
            ->middleware('can:manage_tags');

        Route::get('/search', [TagController::class, 'search'])
            ->name('search')
            ->middleware('can:manage_tags');

        Route::get('/products/search', [TagController::class, 'searchProducts'])
            ->name('products.search')
            ->middleware('can:manage_tags');

        Route::get('/create', [TagController::class, 'create'])
            ->name('create')
            ->middleware('can:manage_tags');

        Route::post('/', [TagController::class, 'store'])
            ->name('store')
            ->middleware('can:manage_tags');

        Route::get('/{id}', [TagController::class, 'show'])
            ->whereNumber('id')
            ->name('show')
            ->middleware('can:manage_tags');

        Route::get('/{id}/edit', [TagController::class, 'edit'])
            ->whereNumber('id')
            ->name('edit')
            ->middleware('can:manage_tags');

        Route::put('/{id}', [TagController::class, 'update'])
            ->whereNumber('id')
            ->name('update')
            ->middleware('can:manage_tags');

        Route::delete('/{id}', [TagController::class, 'destroy'])
            ->whereNumber('id')
            ->name('destroy')
            ->middleware('can:manage_tags');

        Route::post('/{id}/products', [TagController::class, 'attachProduct'])
            ->whereNumber('id')
            ->name('products.attach')
            ->middleware('can:manage_tags');

        Route::delete('/{id}/products/{productId}', [TagController::class, 'detachProduct'])
            ->whereNumber('id')
            ->whereNumber('productId')
            ->name('products.detach')
            ->middleware('can:manage_tags');
    });
