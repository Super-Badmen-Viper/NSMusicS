let shortkey

const isElectron = window && window.process && window.process.type === 'renderer'

if (isElectron) {
  shortkey = require('vue3-shortkey')
} else {
  // import('vue3-shortkey').then((module) => {
  //   shortkey = module.shortkey
  // })
  shortkey = undefined
}

export { shortkey }
