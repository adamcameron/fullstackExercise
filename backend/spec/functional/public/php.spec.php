<?php
namespace adamCameron\fullStackExercise\spec\functional\public;

use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\Response;

describe('Tests that simple PHP request returns expected result', function () {

    it("should return G'day World from gdayWorld.php", function () {
        $client = new Client([
            'base_uri' => 'http://fullstackexercise.backend'
        ]);

        $response = $client->get('gdayWorld.php');
        expect($response->getStatusCode())->toBe(Response::HTTP_OK);

        $content = $response->getBody()->getContents();
        expect($content)->toBe("G'day world!");
    });
});
