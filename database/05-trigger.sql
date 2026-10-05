USE courier_management;

DROP TRIGGER IF EXISTS after_delivery_status_update;

DELIMITER $$

CREATE TRIGGER after_delivery_status_update
AFTER UPDATE ON deliveries
FOR EACH ROW
BEGIN
    IF NEW.delivery_status = 'DELIVERED'
       AND OLD.delivery_status <> 'DELIVERED' THEN
        UPDATE parcels
        SET parcel_status = 'DELIVERED'
        WHERE parcel_id = NEW.parcel_id;
    END IF;
END $$

DELIMITER ;
