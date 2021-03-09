<?php

namespace adamCameron\fullStackExercise\spec\unit;

use adamCameron\fullStackExercise\MyClass;

describe('Tests of MyClass::needsTesting', function () {


    beforeEach(function () {
        $this->myClass = new MyClass();
    });

    it('should return true', function () {
        expect($this->myClass->needsTesting())->toBe(true);
    });
});