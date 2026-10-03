package com.lokesh.employeemanagement.service;

import com.lokesh.employeemanagement.dto.AttendanceResponseDTO;
import com.lokesh.employeemanagement.dto.ClockInRequestDTO;
import com.lokesh.employeemanagement.exception.ResourceNotFoundException;
import com.lokesh.employeemanagement.model.AttendanceRecord;
import com.lokesh.employeemanagement.model.AttendanceStatus;
import com.lokesh.employeemanagement.model.Employee;
import com.lokesh.employeemanagement.repository.AttendanceRepository;
import com.lokesh.employeemanagement.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public AttendanceResponseDTO clockIn(ClockInRequestDTO request) {
        LocalDate today = LocalDate.now();

        if (attendanceRepository.existsByEmployeeIdAndWorkDate(request.employeeId(), today)) {
            throw new IllegalStateException("Employee has already clocked in today.");
        }

        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.employeeId()));

        AttendanceRecord record = new AttendanceRecord();
        record.setEmployee(employee);
        record.setWorkDate(today);
        record.setClockIn(LocalDateTime.now());
        record.setStatus(AttendanceStatus.PRESENT);

        AttendanceRecord saved = attendanceRepository.save(record);
        return mapToDTO(saved);
    }

    @Override
    public AttendanceResponseDTO clockOut(Long employeeId) {
        LocalDate today = LocalDate.now();
        AttendanceRecord record = attendanceRepository.findByEmployeeIdAndWorkDate(employeeId, today)
                .orElseThrow(() -> new ResourceNotFoundException("No active clock-in found for employee ID: " + employeeId + " today."));

        if (record.getClockOut() != null) {
            throw new IllegalStateException("Employee has already clocked out today.");
        }

        record.setClockOut(LocalDateTime.now());

        // Calculate hours worked to evaluate status
        Duration duration = Duration.between(record.getClockIn(), record.getClockOut());
        double hoursWorked = duration.toMinutes() / 60.0;

        if (hoursWorked < 4.0) {
            record.setStatus(AttendanceStatus.HALF_DAY);
        } else {
            record.setStatus(AttendanceStatus.PRESENT);
        }

        AttendanceRecord updated = attendanceRepository.save(record);
        return mapToDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceResponseDTO> getAttendanceByEmployee(Long employeeId, Pageable pageable) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found with id: " + employeeId);
        }
        return attendanceRepository.findByEmployeeId(employeeId, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AttendanceResponseDTO> getAttendanceByDate(LocalDate date, Pageable pageable) {
        return attendanceRepository.findByWorkDate(date, pageable).map(this::mapToDTO);
    }

    private AttendanceResponseDTO mapToDTO(AttendanceRecord record) {
        Double totalHours = null;
        if (record.getClockIn() != null && record.getClockOut() != null) {
            long minutes = Duration.between(record.getClockIn(), record.getClockOut()).toMinutes();
            totalHours = Math.round((minutes / 60.0) * 100.0) / 100.0;
        }

        return new AttendanceResponseDTO(
                record.getId(),
                record.getEmployee().getId(),
                record.getEmployee().getEmployeeCode(),
                record.getEmployee().getName(),
                record.getWorkDate(),
                record.getClockIn(),
                record.getClockOut(),
                record.getStatus(),
                totalHours
        );
    }
}