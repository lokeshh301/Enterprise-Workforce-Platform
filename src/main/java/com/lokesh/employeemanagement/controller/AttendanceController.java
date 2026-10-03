package com.lokesh.employeemanagement.controller;

import com.lokesh.employeemanagement.dto.AttendanceResponseDTO;
import com.lokesh.employeemanagement.dto.ClockInRequestDTO;
import com.lokesh.employeemanagement.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/clock-in")
    public ResponseEntity<AttendanceResponseDTO> clockIn(@Valid @RequestBody ClockInRequestDTO request) {
        return new ResponseEntity<>(attendanceService.clockIn(request), HttpStatus.CREATED);
    }

    @PostMapping("/clock-out/{employeeId}")
    public ResponseEntity<AttendanceResponseDTO> clockOut(@PathVariable Long employeeId) {
        return ResponseEntity.ok(attendanceService.clockOut(employeeId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<Page<AttendanceResponseDTO>> getByEmployee(
            @PathVariable Long employeeId,
            @PageableDefault(size = 15, sort = "workDate") Pageable pageable) {
        return ResponseEntity.ok(attendanceService.getAttendanceByEmployee(employeeId, pageable));
    }

    @GetMapping("/date")
    public ResponseEntity<Page<AttendanceResponseDTO>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PageableDefault(size = 15) Pageable pageable) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date, pageable));
    }
}