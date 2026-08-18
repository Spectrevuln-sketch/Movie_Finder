<?php

namespace App\Providers;

use App\Core\Modules\ModuleManifest;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register module service providers.
     *
     * @return void
     */
    public function register()
    {
        /** @var ModuleManifest $manifest */
        $manifest = $this->app->make(ModuleManifest::class);

        foreach ($manifest->providers() as $provider) {
            $this->app->register($provider);
        }
    }
}
