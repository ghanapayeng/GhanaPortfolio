package com.ghanapayeng.portfolio.service;

import com.ghanapayeng.portfolio.dto.ContactRequestDTO;
import com.ghanapayeng.portfolio.model.ContactMessage;
import com.ghanapayeng.portfolio.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository contactMessageRepository;
    private final EmailService emailService;

    public ContactService(ContactMessageRepository contactMessageRepository, EmailService emailService) {
        this.contactMessageRepository = contactMessageRepository;
        this.emailService = emailService;
    }

    public ContactMessage processContactRequest(ContactRequestDTO dto, String clientIp, String userAgent) {
        log.info("Processing contact inquiry from: {} <{}>, subject: {}", dto.getName(), dto.getEmail(), dto.getSubject());

        ContactMessage message = new ContactMessage(
                dto.getName(),
                dto.getEmail(),
                dto.getSubject() != null && !dto.getSubject().isBlank() ? dto.getSubject() : "Portfolio General Inquiry",
                dto.getMessage(),
                clientIp,
                userAgent
        );

        // 1. Persist in MySQL database
        ContactMessage saved = contactMessageRepository.save(message);
        log.info("Contact message saved to MySQL database with ID: #{}", saved.getId());

        // 2. Dispatch live email notification directly to ghanakanta076@gmail.com
        try {
            emailService.sendContactNotification(saved);
        } catch (Exception ex) {
            log.error("Failed to trigger email notification for message #{}: {}", saved.getId(), ex.getMessage());
        }

        return saved;
    }

    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<ContactMessage> getUnreadMessages() {
        return contactMessageRepository.findByStatusOrderByCreatedAtDesc("UNREAD");
    }

    public ContactMessage markAsRead(Long id) {
        return contactMessageRepository.findById(id).map(msg -> {
            msg.setStatus("READ");
            return contactMessageRepository.save(msg);
        }).orElse(null);
    }

    public ContactMessage markAsRead(String id) {
        try {
            Long longId = Long.parseLong(id);
            return markAsRead(longId);
        } catch (NumberFormatException e) {
            log.warn("Invalid message id format: {}", id);
            return null;
        }
    }
}
