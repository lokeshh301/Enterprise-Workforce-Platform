package com.lokesh.employeemanagement.service;

import com.lokesh.employeemanagement.dto.AttendanceResponseDTO;
import com.lokesh.employeemanagement.dto.ClockInRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AttendanceService {
    AttendanceResponseDTO clockIn(ClockInRequestDTO request);
    AttendanceResponseDTO clockOut(Long employeeId);
    Page<AttendanceResponseDTO> getAttendanceByEmployee(Long employeeId, Pageable pageable);
    Page<AttendanceResponseDTO> getAttendanceByDate(LocalDate date, Pageable pageable);
}