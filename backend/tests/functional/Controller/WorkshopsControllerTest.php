<?php

namespace adamCameron\fullStackExercise\tests\functional\Controller;

use adamCameron\fullStackExercise\Model\Workshop;
use adamCameron\fullStackExercise\Repository\WorkshopsRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\HttpFoundation\Response;

/** @testdox Tests of WorkshopController */
class WorkshopsControllerTest extends WebTestCase
{
    private $client;

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
     * @testdox it needs to return a 200-OK status for GET requests
     * @coversNothing
     */
    public function testDoGetReturns200()
    {
        $this->mockRepositoryInServiceContainer();

        $this->client->request('GET', '/workshops/');

        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
    }

    /**
     * @testdox it returns a collection of workshop objects, as JSON
     * @covers \adamCameron\fullStackExercise\Controller\WorkshopsController
     * @covers \adamCameron\fullStackExercise\Factory\WorkshopCollectionFactory
     * @covers \adamCameron\fullStackExercise\Model\WorkshopCollection
     * @covers \adamCameron\fullStackExercise\Model\Workshop
     */
    public function testDoGetReturnsJson()
    {
        $workshops = [
            new Workshop(1, 'Workshop 1'),
            new Workshop(2, 'Workshop 2')
        ];
        $this->mockRepositoryInServiceContainer($workshops);

        $this->client->request('GET', '/workshops/');

        $resultJson = $this->client->getResponse()->getContent();
        $result = json_decode($resultJson, false);

        $this->assertCount(count($workshops), $result);
        array_walk($result, function ($workshopValues, $i) use ($workshops) {
            $workshop = new Workshop($workshopValues->id, $workshopValues->name);
            $this->assertEquals($workshops[$i], $workshop);
        });
    }

    private function mockRepositoryInServiceContainer($returnValue = []): void
    {
        $container = $this->client->getContainer();
        $workshopCollection = $container->get('test.WorkshopCollection');

        $mockedRepo = $this->createMock(WorkshopsRepository::class);
        $mockedRepo->method('selectAll')->willReturn($returnValue);

        $reflection = new \ReflectionClass($workshopCollection);
        $property = $reflection->getProperty('repository');
        $property->setAccessible(true);
        $property->setValue($workshopCollection, $mockedRepo);
    }
}
