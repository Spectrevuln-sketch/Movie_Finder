<?php

namespace Modules\Auth\Providers;

use Illuminate\Routing\Router;
use Illuminate\Support\ServiceProvider;
use Modules\Auth\Middleware\EnsureAuthenticated;

class AuthServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/auth.php',
            'modules.auth'
        );

        $this->app->singleton(
            \Modules\Auth\Services\AuthenticationService::class
        );
    }

    public function boot(Router $router)
    {
        $this->loadRoutesFrom(
            __DIR__ . '/../Routes/web.php'
        );

        $router->aliasMiddleware(
            'module.auth',
            EnsureAuthenticated::class
        );

        $this->loadMigrationsFrom(
            __DIR__ . '/../Database/Migrations'
        );
    }
}
