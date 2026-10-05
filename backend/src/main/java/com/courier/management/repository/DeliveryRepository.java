package com.courier.management.repository;

import com.courier.management.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {

    long countByEmployee_EmployeeId(Integer employeeId);

    @Query("""
        SELECT d
        FROM Delivery d
        JOIN FETCH d.employee
        JOIN FETCH d.parcel
        JOIN FETCH d.route
        """)
    List<Delivery> findAllWithDetails();
}