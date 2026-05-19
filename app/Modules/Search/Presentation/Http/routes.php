<?php

use App\Modules\Search\Presentation\Http\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

// Live search JSON endpoint (consumed by the storefront search bar).
Route::get('/search', [SearchController::class, 'live'])->name('search.live');

// Storefront tag landing page.
Route::get('/tag/{slug}', [SearchController::class, 'tag'])->name('tag.show');
