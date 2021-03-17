<?php

namespace adamCameron\fullStackExercise\Service;

use adamCameron\fullStackExercise\Exception\WorkshopRegistrationValidationException;
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

    public function validate(Request $request)
    {
        $content = $request->getContent();
        $values = json_decode($content, true) ?? []; // Symfony won't validate null (apparently by "design")
        $constraints = $this->getConstraints();
        $violations = $this->validator->validate($values, $constraints);

        if (count($violations) > 0) {
            $errors = array_map(function ($violation) {
                return [
                    'field' => $violation->getPropertyPath(),
                    'message' => $violation->getMessage()
                ];
            }, $violations->getIterator()->getArrayCopy());
            throw new WorkshopRegistrationValidationException($errors);
        }
    }

    private function getConstraints()
    {
        return new Assert\Collection([
            'fields' => [
                'fullName' => [
                    new Assert\Length(['min' => 1, 'max' => 100]),
                    new ContainsXssRiskConstraint()
                ],
                'phoneNumber' => [
                    new Assert\Length(['min' => 1, 'max' => 50]),
                    new ContainsXssRiskConstraint()
                ],
                'workshopsToAttend' => [
                    new Assert\NotBlank(),
                    new Assert\All([
                        new Assert\Type('int')
                    ])
                ],
                'emailAddress' => [
                    new Assert\Length(['min' => 3, 'max' => 320]),
                    new ContainsXssRiskConstraint()
                ],
                'password' => [
                    new Assert\Regex([
                        'pattern' => '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?:.){8,}$/',
                        'message' => 'Failed complexity validation'
                    ])
                ]
            ],
            'allowMissingFields' => false,
            'allowExtraFields' => true
        ]);
    }
}
