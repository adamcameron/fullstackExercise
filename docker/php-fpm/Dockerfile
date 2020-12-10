FROM php:8.0-fpm
RUN apt-get update
RUN apt-get install git --yes
RUN apt-get install zip unzip --yes
RUN apt-get install net-tools iputils-ping --yes
RUN docker-php-ext-install pdo_mysql
RUN pecl install xdebug-3.0.1 && docker-php-ext-enable xdebug
COPY --from=composer /usr/bin/composer /usr/bin/composer
#COPY ./phpunit-code-coverage-xdebug.ini /usr/local/etc/php/conf.d/phpunit-code-coverage-xdebug.ini
ENV XDEBUG_MODE=coverage
WORKDIR  /usr/share/fullstackExercise/
CMD composer install ; php-fpm
EXPOSE 9000
