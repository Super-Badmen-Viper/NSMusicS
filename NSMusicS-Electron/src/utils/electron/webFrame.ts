const isElectron = window && window.process && window.process.type === 'renderer';

let webFrame = null;
if (isElectron) {
    const { webFrame: electronWebFrame } = require('electron');
    webFrame = electronWebFrame;
}

const clearCache = () => {
    if (isElectron && webFrame) {
        webFrame.clearCache();
    }
};

export { clearCache };