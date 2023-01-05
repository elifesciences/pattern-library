FROM scratch as stage-1

# NPM - Manages the node part of the app

ARG node_version
FROM node:${node_version} as node_builder

COPY npm-shrinkwrap.json \
    package.json \
    ./

RUN bin/npm install

# Assets-Builder - Builds the assets (css, js, etc)

FROM node_builder as assets_builder

WORKDIR /srv/pattern-library

COPY .babelrc \
    .jscsrc \
    .jshintrc \
    .stylelintrc \
    gulpfile.js \
    ./

COPY --from=assets_builder /node_modules/ node_modules/

ARG environment=production

COPY assets/fonts/ assets/fonts/
RUN node_modules/.bin/gulp --environment ${environment} fonts

COPY assets/img/ assets/img/
RUN node_modules/.bin/gulp --environment ${environment} img

COPY assets/js/ assets/js/
RUN node_modules/.bin/gulp --environment ${environment} js

COPY assets/sass/ assets/sass/
RUN node_modules/.bin/gulp --environment ${environment} generateCss

# Assets

FROM assets_builder as assets_builder_a
FROM tianon/true@sha256:009cce421096698832595ce039aa13fa44327d96beedb84282a69d3dbcf5a81b

WORKDIR /srv/pattern-library

COPY source/ source/
COPY --from=assets-builder-a /srv/pattern-library/source/assets/ source/assets/
COPY assets/preload.json source/assets/

ARG description=unknown
LABEL description=${description}

## Pattern-Library UI and dependencies - Main app output

FROM scratch as stage-2

# Composer - builds vendor files based on composer.lock

FROM composer:1.6.4 as composer

COPY composer.json \
    composer.lock \
    ./

RUN composer --no-interaction install --ignore-platform-reqs --classmap-authoritative --no-suggest --prefer-dist

# UI-Builder - puts together all files needed for UI

FROM assets as assets-ui
FROM composer as composer-ui
FROM php:7.0.29-cli-alpine as ui-builder


COPY core/styleguide/ public/styleguide/
COPY core/ core/
COPY config/ config/
COPY extras/ extras/
COPY bin/validate bin/validate
COPY --from=composer-ui /app/vendor/ vendor/
COPY --from=assets-ui /srv/pattern-library/source/ source/
RUN php bin/validate && \
    php core/builder.php -g

# UI - Output through nginx

FROM ui-builder
FROM nginx:1.15.0-alpine

COPY --from=ui-builder /public/ /usr/share/nginx/html/

## CI/Selenium - Testing part

FROM scratch as stage-3

# CI - Copy tests

FROM assets-builder

COPY .ci/ .ci/
COPY project_tests.sh smoke_tests.sh wdio.conf.js ./
COPY source/_patterns/00-atoms/errors/ source/_patterns/00-atoms/errors/
COPY test-selenium/ test-selenium/
COPY test/ test/

RUN mkdir -p test/build && \
    chown --recursive node:node test/build

USER node

# Selenium - Run tests

ARG selenium_image_suffix=
FROM selenium/standalone-firefox${selenium_image_suffix}:3.11.0-bismuth
USER root
CMD apt-get update \
    apt-get install --no-install-recommends -y \
    mplayer \
    linux-sound-base
RUN bin/rm -rf /var/lib/apt/lists/*
USER seluser
