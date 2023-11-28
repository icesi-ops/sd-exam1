FROM golang:1.21.1

WORKDIR /app

ENV BACKEND_PORT=8005

COPY . .

RUN go build -o bin ./src/cmd/server/

ENTRYPOINT ["/app/bin"]