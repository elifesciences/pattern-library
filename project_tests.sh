#!/bin/bash
set -e

# moved to containers
#echo "Running gulp unit test suite"
#gulp test
#
#echo "Running Selenium test suite"
#gulp test:selenium

echo "Running validation against schema"
bin/validate

