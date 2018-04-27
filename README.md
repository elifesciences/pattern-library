[![Build Status](https://alfred.elifesciences.org/buildStatus/icon?job=prod-pattern-library)](https://alfred.elifesciences.org/job/prod-pattern-library/)
# Note
This pattern library uses as its starting point  `https://github.com/pattern-lab/patternlab-php` with HEAD at sha e52ced8551000b7c6b97a01f419e2af8a07e2fd1

# Quickstart

This sets up PatternLab to generate the html from mustache templates, and Gulp to handle transformation
of scss to css, and other various build-related tasks. Note that artefacts generated from running Gulp are
inputs for the generation of PatternLab files, so Gulp needs to run before PatternLab. When developing,
it’s recommended to run watch tasks for both, which will take care of this.

## 1. Dependencies
You'll need:

 - PHP (for Patternlab)
 - nodejs (for gulp)
 - ruby (to handle the `compass` gem that underpins `gulp-compass` (see https://www.npmjs.com/package/gulp-compass).

Then install compass: `gem install compass`

## 2. Automatic setup
From the root directory run
```
$ ./bin/dev
```
This will install and run the commands needed to get started, starting a web server on port 8889. If you need a custom port pass this as the first argument:
```
$ ./bin/dev 1234
```
This will run on localhost:1234 

You should be good to go, open your browser and you will see the pattern lab.

# Manual setup

## 1. Set up PatternLab

- Clone pattern library: `git clone git@github.com:elifesciences/pattern-library.git`
- Create the public folder: `cd pattern-library && mkdir public`
- Copy dependencies: `cp -r ./core/styleguide ./public/`

## 2. Set up and run Gulp

- if you have not used gulp before, then install the gulp cli globally with `npm install --global gulp-cli`
- install required npm packages with `npm install`
- run `gulp` to build the css & js files.
- then run `gulp watch` to watch for changes to files or do both in one fell swoop with `gulp && gulp watch` (the watch task on its own will not compile your assets until a file is changed).
- run `gulp local:test:unit --mocha-grep=something` to pass the `--grep` option to mocha and run a subset of tests.
- if generating files intended for website production, invoke with the production flag, like this: `gulp --environment production`. The minifies css & js files.

## 3. Generate PatternLab

To run a **one-off** generation of the patterns, it's `php ./core/builder.php -g`

Alternatively to set up a **watch task** for pattern generation, run `php ./core/builder.php -w` 

## 4. Verify the setup

The static files defining the patterns should now be available in the `public` directory.

Verify the generated static site by serving the `public` folder locally. One quick and dirty way to do this is to run the built in PHP server in the public folder:

  1. Open a new terminal
  2. `cd` into the `public` directory
  3. run the webserver `php -S localhost:8889`
  4. in a browser go to `http://localhost:8889` and verify you can see the generated patterns.

# Using patterns

For patterns that are being exposed as resources (ie the Mustache template can be used in an application), there is a YAML file located alongside the template. This contains details of any CSS files that it requires, and a JSON Schema that documents what input is expected.

You can run `bin/validate`, which checks all data files for a pattern against the schema.

There is also a list of js file dependencies for each pattern, but individual js files have not yet been implemented and so these lists are currently all empty.

# Running tests

## Selenium

```
node_modules/webdriverio/bin/wdio wdio-local.conf.js --spec ./test-selenium/hello.spec.js
```

will run a single test file. This set up relies on your locally installed Firefox.

```
gulp test:selenium:local
```

will instead run all the Selenium tests.

```
gulp test:selenium
```

is used inside the pattern-library VM and should not be used elsewhere.

# Docker setup

```
docker-compose build
```

(re)builds all images:

- `elifesciences/pattern-library_assets-builder` is a Node-based image for Gulp usage
- `elifesciences/pattern-library_assets` is a lightweight image containing `assets/`
- `elifesciences/pattern-library_ui-builder` is a PHP-based image for generation of the UI
- `elifesciences/pattern-library` is a nginx-based image serving the UI
- `elifesciences/pattern-library_ci` is used to run tests
- an anonymous `selenium` image extension.

```
docker-compose up
```

runs containers so that the static website is accessible through a browser at http://localhost:8889

```
docker-compose run --rm ci ./project_tests.sh
```

runs all tests.

To create an exploratory session with the browser used by the Selenium test suite:

```
docker-compose up -d
curl -v localhost:4/wd/hub/session -d '{"desiredCapabilities":{"browserName":"firefox"}}'
```

Connect to this browser by using a VNC client (such as `vinagre`) on `localhost:5900`, with password `secret`. You can visit the pattern-library static website at `http://ui`.

For a local build, run:

```
ENVIRONMENT=development docker-compose build assets
```

To watch for changes, run:

```
bin/watch
```

Changes to `assets/js` (and similar) will be propagated to the `gulp watch` process. Changes to `source/_patterns` (and similar) will be propagated to the `php core/builder.php --watch` process.

This script does not allow to run tests on the result of the watch (yet).

Exit from this script with `Ctrl+C`.

TODO: add docker exec example to run arbitrary gulp commands
TODO: mount source/assets/ as a folder from the host rather than as a volume
TODO: mount test/build/ as a volume
TODO: remove docker-compose build from bin/watch for better restart performance
TODO: tests:watch should be bin/tests-watch, having / source folder as a volume
TODO: for tests:watch, forward 3000, 3001, 8080 to gulp container (or perhaps a different container)

# Notes

All assets paths in Mustache templates must be wrapped in `{{#assetRewrite}}`, which allows implementations to rewrite the path for cache-busting purposes. The path must also be prepended by `{{assetsPath}}`. 
