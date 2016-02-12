# Note
This pattern library uses as its starting point  `https://github.com/pattern-lab/patternlab-php` with HEAD at sha e52ced8551000b7c6b97a01f419e2af8a07e2fd1

# Quickstart
- Clone pattern library: `git clone git@github.com:elifesciences/pattern-library.git`
- Create the public folder: `cd pattern-library && mkdir public`
- Copy dependencies: `cp -r ./core/styleguide ./public/`
- Build pattern library`php ./core/builder.php -g`, check no errors in the output.
- Verify the generated static site by serving the `public` folder locally. One quick and dirty way to do this is to run the built in PHP server in the public folder:

  1. Open a new terminal
  2. `cd` into the `public` directory
  3. run the webserver`php -S localhost:8889`
  4. in a browser go to `http://localhost:8889` and verify you can see the generated patterns.
