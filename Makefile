
PROJECT := $(notdir $(CURDIR))
NODE_VERSION ?= gallium
PHP_VERSION ?= 7.3-fpm
COMPOSER_VERSION ?= 1.6.4
PORT ?= 8080

# Source files that when changed should trigger a rebuild.
FONTS = $(wildcard assets/fonts/**/*)
SASS = $(wildcard assets/sass/**/*)
JAVASCRIPT = $(wildcard assets/js/**/*)
SOURCES = $(wildcard assets/js/**/* assets/sass/**/* source/**/*)

TESTS = $(wildcard test/*.spec.js)
TESTS_OUTPUT = $(patsubst test/%,test/build/%,$(TESTS))
TESTS_HTML = $(patsubst test/%.spec.js,test/%.html,$(TESTS))

# Targets that don't result in output of the same name.
.PHONY: start stop clean distclean test

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
source/assets/fonts: source/assets $(FONTS)
	@cp -r ./assets/fonts ./$@

# Convert the sass to css
source/assets/css/all.css: node_modules source/assets/css $(SASS)
	npx node-sass assets/sass/build.scss ./$@ --importer node_modules/node-sass-magic-importer/dist/cli.js --source-map true --source-map-root file://${PWD} --source-map-embed true --source-comments true

# Compile the Javascript
source/assets/js/main.js: node_modules source/assets/js $(JAVASCRIPT)
	@npx browserify --debug ./assets/js/main.js | npx exorcist ./$@.map > ./$@ && cp assets/js/elife-loader.js ./source/assets/js/elife-loader.js

# Builds the patterns, and pattern-lab static site.
public: source/assets/fonts source/assets/css/all.css source/assets/js/main.js
	@mkdir -p $(CURDIR)/public
	@cp -r ./core/styleguide $(CURDIR)/public/
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) php:$(PHP_VERSION) php ./core/builder.php --generate

# Builds the JavaScript for the tests
test/build/%.spec.js: test/build test/%.spec.js
	npx browserify -o ./$@ ./test/$*.spec.js

# Runs the tests
test/%.html: test/build/%.spec.js
	npx mocha-chrome ./$@ --ignore-resource-errors

# Runs all tests
test: $(TESTS_OUTPUT) $(TESTS_HTML)

# Builds and runs the application on localhost:8080.
start: public
	@echo "$(PROJECT) listening on 'http://localhost:$(PORT)'"
	@docker run --rm --name $(PROJECT) -p $(PORT):80 -e NGINX_ENTRYPOINT_QUIET_LOGS=1 -v $(CURDIR)/public:/usr/share/nginx/html/:ro nginx:alpine

# If running, stops the container.
stop:
	echo $(SOURCES)
	@-docker stop $(PROJECT)
