package com.lokesh.employeemanagement.dto;

import com.lokesh.employeemanagement.model.AttendanceStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record AttendanceResponseDTO(
    Long id,
    Long employeeId,
    String employeeCode,
    String employeeName,
    LocalDate workDate,
    LocalDateTime clockIn,
    LocalDateTime clockOut,
    AttendanceStatus status,
    Double totalHoursWorked
) {}