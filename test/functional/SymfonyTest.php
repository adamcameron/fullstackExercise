<?php

namespace adamCameron\fullStackExercise\test\functional;

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;

class SymfonyTest extends TestCase
{
    /** @coversNothing */
    public function testGreetingsEndPointReturnsPersonalisedGreeting()
    {
        $testName = 'Zachary';
        $expectedGreeting = (object) [
            'name' => $testName,
            'greeting' => "G'day $testName"
        ];

        $client = new Client([
            'base_uri' => 'http://webserver.backend/'
        ]);

        $response = $client->get("greetings/$testName/");
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());

        $contentTypes = $response->getHeader('Content-Type');
        $this->assertCount(1, $contentTypes);
        $this->assertSame('application/json', $contentTypes[0]);

        $responseBody = $response->getBody();
        $responseObject = json_decode($responseBody);
        $this->assertEquals($expectedGreeting, $responseObject);
    }
}
