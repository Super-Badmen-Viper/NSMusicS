#!/bin/sh

# 替换 Nginx 配置模板中的变量
envsubst '${NGINX_PORT} ${BACKEND_SERVICE}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# 验证配置
nginx -t || exit 1

# 执行原始命令
exec "$@"