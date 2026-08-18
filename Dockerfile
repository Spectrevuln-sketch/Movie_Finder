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
RUN a2dismod mpm_event mpm_worker mpm_prefork && \
    a2enmod mpm_prefork && \
    a2enmod rewrite


# ============================================================
# Composer
# ============================================================
COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer


# ============================================================
# Working directory
# ============================================================
WORKDIR /var/www/html


# ============================================================
# Copy application
# ============================================================
COPY . .


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
# Laravel dependencies
# ============================================================
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction


# ============================================================
# Frontend dependencies
# ============================================================
RUN npm ci


# ============================================================
# Clean frontend build
# ============================================================
RUN rm -rf \
    public/css \
    public/js \
    public/mix-manifest.json

RUN mkdir -p \
    public/css \
    public/js

RUN chmod -R 777 public


# ============================================================
# Build frontend
# ============================================================
RUN npm run production


# ============================================================
# Verify frontend assets
# ============================================================
RUN echo "========================================" \
    && echo "FRONTEND BUILD" \
    && echo "========================================" \
    && ls -lah public/css/app.css \
    && ls -lah public/js/app.js \
    && ls -lah public/mix-manifest.json


# ============================================================
# Verify Apache MPM
# Must show ONLY mpm_prefork
# ============================================================
RUN echo "========================================" \
    && echo "APACHE MPM" \
    && echo "========================================" \
    && apache2ctl -M | grep mpm


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