
PROJECT := $(notdir $(CURDIR))
NODE_VERSION ?= boron
PHP_VERSION ?= 7.3-fpm

SOURCES = $(wildcard source/**/*) $(wildcard assets/**/*)

.PHONY: start clean distclean test

.DEFAULT_GOAL := start

distclean: clean
	@rm -rf node_modules

clean:
	@rm -rf public

node_modules: package.json
	docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) npm install

public: node_modules $(SOURCES)
	@mkdir -p $(CURDIR)/public
	@cp -r ./core/styleguide $(CURDIR)/public/
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) node:$(NODE_VERSION) ./node_modules/.bin/gulp
	@docker run -it --rm -v $(CURDIR):/$(PROJECT):rw -w=/$(PROJECT) php:$(PHP_VERSION) php ./core/builder.php -g

start: public
	@docker run -it --rm -p 8080:8080 -v $(CURDIR):/$(PROJECT):ro -w=/$(PROJECT)/public php:$(PHP_VERSION) php -S 0.0.0.0:8080