# Pattern Library

The goals of the `pattern-library` repository is to provide a set of assets.

It's based around [`Pattern Lab`](https://github.com/pattern-lab/patternlab-php), a project that has not been updated in over 6 years and no longer appears to be actively developed. It's hard to be specific about which version we currently use.

It contains Templates, JavaScript, CSS, Images, Fonts and other static resources. It provides an environment to develop components that can be reused on various pages across the site.

## Inputs

The bulk of input files are contained in...

```
./assets/*
./source/*
```
Note: that `source/assets` is where the compiled output from `Gulp` is placed and should be ignored.

## Compilation

Files are process using `Glup`.

## Outputs

The `source` directory is at present where all the project's output resides. Under here, you'll find the templates, json and yaml files that are output as-is, alongside an `assets` directory which contains the JavaScript, CSS, Fonts and Images/resources output by the tooling - `gulp` at the time of writing.

This output is then compiled into 2 containers and published at [DockerHub](https://hub.docker.com) as [`pattern-library`](https://hub.docker.com/r/elifesciences/pattern-library) and [`pattern-library_assets`](https://hub.docker.com/r/elifesciences/pattern-library_assets).

In addition, the `source/assets` directory is packaged into an npm package and published to [npm](https://www.npmjs.com/package/@elifesciences/pattern-library)

A tarball is also created and published to an [s3 bucket](https://s3.amazonaws.com/ci-pattern-library/) as part of the CI for preview purposes, but for Pull Requests ONLY.

## Downstream

The `pattern-library` container is then used by [`patterns-php`](https://github.com/elifesciences/patterns-php) where it exacts various files from within the container, applies some transformations to the templates and yaml and commits those alongside the updated assets into itself which it then publishes to [`packagist`](https://packagist.org/packages/elife/patterns).


## Tasks

- [ ] Can we use a prebuilt docker container for `patternlab` and simply mount our resources into it rather than having it be part of the codebase?
- [ ] Glup is no longer supported and needs to be replaced.
- [ ] Dependencies in the package.json file are in the `devDependencies` section.
- [ ] 

