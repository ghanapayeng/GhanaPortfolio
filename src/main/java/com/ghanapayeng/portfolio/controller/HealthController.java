package com.ghanapayeng.portfolio.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("system", "GHANA_OS // PORTFOLIO BACKEND");
        health.put("version", "2.6.4");
        health.put("database", "MySQL");
        health.put("mailForwarding", "Active (ghanakanta076@gmail.com)");
        health.put("developer", "Ghana Kanta Payeng");
        health.put("timestamp", Instant.now().toString());
        return ResponseEntity.ok(health);
    }
}
