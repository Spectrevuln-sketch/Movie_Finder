<?php

namespace App\Core\Modules;

use RuntimeException;

class ModuleManifest
{
    /**
     * Cached manifest filename.
     *
     * @var string
     */
    protected $manifestPath;

    /**
     * Module root directory.
     *
     * @var string
     */
    protected $modulesPath;

    /**
     * ModuleManifest constructor.
     */
    public function __construct()
    {
        $this->modulesPath = base_path('modules');

        $this->manifestPath = storage_path(
            'framework/cache/modules.php'
        );
    }

    /**
     * Get all discovered module providers.
     *
     * @return array
     */
    public function providers()
    {
        if (app()->environment('production') && $this->isCached()) {
            return $this->loadCachedManifest();
        }

        return $this->discoverProviders();
    }

    /**
     * Discover providers from modules directory.
     *
     * @return array
     */
    protected function discoverProviders()
    {
        if (!is_dir($this->modulesPath)) {
            return [];
        }

        $providers = [];

        $moduleDirectories = glob(
            $this->modulesPath . DIRECTORY_SEPARATOR . '*',
            GLOB_ONLYDIR
        );

        foreach ($moduleDirectories as $moduleDirectory) {
            $moduleName = basename($moduleDirectory);

            if (!$this->isValidModuleName($moduleName)) {
                continue;
            }

            $providerPath = $moduleDirectory
                . DIRECTORY_SEPARATOR
                . 'src'
                . DIRECTORY_SEPARATOR
                . 'Providers'
                . DIRECTORY_SEPARATOR
                . $moduleName . 'ServiceProvider.php';

            if (!is_file($providerPath)) {
                continue;
            }

            $providerClass = 'Modules\\'
                . $moduleName
                . '\\Providers\\'
                . $moduleName
                . 'ServiceProvider';

            if (!class_exists($providerClass)) {
                throw new RuntimeException(
                    "Module provider class [{$providerClass}] "
                    . "was not found for module [{$moduleName}]."
                );
            }

            $providers[] = $providerClass;
        }

        sort($providers);

        return array_values(array_unique($providers));
    }

    /**
     * Determine whether manifest is cached.
     *
     * @return bool
     */
    protected function isCached()
    {
        return is_file($this->manifestPath);
    }

    /**
     * Load cached manifest.
     *
     * @return array
     */
    protected function loadCachedManifest()
    {
        $manifest = require $this->manifestPath;

        return isset($manifest['providers'])
            ? $manifest['providers']
            : [];
    }

    /**
     * Cache discovered modules.
     *
     * @return void
     */
    public function cache()
    {
        $cacheDirectory = dirname($this->manifestPath);

        if (!is_dir($cacheDirectory)) {
            mkdir($cacheDirectory, 0755, true);
        }

        $manifest = [
            'providers' => $this->discoverProviders(),
        ];

        $content = '<?php return ' . var_export($manifest, true) . ';';

        file_put_contents(
            $this->manifestPath,
            $content,
            LOCK_EX
        );
    }

    /**
     * Remove cached module manifest.
     *
     * @return void
     */
    public function clear()
    {
        if ($this->isCached()) {
            unlink($this->manifestPath);
        }
    }

    /**
     * Validate module directory name.
     *
     * @param string $moduleName
     *
     * @return bool
     */
    protected function isValidModuleName($moduleName)
    {
        return (bool) preg_match(
            '/^[A-Za-z][A-Za-z0-9_]*$/',
            $moduleName
        );
    }
}
