<?php

namespace adamCameron\fullStackExercise\Repository;

use adamCameron\fullStackExercise\DAO\WorkshopsDAO;
use adamCameron\fullStackExercise\Model\Workshop;

class WorkshopsRepository
{
    private WorkshopsDAO $dao;

    public function __construct(WorkshopsDAO $dao)
    {
        $this->dao = $dao;
    }

    /** @return Workshop[] */
    public function selectAll() : array
    {
        $records = $this->dao->selectAll();
        return array_map(
            function ($record) {
                return new Workshop($record['id'], $record['name']);
            },
            $records
        );
    }
}
