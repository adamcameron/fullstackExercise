<?php

namespace adamCameron\fullStackExercise\Factory;

use adamCameron\fullStackExercise\Model\WorkshopCollection;
use adamCameron\fullStackExercise\Repository\WorkshopsRepository;

class WorkshopCollectionFactory
{
    private WorkshopsRepository $repository;

    public function __construct(WorkshopsRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getWorkshopCollection() : WorkshopCollection
    {
        $collection = new WorkshopCollection();
        $collection->setRepository($this->repository);

        return $collection;
    }
}
