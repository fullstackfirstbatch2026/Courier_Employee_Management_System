USE courier_management;

DROP FUNCTION IF EXISTS count_employee_deliveries;

DELIMITER $$

CREATE FUNCTION count_employee_deliveries(p_employee_id INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE delivery_count INT;

    SELECT COUNT(*)
    INTO delivery_count
    FROM deliveries
    WHERE employee_id = p_employee_id;

    RETURN delivery_count;
END $$

DELIMITER ;
