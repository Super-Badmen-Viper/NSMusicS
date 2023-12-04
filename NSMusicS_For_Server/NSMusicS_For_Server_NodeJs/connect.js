//npm install -g http-server
//nodemon

const { exec } = require('child_process');
const crypto = require('crypto');

// 定义要使用的端口号和用户名密码
const port = 9999;
const username = 'nsmusics_admin';
const password = 'nsmusics_admin_123';

// 生成密码的哈希值
const hash = crypto.createHash('sha256').update(password).digest('hex');
const authCredentials = `${username}:${hash}`;

// 启动带密码验证的 WebDev 服务
const startWebDevServer = () => {
  exec(`http-server -p ${port} --auth ${authCredentials}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`WebDev server failed to start: ${error.message}`);
      return;
    }
    console.log(`WebDev server is running on port ${port}`);
  });
};

// 调用函数启动 WebDev 服务器
startWebDevServer();