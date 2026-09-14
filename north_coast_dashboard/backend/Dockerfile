FROM maven:3.9.16-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml ./
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
RUN groupadd --system northcoast && useradd --system --gid northcoast northcoast
COPY --from=build /app/target/north-coast-api-0.0.1-SNAPSHOT.jar /app/app.jar
USER northcoast
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=60.0 -XX:+UseSerialGC -XX:+ExitOnOutOfMemoryError"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
