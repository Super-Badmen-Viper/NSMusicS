import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
const app = createApp(App)

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
app.use(VueVirtualScroller)

import rate from 'vue-rate'
import 'vue-rate/dist/vue-rate.css'
app.use(rate)

import contextmenu from 'v-contextmenu'
import 'v-contextmenu/dist/themes/default.css'
app.use(contextmenu)

import { Language } from "@/i18n/i18n";
const i18n = new Language().i18n;
console.log(i18n.locale)
app.use(i18n);

app.use(router)
app.mount('#app')