# Сборка
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml ./
COPY src/ src/
RUN mvn clean package -DskipTests
# Запуск
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/focusbuddy-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
