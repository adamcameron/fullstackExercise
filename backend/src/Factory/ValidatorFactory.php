<?php

namespace adamCameron\fullStackExercise\Factory;

use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ValidatorFactory
{

    public function getValidator() : ValidatorInterface
    {
        return Validation::createValidatorBuilder()->getValidator();
    }
}
