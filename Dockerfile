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
    && a2enmod rewrite

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
RUN chown -R node:node .

# Build assets as node user
USER node
RUN npm run production
USER root

# Set permissions for runtime
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public

# Startup script to handle PORT and migration
COPY <<EOF /usr/local/bin/docker-entrypoint.sh
#!/bin/bash
sed -i "s/80/\${PORT}/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf
php artisan migrate --force
exec apache2-foreground
EOF
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE ${PORT}
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
