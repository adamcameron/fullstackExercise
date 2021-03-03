FROM php:8.0-fpm
RUN apt-get update
RUN apt-get install git --yes
RUN apt-get install net-tools iputils-ping --yes
RUN apt-get install zip unzip --yes
RUN apt-get install vim --yes
RUN apt-get install lcov --yes
RUN docker-php-ext-install pdo_mysql
RUN pecl install xdebug-3.0.1 && docker-php-ext-enable xdebug
COPY --from=composer /usr/bin/composer /usr/bin/composer
ENV XDEBUG_MODE=coverage
WORKDIR  /usr/share/fullstackExercise/
COPY ./bin/ ./bin/
COPY ./var/ ./var/
COPY ./composer.json .
COPY ./composer.lock .
CMD composer install ; php-fpm
EXPOSE 9000
