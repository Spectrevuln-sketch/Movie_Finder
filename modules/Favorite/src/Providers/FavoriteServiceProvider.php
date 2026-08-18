<?php

namespace Modules\Favorite\Providers;

use Illuminate\Support\ServiceProvider;

class FavoriteServiceProvider extends ServiceProvider
{
    public function register()
    {
    }

    public function boot()
    {
        $this->loadRoutesFrom(
            __DIR__ . '/../Routes/web.php'
        );
        
        $this->loadMigrationsFrom(
            __DIR__ . '/../Database/Migrations'
        );
    }
}
