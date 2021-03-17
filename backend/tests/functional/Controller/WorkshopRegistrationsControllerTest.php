<?php

namespace adamCameron\fullStackExercise\tests\functional\Controller;

use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\HttpFoundation\Response;

/**
 * @testdox Functional tests of /workshop-registrations/ endpoint
 * @coversDefaultClass \adamCameron\fullStackExercise\Controller\WorkshopRegistrationsController
 */
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
     * @covers ::doPost
     */
    public function testDoPostReturns201(): void
    {
        $validBody = $this->getValidObjectForTestRequest();
        $this->client->request('POST', '/workshop-registrations/', [], [], [], json_encode($validBody));
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());
    }

    /**
     * @testdox It must receive a JSON object with a $property property, otherwise will return a 400-BAD-REQUEST status
     * @dataProvider provideSchemaPropertyCheckTestCases
     * @covers ::doPost
     */
    public function testRequiredPropertiesArePresentInBody($property)
    {
        $testBody = $this->getValidObjectForTestRequest();
        unset($testBody->$property);
        $this->client->request('POST', '/workshop-registrations/', [], [], [], json_encode($testBody));
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

    /**
     * @testdox It returns details of the validation failures in the body of the 400 response
     * @covers ::doPost
     */
    public function testValidationFailsAreReturned()
    {
        $testBody = $this->getValidObjectForTestRequest();
        unset($testBody->fullName);
        unset($testBody->password);

        $this->client->request('POST', '/workshop-registrations/', [], [], [], json_encode($testBody));
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
        $content = json_decode($response->getContent());

        $this->assertObjectHasAttribute('errors', $content);
        $this->assertEquals(
            (object) [
                'errors' => [
                    (object) ['field' => '[fullName]', 'message' => 'This field is missing.'],
                    (object) ['field' => '[password]', 'message' => 'This field is missing.']
                ]
            ],
            $content
        );
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
