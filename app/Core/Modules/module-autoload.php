<?php

$modulesPath = dirname(__DIR__, 3) . '/modules';

if (!is_dir($modulesPath)) {
    return;
}

foreach (glob($modulesPath . '/*', GLOB_ONLYDIR) as $modulePath) {
    $moduleName = basename($modulePath);

    if (!preg_match('/^[A-Za-z][A-Za-z0-9_]*$/', $moduleName)) {
        continue;
    }

    $srcPath = $modulePath . '/src';

    if (!is_dir($srcPath)) {
        continue;
    }

    spl_autoload_register(
        function ($class) use ($moduleName, $srcPath) {
            $prefix = 'Modules\\' . $moduleName . '\\';

            if (strpos($class, $prefix) !== 0) {
                return;
            }

            $relativeClass = substr($class, strlen($prefix));

            $file = $srcPath . '/'
                . str_replace('\\', '/', $relativeClass)
                . '.php';

            if (is_file($file)) {
                require_once $file;
            }
        }
    );
}
