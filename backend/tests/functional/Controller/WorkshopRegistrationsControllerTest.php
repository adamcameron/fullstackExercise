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
    private const UNTESTED_INT_VALUE = -1;
    private const UNTESTED_PASSWORD_VALUE = 'aA1!1234';

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
     * @covers \adamCameron\fullStackExercise\Factory\ValidatorFactory
     * @covers \adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException
     * @covers \adamCameron\fullStackExercise\Service\WorkshopRegistrationValidationService
     */
    public function testDoPostWithValidValuesReturns201(): void
    {
        $validBody = $this->getValidObjectForTestRequest();
        $this->client->request('POST', '/workshop-registrations/', [], [], [], json_encode($validBody));
        $response = $this->client->getResponse();

        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());
    }


    /**
     * @testdox it will not accept $_dataName for the body
     * @covers ::doPost
     * @covers \adamCameron\fullStackExercise\Factory\ValidatorFactory
     * @covers \adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException
     * @covers \adamCameron\fullStackExercise\Service\WorkshopRegistrationValidationService
     * @dataProvider provideUnexpectedBodyTestCases
     */
    public function testDoPostUnexpectedBodyErrorsOut($body): void
    {
        $this->client->request('POST', '/workshop-registrations/', [], [], [], $body);
        $response = $this->client->getResponse();

        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());

        $content = json_decode($response->getContent());
        $this->assertObjectHasAttribute('errors', $content);
        $this->assertEquals(
            (object) [
                'errors' => [
                    (object) ['field' => '[fullName]', 'message' => 'This field is missing.'],
                    (object) ['field' => '[phoneNumber]', 'message' => 'This field is missing.'],
                    (object) ['field' => '[workshopsToAttend]', 'message' => 'This field is missing.'],
                    (object) ['field' => '[emailAddress]', 'message' => 'This field is missing.'],
                    (object) ['field' => '[password]', 'message' => 'This field is missing.']
                ]
            ],
            $content
        );
    }

    public function provideUnexpectedBodyTestCases()
    {
        return [
            'nothing' => ['body' => json_encode(null)],
            'empty object' => ['body' => json_encode((object)[])],
            'not JSON' => ['body' => 'NOT_JSON'],
        ];
    }

    /**
     * @testdox It must receive a JSON object with a $property property, otherwise will return a 400-BAD-REQUEST status
     * @dataProvider provideSchemaPropertyCheckTestCases
     * @covers ::doPost
     * @covers ::__construct
     * @covers \adamCameron\fullStackExercise\Factory\ValidatorFactory
     * @covers \adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException
     * @covers \adamCameron\fullStackExercise\Service\WorkshopRegistrationValidationService
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
     * @covers ::__construct
     * @covers \adamCameron\fullStackExercise\Factory\ValidatorFactory
     * @covers \adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException
     * @covers \adamCameron\fullStackExercise\Service\WorkshopRegistrationValidationService
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

    /**
     * @testdox It should not accept a $property with length greater than $length characters
     * @covers ::doPost
     * @covers ::__construct
     * @covers \adamCameron\fullStackExercise\Factory\ValidatorFactory
     * @covers \adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException
     * @covers \adamCameron\fullStackExercise\Service\WorkshopRegistrationValidationService
     * @dataProvider provideStringLengthCheckTestCases
     */
    public function testStringLengthValidation($property, $length)
    {
        $testBody = $this->getValidObjectForTestRequest();
        $testBody->$property = str_repeat('X', $length);

        $this->client->request('POST', '/workshop-registrations/', [], [], [], json_encode($testBody));
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());

        $testBody = $this->getValidObjectForTestRequest();
        $testBody->$property = str_repeat('X', $length + 1);

        $this->client->request('POST', '/workshop-registrations/', [], [], [], json_encode($testBody));
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
    }

    public function provideStringLengthCheckTestCases()
    {
        return [
            ['property' => 'fullName', 'length' => 100],
            ['property' => 'phoneNumber', 'length' => 50],
            ['property' => 'emailAddress', 'length' => 320]
        ];
    }

    /**
     * @testdox It should not accept an emailAddress with length less than 3 characters
     * @covers ::doPost
     * @covers ::__construct
     * @covers \adamCameron\fullStackExercise\Factory\ValidatorFactory
     * @covers \adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException
     * @covers \adamCameron\fullStackExercise\Service\WorkshopRegistrationValidationService
     */
    public function testEmailMinLengthValidation()
    {
        $testBody = $this->getValidObjectForTestRequest();
        $testBody->emailAddress = 'a@b';

        $this->client->request('POST', '/workshop-registrations/', [], [], [], json_encode($testBody));
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());

        $testBody = $this->getValidObjectForTestRequest();
        $testBody->emailAddress = 'a@';

        $this->client->request('POST', '/workshop-registrations/', [], [], [], json_encode($testBody));
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
    }

    /**
     * @testdox It $_dataName for password
     * @covers ::doPost
     * @covers ::__construct
     * @covers \adamCameron\fullStackExercise\Factory\ValidatorFactory
     * @covers \adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException
     * @covers \adamCameron\fullStackExercise\Service\WorkshopRegistrationValidationService
     * @dataProvider providePasswordTestCases
     */
    public function testPasswordValidation($testValue, $expectedErrors)
    {
        $testBody = $this->getValidObjectForTestRequest();
        $testBody->password = $testValue;

        $this->client->request('POST', '/workshop-registrations/', [], [], [], json_encode($testBody));
        $response = $this->client->getResponse();

        if (!count($expectedErrors)) {
            $this->assertEquals(Response::HTTP_CREATED, $response->getStatusCode());
            return;
        }
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
        $content = json_decode($response->getContent());

        $this->assertEquals($expectedErrors, $content->errors);
    }

    public function providePasswordTestCases()
    {
        $expectedErrors = [(object) ['field' => '[password]', 'message' => 'Failed complexity validation']];
        return [
            'cannot have fewer than 8 characters' => [
                'password' => 'Aa1!567',
                'expectedErrors' => $expectedErrors
            ],
            'can have exactly 8 characters' => [
                'password' => 'Aa1!5678',
                'expectedErrors' => []
            ],
            'can have more than 8 characters' => [
                'password' => 'Aa1!56789',
                'expectedErrors' => []
            ],
            'must have at least one lowercase letter' => [
                'password' => 'A_1!56789',
                'expectedErrors' => $expectedErrors
            ],
            'must have at least one uppercase letter' => [
                'password' => '_a1!56789',
                'expectedErrors' => $expectedErrors
            ],
            'must have at least one digit' => [
                'password' => 'Aa_!efghi',
                'expectedErrors' => $expectedErrors
            ],
            'must have at least one non-alphanumeric character' => [
                'password' => 'Aa1x56789',
                'expectedErrors' => $expectedErrors
            ],
            'must allow underscore as the one non-alphanumeric character' => [
                'password' => 'Aa1_56789',
                'expectedErrors' => []
            ]
        ];
    }

    /**
     * @testdox It cannot have embedded XSS risk for $property
     * @covers ::doPost
     * @covers ::__construct
     * @covers \adamCameron\fullStackExercise\Factory\ValidatorFactory
     * @covers \adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException
     * @covers \adamCameron\fullStackExercise\Service\ContainsXssRiskConstraint
     * @covers \adamCameron\fullStackExercise\Service\ContainsXssRiskConstraintValidator
     * @covers \adamCameron\fullStackExercise\Service\WorkshopRegistrationValidationService
     * @testWith    ["fullName"]
     *              ["phoneNumber"]
     *              ["emailAddress"]
     */
    public function testXssInTextFieldValidation($property)
    {
        $testBody = $this->getValidObjectForTestRequest();
        $testBody->$property = '<script>hijackTheirSession()</script>';

        $this->client->request('POST', '/workshop-registrations/', [], [], [], json_encode($testBody));
        $response = $this->client->getResponse();
        $this->assertEquals(Response::HTTP_BAD_REQUEST, $response->getStatusCode());

        $content = json_decode($response->getContent());

        $this->assertEquals(
            [
                (object) ['field' => "[$property]", 'message' => 'The string contains illegal content']
            ],
            $content->errors
        );
    }

    private function getValidObjectForTestRequest()
    {
        return (object) [
            'fullName' => static::UNTESTED_VALUE,
            'phoneNumber' => static::UNTESTED_VALUE,
            'workshopsToAttend' => [static::UNTESTED_INT_VALUE],
            'emailAddress' => static::UNTESTED_VALUE,
            'password' => static::UNTESTED_PASSWORD_VALUE
        ];
    }
}
