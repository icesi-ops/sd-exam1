FROM golang:1.21.1

WORKDIR /app

COPY . .

RUN go build -o bin ./src/cmd/server/

ENTRYPOINT ["/app/bin"]