package com.ghanapayeng.portfolio.controller;

import com.ghanapayeng.portfolio.dto.ApiResponse;
import com.ghanapayeng.portfolio.dto.ContactRequestDTO;
import com.ghanapayeng.portfolio.model.ContactMessage;
import com.ghanapayeng.portfolio.service.ContactService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    /**
     * Endpoint to receive Contact inquiries from the portfolio "Connect With Me" terminal.
     * Persists row into MySQL table: contact_messages and emails ghanakanta076@gmail.com.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessage>> submitContactMessage(
            @Valid @RequestBody ContactRequestDTO requestDTO,
            HttpServletRequest request
    ) {
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = request.getRemoteAddr();
        }
        String userAgent = request.getHeader("User-Agent");

        ContactMessage saved = contactService.processContactRequest(requestDTO, clientIp, userAgent);

        return new ResponseEntity<>(
                ApiResponse.ok("Message received, stored in MySQL database, and forwarded to Ghana's email (ghanakanta076@gmail.com)!", saved),
                HttpStatus.CREATED
        );
    }

    /**
     * Admin endpoint to inspect all contact messages stored in MySQL.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactMessage>>> getAllMessages() {
        List<ContactMessage> messages = contactService.getAllMessages();
        return ResponseEntity.ok(ApiResponse.ok("Retrieved contact inquiries from MySQL", messages));
    }

    /**
     * Endpoint to mark a message as READ.
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<ContactMessage>> markAsRead(@PathVariable String id) {
        ContactMessage updated = contactService.markAsRead(id);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error("Message not found with id: " + id));
        }
        return ResponseEntity.ok(ApiResponse.ok("Status updated to READ", updated));
    }
}
