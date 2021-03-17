<?php

namespace adamCameron\fullStackExercise\Service;

use adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException;
use adamCameron\fullStackExercise\Model\WorkshopRegistration;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class WorkshopRegistrationValidationService
{

    private ValidatorInterface $validator;

    public function __construct(ValidatorInterface $validator)
    {
        $this->validator = $validator;
    }

    public function validate(Request $request): void
    {
        $content = $request->getContent();
        $values = json_decode($content, true);
        $constraints = $this->getConstraints();

        $violations = $this->validator->validate($values, $constraints);

        if (count($violations) > 0) {
            throw new WorkshopRegistrationValidationException();
        }
    }

    private function getConstraints()
    {
        return new Assert\Collection([
            'fullName' => new Assert\NotBlank(),
            'phoneNumber' => new Assert\NotBlank(),
            'workshopsToAttend' => new Assert\NotBlank(),
            'emailAddress' => new Assert\NotBlank(),
            'password' => new Assert\NotBlank()
        ]);
    }
}
