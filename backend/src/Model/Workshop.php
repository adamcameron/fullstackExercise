<?php

namespace adamCameron\fullStackExercise\Model;

class Workshop implements \JsonSerializable
{
    private int $id;
    private string $name;

    public function __construct(int $id, string $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public function jsonSerialize()
    {
        return (object) [
            'id' => $this->id,
            'name' => $this->name
        ];
    }
}
