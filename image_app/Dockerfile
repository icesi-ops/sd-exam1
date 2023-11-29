FROM maven:3.6.0-jdk-8-alpine AS build
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
RUN mvn -f /usr/src/app/pom.xml clean package

FROM openjdk:8-jdk-alpine
COPY --from=build /usr/src/app/target/image_app-1.0-SNAPSHOT.jar /usr/app/image_app-1.0-SNAPSHOT.jar
EXPOSE 8083
ENV APP_PORT=8083
ENTRYPOINT ["java","-jar","/usr/app/image_app-1.0-SNAPSHOT.jar"]
