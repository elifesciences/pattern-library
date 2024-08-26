[![Build Status](https://alfred.elifesciences.org/buildStatus/icon?job=prod-pattern-library)](https://alfred.elifesciences.org/job/prod-pattern-library/)
# Note
This pattern library uses as its starting point  `https://github.com/pattern-lab/patternlab-php` with HEAD at sha e52ced8551000b7c6b97a01f419e2af8a07e2fd1

# Quickstart

This sets up PatternLab to generate the html from mustache templates, and Gulp to handle transformation
of scss to css, and other various build-related tasks. Note that artefacts generated from running Gulp are
inputs for the generation of PatternLab files, so Gulp needs to run before PatternLab. When developing,
it’s recommended to run watch tasks for both, which will take care of this.

## Dependencies - Linux / macOS
You'll need:

* You have installed version 7.3.x of [PHP](https://www.php.net/).
* You have installed version 6.x of [Node.js](https://nodejs.org/en/).
* You have installed version 2.7.x of [Python](https://www.python.org/).
* You have installed a recent version of [OpenJDK](https://openjdk.java.net/).

Optionally, you might also require...

* You have installed a recent version of [Docker](https://www.docker.com/).
* You have installed a recent version of [Docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04).

## Dependencies - Windows
You'll need:

* You have installed any linux terminal (Ex: WSL2) that runs Ubuntu 20.04.
* You have installed version 7.3.x of [PHP](https://www.php.net/).
* You have installed version 6.x of [Node.js](https://nodejs.org/en/).
* You have installed version 2.7.x of [Python](https://www.python.org/).
* You have installed a recent version of [OpenJDK](https://openjdk.java.net/).

Optionally, you might also require...

* You have installed a recent version of [Docker](https://www.docker.com/).
* You have installed a recent version of [Docker-compose](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-compose-on-ubuntu-20-04).

<details>
<summary>Windows - tips and tricks</summary>
When using Windows to bypass the main errors, we recommend following the next:

1. Before you clone the repo, until you start running the commands from the [readme](/README.md), make sure that you configure git to use the correct line endings.

    * [Explanation](https://stackoverflow.com/a/71209401) / [More detailed](https://stackoverflow.com/q/10418975)
    * Easy fix : `git config --global core.autocrlf input`

2. Make sure you use Windows Linux Subsystem (WSL) or at least git bash.

    * [Guide to use WSL](https://adamtheautomator.com/windows-subsystem-for-linux/)
    * [Guide to use Git Bash](https://www.geeksforgeeks.org/working-on-git-bash/)

3. Recommended version for Node:

    * `v6.0.0`

</details>

##### Note : You may encounter some errors and need to install [gulp](https://gulpjs.com/docs/en/getting-started/quick-start) manually.

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
docker-compose build  # only necessary after switching branch or installing new dependencies
bin/watch
```

Changes to `assets/js` (and similar) will be propagated to the `gulp watch` process. Changes to `source/_patterns` (and similar) will be propagated to the `php core/builder.php --watch` process.

You can pass options to the underlying gulp:

```
bin/watch --sass-lint=false
```

To run additional gulp command in the same container where `gulp:watch` is running:

```
$ docker exec -it pattern-library-gulp-watch /bin/bash
elife@...$ node_modules/.bin/gulp test:unit
```

To run a particular gulp test:

```
elife@...$ node_modules/.bin/gulp test:unit --filter=hypothesisopener
```

The watch loop keeps a read-only host folder up-to-date with the latest assets:

```
$ ls .container_source_assets/
css  fonts  img  js
```

Exit from this script with `Ctrl+C`.

To watch a particular test in a browser:

```
$ bin/tests-watch test/hypothesisopener.html
```

Visit the URL that is printed out:

```
http://localhost:3000/test/hypothesisopener.html
```

The browser will refresh and rerun the test upon changes to it. Exit from this script with `Ctrl+C`.

# Automatic setup
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

# Manual setup (This may or may not work)

## 1. Set up PatternLab

- Clone pattern library: `git clone git@github.com:elifesciences/pattern-library.git`
- Create the public folder: `cd pattern-library && mkdir public`
- Copy dependencies: `cp -r ./core/styleguide ./public/`

## 2. Set up and run Gulp

- Install required npm packages with `npm install`
- Run `npx gulp` to build the css & js files.
- then run `npx gulp watch` to watch for changes to files or do both in one fell swoop with `npx gulp && npx gulp watch` (the watch task on its own will not compile your assets until a file is changed).
- run `npx gulp local:test:unit --mocha-grep=something` to pass the `--grep` option to mocha and run a subset of tests.
- if generating files intended for website production, invoke with the production flag, like this: `npx gulp --environment production`. The minifies css & js files.

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
npx wdio wdio-local.conf.js --spec ./test-selenium/hello.spec.js
```

will run a single test file. This set up relies on your locally installed Firefox.

```
npx gulp test:selenium:local
```

will instead run all the Selenium tests.

```
npx gulp test:selenium
```

is used inside the pattern-library VM and should not be used elsewhere.

# Notes

All assets paths in Mustache templates must be wrapped in `{{#assetRewrite}}`, which allows implementations to rewrite the path for cache-busting purposes. The path must also be prepended by `{{assetsPath}}`. 

# License
All code in this repo is MIT licensed, apart from the web fonts, which are are licensed separately under the SIL Open Font License. See the LICENSE.MD file in `/assets/fonts/` for details.
