package com.ghanapayeng.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;

/**
 * Ghana Kanta Payeng Portfolio Backend
 * Spring Boot 3 + Spring Data JPA (MySQL) + Mail Forwarder
 */
@SpringBootApplication
@EnableAsync
public class PortfolioApplication {

    public static void main(String[] args) {
        loadDotenv();
        SpringApplication.run(PortfolioApplication.class, args);
        System.out.println("==================================================");
        System.out.println("  GHANA_OS BACKEND SYSTEM INITIALIZED (MYSQL + EMAIL)");
        System.out.println("  Listening on: http://localhost:8080");
        System.out.println("  Health Check: http://localhost:8080/api/v1/health");
        System.out.println("  Contact API:  http://localhost:8080/api/v1/contact");
        System.out.println("  Projects API: http://localhost:8080/api/v1/projects");
        System.out.println("==================================================");
    }

    /**
     * Automatically loads .env file from root or backend directory if present,
     * populating system properties before Spring Boot context initialization.
     */
    private static void loadDotenv() {
        File[] candidates = new File[]{
                new File(".env"),
                new File("../.env"),
                new File("backend/.env")
        };

        for (File file : candidates) {
            if (file.exists() && file.isFile()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                    String line;
                    int loadedCount = 0;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        if (eqIdx > 0) {
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1);
                            }
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                                loadedCount++;
                            }
                        }
                    }
                    System.out.println("[ENV] Successfully loaded " + loadedCount + " variables from " + file.getPath());
                    break;
                } catch (Exception e) {
                    System.err.println("[ENV] Warning: Error reading " + file.getPath() + ": " + e.getMessage());
                }
            }
        }
    }
}
