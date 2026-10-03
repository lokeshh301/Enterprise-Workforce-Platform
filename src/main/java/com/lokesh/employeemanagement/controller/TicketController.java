package com.lokesh.employeemanagement.controller;

import com.lokesh.employeemanagement.dto.CreateTicketRequestDTO;
import com.lokesh.employeemanagement.dto.TicketResponseDTO;
import com.lokesh.employeemanagement.dto.UpdateTicketStatusDTO;
import com.lokesh.employeemanagement.model.TicketStatus;
import com.lokesh.employeemanagement.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<TicketResponseDTO> createTicket(@Valid @RequestBody CreateTicketRequestDTO request) {
        return new ResponseEntity<>(ticketService.createTicket(request), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TicketResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusDTO request) {
        return ResponseEntity.ok(ticketService.updateTicketStatus(id, request));
    }

    @GetMapping
    public ResponseEntity<Page<TicketResponseDTO>> getAllTickets(
            @RequestParam(required = false) TicketStatus status,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ticketService.getAllTickets(status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketResponseDTO> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }
}