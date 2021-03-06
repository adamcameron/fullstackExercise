<?php

namespace adamCameron\fullStackExercise\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/** @codeCoverageIgnore  */
class GreetingsController extends AbstractController
{
    public function doGet(string $name) : Response
    {
        $greetingsResponse = [
            'name' => $name,
            'greeting' => "G'day $name"
        ];
        return new JsonResponse($greetingsResponse);
    }
}
