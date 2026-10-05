package com.courier.management.service;

import com.courier.management.dto.EmployeeDeliveryCountDto;
import com.courier.management.entity.Employee;
import com.courier.management.exception.ResourceNotFoundException;
import com.courier.management.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Integer id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + id
                        ));
    }

    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Integer id, Employee employeeDetails) {

        Employee employee = getEmployeeById(id);

        employee.setName(employeeDetails.getName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPhone(employeeDetails.getPhone());
        employee.setAddress(employeeDetails.getAddress());
        employee.setHireDate(employeeDetails.getHireDate());
        employee.setStatus(employeeDetails.getStatus());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Integer id) {

        Employee employee = getEmployeeById(id);

        employeeRepository.delete(employee);
    }

    public List<EmployeeDeliveryCountDto> getAboveAverageEmployees() {

        return employeeRepository.findEmployeesAboveAverage()
                .stream()
                .map(row -> new EmployeeDeliveryCountDto(
                        ((Number) row[0]).intValue(),
                        (String) row[1],
                        ((Number) row[2]).intValue()
                ))
                .toList();
    }
}