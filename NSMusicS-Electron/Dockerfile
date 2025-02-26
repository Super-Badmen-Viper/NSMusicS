FROM node:20.15.0-alpine
WORKDIR /app
RUN npm install -g serve
COPY dist/ /app
EXPOSE $APP_PORT
CMD ["sh", "-c", "serve -s -l ${APP_PORT}"]