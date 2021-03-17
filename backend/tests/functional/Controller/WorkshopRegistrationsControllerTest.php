<?php

namespace adamCameron\fullStackExercise\tests\functional\Controller;

use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\HttpFoundation\Response;

/** @testdox Functional tests of /workshop-registrations/ endpoint */
class WorkshopRegistrationsControllerTest extends WebTestCase
{
    private KernelBrowser $client;

    private const UNTESTED_VALUE = 'UNTESTED_VALUE';

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
     * @testdox it needs to return a 201-CREATED status for successful POST requests
     * @covers \adamCameron\fullStackExercise\Controller\WorkshopRegistrationsController
     */
    public function testDoPostReturns201(): void
    {
        $validBody = $this->getValidObjectForTestRequest();
        $this->client->request(
            'POST',
            '/workshop-registrations/',
            [],
            [],
            [],
            json_encode($validBody)
        );
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());
    }

    /**
     * @testdox It must receive a JSON object with a $property property, otherwise will return a 400-BAD-REQUEST status
     * @dataProvider provideSchemaPropertyCheckTestCases
     * @covers \adamCameron\fullStackExercise\Controller\WorkshopRegistrationsController
     */
    public function testRequiredPropertiesArePresentInBody($property)
    {
        $testBody = $this->getValidObjectForTestRequest();
        unset($testBody->$property);
        $this->client->request(
            'POST',
            '/workshop-registrations/',
            [],
            [],
            [],
            json_encode($testBody)
        );
        $response = $this->client->getResponse();

        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
    }

    public function provideSchemaPropertyCheckTestCases()
    {
        return [
            ['property' => 'fullName'],
            ['property' => 'phoneNumber'],
            ['property' => 'workshopsToAttend'],
            ['property' => 'emailAddress'],
            ['property' => 'password']
        ];
    }

    private function getValidObjectForTestRequest()
    {
        return (object) [
            'fullName' => static::UNTESTED_VALUE,
            'phoneNumber' => static::UNTESTED_VALUE,
            'workshopsToAttend' => static::UNTESTED_VALUE,
            'emailAddress' => static::UNTESTED_VALUE,
            'password' => static::UNTESTED_VALUE
        ];
    }
}
