<?php

namespace adamCameron\fullStackExercise\tests\functional\Controller;

use adamCameron\fullStackExercise\DAO\WorkshopsDAO;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\HttpFoundation\Response;

/** @testdox Functional tests of /workshops/ endpoint */
class WorkshopsControllerTest extends WebTestCase
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
     * @testdox it needs to return a 200-OK status for successful GET requests
     * @covers \adamCameron\fullStackExercise\Controller\WorkshopsController
     */
    public function testDoGetReturns200()
    {
        $this->client->request('GET', '/workshops/');

        $this->assertEquals(Response::HTTP_OK, $this->client->getResponse()->getStatusCode());
    }

    /**
     * @testdox it returns a collection of workshop objects, as JSON
     * @covers \adamCameron\fullStackExercise\Controller\WorkshopsController
     * @covers \adamCameron\fullStackExercise\Factory\WorkshopCollectionFactory
     * @covers \adamCameron\fullStackExercise\Repository\WorkshopsRepository
     * @covers \adamCameron\fullStackExercise\Model\WorkshopCollection
     * @covers \adamCameron\fullStackExercise\Model\Workshop
     */
    public function testDoGetReturnsJson()
    {
        $workshopDbValues = [
            ['id' => 1, 'name' => 'Workshop 1'],
            ['id' => 2, 'name' => 'Workshop 2']
        ];

        $this->mockWorkshopDaoInServiceContainer($workshopDbValues);

        $this->client->request('GET', '/workshops/');

        $resultJson = $this->client->getResponse()->getContent();
        $result = json_decode($resultJson, true);

        $this->assertCount(count($workshopDbValues), $result);
        array_walk($result, function ($workshopValues, $i) use ($workshopDbValues) {
            $this->assertEquals($workshopDbValues[$i], $workshopValues);
        });
    }

    private function mockWorkshopDaoInServiceContainer($returnValue = []): void
    {
        $mockedDao = $this->createMock(WorkshopsDAO::class);
        $mockedDao->method('selectAll')->willReturn($returnValue);

        $container = $this->client->getContainer();
        $workshopRepository = $container->get('test.WorkshopsRepository');

        $reflection = new \ReflectionClass($workshopRepository);
        $property = $reflection->getProperty('dao');
        $property->setAccessible(true);
        $property->setValue($workshopRepository, $mockedDao);
    }
}
