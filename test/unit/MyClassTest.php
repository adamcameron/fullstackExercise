<?php

namespace adamCameron\fullStackExercise\test\unit;

use adamCameron\fullStackExercise\MyClass;
use PHPUnit\Framework\TestCase;

/** @coversDefaultClass adamCameron\fullStackExercise\MyClass */
class MyClassTest extends TestCase
{
    private $myClass;

    protected function setUp(): void
    {
        $this->myClass = new MyClass();
    }

    /** @covers ::needsTesting */
    public function testNeedsTesting()
    {

        $needsTesting = $this->myClass->needsTesting();
        $this->assertTrue($needsTesting);
    }
}
