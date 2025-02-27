FROM nginx:1.23.3-alpine
WORKDIR /usr/share/nginx/html
COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]