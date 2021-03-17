<?php

namespace adamCameron\fullStackExercise\Service;

use Symfony\Component\Validator\Constraint;

class CollectionCannotBeNullConstraint extends Constraint
{
    public $message = 'The collection cannot be null';
}
