# ⚡ GHANA_OS // Terminal Portfolio & Distributed Microservices

[![Java](https://img.shields.io/badge/Java-25%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Gmail SMTP](https://img.shields.io/badge/Direct_Email-ghanakanta076%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ghanakanta076@gmail.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![CSS Glassmorphism](https://img.shields.io/badge/CSS3-Terminal_Glassmorphism-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![License](https://img.shields.io/badge/Status-Active%20Engineering-brightgreen?style=for-the-badge)](#)

> An ultra-modern, high-performance portfolio engineered with a **Terminal CLI simulator**, **Glassmorphic architecture**, **interactive command shell**, **Java Spring Boot 3 backend**, **MySQL database**, and **direct Gmail notification dispatch** to `ghanakanta076@gmail.com`. Designed and built by **Ghana Kanta Payeng**.

---

## 🌟 Visual Preview & Aesthetics

The portfolio combines **cyberpunk brutalist terminal typography**, **frosted glassmorphic panels (`backdrop-filter: blur(16px)`)**, a **real interactive terminal command line**, and **responsive layouts** across smartphones and PCs.

```
+-----------------------------------------------------------------------------------+
| TERMINAL // GHANA_OS v2.6.4 >> FULL STACK ENGINEER >> DIBRUGARH UNIV (CSE '27)    |
|-----------------------------------------------------------------------------------|
|      [ <HOME>_ ]   [ <TERMINAL_CLI>_ ]   [ <PROJECTS>_ ]   [ <CONNECT>_ ]         |
|                                                                                   |
|  GHANA KANTA PAYENG >_                                                     [2026] |
|  A DEVELOPER THAT PUTS HIGH-PERFORMANCE CODE FIRST                                |
|                                                                                   |
|  $ launch_cli --interactive    $ view_projects --featured    $ cat resume.pdf     |
+-----------------------------------------------------------------------------------+
```

---

## 🚀 Key Features

1. **Interactive Terminal CLI Engine**:
   - Built-in command interpreter supporting:
     - `help`: Interactive command guide
     - `projects` / `ls`: List projects with live execution triggers
     - `run blood-bridge`: Run simulation of the Blood Bridge backend & emergency matching
     - `run url-shortener`: Benchmark URL redirection microservice (12ms latency)
     - `skills`: ASCII tech matrix & capabilities
     - `neofetch`: Ghana OS system architecture and specs
     - `theme <cyber|matrix|amber|hacker|blood>`: Real-time visual theme switcher
     - `contact`: Jump to connection terminal and display contact options
     - `sudo hire-me`: Easter egg direct recruitment authorization
   - Tab key auto-completion & Arrow-key command history.
   - Built-in Web Audio API mechanical keyboard sound synthesizer.
   - Virtual keypad for smartphone touchscreen users.

2. **Featured Projects**:
   - **Blood Bridge**: Emergency blood donation network connecting donors, recipients, and hospital blood banks in real-time with inventory tracking.
   - **URL Shortener Microservice**: Distributed URL redirection engine with Base62 hashing, Redis caching, and MySQL click analytics.
   - **Distributed Engineering Systems**: Multi-threaded socket networking and relational schema models.

3. **"Connect With Me" Form + Direct Email Forwarding**:
   - Interactive glassmorphic terminal at the bottom of the page.
   - Direct asynchronous payload transmission to Java Spring Boot REST API (`POST /api/v1/contact`).
   - Persists inquiries safely into **MySQL table `contact_messages`**.
   - Asynchronously forwards an executive cyberpunk-styled HTML email directly to **`ghanakanta076@gmail.com`**.
   - Includes `Reply-To` visitor header so clicking "Reply" in your inbox responds straight to the sender!
   - Intelligent offline fallback with local storage buffering and 1-click direct mail dispatch.

4. **Production Java Spring Boot 3 + MySQL Backend**:
   - Clean layered architecture:
     - **Entities**: JPA models with relational indexes and constraints.
     - **Repositories**: `JpaRepository` with custom query methods.
     - **Services**: `ContactService`, `ProjectService`, and `EmailService`.
     - **Controllers**: Clean REST endpoints with input validation (`jakarta.validation`).
   - Automated startup database seeder (`DatabaseSeeder.java`).

---

## 📁 Repository Directory Structure

```
GhanaPortfolio/
├── frontend/                        # Client-Side Application (HTML, CSS, JS, Assets)
│   ├── index.html                   # Main terminal-glass portfolio page
│   ├── assets/                      # Media & documents
│   │   ├── images/                  # Project screenshots, certificates, gallery
│   │   ├── icons/                   # Tech logos (Java, MySQL, React, Python...)
│   │   ├── docs/                    # Resume / CV PDF
│   │   └── videos/                  # Memories MP4 video
│   ├── css/
│   │   └── terminal-glass.css       # Glassmorphism & Terminal Design System
│   └── js/
│       ├── terminal.js              # Interactive CLI simulator, commands, sound synth
│       └── app.js                   # Matrix rain, scroll spy, 3D tilt, API client
├── backend/                         # Java Spring Boot 3 Backend
│   ├── pom.xml                      # Maven configuration (JPA, MySQL, Mail)
│   └── src/main/java/com/ghanapayeng/portfolio/
│       ├── config/                  # WebMvcConfig (CORS)
│       ├── controller/              # ContactController, ProjectController, HealthController
│       ├── dto/                     # ContactRequestDTO, ApiResponse
│       ├── exception/               # GlobalExceptionHandler, ResourceNotFoundException
│       ├── loader/                  # DatabaseSeeder (Auto-seeds projects & skills into MySQL)
│       ├── model/                   # ContactMessage, Project, VisitorLog, Skill (JPA Entities)
│       ├── repository/              # Spring Data JPA Repositories
│       └── service/                 # ContactService, ProjectService, EmailService
└── README.md                        # Documentation
```

---

## ⚡ Quick Start Guide

### 1. Run the Frontend Portfolio:
Simply open `frontend/index.html` in any browser or launch a local preview server:
```bash
cd frontend
python3 -m http.server 5173
```
Visit `http://localhost:5173`.

### 2. Configure & Run Spring Boot Backend:
Ensure MySQL is running. Configure credentials in `backend/src/main/resources/application.properties` or provide environment variables:

```bash
cd backend

# Optional: set MySQL and Gmail App Password (for direct email to ghanakanta076@gmail.com)
export SPRING_DATASOURCE_PASSWORD="your-mysql-password"
export MAIL_PASSWORD="your-16-char-gmail-app-password"

mvn clean compile
mvn spring-boot:run
```
The backend will launch on `http://localhost:8080`.

Test the health endpoint:
```bash
curl http://localhost:8080/api/v1/health
```

---

## 👤 Author
**Ghana Kanta Payeng**  
* B.Tech Computer Science & Engineering, Dibrugarh University (2023 - 2027)
* Email: [ghanakanta076@gmail.com](mailto:ghanakanta076@gmail.com)
* GitHub: [@ghanapayeng](https://github.com/ghanapayeng)
* LinkedIn: [ghana-payeng](https://www.linkedin.com/in/ghana-payeng)
* Portfolio: [github.com/ghanapayeng/GhanaPortfolio](https://github.com/ghanapayeng/GhanaPortfolio)
