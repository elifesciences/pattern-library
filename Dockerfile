ARG commit=latest
# looking for a better name for the node image that replaces `assets`
FROM elifesciences/pattern-library_assets:${commit} AS assets
FROM elifesciences/php_cli:22434ef5bda09326d4c9347de7d8c2f1610a0b83 AS ui-builder

USER elife
ENV PROJECT_FOLDER=/srv/pattern-library-ui
RUN mkdir ${PROJECT_FOLDER} && \
    mkdir ${PROJECT_FOLDER}/public
WORKDIR ${PROJECT_FOLDER}
COPY --chown=elife:elife \
    composer.json \
    composer.lock \
    ${PROJECT_FOLDER}/
# customized command for composer
RUN composer --no-interaction install

COPY --from=assets \
    --chown=elife:elife \
    /srv/pattern-library/source/ ${PROJECT_FOLDER}/source
COPY --chown=elife:elife \
    core/ ${PROJECT_FOLDER}/core
COPY --chown=elife:elife \
    core/styleguide ${PROJECT_FOLDER}/public/styleguide
COPY --chown=elife:elife config/ ${PROJECT_FOLDER}/config
RUN php core/builder.php -g

FROM nginx:1.13.7
COPY --from=ui-builder \
    --chown=root:root \
    /srv/pattern-library-ui/public/ /usr/share/nginx/html
