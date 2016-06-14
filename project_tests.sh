#!/bin/bash
set -e

echo "Setting up local working copy..."
mkdir -p public
cp -r ./core/styleguide ./public/
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
