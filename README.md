# Note
This pattern library uses as its starting point  `https://github.com/pattern-lab/patternlab-php` with HEAD at sha e52ced8551000b7c6b97a01f419e2af8a07e2fd1

# Quickstart

This sets up PatternLab to generate the html from mustache templates, and Grunt to handle transformation
of scss to css, & other various build-related tasks. Note that artefacts generated from running Grunt are 
inputs for the generation of PatternLab files, so Grunt needs to run before PatternLab. When developing,
it's recommended to run watch tasks for both, which will take care of this.

## 1. Set up PatternLab

- Clone pattern library: `git clone git@github.com:elifesciences/pattern-library.git`
- Create the public folder: `cd pattern-library && mkdir public`
- Copy dependencies: `cp -r ./core/styleguide ./public/`

## 2. Set up and run Grunt

- install required Grunt packages with `npm install`
- run `grunt --dev` to build the css & js files.

## 3. Generate PatternLab

- Run `php ./core/builder.php -g`, and check no errors in the output.

## 4. Verify the setup

The static files defining the patterns should now be available in the `public` directory.

Verify the generated static site by serving the `public` folder locally. One quick and dirty way to do this is to run the built in PHP server in the public folder:

  1. Open a new terminal
  2. `cd` into the `public` directory
  3. run the webserver `php -S localhost:8889`
  4. in a browser go to `http://localhost:8889` and verify you can see the generated patterns.
