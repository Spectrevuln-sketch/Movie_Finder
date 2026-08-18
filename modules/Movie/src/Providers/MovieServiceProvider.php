<?php

namespace Modules\Movie\Providers;

use Illuminate\Support\ServiceProvider;

class MovieServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(\Modules\Movie\Services\OmdbService::class, function ($app) {
            return new \Modules\Movie\Services\OmdbService();
        });
    }

    public function boot()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../../config/omdb.php', 'modules.omdb'
        );

        $this->loadRoutesFrom(
            __DIR__ . '/../Routes/web.php'
        );

        $this->loadMigrationsFrom(
            __DIR__ . '/../Database/Migrations'
        );
    }
}
