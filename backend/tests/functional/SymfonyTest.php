<?php

namespace adamCameron\fullStackExercise\tests\functional;

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;

/** @testdox Tests of baseline Symfony install */
class SymfonyTest extends TestCase
{
    /**
     * @testdox it displays the Symfony welcome screen
     * @coversNothing
     */
    public function testWelcomeScreen()
    {

        $client = new Client([
            'base_uri' => 'http://fullstackexercise.backend'
        ]);

        $response = $client->get(
            "/",
            ['http_errors' => false]
        );
        // unexpectedly perhaps: the welcome page returns a 404. This is "by design"
        $this->assertEquals(Response::HTTP_NOT_FOUND, $response->getStatusCode());

        $html = $response->getBody();
        $document = $this->loadHtmlWithoutHtml5ErrorReporting($html);

        $xpathDocument = new \DOMXPath($document);

        $hasTitle = $xpathDocument->query('/html/head/title[text() = "Welcome to Symfony!"]');
        $this->assertCount(1, $hasTitle);
    }

    private function loadHtmlWithoutHtml5ErrorReporting($html) : \DOMDocument
    {
        $document = new \DOMDocument();
        libxml_use_internal_errors(true);
        $document->loadHTML($html);
        libxml_clear_errors();

        return $document;
    }


    /**
     * @testdox it returns a personalised greeting from the /greetings end point
     * @coversNothing
     */
    public function testGreetingsEndPointReturnsPersonalisedGreeting()
    {
        $testName = 'Zachary';
        $expectedGreeting = (object) [
            'name' => $testName,
            'greeting' => "G'day $testName"
        ];

        $client = new Client([
            'base_uri' => 'http://fullstackexercise.backend/'
        ]);

        $response = $client->get(
            "greetings/$testName",
            ['http_errors' => false]
        );
        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());

        $contentTypes = $response->getHeader('Content-Type');
        $this->assertCount(1, $contentTypes);
        $this->assertSame('application/json', $contentTypes[0]);

        $responseBody = $response->getBody();
        $responseObject = json_decode($responseBody);
        $this->assertEquals($expectedGreeting, $responseObject);
    }
}
