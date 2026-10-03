package com.lokesh.employeemanagement.repository;

import com.lokesh.employeemanagement.model.AttendanceRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {
    Optional<AttendanceRecord> findByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);
    Page<AttendanceRecord> findByEmployeeId(Long employeeId, Pageable pageable);
    Page<AttendanceRecord> findByWorkDate(LocalDate workDate, Pageable pageable);
    boolean existsByEmployeeIdAndWorkDate(Long employeeId, LocalDate workDate);
}