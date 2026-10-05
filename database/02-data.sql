USE courier_management;

INSERT INTO employees (name,email,phone,address,hire_date,status) VALUES
('Arun Kumar','arun@gmail.com','9876543210','Chennai','2023-01-10','ACTIVE'),
('Priya Sharma','priya@gmail.com','9876543211','Coimbatore','2023-03-15','ACTIVE'),
('Rahul Kumar','rahul@gmail.com','9876543212','Madurai','2022-07-20','ACTIVE'),
('Divya Raj','divya@gmail.com','9876543213','Salem','2024-01-05','ACTIVE'),
('Karthik S','karthik@gmail.com','9876543214','Trichy','2024-02-12','ACTIVE');

INSERT INTO parcels (tracking_number,sender_name,receiver_name,receiver_address,weight,parcel_status) VALUES
('TRK10001','Amazon','Ravi','Chennai',2.50,'PENDING'),
('TRK10002','Flipkart','Kumar','Coimbatore',1.20,'PENDING'),
('TRK10003','Meesho','Anitha','Madurai',3.40,'PENDING'),
('TRK10004','Amazon','Suresh','Salem',5.00,'PENDING'),
('TRK10005','Flipkart','Priya','Trichy',2.10,'PENDING'),
('TRK10006','Meesho','Vijay','Chennai',1.80,'PENDING'),
('TRK10007','Amazon','Lakshmi','Coimbatore',4.50,'PENDING'),
('TRK10008','Flipkart','Manoj','Madurai',2.30,'PENDING');

INSERT INTO routes (route_name,source,destination,distance,route_status) VALUES
('Chennai-Coimbatore','Chennai','Coimbatore',500.00,'ACTIVE'),
('Chennai-Madurai','Chennai','Madurai',460.00,'ACTIVE'),
('Chennai-Salem','Chennai','Salem',340.00,'ACTIVE'),
('Chennai-Trichy','Chennai','Trichy',330.00,'ACTIVE');

INSERT INTO deliveries (employee_id,parcel_id,route_id,delivery_status) VALUES
(1,1,1,'DELIVERED'),
(1,2,1,'DELIVERED'),
(1,3,2,'IN_TRANSIT'),
(2,4,3,'DELIVERED'),
(2,5,4,'ASSIGNED'),
(3,6,1,'DELIVERED'),
(3,7,1,'IN_TRANSIT'),
(4,8,2,'ASSIGNED');
