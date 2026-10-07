package com.sweetcrumbs.bakery.dto;

import com.sweetcrumbs.bakery.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateDto {

    @NotNull(message = "Status is required")
    private OrderStatus status;

    public StatusUpdateDto() {}

    public StatusUpdateDto(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
