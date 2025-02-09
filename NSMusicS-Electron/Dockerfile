# docker pull node:20.15.0-slim
# docker logs <container_id>
# docker exec -it <container_id> node -v
# docker exec -it <container_id> npm -v

FROM node:20.15.0-slim

# 设置元数据
LABEL maintainer="https://github.com/Super-Badmen-Viper/NSMusicS"
LABEL description="NSMusicS-GO Application Container"
LABEL version="1.5.0"

# 设置工作目录
WORKDIR /app

# 设置默认环境变量
ENV NODE_ENV=production \
    ELECTRON_DISABLE_SECURITY_WARNINGS=true

# 先拷贝包管理文件并安装依赖
COPY package*.json ./

# 合并 RUN 指令并清理缓存
RUN npm config set registry https://registry.npmmirror.com && \
    apt-get update && \
    apt-get -y install libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1 && \
    npm install electron && \
    npm install && \
    npm cache clean --force && \
    rm -rf /tmp/* /var/cache/apk/*

# 拷贝应用代码
COPY . .

# 设置健康检查
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:5173 || exit 1

# 声明端口和数据卷
EXPOSE 5173
VOLUME ["/app/data"]

# 使用 exec 格式的 ENTRYPOINT
ENTRYPOINT ["sh", "-c", "npm run dev"]