
PROJECT := $(notdir $(CURDIR))
NODE_VERSION ?= boron
PHP_VERSION ?= 7.3-fpm

# Source files that when changed should trigger a rebuild.
SOURCES := $(wildcard assets/**/*) $(wildcard source/**/*)

# Targets that don't result in output of the same name.
.PHONY: start \
        clean \
				distclean \
				test

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

# Builds the patterns, and pattern-lab static site.
public: node_modules $(SOURCES)
	@mkdir -p $(CURDIR)/public
	@cp -r ./core/styleguide $(CURDIR)/public/
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) ./node_modules/.bin/gulp
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) php:$(PHP_VERSION) php ./core/builder.php -g

# Builds and runs the application on localhost:8080.
start: public
	@docker run -it --rm -p 8080:8080 -v $(CURDIR):/$(PROJECT):ro -w=/$(PROJECT)/public php:$(PHP_VERSION) php -S 0.0.0.0:8080