package com.lokesh.employeemanagement.service;

import com.lokesh.employeemanagement.dto.EmployeeRequestDTO;
import com.lokesh.employeemanagement.dto.EmployeeResponseDTO;
import com.lokesh.employeemanagement.exception.ResourceNotFoundException;
import com.lokesh.employeemanagement.model.Employee;
import com.lokesh.employeemanagement.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public EmployeeResponseDTO saveEmployee(EmployeeRequestDTO requestDTO) {
        if (employeeRepository.existsByEmployeeCode(requestDTO.employeeCode())) {
            throw new IllegalArgumentException("Employee code already exists: " + requestDTO.employeeCode());
        }
        if (employeeRepository.existsByEmail(requestDTO.email())) {
            throw new IllegalArgumentException("Email already exists: " + requestDTO.email());
        }

        Employee employee = new Employee();
        mapDtoToEntity(requestDTO, employee);

        Employee saved = employeeRepository.save(employee);
        return mapEntityToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmployeeResponseDTO> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(this::mapEntityToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponseDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return mapEntityToDto(employee);
    }

    @Override
    public EmployeeResponseDTO updateEmployee(Long id, EmployeeRequestDTO requestDTO) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        mapDtoToEntity(requestDTO, existing);
        Employee updated = employeeRepository.save(existing);
        return mapEntityToDto(updated);
    }

    @Override
    public void deleteEmployee(Long id) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(existing);
    }

    private void mapDtoToEntity(EmployeeRequestDTO dto, Employee entity) {
        entity.setEmployeeCode(dto.employeeCode());
        entity.setName(dto.name());
        entity.setDepartment(dto.department());
        entity.setEmail(dto.email());
        entity.setSalary(dto.salary());
    }

    private EmployeeResponseDTO mapEntityToDto(Employee entity) {
        return new EmployeeResponseDTO(
                entity.getId(),
                entity.getEmployeeCode(),
                entity.getName(),
                entity.getDepartment(),
                entity.getEmail(),
                entity.getSalary(),
                entity.getStatus()
        );
    }
}