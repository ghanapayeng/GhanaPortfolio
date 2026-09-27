# GHANA_OS Backend Architecture & API Documentation

## Overview
Full-stack production architecture powered by **Spring Boot 3 (Java 17+)**, **Spring Data JPA**, and **MySQL / TiDB Cloud**, with asynchronous **Gmail SMTP mail forwarding**.

The backend serves both:
1. **REST APIs**: `http://localhost:8080/api/v1/...`
2. **Static Web Application**: `http://localhost:8080/` (served directly from `src/main/resources/static`)

---

## Directory Structure
```
GhanaPortfolio/
├── src/
│   ├── main/
│   │   ├── java/com/ghanapayeng/portfolio/
│   │   │   ├── config/            # WebMvc & CORS Configuration
│   │   │   ├── controller/        # REST API Controllers (Contact, Projects, Health)
│   │   │   ├── dto/               # Data Transfer Objects & Validation
│   │   │   ├── exception/         # Global Exception Handlers
│   │   │   ├── loader/            # Seed Data Loader
│   │   │   ├── model/             # JPA Entities (ContactMessage, Project, Skill, VisitorLog)
│   │   │   ├── repository/        # Spring Data JPA Repositories
│   │   │   ├── service/           # Business Logic & Async Gmail EmailService
│   │   │   └── PortfolioApplication.java # Spring Boot Entry Point + .env Loader
│   │   └── resources/
│   │       ├── static/            # Frontend Assets (HTML, CSS, JS, Media)
│   │       ├── templates/         # Server-side HTML templates (if needed)
│   │       ├── application-dev.properties
│   │       ├── application-local.properties
│   │       └── application.properties
│   └── test/java/com/ghanapayeng/portfolio/
├── .env                           # Local Secrets & Credentials (git-ignored)
├── .env.example                   # Public Environment Template
├── .gitignore                     # Git ignore rules
├── BACKEND.md                     # Backend API & Systems Guide
├── Dockerfile                     # Containerization specification
├── HELP.md                        # Maven & Spring Boot reference
├── mvnw & mvnw.cmd                # Maven Wrapper executables
├── pom.xml                        # Maven Dependencies & Build Config
└── README.md                      # Project Overview
```

---

## Quick Start

### 1. Configure Credentials
Copy `.env.example` to `.env` and configure your credentials:
```bash
cp .env.example .env
```

### 2. Run the Application
Using the Maven Wrapper:
```bash
./mvnw spring-boot:run
```

Or using standard Maven:
```bash
mvn spring-boot:run
```

Access the application in your browser:
- **Web Portfolio**: [http://localhost:8080](http://localhost:8080)
- **Health Check**: [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health)
- **Contact API**: [http://localhost:8080/api/v1/contact](http://localhost:8080/api/v1/contact)

---

## API Reference

### 1. Health Status
- **Endpoint**: `GET /api/v1/health`
- **Response**:
```json
{
  "status": "UP",
  "database": "MySQL / TiDB",
  "mailForwarding": "Active (ghanakanta076@gmail.com)",
  "system": "GHANA_OS // PORTFOLIO BACKEND",
  "developer": "Ghana Kanta Payeng",
  "version": "2.6.4"
}
```

### 2. Contact Inquiries & Direct Email
- **Endpoint**: `POST /api/v1/contact`
- **Request Body**:
```json
{
  "name": "Alex Vance",
  "email": "alex@example.com",
  "subject": "Collaboration / Inquiry",
  "message": "Hello Ghana, I loved your portfolio..."
}
```
- **Actions**:
  1. Stores record into MySQL table `contact_messages`.
  2. Dispatches cyber-themed HTML email to `ghanakanta076@gmail.com` via Gmail SMTP asynchronously.
