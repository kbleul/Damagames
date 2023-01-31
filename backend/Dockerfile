FROM php:8-fpm-alpine

RUN mkdir -p /var/www/html

WORKDIR /var/www/html
COPY . .
COPY --from=composer:2.4 /usr/bin/composer /usr/bin/composer
RUN docker-php-ext-install pdo pdo_mysql exif

EXPOSE 8000

RUN chmod +x /var/www/html/entrypoint.sh
RUN composer install --ignore-platform-req=php

# CMD ["/usr/local/bin/php", "artisan", "serve", "--host=0.0.0.0", "--port=8082"]
ENTRYPOINT ["/bin/sh", "/var/www/html/entrypoint.sh" ]




