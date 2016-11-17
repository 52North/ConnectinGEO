FROM tomcat:9
MAINTAINER Matthes Rieke <m.rieke@52north.org>

# Project: https://github.com/52North/sos

WORKDIR /tmp
#COPY tomcat-conf/* $CATALINA_HOME/conf/
#COPY rest-api-config/* sos-webapp/WEB-INF/classes/
COPY tomcat-conf/* /tmp/tomcat-conf/
COPY rest-api-config/* /tmp/rest-api-config/
COPY helgoland-config/* /tmp/helgoland-config/
RUN curl -L -o sos-bundle.zip https://github.com/52North/SOS/releases/download/4.3.8/52n-sensorweb-sos-bundle-4.3.8.zip \
    && unzip -d sos-bundle sos-bundle.zip \
    && unzip -d sos-webapp sos-bundle/*/bin/target/*.war \
    && cp /tmp/tomcat-conf/* $CATALINA_HOME/conf/ \
    && cp /tmp/rest-api-config/* sos-webapp/WEB-INF/classes/ \
    && curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get -y install nodejs git \
    && npm install -g bower && npm install -g grunt \
    && curl -L -o helgoland.zip https://github.com/52North/helgoland/archive/test-stable.zip \
    && unzip -d helgoland helgoland.zip \
    && cd helgoland/helgoland-test-stable \
    && npm install && bower --allow-root install && grunt \
    && cp /tmp/helgoland-config/* dist/ \
    && cp -R dist/ ../../sos-webapp/static/client/helgoland \
    && cd ../../ \
    && cp -R sos-webapp/ $CATALINA_HOME/webapps/52n-sos-webapp \
    && apt-get -y purge nodejs git python \
    && apt-get -y autoremove --purge \
    && apt-get clean \
    && rm -rf /tmp/* && rm -rf /usr/lib/node_modules && rm -rf /root/.npm
ENV JAVA_OPTS="-XX:PermSize=4096m -XX:MaxPermSize=3072m"
