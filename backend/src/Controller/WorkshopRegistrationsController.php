<?php

namespace adamCameron\fullStackExercise\Controller;

use adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException;
use adamCameron\fullStackExercise\Service\WorkshopRegistrationValidationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class WorkshopRegistrationsController extends AbstractController
{

    private WorkshopRegistrationValidationService $validator;

    public function __construct(WorkshopRegistrationValidationService $validator)
    {
        $this->validator = $validator;
    }

    public function doPost(Request $request) : JsonResponse
    {
        try {
            $this->validator->validate($request);
        } catch (WorkshopRegistrationValidationException $e) {
            return new JsonResponse(['errors' => $e->getErrors()], Response::HTTP_BAD_REQUEST);
        }
        return new JsonResponse(null, Response::HTTP_CREATED);
    }
}
