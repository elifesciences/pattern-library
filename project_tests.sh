#!/bin/bash
set -e

echo "Installing dependencies..."
npm install
composer install --no-interaction
echo "Building with gulp..."
gulp --environment production
echo "Running tests..."
gulp test
bin/validate
echo "Generating PatternLab..."
php ./core/builder.php -g
