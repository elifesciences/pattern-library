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

## 1. Set up PatternLab

- Clone pattern library: `git clone git@github.com:elifesciences/pattern-library.git`
- Create the public folder: `cd pattern-library && mkdir public`
- Copy dependencies: `cp -r ./core/styleguide ./public/`

## 2. Set up and run Gulp

- if you have not used gulp before, then install the gulp cli globally with `npm install --global gulp-cli`
- install required npm packages with `npm install`
- run `gulp` to build the css & js files.
- then run `gulp watch` to watch for changes to files or do both in one fell swoop with `gulp && gulp watch` (the watch task on its own will not compile your assets until a file is changed).
- if generating files intended for website production, invoke with the production flag, like this: `gulp --environment production`. The only difference at the moment is to minify css files, it may be used for more later.

## 3. Generate PatternLab

- Run `php ./core/builder.php -g`, and check no errors in the output.

## 4. Verify the setup

The static files defining the patterns should now be available in the `public` directory.

Verify the generated static site by serving the `public` folder locally. One quick and dirty way to do this is to run the built in PHP server in the public folder:

  1. Open a new terminal
  2. `cd` into the `public` directory
  3. run the webserver `php -S localhost:8889`
  4. in a browser go to `http://localhost:8889` and verify you can see the generated patterns.
