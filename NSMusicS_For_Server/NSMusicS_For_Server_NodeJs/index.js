const fs = require('fs');
const path = require('path');

function getAudioFilePaths(directoryPath) {
  const audioFilePaths = [];

  // 递归遍历文件夹
  function traverseDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        traverseDirectory(filePath); // 递归遍历子文件夹
      } else if (stat.isFile()) {
        const extname = path.extname(filePath);

        // 判断文件是否为音频文件（可以根据具体需求进行修改）
        if (extname === '.mp3' || extname === '.wav' || extname === '.flac') {
          audioFilePaths.push(filePath);
        }
      }
    }
  }

  traverseDirectory(directoryPath);

  return audioFilePaths;
}

// 获取命令行参数中的文件夹路径
const directoryPath = process.argv[2];

if (!directoryPath) {
  console.error('Please provide the directory path as a command line argument.');
  process.exit(1);
}

// 获取指定文件夹内的所有音频文件路径
const audioFiles = getAudioFilePaths(directoryPath);

// 映射为网络路径
const networkPaths = audioFiles.map(filePath => {
  const filename = path.basename(filePath);
  const networkPath = `http://119.136.113.131/${filename}`; // 替换为你的服务器域名和路径
  return networkPath;
});

// 创建 XML 文件内容
const xmlContent = `<paths>
  ${networkPaths.map(networkPath => `<path>${networkPath}</path>`).join('\n  ')}
</paths>`;

// 将 XML 内容写入文件
fs.writeFile('This_Server_Music.xml', xmlContent, err => {
  if (err) {
    console.error('Error writing XML file:', err);
  } else {
    console.log('XML file written successfully.');
  }
});