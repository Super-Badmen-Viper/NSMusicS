# FROM golang:1.24.0-alpine
# RUN mkdir /app
# ADD . /app
# WORKDIR /app

# RUN go build -o main cmd/main.go
# CMD ["/app/main"]

FROM golang:1.24.0-alpine AS builder
WORKDIR /app
ADD . /app
RUN go mod download
RUN CGO_ENABLED=0 go build -o main cmd/main.go
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main /app/main
COPY --from=builder /app/.env /app/.env
CMD ["/app/main"]