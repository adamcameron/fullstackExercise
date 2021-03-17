<?php

namespace adamCameron\fullStackExercise\Service;

use Symfony\Component\Validator\Constraint;

class ContainsXssRiskConstraint extends Constraint
{
    public $message = 'The string contains illegal content';
}
