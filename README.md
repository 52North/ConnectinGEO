# 52°North Sensor Web Docker Containers

This page provides a brief overview on the available Docker images for
the Sensor Web, created and maintained by 52°North.

`https://hub.docker.com/r/mdillon/postgis/` provides docker images of
PostgreSQL with PostGIS extensions and templates installed. We have based
our example databases on these images.

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
`docker run --name sos-empty-postgres -p 5432:5432 52north/sos-empty-postgres:1.0.0`
1. Run the **sos** docker image:
`docker run --link sos-empty-postgres:postgres -p 8080:8080 52north/sos:4.3.7`

Alternatively, you can use the following **docker-compose** file (run with
`docker-compose build && docker-compose up`):

```yml
version: '2'
services:
  postgres-db-empty:
    image: mdillon/postgis:9.5
    expose:
      - 5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=sos
  sos-service:
    image: 52north/sos:4.3.7
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
A database with some sample data is available as the **52north/sos-example-postgres**
docker image. Execute the following docker commands:

1. Start the postgres container:
`docker run --name sos-example-postgres -p 5432:5432 52north/sos-example-postgres:1.0.0`
1. Run the **sos-configured** docker image:
`docker run --link sos-example-postgres:postgres -p 8080:8080 52north/sos-configured:4.3.7`


Alternatively, you can use the following **docker-compose** file (run with
`docker-compose build && docker-compose up`):

```yml
version: '2'
services:
  sos-example-postgres:
    image: 52north/sos-example-postgres:1.0.0
    expose:
      - 5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=sos
  sos-service:
    image: 52north/sos-configured:4.3.7
    ports:
      - 8080:8080
    links:
      - sos-example-postgres:postgres
```

The SOS is now up and running at [http://localhost:8080/52n-sos-webapp](http://localhost:8080/52n-sos-webapp).

## REST API Setup

## Helgoland (JS Client) Setup
