# ==========================================
# BUILD STAGE
# ==========================================

FROM eclipse-temurin:17-jdk-jammy AS build

WORKDIR /app

# Copy Maven wrapper and project configuration
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Make Maven wrapper executable
RUN chmod +x mvnw

# Copy source code
COPY src src

# Build Spring Boot application
RUN ./mvnw clean package -DskipTests


# ==========================================
# RUNTIME STAGE
# ==========================================

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy the generated Spring Boot JAR
COPY --from=build /app/target/*.jar app.jar

# Render provides the PORT environment variable
EXPOSE 10000

# Start Spring Boot using Render's PORT
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-10000}"]