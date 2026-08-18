<?php

use Illuminate\Support\Facades\Route;
use Modules\Favorite\Controllers\FavoriteController;

Route::middleware(['web', 'module.auth'])->group(function () {
    Route::get('/favorites', [
        FavoriteController::class,
        'index',
    ])->name('favorites.index');

    // Static route HARUS sebelum dynamic route
    Route::get('/favorites/all', [
        FavoriteController::class,
        'showAll',
    ])->name('favorites.showAll');

    Route::get('/favorites/{imdbId}', [
        FavoriteController::class,
        'show',
    ])->name('favorites.show');

    Route::post('/favorites', [
        FavoriteController::class,
        'store',
    ])->name('favorites.store');

    Route::delete('/favorites/{imdbId}', [
        FavoriteController::class,
        'destroy',
    ])->name('favorites.destroy');
});
