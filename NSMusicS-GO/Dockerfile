# Build -GO Model
# FROM golang:1.24.0-alpine
# RUN mkdir /app
# ADD . /app
# WORKDIR /app
# RUN go build -o main cmd/main.go
# CMD ["/app/main"]

# Build Simplify-GO Model
FROM golang:1.24.0-alpine AS builder
WORKDIR /app
ADD . /app
RUN go mod download
RUN go build -o main cmd/main.go
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main /app/main
COPY --from=builder /app/.env /app/.env
CMD ["/app/main"]