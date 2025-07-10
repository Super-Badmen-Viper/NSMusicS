let ALAC
let AV

const isElectron = window && window.process && window.process.type === 'renderer'

if (isElectron) {
  ALAC = require('alac')
  AV = require('av')
} else {
  import('alac').then((module) => {
    ALAC = module.ALAC
  })
  import('av').then((module) => {
    AV = module.AV
  })
}

export { ALAC, AV }
