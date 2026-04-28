<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'store-homepage', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/produto/{id}', function ($id) {
    return inertia('product-page', ['id' => $id]);
})->name('product.show');

Route::inertia('/cart', 'cart-page')->name('cart.index');
Route::inertia('/checkout', 'checkout-page')->name('checkout.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
