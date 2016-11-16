FROM tomcat:9
MAINTAINER Matthes Rieke <m.rieke@52north.org>

# Project: https://github.com/52North/sos

WORKDIR /tmp
RUN curl -L -o sos-bundle.zip http://52north.org/downloads/send/3-sos/491-52n-sensorweb-sos-bundle-4-3-7\
    && unzip -d sos-bundle sos-bundle.zip \
    && unzip -d sos-webapp sos-bundle/*/bin/target/*.war
COPY tomcat-conf/* $CATALINA_HOME/conf/
COPY rest-api-config/* sos-webapp/WEB-INF/classes/
COPY sos-config/configuration.db sos-webapp/
COPY sos-config/datasource.properties sos-webapp/WEB-INF
RUN apt-get update \
    && apt-get -y install zip \
    && cd sos-webapp ; zip -r ../52n-sos-webapp-configured.war . * ; cd .. \
    && cp 52n-sos-webapp-configured.war $CATALINA_HOME/webapps/52n-sos-webapp.war \
    && apt-get -y remove zip \
    && apt-get -y autoremove \
    && rm -r *

ENV JAVA_OPTS="-XX:PermSize=4096m -XX:MaxPermSize=3072m"
