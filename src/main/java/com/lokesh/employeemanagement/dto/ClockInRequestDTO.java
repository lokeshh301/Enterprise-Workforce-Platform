package com.lokesh.employeemanagement.dto;

import jakarta.validation.constraints.NotNull;

public record ClockInRequestDTO(
    @NotNull(message = "Employee ID is required")
    Long employeeId
) {}