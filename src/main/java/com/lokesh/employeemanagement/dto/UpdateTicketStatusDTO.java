package com.lokesh.employeemanagement.dto;

import com.lokesh.employeemanagement.model.TicketStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateTicketStatusDTO(
    @NotNull(message = "Target status is required")
    TicketStatus status,

    Long resolverId,
    String resolutionNotes
) {}