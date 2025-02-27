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

# Build Vue-GO Model
# FROM golang:1.24.0-alpine AS go-builder
# WORKDIR /app
# COPY . .
# RUN go mod download && \
#     go build -o main cmd/main.go
# FROM node:20.15.0-alpine
# WORKDIR /app
# COPY --from=go-builder /app/main /app/main
# COPY --from=go-builder /app/.env /app/.env
# RUN npm install -g serve
# COPY dist/ /app/dist

# RUN echo $'#!/bin/sh\n\
# /app/main &\n\
# serve -s -l ${APP_PORT:-5173} /app/dist\n\
# ' > /app/start.sh && \
#     chmod +x /app/start.sh

# EXPOSE 8089 5173 27017

# CMD ["/app/start.sh"]