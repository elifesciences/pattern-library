DOCKER_COMPOSE = docker-compose

.PHONY: build clean dev stop test validate

build:
	$(DOCKER_COMPOSE) build

dev: build
	bin/watch

stop:
	$(DOCKER_COMPOSE) down --remove-orphans

clean: stop
	$(DOCKER_COMPOSE) down --volumes

test:
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.ci.yml run --rm --name pattern-library_ci_project_tests.sh ci ./project_tests.sh

validate:
	bin/validate
