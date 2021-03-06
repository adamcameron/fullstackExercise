<?php

namespace adamCameron\fullStackExercise\Service;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class ContainsXssRiskConstraintValidator extends ConstraintValidator
{
    public function validate($value, Constraint $constraint)
    {
        // @codeCoverageIgnoreStart
        // ignoring because this is Symfony boilerplate (can't put this in the comment above because PHPUnit "rocks")
        if (!$constraint instanceof ContainsXssRiskConstraint) {
            throw new UnexpectedTypeException($constraint, ContainsXssRiskConstraint::class);
        }

        if (empty($value)) {
            return;
        }

        if (!is_string($value)) {
            throw new UnexpectedValueException($value, 'string');
        }
        // @codeCoverageIgnoreEnd

        if (htmlspecialchars($value) !== $value) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ string }}', $value)
                ->addViolation();
        }
    }
}
