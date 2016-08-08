#!/usr/bin/env php
<?php

use JsonSchema\Validator;
use Rs\Json\Pointer;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Yaml\Yaml;

require_once __DIR__ . '/../vendor/autoload.php';
$patternDir = __DIR__ . '/../source/_patterns';

const DONE = '🎾';
const NOT_DONE = '🌑';

const IGNORED_FILES = [
    'content-header-background-style-markup.mustache',
    'investor-logos.mustache',
    'social-links.mustache',
    'contact-form.mustache',
    'image-grid.mustache'
];

$atoms = (new Finder())
    ->files()
    ->in($patternDir . '/00-atoms')
    ->in($patternDir . '/01-molecules')
    ->in($patternDir . '/02-organisms')
    ->name('*.mustache')
    ->filter(function(\Symfony\Component\Finder\SplFileInfo $f) {
        $filename = $f->getFilename();
        return (
            strpos($filename, '_pl-only') === FALSE &&
            strpos($filename, '_0') === FALSE &&
            strpos($filename, '--') === FALSE &&
            in_array($filename, IGNORED_FILES) === FALSE
        );
    })
;
$i=0;
$count = 0;

$atom_list = [];
$molecule_list = [];
$organism_list = [];

foreach ($atoms as $a) {
    $i++;
    $b = explode('.', $a->getFilename());
    $c = array_pop($b);
    $d = implode('.', $b);

    $file = (new Finder())->files()->in($patternDir)->name($d . '.yaml');
    $hasFiles = false;
    foreach ($file as $f) {
        $count++;
        $hasFiles = true;
    }
    $output_line = '';

    if ($hasFiles) {
        $output_line .= DONE . '  ';
    }
    else {
        $output_line .= NOT_DONE . '  ';
    }
    $output_line .= $d . "\n";

    $path = $a->getPath();
    if (strpos($path, '00-atoms')) {
        $atom_list[] = $output_line;
    }
    else if (strpos($path, '01-molecules')) {
        $molecule_list[] = $output_line;
    }
    else if (strpos($path, '02-organisms')) {
        $organism_list[] = $output_line;
    }
}

function renderLines(array $lines) {
    foreach ($lines as $line) {
        print $line;
    }
}

print "\n\n Atoms \n===========================\n";
renderLines($atom_list);

print "\n\n Molecules \n===========================\n";
renderLines($molecule_list);

print "\n\n Organisms \n===========================\n";
renderLines($organism_list);


$percent = round($count / $i * 100, 1);

print "\n\n Completed $count out of $i ($percent%)\n";
