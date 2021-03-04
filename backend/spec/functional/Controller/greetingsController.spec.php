<?php

namespace adamCameron\fullStackExercise\spec\functional\Controller;

use adamCameron\fullStackExercise\Kernel;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

describe('Tests of GreetingsController', function () {

    beforeAll(function () {
        $this->request = Request::createFromGlobals();
        $this->kernel  = new Kernel('test', false);
    });

    describe('Tests of doGet', function () {
        it('returns a JSON greeting object', function () {
            $testName = 'Zachary';

            $request = $this->request->create("/greetings/$testName", 'GET');
            $response = $this->kernel->handle($request);

            expect($response->getStatusCode())->toBe(Response::HTTP_OK);
        });
    });
});
