FROM node:6.11.2-alpine

MAINTAINER Andre Rocha <andre@konkerlabs.com>, Kobayashi <ckobayashi@konkerlabs.com>, Wellington Mariusso <wellington@konkerlabs.com>

ENV WEBAPP_HOME=/usr/share/webapp/

COPY docker/docker-entrypoint.sh /tmp/docker-entrypoint.sh
COPY package.json /tmp/package.json
COPY data /tmp/data
COPY public /tmp/public
COPY webapp.js /tmp
COPY localdb.json /tmp

RUN cp /tmp/docker-entrypoint.sh /etc/init.d/webapp && \
    chmod a+x /etc/init.d/webapp && \
    mkdir -p $WEBAPP_HOME && \
    cp /tmp/package.json $WEBAPP_HOME && \
    cp -r /tmp/data $WEBAPP_HOME && \
    cp -r /tmp/public $WEBAPP_HOME && \
    cp /tmp/webapp.js $WEBAPP_HOME && \
    cp /tmp/localdb.json $WEBAPP_HOME && \
    cd $WEBAPP_HOME && \
    npm install

WORKDIR $WEBAPP_HOME
EXPOSE 80

ENTRYPOINT ["/etc/init.d/webapp"]