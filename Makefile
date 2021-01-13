# The name of the project
PROJECT := pattern-library

# The version of Node.js to use, see https://hub.docker.com/_/node. Note this is a dynamic tag and hence not the best way to pin a dep, but good enough for demo.
NODE_VERSION ?= boron

# The version of the PHP to use, see https://hub.docker.com/_/php. Note this is a dynamic tag and hence not the best way to pin a dep, but good enough for demo.
PHP_VERSION ?= 7.3-fpm

# My best guess at the source files needed by pattern-library. Note that I know this is incomplete!
SOURCES = $(wildcard source/**/*) $(wildcard assets/**/*)

# Lets make know which recipes don't actually produce any artefacts
.PHONY: start clean

# The default recipe to run if non is specified
.DEFAULT_GOAL := start

# Cleans up build and tooling artefacts
clean:
	@rm -rf node_modules public

# If not present, or if package.json has changed, uses a Node.js container to install dependencies.
node_modules: package.json
	docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) npm install

# If not present, or if any of the source files have changed, uses a Node.js and PHPO container to build the pattern-library static site.
public: node_modules $(SOURCES)
	@mkdir -p $(CURDIR)/public
	@cp -r ./core/styleguide $(CURDIR)/public/
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) ./node_modules/.bin/gulp
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) php:$(PHP_VERSION) php ./core/builder.php -g

# Uses a PHP container to serve the static site on port 8889
start: public
	@docker run -it --rm -p 8889:8889 -v $(CURDIR):/$(PROJECT):ro -w=/$(PROJECT)/public php:$(PHP_VERSION) php -S 0.0.0.0:8889