package com.courier.management.dto;

public record EmployeeDeliveryCountDto(
        Integer employeeId,
        String employeeName,
        Integer deliveryCount
) {
}