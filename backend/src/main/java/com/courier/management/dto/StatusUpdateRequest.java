package com.courier.management.dto;

import com.courier.management.entity.DeliveryStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull
    private DeliveryStatus status;

    public StatusUpdateRequest() {
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryStatus status) {
        this.status = status;
    }
}