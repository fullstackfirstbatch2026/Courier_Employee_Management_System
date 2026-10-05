# Courier Employee Management System

A full-stack Courier Employee Management System built with:

- Java 17
- Spring Boot
- Spring Data JPA
- MySQL 8
- React + Vite
- Docker

## Database requirements implemented

1. JOIN - delivery details with employee, parcel and route information.
2. Subquery - employees handling above-average deliveries.
3. Stored procedure - `assign_delivery`.
4. Function - `count_employee_deliveries`.
5. Trigger - updates parcel status when delivery becomes DELIVERED.

## Backend setup

Create the MySQL database and run these files in order:

1. database/01-schema.sql
2. database/02-data.sql
3. database/03-procedure.sql
4. database/04-function.sql
5. database/05-trigger.sql

Set database credentials in environment variables if needed:

DB_HOST
DB_PORT
DB_NAME
DB_USERNAME
DB_PASSWORD

Default values:
DB_HOST=localhost
DB_PORT=3306
DB_NAME=courier_management
DB_USERNAME=root
DB_PASSWORD=root

From backend:

mvn clean package

Then:

java -jar target/courier-management-0.0.1-SNAPSHOT.jar

Swagger:
http://localhost:8080/swagger-ui.html

## Docker flow

From backend:

mvn clean package

docker build -t courier-management .

docker login

docker tag courier-management:latest YOUR_DOCKERHUB_USERNAME/courier-management:latest

docker push YOUR_DOCKERHUB_USERNAME/courier-management:latest

docker pull YOUR_DOCKERHUB_USERNAME/courier-management:latest

docker run -d --name courier-management -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_NAME=courier_management \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=root \
  YOUR_DOCKERHUB_USERNAME/courier-management:latest

## Important

The backend Docker image contains the Java REST API. MySQL is kept as a separate database service for this deployment flow.

## REST endpoints

GET /api/employees
POST /api/employees
PUT /api/employees/{id}
DELETE /api/employees/{id}

GET /api/employees/above-average
GET /api/employees/{id}/delivery-count

GET /api/parcels
POST /api/parcels
PUT /api/parcels/{id}
DELETE /api/parcels/{id}

GET /api/routes
POST /api/routes
PUT /api/routes/{id}
DELETE /api/routes/{id}

GET /api/deliveries
GET /api/deliveries/details
POST /api/deliveries/assign
PATCH /api/deliveries/{id}/status
DELETE /api/deliveries/{id}

## Frontend

From frontend:

npm install
npm run dev

Frontend:
http://localhost:5173
