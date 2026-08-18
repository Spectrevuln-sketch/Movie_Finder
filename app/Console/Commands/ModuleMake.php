<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use InvalidArgumentException;

class ModuleMake extends Command
{
    protected $signature = 'module:make {name}';

    protected $description = 'Create a new application module';

    protected $files;

    public function __construct(Filesystem $files)
    {
        parent::__construct();

        $this->files = $files;
    }

    public function handle()
    {
        $name = $this->argument('name');

        if (!$this->isValidModuleName($name)) {
            throw new InvalidArgumentException(
                'Module name must contain only letters, numbers, and underscores, and must start with a letter.'
            );
        }

        $modulePath = base_path('modules/' . $name);

        if ($this->files->exists($modulePath)) {
            $this->error("Module [{$name}] already exists.");

            return 1;
        }

        $this->createDirectories($modulePath);
        $this->createFiles($name, $modulePath);

        $this->info("Module [{$name}] created successfully.");

        return 0;
    }

    protected function createDirectories($modulePath)
    {
        $directories = [
            'config',

            'src/Controllers',
            'src/Database/Migrations',
            'src/Middleware',
            'src/Models',
            'src/Requests',
            'src/Repositories',
            'src/Services',
            'src/Providers',
            'src/Routes',

            'resources/js/components',
            'resources/js/hooks',
            'resources/js/pages',
            'resources/js/types',
            'resources/js/lib',

            'resources/css',
        ];

        foreach ($directories as $directory) {
            $this->files->makeDirectory(
                $modulePath . '/' . $directory,
                0755,
                true
            );
        }
    }

    protected function createFiles($name, $modulePath)
    {
        $providerClass = <<<PHP
<?php

namespace Modules\\{$name}\\Providers;

use Illuminate\\Support\\ServiceProvider;

class {$name}ServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        \$this->loadRoutesFrom(
            __DIR__ . '/../Routes/web.php'
        );

        \$this->loadMigrationsFrom(
            __DIR__ . '/../Database/Migrations'
        );
    }
}

PHP;

        $routeFile = <<<PHP
<?php

use Illuminate\\Support\\Facades\\Route;

// Module {$name} routes.
// Add feature routes here.

PHP;

        $this->files->put(
            $modulePath
                . '/src/Providers/'
                . $name
                . 'ServiceProvider.php',
            $providerClass
        );

        $this->files->put(
            $modulePath . '/src/Routes/web.php',
            $routeFile
        );

        $this->files->put(
            $modulePath . '/README.md',
            "# {$name} Module\n\nFeature module for {$name}.\n"
        );
    }

    protected function isValidModuleName($name)
    {
        return preg_match(
            '/^[A-Za-z][A-Za-z0-9_]*$/',
            $name
        );
    }
}