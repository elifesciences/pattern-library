[![Build Status](https://alfred.elifesciences.org/buildStatus/icon?job=prod-pattern-library)](https://alfred.elifesciences.org/job/prod-pattern-library/)
# Note
This pattern library uses as its starting point  `https://github.com/pattern-lab/patternlab-php` with HEAD at sha e52ced8551000b7c6b97a01f419e2af8a07e2fd1

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
This will build the assets into the public folder and share it with a docker image containing a web server on port 8080.
You should be good to go, open your browser and navigate to [localhost:8080](http://localhost:8080) and you will see the pattern lab.

# Manual setup

## 1. Set up PatternLab

- Clone pattern library: `git clone git@github.com:elifesciences/pattern-library.git`
- Create the public folder: `cd pattern-library && mkdir public`
- Copy dependencies: `cp -r ./core/styleguide ./public/`

## 2. Build assets

- Install required npm packages with `make node_modules`
- Run `make public` to build the css, js, font, and image files.
- Run `make watch` to watch for changes to the assets and rebuild them when detected.
- Run `make test` to run the tests.
- When generating files intended for website production, invoke with the production environment variable, like this: `ENVIRONMENT=production make public`. The minifies css & js files.

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

```
make test
```

will run the unit tests.

# Notes

All assets paths in Mustache templates must be wrapped in `{{#assetRewrite}}`, which allows implementations to rewrite the path for cache-busting purposes. The path must also be prepended by `{{assetsPath}}`. 

# License
All code in this repo is MIT licensed, apart from the web fonts, which are are licensed separately under the SIL Open Font License. See the LICENSE.MD file in `/assets/fonts/` for details.
