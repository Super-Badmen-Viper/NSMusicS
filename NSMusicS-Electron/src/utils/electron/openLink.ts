const isElectron = window && window.process && window.process.type === 'renderer';

const openLink = (url) => {
    if (isElectron) {
        const { shell } = require('electron');
        shell.openExternal(url);
    } else {
        window.open(url, '_blank');
    }
};

export { openLink };