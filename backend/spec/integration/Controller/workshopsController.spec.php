<?php

namespace adamCameron\fullStackExercise\spec\unit\Factory;

use adamCameron\fullStackExercise\Controller\Thing;
use adamCameron\fullStackExercise\Kernel;
use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Dotenv\Dotenv;

describe("End to end tests of WorkshopController", function () {

    beforeAll(function () {
        $dotenv = new Dotenv();
        $dotenv->load(dirname(__DIR__, 3) . "/.env.test");

        $this->createWebTestCase = function () {

            return new class() extends WebTestCase {

                protected static function getKernelClass()
                {
                    return Kernel::class;
                }

                public static function getClient($options) {
                    return static::createClient($options);
                }

                public static function getContainer() {
                    return static::$container;
                }
            };
        };
    });

    it('returns the expected workshops from the database', function () {
        $webTestCase = $this->createWebTestCase();
        $client = $webTestCase::getClient(['debug' => false]);

        $client->request('GET', '/workshops/');
        $response = $client->getResponse();
        $workshops = json_decode($response->getContent(), false);

        /** @var Connection */
        $connection = $client->getContainer()->get('database_connection');
        $expectedRecords = $connection->query("SELECT id, name FROM workshops ORDER BY id ASC")->fetchAll();

        expect($workshops)->toHaveLength(count($expectedRecords));

        array_walk($expectedRecords, function ($record, $i) use ($workshops) {
            expect($workshops[$i]->id)->toEqual($record['id']);
            expect($workshops[$i]->name)->toBe($record['name']);
        });
    });
});
