<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitb1e3d41f9a88048cd593833be6fe80b3
{
    public static $prefixLengthsPsr4 = array (
        'Z' => 
        array (
            'Zend\\Escaper\\' => 13,
        ),
        'P' => 
        array (
            'PhpOffice\\PhpWord\\' => 18,
            'PhpOffice\\Common\\' => 17,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Zend\\Escaper\\' => 
        array (
            0 => __DIR__ . '/..' . '/zendframework/zend-escaper/src',
        ),
        'PhpOffice\\PhpWord\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpoffice/phpword/src/PhpWord',
        ),
        'PhpOffice\\Common\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpoffice/common/src/Common',
        ),
    );

    public static $classMap = array (
        'PclZip' => __DIR__ . '/..' . '/pclzip/pclzip/pclzip.lib.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitb1e3d41f9a88048cd593833be6fe80b3::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitb1e3d41f9a88048cd593833be6fe80b3::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitb1e3d41f9a88048cd593833be6fe80b3::$classMap;

        }, null, ClassLoader::class);
    }
}
