<?php

namespace adamCameron\fullStackExercise\Exception;

use \DomainException;

class WorkshopRegistrationValidationException extends DomainException
{
    public function __construct($errors)
    {
        $this->errors = $errors;
    }

    public function getErrors()
    {
        return $this->errors;
    }
}
