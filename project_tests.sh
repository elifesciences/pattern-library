#!/bin/bash
set -e

echo "Installing dependencies..."
npm install
echo "Building with gulp..."
gulp --environment production
echo "Running tests..."
gulp test
echo "Generating PatternLab..."
php ./core/builder.php -g
