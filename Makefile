
PROJECT := $(notdir $(CURDIR))
NODE_VERSION ?= boron
PHP_VERSION ?= 7.3-fpm
COMPOSER_VERSION ?= 1.6.4
PORT ?= 8080

# Source files that when changed should trigger a rebuild.
SOURCES = $(wildcard assets/js/**/* assets/sass/**/* source/**/*)

SASS = $(wildcard assets/sass/**/*)
TESTS = $(wildcard test/*.spec.js)
TESTS_SOURCES = $(patsubst test/%,test/build/%,$(TESTS))
TESTS_HTML=$(patsubst test/%.spec.js,test/%.html,$(TESTS))

# Targets that don't result in output of the same name.
.PHONY: start \
        clean \
        distclean \
        test

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

# Create various directories
source/assets source/assets/js source/assets/css test/build:
	@mkdir -p $@

# Copy the fonts
source/assets/fonts: source/assets
	@cp -r ./assets/fonts ./$@

# Convert the sass to css
source/assets/css/all.css: node_modules source/assets/css $(SASS)
	npx node-sass assets/sass/build.scss ./$@ --importer node_modules/node-sass-magic-importer/dist/cli.js --source-map true --source-map-root file://${PWD} --source-map-embed true --source-comments true

# Compile the Javascript
source/assets/js/main.js: node_modules source/assets/js
	@npx browserify --debug ./assets/js/main.js | npx exorcist ./$@.map > ./$@ && cp assets/js/elife-loader.js ./source/assets/js/elife-loader.js

# Builds the patterns, and pattern-lab static site.
public: source/assets/fonts source/assets/css/all.css source/assets/js/main.js
	@mkdir -p $(CURDIR)/public
	@cp -r ./core/styleguide $(CURDIR)/public/
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) php:$(PHP_VERSION) php ./core/builder.php --generate

test/build/%.spec.js: test/%.spec.js
	npx browserify -o ./$@ ./test/$*.spec.js

test/%.html: test/build/%.spec.js
	@echo "Running test $@"
	@npx mocha-chrome ./$@ --ignore-resource-errors

test: test/build $(TESTS_HTML)

# Builds and runs the application on localhost:8080.
start: public
	@echo "$(PROJECT) listening on 'http://localhost:$(PORT)'"
	@docker run --rm --name $(PROJECT) -p $(PORT):80 -e NGINX_ENTRYPOINT_QUIET_LOGS=1 -v $(CURDIR)/public:/usr/share/nginx/html/:ro nginx:alpine

# If running, stops the container.
stop:
	echo $(SOURCES)
	@-docker stop $(PROJECT)
