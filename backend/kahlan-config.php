<?php
use Kahlan\Filter\Filters;
use Kahlan\Reporter\Coverage\Exporter\Coveralls;

$commandLine = $this->commandLine();
$commandLine->option('no-header', 'default', 1);