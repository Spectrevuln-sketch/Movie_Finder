<?php

use Illuminate\Support\Facades\Route;
use Modules\Movie\Controllers\MovieController;


Route::middleware(['web', 'module.auth'])->group(function () {
    Route::prefix('movies')->group(function () {
        Route::get('/api', [MovieController::class, 'getMovies'])->name('movies.api');
        Route::get('/{imdbId}', [MovieController::class, 'show'])->name('movies.show');
        Route::get('/', [MovieController::class, 'index'])->name('movies.index');
    });
    Route::get('/', [MovieController::class, 'landing'])->name('landing');
});
