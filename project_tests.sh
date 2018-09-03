#!/bin/bash
set -e

echo "Running gulp unit test suite"
node_modules/.bin/gulp test:unit

echo "Running Selenium test suite"
node_modules/.bin/gulp test:selenium

echo "Static checks"
.ci/errors-ascii-chars
