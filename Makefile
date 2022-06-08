
PROJECT := $(notdir $(CURDIR))
NODE_VERSION ?= gallium
PHP_VERSION ?= 7.3-fpm
COMPOSER_VERSION ?= 1.6.4
PORT ?= 8889

# Source files that when changed should trigger a rebuild.
FONTS = $(shell find assets/fonts -type f)
SASS = $(shell find assets/sass -type f)
JAVASCRIPT = $(shell find assets/js -type f)
SOURCES = $(wildcard assets/js/**/* assets/sass/**/* source/**/*)

TESTS = $(wildcard test/*.spec.js)
TESTS_OUTPUT = $(patsubst test/%,test/build/%,$(TESTS))
TESTS_HTML = $(patsubst test/%.spec.js,test/%.html,$(TESTS))

SASS_ARGS =

ifeq ($(ENVIRONMENT),production)
  SASS_ARGS=--output-style compressed
endif

JS_ARGS=--debug ./assets/js/main.js | npx exorcist ./source/assets/js/main.js.map > ./source/assets/js/main.js && cp assets/js/elife-loader.js ./source/assets/js/elife-loader.js

ifeq ($(ENVIRONMENT),production)
  JS_ARGS=./assets/js/main.js | npx uglifyjs > ./source/assets/js/main.js && cp assets/js/elife-loader.js ./source/assets/js/elife-loader.js
endif

# Targets that don't result in output of the same name.
.PHONY: start watch stop clean distclean test test_notify fonts images

# When no target is specified, the default target to run.
.DEFAULT_GOAL := start

# Cleans build output and local dependencies
distclean: clean
	@rm -rf node_modules vendor

# Cleans build output
clean:
	@rm -rf public source/assets test/build

# Install Node.js dependencies if either, the node_modules directory is not present or package.json has changed.
node_modules: package.json
	@npm install
	@touch $@

# Create directories
source/assets source/assets/js source/assets/css test/build:
	@mkdir -p $@

# Copy the fonts
fonts: source/assets $(FONTS)
	@mkdir -p $(CURDIR)/source/assets/fonts
	@cp -r ./assets/fonts $(CURDIR)/source/assets

# Optimise image assets
images: node_modules
	@mkdir -p source/assets/img/errors source/assets/img/icons source/assets/img/patterns/molecules source/assets/img/patterns/organisms
	@npx imagemin-cli './assets/img/errors' -o ./source/assets/img/errors/ --plugin.mozjpeg.progressive=true
	@npx imagemin-cli './assets/img/icons' -o ./source/assets/img/icons --plugin.mozjpeg.progressive=true
	@npx imagemin-cli './assets/img/patterns/molecules' -o ./source/assets/img/patterns/molecules/ --plugin.mozjpeg.progressive=true
	@npx imagemin-cli './assets/img/patterns/organisms' -o ./source/assets/img/patterns/organisms/ --plugin.mozjpeg.progressive=true

# Convert the sass to css
source/assets/css/all.css: node_modules source/assets/css $(SASS)
	npx node-sass assets/sass/build.scss ./$@ --importer node_modules/node-sass-magic-importer/dist/cli.js --source-map true --source-map-root file://${PWD} --source-map-embed true --source-comments true ${SASS_ARGS}

# Compile the Javascript
source/assets/js/main.js: node_modules source/assets/js $(JAVASCRIPT)
	@npx browserify ${JS_ARGS}

# Builds the patterns, and pattern-lab static site.
public: fonts images source/assets/css/all.css source/assets/js/main.js
	@mkdir -p $(CURDIR)/public
	@cp -r ./core/styleguide $(CURDIR)/public/
	@docker run --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) php:$(PHP_VERSION) php ./core/builder.php --generate

test_notify:
	@echo "Building tests. This might take a while. Grab a coffee!"

# Builds the JavaScript for the tests
test/build/%.spec.js: test/build test/%.spec.js
	@npx browserify -o ./$@ ./test/$*.spec.js

# Runs the tests
test/%.html: test/build/%.spec.js
	@npx mocha-headless-chrome -f ./$@ -a no-sandbox

# Runs all tests
test: test_notify $(TESTS_OUTPUT) $(TESTS_HTML)

# Watch files for changes and rebuild when detected
watch: public
	@docker build . -f Dockerfile.watch -t pattern-library-watch
	@docker run -d --rm --name $(PROJECT) -p $(PORT):8889 -v $(CURDIR):/opt/pattern-library:rw pattern-library-watch /opt/pattern-library/bin/dev
	@-npx nodemon -C -w ./assets -e "png,tiff,svg,woff2,scss,js" -x "make public"
	@-docker stop $(PROJECT)

# Builds and runs the application on localhost:8889.
start: public
	@echo "$(PROJECT) listening on 'http://localhost:$(PORT)'"
	@docker run --rm --name $(PROJECT) -p $(PORT):80 -e NGINX_ENTRYPOINT_QUIET_LOGS=1 -v $(CURDIR)/public:/usr/share/nginx/html/:ro nginx:alpine

# If running, stops the container.
stop:
	@echo $(SOURCES)
	@-docker stop $(PROJECT)
