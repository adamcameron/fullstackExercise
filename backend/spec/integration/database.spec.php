<?php

namespace adamCameron\fullStackExercise\spec\integration;

use \PDO;

describe('Tests database availability', function () {


    beforeEach(function () {
        $this->connection = new PDO(
            'mysql:dbname=mysql;host=database.backend',
            'root',
            $_ENV['DATABASE_ROOT_PASSWORD']
        );
    });

    it('should return the expected database version', function () {
        $statement = $this->connection->query("show variables where variable_name = 'innodb_version'");
        $statement->execute();

        $version = $statement->fetchAll();

        expect($version)->toHaveLength(1);
        expect($version[0]['Value'])->toBe('10.5.8');
    });
});