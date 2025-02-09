const isElectron = (
    typeof window !== 'undefined' &&
    window.navigator.userAgent.includes('Electron')
);

const openLink = (url) => {
    if (isElectron) {
        const { shell } = require('electron');
        shell.openExternal(url);
    } else {
        window.open(url, '_blank');
    }
};

export { openLink };