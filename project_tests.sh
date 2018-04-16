#!/bin/bash
set -e

echo "Running gulp unit test suite"
gulp test:unit

echo "Running Selenium test suite"
gulp test:selenium
