package com.lokesh.employeemanagement.service;

import com.lokesh.employeemanagement.dto.CreateTicketRequestDTO;
import com.lokesh.employeemanagement.dto.TicketResponseDTO;
import com.lokesh.employeemanagement.dto.UpdateTicketStatusDTO;
import com.lokesh.employeemanagement.model.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TicketService {
    TicketResponseDTO createTicket(CreateTicketRequestDTO request);
    TicketResponseDTO updateTicketStatus(Long ticketId, UpdateTicketStatusDTO request);
    Page<TicketResponseDTO> getAllTickets(TicketStatus status, Pageable pageable);
    TicketResponseDTO getTicketById(Long id);
}