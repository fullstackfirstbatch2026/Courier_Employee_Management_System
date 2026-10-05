package com.courier.management.repository;

import com.courier.management.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query(value = """
        SELECT
            e.employee_id AS employeeId,
            e.name AS name,
            COUNT(d.delivery_id) AS deliveryCount
        FROM employees e
        JOIN deliveries d
            ON e.employee_id = d.employee_id
        GROUP BY e.employee_id, e.name
        HAVING COUNT(d.delivery_id) >
        (
            SELECT AVG(employee_delivery_count)
            FROM
            (
                SELECT COUNT(*) AS employee_delivery_count
                FROM deliveries
                GROUP BY employee_id
            ) AS delivery_counts
        )
        """, nativeQuery = true)
    List<Object[]> findEmployeesAboveAverage();
}