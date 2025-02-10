# 使用更小的基础镜像
FROM golang:1.23.3-alpine

# 设置元数据
LABEL maintainer="https://github.com/Super-Badmen-Viper/NSMusicS"
LABEL description="NSMusicS-GO Backend Container"
LABEL version="1.5.0"

# 设置工作目录
WORKDIR /app

# 拷贝项目代码
COPY . .

# 下载依赖项
RUN go mod download

# 构建应用
RUN go build -o main cmd/main.go

# 设置默认命令
CMD ["/app/main"]