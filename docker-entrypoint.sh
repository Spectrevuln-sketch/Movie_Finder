#!/bin/bash
set -euo pipefail

# Default port if PORT is not provided by Railway
PORT="${PORT:-80}"

# 1) Ensure exactly one MPM: prefer mpm_prefork for mod_php
# Use a2dismod safely (ignore errors) and a2enmod to enable prefork
# This is idempotent and safe to run at container start.
a2dismod mpm_event mpm_worker || true
rm -f /etc/apache2/mods-enabled/mpm_*.load /etc/apache2/mods-enabled/mpm_*.conf || true
a2enmod mpm_prefork rewrite || true

# 2) Update Apache listening port and VirtualHost if necessary
if [ -f /etc/apache2/ports.conf ]; then
  sed -ri "s/Listen [0-9]+/Listen ${PORT}/g" /etc/apache2/ports.conf || true
fi

if [ -f /etc/apache2/sites-available/000-default.conf ]; then
  sed -ri "s/:?[0-9]*\/?%?/:${PORT}/g" /etc/apache2/sites-available/000-default.conf || true
  # Also ensure DocumentRoot directory exists (avoid Apache failing to start)
  mkdir -p /var/www/html/public || true
fi

# 3) Optional: run Laravel migrations if artisan exists and MIGRATE env var is true
# Set MIGRATE=false to skip migrations.
MIGRATE="${MIGRATE:-true}"
if [ "${MIGRATE}" = "true" ] && [ -f /var/www/html/artisan ]; then
  echo "Running artisan migrate --force"
  php /var/www/html/artisan migrate --force || {
    echo "Artisan migrate failed — continuing to start Apache (check logs)"
  }
fi

# 4) Fix runtime permissions (best-effort)
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/public || true

# 5) Start Apache in foreground (apache2-foreground is provided by official php images)
exec apache2-foreground