// 定义一个状态位，表示当前是否是 Electron 环境
const isElectron = window && window.process && window.process.type === 'renderer';

// 动态加载 webFrame
let webFrame = null;
if (isElectron) {
    const { webFrame: electronWebFrame } = require('electron');
    webFrame = electronWebFrame;
} else {
    console.log('当前不是 Electron 环境，不加载 webFrame');
}

const clearCache = () => {
    if (isElectron && webFrame) {
        webFrame.clearCache();
    } else {
        console.log('当前不是 Electron 环境，无法清除缓存');
    }
};

export { clearCache };