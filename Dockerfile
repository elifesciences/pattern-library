ARG image_tag=latest
FROM elifesciences/pattern-library_ui-builder:${image_tag} AS ui-builder

FROM nginx:1.13.7
COPY --from=ui-builder \
    --chown=root:root \
    /srv/pattern-library-ui/public/ /usr/share/nginx/html
