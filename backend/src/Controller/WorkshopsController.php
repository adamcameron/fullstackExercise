<?php

namespace adamCameron\fullStackExercise\Controller;

use adamCameron\fullStackExercise\Model\WorkshopCollection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class WorkshopsController extends AbstractController
{

    private WorkshopCollection $workshops;

    public function __construct(WorkshopCollection $workshops)
    {
        $this->workshops = $workshops;
    }

    public function doGet(Request $request) : JsonResponse
    {
        $origin = $request->headers->get('origin');

        error_log($origin . PHP_EOL . PHP_EOL, 3, '/var/log/adam_debug.log');

        $this->workshops->loadAll();

        return new JsonResponse(
            $this->workshops,
            Response::HTTP_OK,
            [
                'Access-Control-Allow-Origin' => $origin
            ]);
    }
}
