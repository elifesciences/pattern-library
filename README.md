[![Build Status](https://alfred.elifesciences.org/buildStatus/icon?job=prod-pattern-library)](https://alfred.elifesciences.org/job/prod-pattern-library/)
# Note
This pattern library uses as its starting point `https://github.com/pattern-lab/patternlab-php` with HEAD at sha e52ced8551000b7c6b97a01f419e2af8a07e2fd1

# Quickstart

This sets up PatternLab to generate the html from mustache templates, and make to handle transformation
of scss to css, and other various build-related tasks. Note that artefacts generated from running make targets 
are inputs for the generation of PatternLab files, so these need to run before PatternLab. When developing,
it’s recommended to run watch tasks for both, which will take care of this.

## 1. Dependencies
You'll need:

* You have installed version 7.3.x of [PHP](https://www.php.net/).
* You have installed version 16.x of [Node.js](https://nodejs.org/en/).
* You have installed a recent version of [Docker](https://www.docker.com/).

## 2. Automatic setup
From the root directory run
```
$ make
```
or to automatically rebuild assets:
```
$ make watch
```
This will build the assets into the public folder and share it with a docker image containing a web server on port 8889 by default (can be adjusted by setting the env variable PORT).
You should be good to go, open your browser and navigate to [localhost:8889](http://localhost:8889) and you will see the pattern lab.

# Manual setup

## 1. Set up PatternLab

- Clone pattern library: `git clone git@github.com:elifesciences/pattern-library.git`
- Create the public folder: `cd pattern-library && mkdir public`
- Copy dependencies: `cp -r ./core/styleguide ./public/`

## 2. Build assets

- Install required npm packages with `make node_modules`
- Run `make public` to build the css, js, font, and image files.
- When generating files intended for website production, invoke with the production environment variable, like this: `ENVIRONMENT=production make public`. The minifies css & js files.

# Running tests

```
make test
```

will run the unit tests.

# Notes

All assets paths in Mustache templates must be wrapped in `{{#assetRewrite}}`, which allows implementations to rewrite the path for cache-busting purposes. The path must also be prepended by `{{assetsPath}}`. 

# License
All code in this repo is MIT licensed, apart from the web fonts, which are are licensed separately under the SIL Open Font License. See the LICENSE.MD file in `/assets/fonts/` for details.
