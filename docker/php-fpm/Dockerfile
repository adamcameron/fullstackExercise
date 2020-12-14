FROM php:8.0-fpm
RUN apt-get update --yes && apt-get install git --yes
ENV XDEBUG_MODE=coverage
RUN docker-php-ext-install pdo_mysql
RUN pecl install xdebug-3.0.1 && docker-php-ext-enable xdebug
COPY --from=composer /usr/bin/composer /usr/bin/composer
WORKDIR  /usr/share/fullstackExercise/
CMD composer install ; php-fpm
EXPOSE 9000
