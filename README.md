# nodejs-task
# Durim Gashi 

# API Documentation

To easily test the API, I have written an OpenAPI documentation, and I have placed it in the root folder of the project.
The file is named API_Documentation.yaml. For testing, you can import it to: https://editor.swagger.io/ or Postman (or any
other client that supports yaml importing)

# Database of choice - MySQL

For this assignment I have chosen to go with a relational database, which is MySQL. Even though I have experiece
with cloud-hosted NoSQL databases such as Firebase, using MySQL on frequent basis has made it much easier for me to work
with it. 

There are advantages and disadvantages to using the both of them, SQL databases are efficient at processing queries 
and joining data across tables, making it easier to perform complex queries against structured data. NoSQL databases 
on the other hand lack consistency and typically require more work to query data, particularly as query complexity increases.

# Running the application

The application can be run locally using Node and can also be run using Docker. 

Prerequisites for running with Docker:

- Docker version 20.10.8
- docker-compose version 1.29.2

Prerequisites for running with Node:
- Node v14.0
- MySQL 8.0 or MariaDB 10.4.22

# Running with Docker:

The application has two Dockerfiles for building two containers. One for running the server and the other for running the tests.
In the docker-compose.yml file, there are two containers created. One is created to run the tests and the other is created for the server itself.

Run the commands in the following order to run the application and the tests (run at same directory with Dockerfiles):

docker build -f Dockerfile.Main . -t node_dev     # Build the dockerfile which will be used by docker-compose to create the container
docker build -f Dockerfile.Test . -t node_test    # Build the dockerfile which will be used by docker-compose to run the tests
docker-compose up -d                              # Run the containers as defined in the dockerfile(s). Run in detached mode.

After this, the following environment will be established:

----------------------- LOCAL DOCKER NETWORK -------------------------
|    APP (Container)                         APP_TEST (Container)    |
|    Ports: 3000:3000                        Ports: 3002:3002        |
|    Image: node:14                          Image: node:14          |
|    Entrypoint: "pm2 app.js"                Entrypoint: "node test" |
|                                                                    |
|                                                                    |
|   MYSQL_MAIN (Container)                   MYSQL_TEST (Container)  |
|   Ports: 3306                              Ports: 3306             |
|   Image: mariadb:10.4.22                   Image: mariadb:10.4.22  |   
|   Entrypoint: Default                      Entrypoint: Default     |
|                                                                    |
----------------------- LOCAL DOCKER NETWORK -------------------------

Both the Dockerfile.Main and Dockerfile.Test use the node:14 image but they differ on what they are used for.
While Dockerfile.Main builds an image to access the server, Dockerfile.Test builds an image for running the tests.

These images are then run into containers using the docker-compose file.
Docker-compose makes it easy to run containers because it pre-defines environmental variables, sets container names
for easier access, names the services, so they can be reached as hostnames and not IP-s and also makes it very 
easy to control the start-up and shutdown process of containers using these two commands:

docker-compose up -d         # Create the containers with the images stated in the yaml file, run in detached mode
docker-compose down          # Destroy the containers (but not the images). 

# To check the output of each container, use these commands:

docker logs app              # To see the output of main app container
docker logs app_test         # To see the output of the containers that runs the test
docker logs mysql_main       # To see the output of the main database container
docker logs mysql_test       # To see the output of the database container used for tests 



For instance, a sample output of docker logs app_test is below:
# ####################################
> nodejs-task@1.0.0 test /app
> jest --silent

PASS tests/endpoints.test.js

Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        2.741 s
# ####################################