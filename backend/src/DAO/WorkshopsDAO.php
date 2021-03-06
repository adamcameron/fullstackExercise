<?php

namespace adamCameron\fullStackExercise\DAO;

use Doctrine\DBAL\Connection;

/** @codeCoverageIgnore */
class WorkshopsDAO
{
    private Connection $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function selectAll() : array
    {
        $sql = "
            SELECT
                id, name
            FROM
                workshops
            ORDER BY
                id ASC
        ";
        $statement = $this->connection->executeQuery($sql);

        return $statement->fetchAllAssociative();
    }
}
