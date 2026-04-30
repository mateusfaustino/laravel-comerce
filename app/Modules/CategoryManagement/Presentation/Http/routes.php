<?php

use App\Modules\CategoryManagement\Presentation\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin/categories')
    ->name('admin.categories.')
    ->group(function () {
        Route::get('/', [CategoryController::class, 'index'])
            ->name('index')
            ->middleware('can:list_categories');

        Route::get('/create', [CategoryController::class, 'create'])
            ->name('create')
            ->middleware('can:register_category');

        Route::post('/', [CategoryController::class, 'store'])
            ->name('store')
            ->middleware('can:register_category');

        Route::get('/{id}', [CategoryController::class, 'show'])
            ->name('show')
            ->middleware('can:list_categories');

        Route::get('/{id}/edit', [CategoryController::class, 'edit'])
            ->name('edit')
            ->middleware('can:edit_category');

        Route::put('/{id}', [CategoryController::class, 'update'])
            ->name('update')
            ->middleware('can:edit_category');

        Route::delete('/{id}', [CategoryController::class, 'destroy'])
            ->name('destroy')
            ->middleware('can:delete_category');
    });
