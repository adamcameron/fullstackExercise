<?php
namespace adamCameron\fullStackExercise\spec\functional;

use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\Response;

describe('Tests that gdayWorld.html returns expected content', function () {

    beforeAll(function () {
        $this->expectedContent = "G'day world!";

        $client = new Client([
            'base_uri' => 'http://fullstackexercise.backend/'
        ]);

        $this->response = $client->get('gdayWorld.html');

        $html = $this->response->getBody();
        $document = new \DOMDocument();
        $document->loadHTML($html);
        $this->xpathDocument = new \DOMXPath($document);
    });

    it("should have expected status code", function () {
        expect($this->response->getStatusCode())->toBe(Response::HTTP_OK);
    });

    it("should have expected title", function () {
        $hasTitle = $this->xpathDocument->query('/html/head/title[text() = "' . $this->expectedContent . '"]');
        expect($hasTitle)->toHaveLength(1);
    });

    it("should have expected heading", function () {
        $hasHeading = $this->xpathDocument->query('/html/body/h1[text() = "' . $this->expectedContent . '"]');
        expect($hasHeading)->toHaveLength(1);
    });

    it("should have expected content", function () {
        $hasContent = $this->xpathDocument->query('/html/body/p[text() = "' . $this->expectedContent . '"]');
        expect($hasContent)->toHaveLength(1);
    });
});
