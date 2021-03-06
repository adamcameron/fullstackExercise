<?php

namespace adamCameron\fullStackExercise\Controller;

use adamCameron\fullStackExercise\Model\WorkshopCollection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class WorkshopsController extends AbstractController
{

    private WorkshopCollection $workshops;

    public function __construct(WorkshopCollection $workshops)
    {
        $this->workshops = $workshops;
    }

    public function doGet() : JsonResponse
    {
        $this->workshops->loadAll();

        return new JsonResponse($this->workshops);
    }
}
