package com.lokesh.employeemanagement.service;

import com.lokesh.employeemanagement.dto.CreateTicketRequestDTO;
import com.lokesh.employeemanagement.dto.TicketResponseDTO;
import com.lokesh.employeemanagement.dto.UpdateTicketStatusDTO;
import com.lokesh.employeemanagement.exception.ResourceNotFoundException;
import com.lokesh.employeemanagement.model.Employee;
import com.lokesh.employeemanagement.model.ServiceTicket;
import com.lokesh.employeemanagement.model.TicketStatus;
import com.lokesh.employeemanagement.repository.EmployeeRepository;
import com.lokesh.employeemanagement.repository.TicketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final EmployeeRepository employeeRepository;

    public TicketServiceImpl(TicketRepository ticketRepository, EmployeeRepository employeeRepository) {
        this.ticketRepository = ticketRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public TicketResponseDTO createTicket(CreateTicketRequestDTO request) {
        Employee requester = employeeRepository.findById(request.requesterId())
                .orElseThrow(() -> new ResourceNotFoundException("Requester not found with id: " + request.requesterId()));

        ServiceTicket ticket = new ServiceTicket();
        ticket.setTicketCode("TCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        ticket.setTitle(request.title());
        ticket.setDescription(request.description());
        ticket.setPriority(request.priority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setRequester(requester);

        ServiceTicket saved = ticketRepository.save(ticket);
        return mapToDTO(saved);
    }

    @Override
    public TicketResponseDTO updateTicketStatus(Long ticketId, UpdateTicketStatusDTO request) {
        ServiceTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        validateStateTransition(ticket.getStatus(), request.status());
        ticket.setStatus(request.status());

        if (request.resolverId() != null) {
            Employee resolver = employeeRepository.findById(request.resolverId())
                    .orElseThrow(() -> new ResourceNotFoundException("Resolver not found with id: " + request.resolverId()));
            ticket.setAssignedResolver(resolver);
        }

        if (request.status() == TicketStatus.RESOLVED && (request.resolutionNotes() == null || request.resolutionNotes().isBlank())) {
            throw new IllegalArgumentException("Resolution notes are mandatory when marking ticket as RESOLVED");
        }

        if (request.resolutionNotes() != null) {
            ticket.setResolutionNotes(request.resolutionNotes());
        }

        ServiceTicket updated = ticketRepository.save(ticket);
        return mapToDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponseDTO> getAllTickets(TicketStatus status, Pageable pageable) {
        if (status != null) {
            return ticketRepository.findByStatus(status, pageable).map(this::mapToDTO);
        }
        return ticketRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponseDTO getTicketById(Long id) {
        ServiceTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        return mapToDTO(ticket);
    }

    private void validateStateTransition(TicketStatus current, TicketStatus next) {
        if (current == TicketStatus.CLOSED) {
            throw new IllegalStateException("Closed tickets cannot be modified.");
        }
        if (current == TicketStatus.OPEN && next == TicketStatus.RESOLVED) {
            throw new IllegalStateException("Ticket must be moved to IN_PROGRESS before being RESOLVED.");
        }
    }

    private TicketResponseDTO mapToDTO(ServiceTicket t) {
        return new TicketResponseDTO(
                t.getId(),
                t.getTicketCode(),
                t.getTitle(),
                t.getDescription(),
                t.getPriority(),
                t.getStatus(),
                t.getRequester().getId(),
                t.getRequester().getName(),
                t.getAssignedResolver() != null ? t.getAssignedResolver().getId() : null,
                t.getAssignedResolver() != null ? t.getAssignedResolver().getName() : null,
                t.getResolutionNotes(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}