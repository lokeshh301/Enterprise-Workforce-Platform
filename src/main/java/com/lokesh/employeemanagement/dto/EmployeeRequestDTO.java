package com.lokesh.employeemanagement.dto;

import jakarta.validation.constraints.*;

public record EmployeeRequestDTO(
    @NotBlank(message = "Employee code is mandatory")
    @Pattern(regexp = "^EMP-[0-9]{3,6}$", message = "Employee code must follow format: EMP-XXXX")
    String employeeCode,

    @NotBlank(message = "Name cannot be blank")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    String name,

    @NotBlank(message = "Department cannot be blank")
    String department,

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    String email,

    @NotNull(message = "Salary cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Salary must be greater than zero")
    Double salary
) {}