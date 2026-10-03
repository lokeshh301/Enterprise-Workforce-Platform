package com.lokesh.employeemanagement.dto;

import com.lokesh.employeemanagement.model.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTicketRequestDTO(
    @NotNull(message = "Requester employee ID is required")
    Long requesterId,

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 150, message = "Title must be between 5 and 150 characters")
    String title,

    @NotBlank(message = "Description cannot be blank")
    String description,

    @NotNull(message = "Priority is required")
    TicketPriority priority
) {}