# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the pom.xml and download dependencies (leverage docker layer caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the build artifact from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Environment variables defaults (can be overridden at runtime)
ENV SPRING_DATA_MONGODB_URI=mongodb://admin:Gowri%401297@13.201.174.140:27017/salary_tracker_db?authSource=admin
ENV PORT=8080

# Run the spring boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
