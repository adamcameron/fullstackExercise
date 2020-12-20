<?php

namespace adamCameron\fullStackExercise\test\integration;

use PHPUnit\Framework\TestCase;
use \PDO;

class DatabaseTest extends TestCase
{
    /** @coversNothing */
    public function testDatabaseVersion()
    {
        $connection = new PDO(
            'mysql:dbname=mysql;host=database.backend',
            'root',
            $_ENV['DATABASE_ROOT_PASSWORD']
        );

        $statement = $connection->query("show variables where variable_name = 'innodb_version'");
        $statement->execute();

        $version = $statement->fetchAll();

        $this->assertCount(1, $version);
        $this->assertSame('10.5.8', $version[0]['Value']);
    }
}
