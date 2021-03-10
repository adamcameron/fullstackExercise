<?php

namespace adamCameron\fullStackExercise\tests\unit\Controller;

use adamCameron\fullStackExercise\Controller\WorkshopsController;
use adamCameron\fullStackExercise\Model\WorkshopCollection;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;

/**
 * @testdox Unit tests of WorkshopsController
 * @coversDefaultClass \adamCameron\fullStackExercise\Controller\WorkshopsController
 */
class WorkshopControllerTest extends TestCase
{

    private WorkshopsController $controller;
    private WorkshopCollection $collection;

    protected function setUp(): void
    {
        $this->collection = $this->createMock(WorkshopCollection::class);
        $this->controller = new WorkshopsController($this->collection);
    }

    /**
     * @testdox It makes sure the CORS header returns with the origin's address
     * @covers ::doGet
     */
    public function testDoGetSetsCorsHeader()
    {
        $testOrigin = 'TEST_ORIGIN';
        $request = new Request();
        $request->headers->set('origin', $testOrigin);

        $response = $this->controller->doGet($request);

        $this->assertSame($testOrigin, $response->headers->get('Access-Control-Allow-Origin'));
    }
}
