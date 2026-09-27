package com.ghanapayeng.portfolio.service;

import com.ghanapayeng.portfolio.model.ContactMessage;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${portfolio.contact.notification-email:ghanakanta076@gmail.com}")
    private String destinationEmail;

    @Value("${spring.mail.username:}")
    private String mailSenderUser;

    @Value("${spring.mail.password:}")
    private String mailSenderPassword;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Asynchronously dispatches an executive terminal-styled email notification
     * directly to Ghana Kanta Payeng's personal inbox (ghanakanta076@gmail.com).
     */
    @Async
    public void sendContactNotification(ContactMessage message) {
        log.info("Initiating email transmission to destination: {} for message ID: #{}", destinationEmail, message.getId());

        if (mailSender == null || mailSenderPassword == null || mailSenderPassword.isBlank()) {
            log.warn("⚠️ SMTP credentials not fully configured (spring.mail.password is empty). " +
                     "Message #{} is safely saved in MySQL table 'contact_messages'. " +
                     "To activate live Gmail SMTP delivery to {}, set MAIL_PASSWORD in application.properties or environment variable.",
                     message.getId(), destinationEmail);
            return;
        }

        try {
            if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl impl) {
                if (mailSenderPassword != null) {
                    impl.setPassword(mailSenderPassword.replace(" ", ""));
                }
                if (mailSenderUser != null && !mailSenderUser.isBlank()) {
                    impl.setUsername(mailSenderUser.trim());
                }
            }

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            String fromAddress = (mailSenderUser != null && !mailSenderUser.isBlank()) 
                    ? mailSenderUser 
                    : destinationEmail;

            helper.setFrom(fromAddress, "GHANA_OS Terminal Portfolio");
            helper.setTo(destinationEmail);
            helper.setReplyTo(message.getEmail(), message.getName());
            helper.setSubject("⚡ [GHANA_OS] New Contact Transmission: " + message.getName() + " // " + message.getSubject());

            String formattedDate = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm:ss z")
                    .withZone(ZoneId.of("Asia/Kolkata"))
                    .format(message.getCreatedAt());

            String htmlBody = buildHtmlEmail(message, formattedDate);
            helper.setText(htmlBody, true);

            mailSender.send(mimeMessage);
            log.info("✅ SUCCESS: Email notification delivered to {} for contact message #{}", destinationEmail, message.getId());
        } catch (Exception ex) {
            log.error("❌ Failed to transmit email notification to {}: {}", destinationEmail, ex.getMessage(), ex);
        }
    }

    private String buildHtmlEmail(ContactMessage message, String formattedDate) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <style>
                body { margin: 0; padding: 0; background-color: #0b0f19; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e2e8f0; }
                .email-container { max-width: 650px; margin: 30px auto; background-color: #111827; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                .header-bar { background: linear-gradient(135deg, #0f172a 0%%, #1e1b4b 100%%); padding: 25px 30px; border-bottom: 2px solid #00f5ff; }
                .term-title { font-family: 'Courier New', Courier, monospace; font-size: 13px; color: #00f5ff; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 5px; }
                .header-heading { margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; }
                .badge-status { display: inline-block; background: rgba(0, 245, 255, 0.15); color: #00f5ff; border: 1px solid rgba(0, 245, 255, 0.3); font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600; margin-top: 8px; }
                .content-box { padding: 30px; }
                .meta-table { width: 100%%; border-collapse: collapse; margin-bottom: 25px; }
                .meta-table td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #1e293b; }
                .meta-label { color: #94a3b8; width: 130px; font-weight: 600; font-family: 'Courier New', monospace; }
                .meta-value { color: #f8fafc; font-weight: 500; }
                .meta-value a { color: #00f5ff; text-decoration: none; }
                .message-card { background-color: #0d131f; border-left: 4px solid #00f5ff; padding: 20px; border-radius: 6px; margin: 20px 0; }
                .message-title { font-family: 'Courier New', monospace; font-size: 12px; color: #94a3b8; margin-bottom: 10px; text-transform: uppercase; }
                .message-text { font-size: 15px; line-height: 1.6; color: #f1f5f9; white-space: pre-wrap; word-break: break-word; }
                .actions { text-align: center; margin: 30px 0 10px 0; }
                .btn-reply { display: inline-block; background: #00f5ff; color: #0a0e17; font-weight: 700; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase; }
                .footer { background-color: #090d16; padding: 20px 30px; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; font-family: 'Courier New', monospace; }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="header-bar">
                  <div class="term-title">&gt;&gt; GHANA_OS // INCOMING DISPATCH</div>
                  <h1 class="header-heading">New Portfolio Inquiry Received</h1>
                  <span class="badge-status">MYSQL TICKET #%d // DELIVERED</span>
                </div>
                <div class="content-box">
                  <table class="meta-table">
                    <tr>
                      <td class="meta-label">SENDER:</td>
                      <td class="meta-value"><strong>%s</strong></td>
                    </tr>
                    <tr>
                      <td class="meta-label">EMAIL:</td>
                      <td class="meta-value"><a href="mailto:%s">%s</a></td>
                    </tr>
                    <tr>
                      <td class="meta-label">SUBJECT:</td>
                      <td class="meta-value"><strong>%s</strong></td>
                    </tr>
                    <tr>
                      <td class="meta-label">RECEIVED:</td>
                      <td class="meta-value">%s</td>
                    </tr>
                    <tr>
                      <td class="meta-label">CLIENT IP:</td>
                      <td class="meta-value"><code>%s</code></td>
                    </tr>
                  </table>

                  <div class="message-card">
                    <div class="message-title">&gt;&gt; TRANSMISSION PAYLOAD:</div>
                    <div class="message-text">%s</div>
                  </div>

                  <div class="actions">
                    <a href="mailto:%s?subject=Re: %s" class="btn-reply">Reply to %s Directly &rarr;</a>
                  </div>
                </div>
                <div class="footer">
                  PORTFOLIO ARCHITECTURE // SPRING BOOT 3 + MYSQL PERSISTENCE<br>
                  Forwarded automatically to <strong>%s</strong>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                message.getId(),
                escapeHtml(message.getName()),
                escapeHtml(message.getEmail()),
                escapeHtml(message.getEmail()),
                escapeHtml(message.getSubject()),
                formattedDate,
                escapeHtml(message.getIpAddress() != null ? message.getIpAddress() : "UNKNOWN"),
                escapeHtml(message.getMessage()),
                escapeHtml(message.getEmail()),
                escapeHtml(message.getSubject()),
                escapeHtml(message.getName()),
                destinationEmail
            );
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input.replace("&", "&amp;")
                    .replace("<", "&lt;")
                    .replace(">", "&gt;")
                    .replace("\"", "&quot;")
                    .replace("'", "&#39;");
    }
}
