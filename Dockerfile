FROM node:6.13.1-slim

# TODO: base image
USER root
RUN useradd -ms /bin/bash -G www-data elife && \
    chown elife:elife /srv && \
    mkdir /srv/bin && \
    chown elife:elife /srv/bin && \
    mkdir -p /var/www && \
    chown www-data:www-data /var/www
ENV PATH=/srv/bin:${PATH}
# end base image

# potentially base image
RUN npm install -g gulp-cli
# end potentially base image

RUN apt-get update && apt-get install -y \
    bzip2 \
    g++ \
    make \
    ruby-dev 

USER elife
ENV PROJECT_FOLDER=/srv/pattern-library
RUN mkdir ${PROJECT_FOLDER}
WORKDIR ${PROJECT_FOLDER}
COPY --chown=elife:elife \
    package.json \
    npm-shrinkwrap.json \
    ${PROJECT_FOLDER}/
RUN npm install

COPY --chown=elife:elife assets/ ${PROJECT_FOLDER}/assets
COPY --chown=elife:elife config/ ${PROJECT_FOLDER}/config
COPY --chown=elife:elife source/ ${PROJECT_FOLDER}/source
COPY --chown=elife:elife \
    .babelrc \
    .jscsrc \
    .jshintrc \
    .stylelintrc \
    gulpfile.js \
    ${PROJECT_FOLDER}/
RUN gulp
