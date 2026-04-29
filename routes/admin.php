<?php

use App\Modules\AdminPanel\Presentation\Http\Controllers\AdminController;
use App\Modules\AdminPanel\Presentation\Http\Middleware\CheckAdminPanelAccess;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', CheckAdminPanelAccess::class])
    ->prefix('admin')
    ->group(function () {
        Route::get('dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    });

Route::get('admin/unauthorized', function () {
    return inertia('admin/unauthorized');
})->name('admin.unauthorized');
