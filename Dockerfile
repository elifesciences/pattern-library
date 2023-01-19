ARG node_version
ARG environment=production
ARG description=unknown
ARG selenium_image_suffix=

# NPM - Manages the node part of the app

FROM node:${node_version} as npm

COPY npm-shrinkwrap.json \
    package.json \
    ./

RUN npm install

# Assets-Builder - Builds the assets (css, js, etc)

FROM npm as assets_builder

WORKDIR /srv/pattern-library

COPY .babelrc \
    .jscsrc \
    .jshintrc \
    .stylelintrc \
    gulpfile.js \
    ./

COPY --from=npm /node_modules/ node_modules/

ARG environment

COPY assets/fonts/ assets/fonts/
RUN node_modules/.bin/gulp --environment ${environment} fonts

COPY assets/img/ assets/img/
RUN node_modules/.bin/gulp --environment ${environment} img

COPY assets/js/ assets/js/
RUN node_modules/.bin/gulp --environment ${environment} js

COPY assets/sass/ assets/sass/
RUN node_modules/.bin/gulp --environment ${environment} generateCss

# Assets

FROM tianon/true@sha256:009cce421096698832595ce039aa13fa44327d96beedb84282a69d3dbcf5a81b as assets

WORKDIR /srv/pattern-library

COPY source/ source/
COPY --from=assets_builder /srv/pattern-library/source/assets/ source/assets/
COPY assets/preload.json source/assets/

ARG description
LABEL description=${description}

## Pattern-Library UI and dependencies - Main app output

# Composer - builds vendor files based on composer.lock

FROM composer:1.6.4 as composer

COPY composer.json \
    composer.lock \
    ./

RUN composer --no-interaction install --ignore-platform-reqs --classmap-authoritative --no-suggest --prefer-dist

# UI-Builder - puts together all files needed for UI

FROM php:7.0.29-cli-alpine as ui-builder

COPY core/styleguide/ public/styleguide/
COPY core/ core/
COPY config/ config/
COPY extras/ extras/
COPY bin/validate bin/validate
COPY --from=composer /app/vendor/ vendor/
COPY --from=assets /srv/pattern-library/source/ source/
RUN php bin/validate && \
    php core/builder.php -g

# UI - Output through nginx

FROM nginx:1.15.0-alpine as ui

COPY --from=ui-builder /public/ /usr/share/nginx/html/

## CI/Selenium - Testing part

# CI - Copy tests

FROM assets_builder as ci

COPY .ci/ .ci/
COPY project_tests.sh smoke_tests.sh wdio.conf.js ./
COPY source/_patterns/00-atoms/errors/ source/_patterns/00-atoms/errors/
COPY test-selenium/ test-selenium/
COPY test/ test/

RUN mkdir -p test/build && \
    chown --recursive node:node test/build

USER root

# Selenium - Run tests

FROM selenium/standalone-firefox${selenium_image_suffix}:3.11.0-bismuth as selenium
USER root
RUN apt-get update && apt-get install --no-install-recommends -y \
    mplayer \
    linux-sound-base \
    && rm -rf /var/lib/apt/lists/*
USER seluser
