ARG image_tag=latest
FROM --platform=linux/amd64 elifesciences/pattern-library_ui-builder:${image_tag} AS ui-builder

FROM nginx:1.25.1-alpine
COPY --from=ui-builder /public/ /usr/share/nginx/html/
