CREATE DATABASE IF NOT EXISTS courier_management;
USE courier_management;

CREATE TABLE IF NOT EXISTS employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255),
    hire_date DATE NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS parcels (
    parcel_id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_number VARCHAR(50) NOT NULL UNIQUE,
    sender_name VARCHAR(100) NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_address VARCHAR(255) NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    parcel_status ENUM('PENDING','ASSIGNED','IN_TRANSIT','DELIVERED','CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS routes (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    source VARCHAR(150) NOT NULL,
    destination VARCHAR(150) NOT NULL,
    distance DECIMAL(10,2) NOT NULL,
    route_status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE'
);

CREATE TABLE IF NOT EXISTS deliveries (
    delivery_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    parcel_id INT NOT NULL,
    route_id INT NOT NULL,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMP NULL,
    delivery_status ENUM('ASSIGNED','IN_TRANSIT','DELIVERED','CANCELLED') DEFAULT 'ASSIGNED',
    CONSTRAINT fk_delivery_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    CONSTRAINT fk_delivery_parcel FOREIGN KEY (parcel_id) REFERENCES parcels(parcel_id),
    CONSTRAINT fk_delivery_route FOREIGN KEY (route_id) REFERENCES routes(route_id)
);
