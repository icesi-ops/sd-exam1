FROM postgres:12-alpine

env POSTGRES_PASSWORD=postgres
env POSTGRES_DB=LibraryDB
COPY ./postgres.sql /docker-entrypoint-initdb.d

