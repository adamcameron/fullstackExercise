<?php

namespace adamCameron\fullStackExercise\tests\functional\public;

use GuzzleHttp\Client;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Response;

/** @testdox PHP config tests */
class PhpTest extends TestCase
{
    /**
     * @testdox gdayWorld.php outputs G'day world!
     * @coversNothing
     */
    public function testGdayWorldPhpReturnsExpectedContent()
    {
        $client = new Client([
            'base_uri' => 'http://fullstackexercise.backend/'
        ]);

        $response = $client->get('gdayWorld.php');

        $this->assertEquals(Response::HTTP_OK, $response->getStatusCode());

        $content = $response->getBody()->getContents();

        $this->assertSame("G'day world!", $content);
    }
}
