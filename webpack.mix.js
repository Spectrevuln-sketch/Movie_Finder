const mix = require('laravel-mix');
const path = require('path');

mix.react('resources/js/app.tsx', 'public/js');

mix.postCss('resources/css/app.css', 'public/css', [
    require('tailwindcss')('./tailwind.config.js'),
]);

mix.webpackConfig({
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            '@modules': path.resolve(__dirname, 'modules'),
        },
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
        ],
    },
});
