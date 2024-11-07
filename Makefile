.PHONY: test

test:
	docker-compose -f docker-compose.yml -f docker-compose.ci.yml run --rm --name pattern-library_ci_project_tests.sh ci ./project_tests.sh