DOCKER_COMPOSE = docker-compose

.PHONY: build clean dev test

build:
	$(DOCKER_COMPOSE) build

dev: build
	bin/watch

clean:
	$(DOCKER_COMPOSE) down --remove-orphans
	$(DOCKER_COMPOSE) down --volumes

test:
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.ci.yml run --rm --name pattern-library_ci_project_tests.sh ci ./project_tests.sh
