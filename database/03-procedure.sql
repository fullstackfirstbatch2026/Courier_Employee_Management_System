USE courier_management;

DROP PROCEDURE IF EXISTS assign_delivery;

DELIMITER $$

CREATE PROCEDURE assign_delivery(
    IN p_employee_id INT,
    IN p_parcel_id INT,
    IN p_route_id INT
)
BEGIN
    INSERT INTO deliveries (
        employee_id, parcel_id, route_id, assigned_date, delivery_status
    )
    VALUES (
        p_employee_id, p_parcel_id, p_route_id, CURRENT_TIMESTAMP, 'ASSIGNED'
    );

    UPDATE parcels
    SET parcel_status = 'ASSIGNED'
    WHERE parcel_id = p_parcel_id;
END $$

DELIMITER ;
