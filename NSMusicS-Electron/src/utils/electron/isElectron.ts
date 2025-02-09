const isElectron = (
    typeof window !== 'undefined' &&
    window.navigator.userAgent.includes('Electron')
);

console.log('isElectron:', isElectron);

let ipcRenderer = null;
if (isElectron) {
    const { ipcRenderer: electronIpcRenderer } = require('electron');
    ipcRenderer = electronIpcRenderer;
}

export {ipcRenderer, isElectron};