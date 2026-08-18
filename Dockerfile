FROM php:7.4-apache

RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libpq-dev \
    zip \
    unzip \
    git \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_pgsql \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN cat > /etc/apache2/sites-available/000-default.conf <<'EOF'
<VirtualHost *:80>
    DocumentRoot /var/www/html/public

    <Directory /var/www/html/public>
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

RUN npm ci

# Clean frontend build artifacts
RUN rm -rf public/css public/js public/mix-manifest.json

# Recreate writable directories
RUN mkdir -p public/css public/js
RUN chmod -R 777 public

# Build frontend
RUN npm run production

# Verify generated assets
RUN echo "=== CSS ===" && \
    ls -lah public/css/app.css && \
    echo "=== JS ===" && \
    ls -lah public/js/app.js && \
    echo "=== MANIFEST ===" && \
    ls -lah public/mix-manifest.json && \
    cat public/mix-manifest.json

# Runtime permissions
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache \
    /var/www/html/public

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]