<?php
namespace adamCameron\fullStackExercise\spec\functional;

use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\Response;

describe('Tests that example.com can be curled', function () {

    beforeAll(function () {
        $client = new Client([
            'base_uri' => 'http://example.com/'
        ]);

        $this->response = $client->get('index.html');

        $html = $this->response->getBody();
        $document = new \DOMDocument();
        $document->loadHTML($html);
        $this->xpathDocument = new \DOMXPath($document);
    });

    it("should have expected status code", function () {
        expect($this->response->getStatusCode())->toBe(Response::HTTP_OK);
    });

    it("should have expected title", function () {
        $hasTitle = $this->xpathDocument->query('/html/head/title[text() = "Example Domain"]');
        expect($hasTitle)->toHaveLength(1);
    });

    it("should have expected heading", function () {
        $hasHeading = $this->xpathDocument->query('/html/body/div/h1[text() = "Example Domain"]');
        expect($hasHeading)->toHaveLength(1);
    });
});
