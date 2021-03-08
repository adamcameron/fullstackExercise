<?php

namespace adamCameron\fullStackExercise\spec\unit;

use adamCameron\fullStackExercise\MyClass;
use Kahlan\Plugin\Double;
use kahlanIssues\SomeClass;

describe('Tests of MyClass::needsTesting', function () {


    beforeEach(function () {
        $this->myClass = new MyClass();
    });

    it('should return true', function () {
        expect($this->myClass->needsTesting())->toBe(true);
    });

    it('trying to replicate class error', function () {

        $double = Double::instance(['extends' => MyClass::class, 'methods'=>['needsTesting']]);
        allow($double)->toReceive('needsTesting')->andReturn('MOCKED RESULT');

        expect($double->needsTesting())->toBe('MOCKED RESULT');
    });
});