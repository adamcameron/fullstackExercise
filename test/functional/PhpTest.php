<?php

namespace adamCameron\fullStackExercise\test\functional\_public; // "public" is reserved

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;

class PhpTest extends TestCase
{
    /** @coversNothing */
    public function testGdayWorldPhpReturnsExpectedContent()
    {
        $client = new Client([
            'base_uri' => 'http://webserver.backend/'
        ]);

        $response = $client->get('gdayWorld.php');

        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());

        $content = $response->getBody()->getContents();

        $this->assertSame("G'day world", $content);
    }
}
