<?php

namespace adamCameron\fullStackExercise\tests\integration\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Dotenv\Dotenv;

/** @testdox End to end tests of WorkshopController */
class WorkshopControllerTest extends WebTestCase
{
    private KernelBrowser $client;

    public static function setUpBeforeClass(): void
    {
        $dotenv = new Dotenv();
        $dotenv->load(dirname(__DIR__, 3) . "/.env.test");
    }

    protected function setUp(): void
    {
        $this->client = static::createClient(['debug' => false]);
    }

    /**
     * @testdox it returns the expected workshops from the database
     * @covers \adamCameron\fullStackExercise\Controller\WorkshopsController
     * @covers \adamCameron\fullStackExercise\Factory\WorkshopCollectionFactory
     * @covers \adamCameron\fullStackExercise\Model\WorkshopCollection
     * @covers \adamCameron\fullStackExercise\Repository\WorkshopsRepository
     * @covers \adamCameron\fullStackExercise\Model\Workshop
     */
    public function testDoGet()
    {
        $this->client->request('GET', '/workshops/');
        $response = $this->client->getResponse();
        $workshops = json_decode($response->getContent(), false);

        /** @var Connection */
        $connection = static::$container->get('database_connection');
        $expectedRecords = $connection->query("SELECT id, name FROM workshops ORDER BY id ASC")->fetchAll();

        $this->assertCount(count($expectedRecords), $workshops);
        array_walk($expectedRecords, function ($record, $i) use ($workshops) {
            $this->assertEquals($record['id'], $workshops[$i]->id);
            $this->assertSame($record['name'], $workshops[$i]->name);
        });
    }
}
