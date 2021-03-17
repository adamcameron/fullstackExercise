<?php

namespace adamCameron\fullStackExercise\Model;

class WorkshopRegistration
{
    public string $fullName;
    public string $phoneNumber;
    public array $workshopsToAttend;
    public string $emailAddress;
    public string $password;

    public function __construct(
        string $fullName,
        string $phoneNumber,
        array $workshopsToAttend,
        string $emailAddress,
        string $password
    ) {
        $this->fullName = $fullName;
        $this->phoneNumber = $phoneNumber;
        $this->workshopsToAttend = $workshopsToAttend;
        $this->emailAddress = $emailAddress;
        $this->password = $password;
    }
}
