<?php

namespace adamCameron\fullStackExercise\tests\functional\public;

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;

/** @testdox Webserver config tests */
class WebServerTest extends TestCase
{
    /**
     * @testdox It serves gdayWorld.html with expected content
     * @coversNothing
     */
    public function testGdayWorldHtmlReturnsExpectedContent()
    {
        $expectedContent = "G'day world!";


        $client = new Client([
            'base_uri' => 'http://fullstackexercise.backend/'
        ]);

        $response = $client->get('gdayWorld.html');

        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());

        $html = $response->getBody();
        $document = new \DOMDocument();
        $document->loadHTML($html);

        $xpathDocument = new \DOMXPath($document);

        $hasTitle = $xpathDocument->query('/html/head/title[text() = "' . $expectedContent . '"]');
        $this->assertCount(1, $hasTitle);

        $hasHeading = $xpathDocument->query('/html/body/h1[text() = "' . $expectedContent . '"]');
        $this->assertCount(1, $hasHeading);

        $hasContent = $xpathDocument->query('/html/body/p[text() = "' . $expectedContent . '"]');
        $this->assertCount(1, $hasContent);
    }
}
