# Build Simplify-GO Model
# FROM golang:1.24.0-alpine AS builder
# WORKDIR /app
# ADD . /app
# RUN go mod download
# RUN go build -o main cmd/main.go
# FROM alpine:latest
# WORKDIR /app
# COPY --from=builder /app/main /app/main
# COPY --from=builder /app/.env /app/.env
# CMD ["/app/main"]

# 构建阶段
FROM golang:1.24.0-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o main cmd/main.go

# 运行阶段
FROM alpine:latest

# 安装FFmpeg及依赖[3,6](@ref)
RUN apk update && \
    apk add --no-cache \
    ffmpeg \
    libc6-compat && \
    rm -rf /var/cache/apk/*

# 设置应用运行环境
WORKDIR /app
COPY --from=builder /app/main /app/main
COPY --from=builder /app/.env /app/.env

# 验证FFmpeg安装[6](@ref)
RUN ffmpeg -version

# 启动应用
CMD ["/app/main"]