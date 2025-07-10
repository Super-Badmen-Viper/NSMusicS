const isElectron = typeof window !== 'undefined' && window.navigator.userAgent.includes('Electron')

let webFrame = null
if (isElectron) {
  const { webFrame: electronWebFrame } = require('electron')
  webFrame = electronWebFrame
}

const clearCache = () => {
  if (isElectron && webFrame) {
    webFrame.clearCache()
  }
}

export { clearCache }
