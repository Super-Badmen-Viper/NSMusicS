FROM node:20.15.0-slim
WORKDIR /app
COPY package*.json ./

RUN npm config set registry https://registry.npmmirror.com && \
    apt-get update && \
    apt-get -y install libgtkextra-dev libgconf2-dev libnss3 libasound2 libxtst-dev libxss1 && \
    npm install electron && \
    npm install && \
    npm cache clean --force && \
    rm -rf /var/lib/apt/lists/*

COPY . .
EXPOSE 5173
VOLUME ["/app/data"]
ENTRYPOINT ["sh", "-c", "npm run dev"]