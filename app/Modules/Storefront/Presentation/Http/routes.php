<?php

use App\Modules\Storefront\Presentation\Http\Controllers\StorefrontController;
use Illuminate\Support\Facades\Route;

Route::get('/', [StorefrontController::class, 'home'])->name('home');

Route::get('/categoria/{slug}', [StorefrontController::class, 'category'])->name('category.show');

Route::get('/produto/{slug}', [StorefrontController::class, 'show'])->name('product.show');
