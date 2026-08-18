FROM php:7.4-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libpq-dev \
    zip \
    unzip \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_pgsql \
    && a2dismod mpm_event mpm_worker \
    && a2enmod mpm_prefork rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Setup Apache DocumentRoot
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Setup permissions for build
RUN mkdir -p public/build && chown -R www-data:www-data /var/www/html

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN npm install

# Build assets as root to avoid permission errors
RUN npm run production

# Set permissions for runtime
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public

# Startup script to handle PORT and migration
COPY <<EOF /usr/local/bin/docker-entrypoint.sh
#!/bin/bash
a2dismod mpm_event mpm_worker >/dev/null 2>&1
a2enmod mpm_prefork >/dev/null 2>&1
sed -i "s/Listen 80/Listen \${PORT}/g" /etc/apache2/ports.conf
sed -i "s/:80/:\${PORT}/g" /etc/apache2/sites-available/000-default.conf
php artisan migrate --force
exec apache2-foreground
EOF
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE ${PORT}
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
