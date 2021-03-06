<?php

namespace adamCameron\fullStackExercise\Model;

use adamCameron\fullStackExercise\Repository\WorkshopsRepository;

class WorkshopCollection implements \JsonSerializable
{
    private WorkshopsRepository $repository;

    /** @var Workshop[] */
    private $workshops;

    public function setRepository(WorkshopsRepository $repository) : void
    {
        $this->repository = $repository;
    }

    public function loadAll()
    {
        $this->workshops = $this->repository->selectAll();
    }

    public function jsonSerialize()
    {
        return $this->workshops;
    }
}
