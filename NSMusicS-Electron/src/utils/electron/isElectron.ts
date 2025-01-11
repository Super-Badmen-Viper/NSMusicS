const isElectron = window && window.process && window.process.type === 'renderer';

console.log('isElectron:', isElectron);

let ipcRenderer = null;
if (isElectron) {
    const { ipcRenderer: electronIpcRenderer } = require('electron');
    ipcRenderer = electronIpcRenderer;
}

export { ipcRenderer, isElectron };