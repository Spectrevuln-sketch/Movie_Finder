import React from 'react';
import { render } from 'react-dom';
import { InertiaApp } from '@inertiajs/inertia-react';

const app = document.getElementById('app');

if (!app) {
    throw new Error('Inertia app root element was not found.');
}

const pages = require.context(
    '../../modules',
    true,
    /\.\/.*\/resources\/js\/pages\/.*\.(ts|tsx)$/
);

const resolveComponent = (name: string) => {
    const parts = name.split('/');
    const moduleName = parts.shift();
    const pagePath = parts.join('/');

    const candidates = [
        `./${moduleName}/resources/js/pages/${pagePath}.tsx`,
        `./${moduleName}/resources/js/pages/${pagePath}.ts`,
    ];

    const key = candidates.find((candidate) =>
        pages.keys().includes(candidate)
    );

    if (!key) {
        throw new Error(
            `Inertia page "${name}" not found.\n` +
            `Available pages:\n${pages.keys().join('\n')}`
        );
    }

    const page = pages(key);

    return page.default || page;
};

render(
    <InertiaApp
        initialPage={JSON.parse(app.dataset.page)}
        resolveComponent={resolveComponent}
    />,
    app
);