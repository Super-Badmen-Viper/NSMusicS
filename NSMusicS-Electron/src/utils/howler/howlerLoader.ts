let Howl

const isElectron = window && window.process && window.process.type === 'renderer'

if (isElectron) {
  Howl = require('howler').Howl
} else {
  import('howler').then((module) => {
    Howl = module.Howl
  })
}

export { Howl }
