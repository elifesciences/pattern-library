ARG image_tag=latest
FROM elifesciences/pattern-library_assets:${image_tag} AS assets
FROM elifesciences/pattern-library_composer:${image_tag} AS composer
FROM php:7.0.29-cli-alpine AS ui-builder

WORKDIR /srv/pattern-library-ui

COPY core/styleguide/ public/styleguide/
COPY core/ core/
COPY config/ config/
COPY extras/ extras/
COPY bin/ bin/
COPY --from=composer /app/vendor/ vendor/
COPY --from=assets /srv/pattern-library/source/ source/
RUN php bin/validate
RUN php core/builder.php -g

FROM nginx:1.13.7
COPY --from=ui-builder \
    --chown=root:root \
    /srv/pattern-library-ui/public/ /usr/share/nginx/html/
