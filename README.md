# ARCHIVED

This project is no longer maintained and will not receive any further updates. If you plan to continue using it, please be aware that future security issues will not be addressed.

# 52°North Sensor Web Docker Containers

This page provides a brief overview on the available Docker images for
the Sensor Web, created and maintained by 52°North:

[https://hub.docker.com/r/52north/](https://hub.docker.com/r/52north/)

[mdillon](https://hub.docker.com/r/mdillon/postgis/)
provides docker images of PostgreSQL with PostGIS extensions and templates installed.
We have based our example databases on these images.

## SOS Setup

The **52north/sos-configured** docker image consists of a pre-configured
SOS instance running in a Tomcat container. It has the following settings:

* Database connection: PostgreSQL on `postgres:5432` with credentials `postgres:postgres`
(the DB is running in a DNS named (`postgres`) docker container)
* Administrator account with credentials `admin:admin`
* Transactional operations enabled

The **52north/sos** docker image is a simple instance of a non-configured SOS.
This image requires the installation procedure to be executed.

### Using an Empty Database

For this example, we use the non-configured **52north/sos** docker image.
Run the following docker commands:

1. Start the postgres container:
`docker run -e "POSTGRES_DB=sos" --name sos-empty-postgres -p 5432:5432 mdillon/postgis:9.5`
1. Run the **sos** docker image:
`docker run --link sos-empty-postgres:postgres -p 8080:8080 52north/sos:4.3.8`

Alternatively, you can use the following **docker-compose** file (run with
`docker-compose build && docker-compose up`):

```yml
version: '2'
services:
  postgres-db-empty:
    image: mdillon/postgis:9.5
    ports:
      - 5432:5432
    expose:
      - 5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=sos
  sos-service:
    image: 52north/sos:4.3.8
    ports:
      - 8080:8080
    links:
      - postgres-db-empty:postgres
```


Now, access [http://localhost:8080/52n-sos-webapp](http://localhost:8080/52n-sos-webapp).
The landing page will tell you to execute the installation procedure. Follow this
guided procedure. In particular, apply the following properties:

* as the _Datasource_ select `PostgreSQL/PostGIS`
* in the _Database Configuration_ section, make sure to set the
_Host_ to `postgres`

You will have your SOS running in a few seconds.

### Using a Pre-filled Database

For this example, we use the pre-configured **52north/sos-configured** docker image.
A database with some sample data is available as the **52north/sos-weather-postgres**
docker image. Execute the following docker commands:

1. Start the postgres container:
`docker run --name sos-weather-postgres -p 5432:5432 52north/sos-weather-postgres:4.3.8`
1. Run the **sos-configured** docker image:
`docker run --link sos-weather-postgres:postgres -p 8080:8080 52north/sos-configured:4.3.8`


Alternatively, you can use the following **docker-compose** file (run with
`docker-compose build && docker-compose up`):

```yml
version: '2'
services:
  sos-weather-postgres:
    image: 52north/sos-weather-postgres:4.3.8
    ports:
      - 5432:5432
    expose:
      - 5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=sos
  sos-service:
    image: 52north/sos-configured:4.3.8
    ports:
      - 8080:8080
    links:
      - sos-weather-postgres:postgres
```

The SOS is now up and running at [http://localhost:8080/52n-sos-webapp](http://localhost:8080/52n-sos-webapp).

## REST API Setup

Both the **52north/sos** and the **52north/sos-configured** image come with the
Series REST API bundled in the webapp. You can access the API at:
[http://localhost:8080/52n-sos-webapp/api/v1/](http://localhost:8080/52n-sos-webapp/api/v1/).

## Helgoland (JS Client) Setup

The images also contain the Helgoland JavaScript client. You can access the
client at:
[http://localhost:8080/52n-sos-webapp/static/client/jsClient/#map](http://localhost:8080/52n-sos-webapp/static/client/jsClient/#map)
