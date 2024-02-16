import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import 'vfonts/Lato.css'// 通用字体
import 'vfonts/FiraCode.css'// 等宽字体
import {
    // create naive ui
    create,
    // component
    NButton
  } from 'naive-ui'
const naive = create({
    components: [NButton]
  })//全局安装

const app = createApp(App)

app.use(router)
app.use(naive)

app.mount('#app')