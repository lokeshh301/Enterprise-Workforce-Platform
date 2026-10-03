package com.lokesh.employeemanagement.dto;

public record EmployeeResponseDTO(
    Long id,
    String employeeCode,
    String name,
    String department,
    String email,
    Double salary,
    String status
) {}