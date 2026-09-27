package com.ghanapayeng.portfolio.loader;

import com.ghanapayeng.portfolio.model.Project;
import com.ghanapayeng.portfolio.model.Skill;
import com.ghanapayeng.portfolio.repository.ProjectRepository;
import com.ghanapayeng.portfolio.repository.SkillRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Automatically seeds the MySQL database with initial portfolio projects & skills
 * if the tables are currently empty.
 */
@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;

    public DatabaseSeeder(ProjectRepository projectRepository, SkillRepository skillRepository) {
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    public void run(String... args) {
        seedProjectsIfEmpty();
        seedSkillsIfEmpty();
    }

    private void seedProjectsIfEmpty() {
        if (projectRepository.count() == 0) {
            log.info("Initializing MySQL database with default featured projects (Blood Bridge, URL Shortener)...");

            Project bloodBridge = new Project(
                    "blood-bridge",
                    "Blood Bridge",
                    "HEALTHCARE // EMERGENCY",
                    "Life-saving emergency blood donation platform linking donors with urgent hospital requests and real-time blood bank inventory tracking.",
                    Arrays.asList("Java Spring Boot", "MySQL", "React.js", "WebSocket", "Geolocation"),
                    "https://github.com/ghanapayeng/blood-bridge",
                    "#projects",
                    "assets/images/blood-bridge-preview.jpg",
                    true,
                    1
            );

            Project urlShortener = new Project(
                    "url-shortener",
                    "URL Shortener Microservice",
                    "DISTRIBUTED // CACHE",
                    "High-concurrency URL shortening service with sub-15ms redirection latency, Base62 encoding, custom aliases, QR generator, and click analytics.",
                    Arrays.asList("Java Spring Boot", "Spring Data JPA", "MySQL", "Redis Cache", "React / Glass UI"),
                    "https://github.com/ghanapayeng/url-shortener",
                    "#projects",
                    "assets/images/url-shortener-preview.jpg",
                    true,
                    2
            );

            Project distributedSystems = new Project(
                    "distributed-engineering-systems",
                    "Distributed Engineering Systems",
                    "DISTRIBUTED SYSTEMS // LAB",
                    "Core systems programming, low-latency socket pipelines, and relational schema optimization models.",
                    Arrays.asList("C / C++", "Java 25", "MySQL", "Linux OS"),
                    "https://github.com/ghanapayeng",
                    "#projects",
                    "assets/images/project1.jpg",
                    true,
                    3
            );

            projectRepository.saveAll(Arrays.asList(bloodBridge, urlShortener, distributedSystems));
            log.info("Successfully seeded 3 projects into MySQL 'projects' table.");
        }
    }

    private void seedSkillsIfEmpty() {
        if (skillRepository.count() == 0) {
            log.info("Initializing MySQL 'skills' table with core stack competencies...");

            List<Skill> skills = Arrays.asList(
                    new Skill("Java", "BACKEND", 92, "assets/icons/java-logo.png"),
                    new Skill("Spring Boot", "BACKEND", 90, "assets/icons/java-logo.png"),
                    new Skill("MySQL", "DATABASE", 88, "assets/icons/logo-mysql-mysql-logo-png-images-are-download-crazypng-21.png"),
                    new Skill("React.js", "FRONTEND", 82, "assets/icons/react-logo.png"),
                    new Skill("Node.js", "BACKEND", 80, "assets/icons/node-logo.png"),
                    new Skill("Python", "BACKEND", 78, "assets/icons/python-logo.png"),
                    new Skill("C / C++", "TOOLS", 85, "assets/icons/c-plus-programming-language-emblem-vector-30039389.jpg")
            );

            skillRepository.saveAll(skills);
            log.info("Successfully seeded {} skills into MySQL 'skills' table.", skills.size());
        }
    }
}
