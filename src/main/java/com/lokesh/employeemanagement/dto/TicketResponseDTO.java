package com.lokesh.employeemanagement.dto;

import com.lokesh.employeemanagement.model.TicketPriority;
import com.lokesh.employeemanagement.model.TicketStatus;
import java.time.LocalDateTime;

public record TicketResponseDTO(
    Long id,
    String ticketCode,
    String title,
    String description,
    TicketPriority priority,
    TicketStatus status,
    Long requesterId,
    String requesterName,
    Long resolverId,
    String resolverName,
    String resolutionNotes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}