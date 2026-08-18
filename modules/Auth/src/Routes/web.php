<?php

use Illuminate\Support\Facades\Route;
use Modules\Auth\Controllers\AuthController;


Route::middleware('web')->group(function () {
    Route::get('/login', [
        AuthController::class,
        'showLogin',
    ])->name('login');

    Route::post('/login', [
        AuthController::class,
        'login',
    ])->name('login.attempt');

    Route::post('/logout', [
        AuthController::class,
        'logout',
    ])->name('logout');
});