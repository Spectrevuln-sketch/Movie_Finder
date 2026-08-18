FROM php:7.4-apache

ARG NODE_VERSION=16

# ---------------------------------------------------------
# System dependencies + PHP extensions
# ---------------------------------------------------------
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    zip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libpq-dev \
    && curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-configure gd \
    --with-freetype \
    --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
    gd \
    pdo \
    pdo_pgsql \
    && a2dismod mpm_event mpm_worker || true \
    && a2enmod mpm_prefork rewrite \
    && rm -rf /var/lib/apt/lists/*

# ---------------------------------------------------------
# Composer
# ---------------------------------------------------------
COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

# ---------------------------------------------------------
# Application
# ---------------------------------------------------------
WORKDIR /var/www/html

COPY . .


RUN sed -i \
    's#DocumentRoot /var/www/html#DocumentRoot /var/www/html/public#' \
    /etc/apache2/sites-available/000-default.conf

RUN printf '%s\n' 'ServerName localhost' \
    > /etc/apache2/conf-available/servername.conf \
    && a2enconf servername


RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader


RUN npm ci

# ---------------------------------------------------------
# Production frontend build
# ---------------------------------------------------------
RUN npm run production

# ---------------------------------------------------------
# Verify compiled assets
# ---------------------------------------------------------
RUN test -f public/mix-manifest.json \
    && test -f public/js/app.js \
    && test -f public/css/app.css

# ---------------------------------------------------------
# Runtime permissions
# ---------------------------------------------------------
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    bootstrap/cache \
    && chown -R www-data:www-data \
    storage \
    bootstrap/cache \
    public \
    && chmod -R ug+rwX \
    storage \
    bootstrap/cache

# ---------------------------------------------------------
# Railway entrypoint
# ---------------------------------------------------------
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
