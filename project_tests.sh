#!/bin/bash
set -e

echo "Running unit test suite"
make test

#echo "Running Selenium test suite"
#node_modules/.bin/gulp test:selenium

echo "Static checks"
.ci/errors-ascii-chars
