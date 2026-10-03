package com.lokesh.employeemanagement.service;

import com.lokesh.employeemanagement.dto.EmployeeRequestDTO;
import com.lokesh.employeemanagement.dto.EmployeeResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmployeeService {
    EmployeeResponseDTO saveEmployee(EmployeeRequestDTO requestDTO);
    Page<EmployeeResponseDTO> getAllEmployees(Pageable pageable);
    EmployeeResponseDTO getEmployeeById(Long id);
    EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO requestDTO);
    void deleteEmployee(Long id);
}