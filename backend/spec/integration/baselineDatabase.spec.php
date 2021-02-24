<?php

namespace adamCameron\fullStackExercise\spec\integration;

use \PDO;

describe('Tests for registration database', function () {

    $this->getConnectionDetailsFromEnvironment = function () {
        return (object) [
            'database' => $_ENV['MYSQL_DATABASE'],
            'user' => $_ENV['MYSQL_USER'],
            'password' => $_ENV['MYSQL_PASSWORD']
        ];
    };

    beforeAll(function () {
        $connectionDetails = $this->getConnectionDetailsFromEnvironment();
        $this->connection = new PDO(
            "mysql:dbname=$connectionDetails->database;host=database.backend",
            $connectionDetails->user,
            $connectionDetails->password
        );
    });

    describe('Connectivity tests', function () {
        it('can connect to the database with environment-based credentials', function () {
            $statement =  $this->connection->query("SELECT 'OK' AS test FROM dual");
            $statement->execute();

            $testResult = $statement->fetch(PDO::FETCH_ASSOC);

            expect($testResult)->toContainKey('test');
            expect($testResult['test'])->toBe('OK');
        });
    });

    describe('Schema tests', function () {
        $schemata = [
            [
                'tableName' => 'workshops',
                'schema' => [
                    ['Field' => 'id', 'Type' => 'int(11)'],
                    ['Field' => 'name', 'Type' => 'varchar(500)']
                ]
            ],
            [
                'tableName' => 'registrations',
                'schema' => [
                    ['Field' => 'id', 'Type' => 'int(11)'],
                    ['Field' => 'fullName', 'Type' => 'varchar(100)'],
                    ['Field' => 'phoneNumber', 'Type' => 'varchar(50)'],
                    ['Field' => 'emailAddress', 'Type' => 'varchar(320)'],
                    ['Field' => 'password', 'Type' => 'varchar(255)'],
                    ['Field' => 'ipAddress', 'Type' => 'varchar(15)'],
                    ['Field' => 'uniqueCode', 'Type' => 'varchar(36)'],
                    ['Field' => 'created', 'Type' => 'timestamp']
                ]
            ],
            [
                'tableName' => 'registeredWorkshops',
                'schema' => [
                    ['Field' => 'id', 'Type' => 'int(11)'],
                    ['Field' => 'registrationId', 'Type' => 'int(11)'],
                    ['Field' => 'workshopId', 'Type' => 'int(11)']
                ]
            ]
        ];

        array_walk($schemata, function ($tableSchema) {
            $tableName = $tableSchema['tableName'];
            $expectedSchema = $tableSchema['schema'];

            it("has a $tableName table with the required schema", function () use ($tableName, $expectedSchema) {
                $statement = $this->connection->query("SHOW COLUMNS FROM $tableName");
                $statement->execute();

                $columns = $statement->fetchAll(PDO::FETCH_ASSOC);

                expect($columns)->toHaveLength(count($expectedSchema));
                foreach ($expectedSchema as $i => $column) {
                    expect($columns[$i]['Field'])->toBe($expectedSchema[$i]['Field']);
                    expect($columns[$i]['Type'])->toBe($expectedSchema[$i]['Type']);
                }
            });
        });
    });

    describe('Data tests', function () {
        it('has the required baseline workshop data', function () {
            $expectedWorkshops = [
                ['id' => '2', 'name' => 'TEST_WORKSHOP 1'],
                ['id' => '3', 'name' => 'TEST_WORKSHOP 2'],
                ['id' => '5', 'name' => 'TEST_WORKSHOP 3'],
                ['id' => '7', 'name' => 'TEST_WORKSHOP 4']
            ];

            $statement = $this->connection->query("SELECT id, name FROM workshops ORDER BY id");
            $statement->execute();
            $workshops = $statement->fetchAll(PDO::FETCH_ASSOC);

            expect($workshops)->toEqual($expectedWorkshops);
        });

        it('correctly auto-increments the ID on new insertions', function () {
            $expectedWorkshopName = 'TEST_WORKSHOP 5';

            $this->connection->beginTransaction();

            $statement = $this->connection->prepare(query: "INSERT INTO workshops (name) VALUES (:name)");
            $statement->execute(['name' => $expectedWorkshopName]);
            $id = $this->connection->lastInsertId();

            $statement = $this->connection->prepare("SELECT id, name FROM workshops WHERE id = :id");
            $statement->execute(['id' => $id]);
            $workshops = $statement->fetchAll(PDO::FETCH_ASSOC);

            expect($workshops)->toHaveLength(1);
            expect($workshops[0])->toContainKey('name');
            expect($workshops[0]['name'])->toBe($expectedWorkshopName);

            $this->connection->rollback();
        });
    });
});
