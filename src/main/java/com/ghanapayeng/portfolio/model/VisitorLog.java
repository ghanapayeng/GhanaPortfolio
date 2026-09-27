package com.ghanapayeng.portfolio.model;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * JPA Entity representing visitor telemetry & page views.
 * Persisted in MySQL table: visitor_logs
 */
@Entity
@Table(
    name = "visitor_logs",
    indexes = {
        @Index(name = "idx_visitor_timestamp", columnList = "timestamp")
    }
)
public class VisitorLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    private String path;

    @Column(name = "ip_hash", length = 64)
    private String ipHash;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(length = 255)
    private String referrer;

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    @PrePersist
    public void prePersist() {
        if (this.timestamp == null) {
            this.timestamp = Instant.now();
        }
    }

    public VisitorLog() {
    }

    public VisitorLog(String path, String ipHash, String userAgent, String referrer) {
        this.path = path;
        this.ipHash = ipHash;
        this.userAgent = userAgent;
        this.referrer = referrer;
        this.timestamp = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getIpHash() {
        return ipHash;
    }

    public void setIpHash(String ipHash) {
        this.ipHash = ipHash;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getReferrer() {
        return referrer;
    }

    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
