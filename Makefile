
PROJECT := $(notdir $(CURDIR))
NODE_VERSION ?= boron
PHP_VERSION ?= 7.3-cli
COMPOSER_VERSION ?= 1.6.4
PORT ?= 8080

# Source files that when changed should trigger a rebuild.
SOURCES := $(wildcard assets/**/*) $(wildcard source/**/*)

# Targets that don't result in output of the same name.
.PHONY: start \
        clean \
				distclean \
				test \
				validate

# When no target is specified, the default target to run.
.DEFAULT_GOAL := start

# Cleans build output and local dependencies
distclean: clean
	@rm -rf node_modules

# Cleans build output
clean:
	@rm -rf public source/assets

# Install Node.js dependencies if either, the node_modules directory is not present or package.json has changed.
node_modules: package.json
	docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) npm install

# Install PHP dependencies if, the vendor directory is not present or if composer.json or composer.lock have changed. 
vendor: composer.json composer.lock
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) composer:$(COMPOSER_VERSION) composer --no-interaction install --ignore-platform-reqs --classmap-authoritative --no-suggest --prefer-dist

# Builds the patterns, and pattern-lab static site.
public: node_modules $(SOURCES)
	@mkdir -p $(CURDIR)/public
	@cp -r ./core/styleguide $(CURDIR)/public/
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) ./node_modules/.bin/gulp
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) php:$(PHP_VERSION) php ./core/builder.php -g

# Runs the unit test suite
unit: public
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) ./node_modules/.bin/gulp test:unit

# Runs the schema validator
validate: vendor
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) php:$(PHP_VERSION) php bin/validate

# Builds and runs the application on localhost:8080.
start: public
	@docker run --rm -d --name $(PROJECT) -p $(PORT):80 -v $(CURDIR)/public:/usr/share/nginx/html/:ro nginx:alpine
	@echo "$(PROJECT) listening on 'http://localhost:$(PORT)'"

# If running, stops the container.
stop:
	@-docker stop $(PROJECT)
