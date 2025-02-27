FROM node:20.15.0-alpine
WORKDIR /app
RUN npm install -g serve --production --no-cache
COPY dist/ /app
EXPOSE $APP_PORT
CMD ["sh", "-c", "serve -s -l ${APP_PORT}"]

# NSMusicS-NodeServer
# FROM node:20.15.0-alpine
# WORKDIR /app
# RUN npm install -g serve
# COPY dist/ /app
# COPY server.js /app
# COPY nodemon.json /app
# COPY package.json /app
# EXPOSE $APP_PORT
# RUN npm install -g nodemon --production --no-cache
# RUN npm install koa koa-router @koa/cors koa-bodyparser mongodb --production --no-cache
# CMD ["sh", "-c", "serve -s -l ${APP_PORT} & nodemon server.js"]