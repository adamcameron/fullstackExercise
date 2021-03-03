<?php
use Kahlan\Filter\Filters;
use Kahlan\Reporter\Coverage;
use Kahlan\Reporter\Coverage\Driver\Xdebug;

$commandLine = $this->commandLine();
$commandLine->option('no-header', 'default', 1);

Filters::apply($this, 'coverage', function($next) {
    if (!extension_loaded('xdebug')) {
        return;
    }
    $reporters = $this->reporters();
    $coverage = new Coverage([
        'verbosity' => $this->commandLine()->get('coverage'),
        'driver'    => new Xdebug(),
        'path'      => $this->commandLine()->get('src'),
        'exclude'   => [
            'src/Kernel.php',
            'src/Controller/GreetingsController.php'
        ],
        'colors'    => !$this->commandLine()->get('no-colors')
    ]);
    $reporters->add('coverage', $coverage);
});

