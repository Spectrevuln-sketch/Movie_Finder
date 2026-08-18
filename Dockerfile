FROM php:7.4-apache

# ============================================================
# System dependencies
# ============================================================
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
    && rm -rf /var/lib/apt/lists/*

# ============================================================
# Apache MPM - FORCE PREFORK ONLY
# ============================================================
# Disable possible other MPMs, remove any mpm symlinks, then enable prefork
RUN set -eux; \
    a2dismod mpm_event mpm_worker || true; \
    rm -f /etc/apache2/mods-enabled/mpm_*.load /etc/apache2/mods-enabled/mpm_*.conf || true; \
    a2enmod mpm_prefork rewrite

# ============================================================
# Composer (use multi-stage composer binary copy)
# ============================================================
COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

# ============================================================
# Working directory
# ============================================================
WORKDIR /var/www/html

# Copy composer files first to leverage Docker cache
COPY composer.json composer.lock ./

# ============================================================
# Laravel dependencies (composer install)
# ============================================================
RUN composer install \
    --no-dev \
    --no-autoloader \
    --no-scripts \
    --no-interaction \
    --prefer-dist

# ============================================================
# Copy rest of application
# ============================================================
COPY . .

# ============================================================
# Finish composer autoload generation and run scripts
# ============================================================
RUN composer dump-autoload \
    --no-dev \
    --optimize \
    --no-interaction

# ============================================================
# Apache VirtualHost
# ============================================================
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

# ============================================================
# Frontend dependencies
# ============================================================
RUN npm ci --silent

# ============================================================
# Clean frontend build
# ============================================================
RUN rm -rf public/css public/js public/mix-manifest.json || true \
    && mkdir -p public/css public/js \
    && chmod -R 777 public

# ============================================================
# Build frontend
# ============================================================
RUN npm run production

# ============================================================
# Verify frontend assets (simple outputs during build)
# ============================================================
RUN echo "========================================" \
    && echo "FRONTEND BUILD" \
    && echo "========================================" \
    && ls -lah public/css/app.css || true \
    && ls -lah public/js/app.js || true \
    && ls -lah public/mix-manifest.json || true

# ============================================================
# Verify Apache MPM (should show ONLY mpm_prefork)
# ============================================================
RUN echo "========================================" \
    && echo "APACHE MPM" \
    && echo "========================================" \
    && apache2ctl -M | grep mpm || (apache2ctl -M && false)

# ============================================================
# Runtime permissions
# ============================================================
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache \
    /var/www/html/public

# ============================================================
# Entrypoint
# ============================================================
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ============================================================
# Railway
# ============================================================
EXPOSE 80
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]