package com.lokesh.employeemanagement.repository;

import com.lokesh.employeemanagement.model.ServiceTicket;
import com.lokesh.employeemanagement.model.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketRepository extends JpaRepository<ServiceTicket, Long> {
    Optional<ServiceTicket> findByTicketCode(String ticketCode);
    Page<ServiceTicket> findByStatus(TicketStatus status, Pageable pageable);
    Page<ServiceTicket> findByRequesterId(Long employeeId, Pageable pageable);
    long countByStatus(TicketStatus status);
}