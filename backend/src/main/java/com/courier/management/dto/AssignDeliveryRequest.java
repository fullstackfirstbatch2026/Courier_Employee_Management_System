package com.courier.management.dto;

import jakarta.validation.constraints.NotNull;

public class AssignDeliveryRequest {

    @NotNull
    private Integer employeeId;

    @NotNull
    private Integer parcelId;

    @NotNull
    private Integer routeId;

    public AssignDeliveryRequest() {
    }

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public Integer getParcelId() {
        return parcelId;
    }

    public void setParcelId(Integer parcelId) {
        this.parcelId = parcelId;
    }

    public Integer getRouteId() {
        return routeId;
    }

    public void setRouteId(Integer routeId) {
        this.routeId = routeId;
    }
}