<?php
namespace adamCameron\fullStackExercise\spec\functional;

use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\Response;

describe('Tests that Symfony app is running', function () {

    it('should return the correct 404 page on the / route', function () {
        $client = new Client([
            'base_uri' => 'http://fullstackexercise.backend'
        ]);

        $response = $client->get(
            "/",
            ['http_errors' => false]
        );
        // unexpectedly perhaps: the welcome page returns a 404. This is "by design"
        expect($response->getStatusCode())->toBe(Response::HTTP_NOT_FOUND);

        $html = $response->getBody();
        $document = $this->loadHtmlWithoutHtml5ErrorReporting($html);

        $xpathDocument = new \DOMXPath($document);

        $hasTitle = $xpathDocument->query('/html/head/title[text() = "Welcome to Symfony!"]');

        expect($hasTitle)->toHaveLength(1);

    });

    it('should return a personalised greeting from the greetings route', function () {
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

        expect($response->getStatusCode())->toBe(Response::HTTP_OK);

        $contentTypes = $response->getHeader('Content-Type');
        expect($contentTypes)->toHaveLength(1);
        expect($contentTypes[0])->toBe('application/json');

        $responseBody = $response->getBody();
        $responseObject = json_decode($responseBody);
        expect($responseObject)->toEqual($expectedGreeting);
    });

    $this->loadHtmlWithoutHtml5ErrorReporting = function ($html) {
        $document = new \DOMDocument();
        libxml_use_internal_errors(TRUE);
        $document->loadHTML($html);
        libxml_clear_errors();

        return $document;
    };
});
