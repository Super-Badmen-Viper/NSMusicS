import './assets/main.css'
import './assets/global.css'
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
app.use(VueVirtualScroller)

import rate from 'vue-rate'
import 'vue-rate/dist/vue-rate.css'
app.use(rate)

import JsonViewer from 'vue-json-viewer'
app.use(JsonViewer)

import contextmenu from 'v-contextmenu'
import 'v-contextmenu/dist/themes/default.css'
app.use(contextmenu)

import { setupHammerDirective } from './utils/hammer/hammer'
setupHammerDirective(app)

import router from './router'
app.use(router)

import { Language } from '@/i18n/i18n'
const i18n = new Language().i18n
console.log(i18n.locale)
app.use(i18n)

app.mount('#app')
