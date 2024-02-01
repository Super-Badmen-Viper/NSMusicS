<script setup lang="ts">
  import { RouterLink, RouterView } from 'vue-router'
  import Bar_Music_Player from '../src/components/Bar_Music_Player.vue'

  // System BrowserWindow Set
  const { ipcRenderer } = require('electron');
  function minimize() {
    ipcRenderer.send('window-min');
  }
  function maximize() {
    ipcRenderer.send('window-max');
  }
  function closeWindow() {
    ipcRenderer.send('window-close');
  }
  // function minimize() {
  //   Electron.ipcRenderer.send('window-min');
  // }
  // function maximize() {
  //   Electron.ipcRenderer.send('window-max');
  // }
  // function closeWindow() {
  //   Electron.ipcRenderer.send('window-close');
  // }

  // open view musicplayer
  import { ref,watch } from 'vue';
  const margin_top_value_view_music_player = ref(100);
  const get_send_onclick = (value:any) => margin_top_value_view_music_player.value = value
  const isVisible = ref(true);
  // watch监听 margin_top_value_view_music_player 的变化
  watch(isVisible, (newValue) => {
    if (newValue) {
      setTimeout(() => {
        isVisible.value = false;
      }, 200); // 调整动画持续时间
    }
  });

  // System Theme Color
  const this_App_background_color = ref('#FFFFFF');

</script>

<template>
  <div class="this_App" :style="{ backgroundColor:this_App_background_color }">
    <div class="bar_select_view">
      <div class="wrapper">
        <nav>
          <RouterLink class="routerLink" to="/">我的收藏</RouterLink>
          <RouterLink class="routerLink" to="/about">本地音乐</RouterLink>
          <RouterLink class="routerLink" to="/">自定义歌单</RouterLink>
          <RouterLink class="routerLink" to="/about">About</RouterLink>
          <RouterLink class="routerLink" to="/">Home</RouterLink>
          <RouterLink class="routerLink" to="/about">About</RouterLink>
        </nav>
      </div>
    </div>

    <div class="bar_top_setapp">
      <section  style="
                -webkit-app-region: no-drag;
                width: auto;/*设置为 auto 即为单分布，100vw 为多分布(左，中，右) */
                position: absolute;right: 0;
                text-align:center;
                z-index: 99;
                ">
                <div type="button" class="win_close" @click="closeWindow"></div>
                <div type="button" class="win_max" @click="maximize"></div>
                <div type="button" class="win_min" @click="minimize"></div>
      </section>
    </div>

    <RouterView class="view_show" />

    <div class="view_music_player" 
        v-if="isVisible"
        :style="{ height: `calc(100vh - ${margin_top_value_view_music_player}vh)` }">
    </div>

  
    <Bar_Music_Player 
        @on-click="get_send_onclick" />
  </div>
</template>

<style scoped>
/*Auto：当min-width < 512px*/
    .bar_select_view {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 60px;
    }
    .bar_select_view .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }
    .view_show {
      position: fixed;
      top: 60px;
      left: 0;
      width: 100vw;
      height: 100vh;
      margin-left: 0px;   
    }
    .bar_top_setapp{
      width: 60px;
      height: 60px;
      position: fixed;
      top: 0;
      right: 0;
      -webkit-app-region: drag;
    }
    nav {
      width: 100%;
      text-align: left;
      margin-top: 2rem;
    }
    nav a.router-link-exact-active {
      color: var(--color-text);
    }
    nav a.router-link-exact-active:hover {
      background-color: transparent;
    }
    nav a {
      display: inline-block;
      padding: 0 1rem;
      border-left: 1px solid var(--color-border);
    }
    nav a:first-of-type {
      border: 0;
    }

/*当min-width >= 512px*/
@media screen and (min-width: 512px) {
    .this_App{
      width: 100vw;
      height: 100vh;
      position: absolute;
      top: 0;left: 0;
    }
    .bar_select_view {
      width: 180px;
      height: 100vh;
      position: absolute;
      left: 0;top: 0;
    }
    .bar_select_view .wrapper {
      display: flex;
      place-items: flex-wrap;
      padding-right: calc(var(--section-gap) / 2);
      flex-wrap: wrap;  
      margin-top: 70px;
      margin-left: 30px;
    }
    .bar_select_view .wrapper .routerLink{
      width: 150px;
      height: 36px;
      text-align: left;
      padding-top: 4px;
      padding-left: 40px;
      margin-top: 10px;
      border-radius: 10px;

      background-image: url('../src/assets/logo.svg');
      background-repeat: no-repeat;
      background-size: 20px;
      background-position:10%;

      cursor: default;
      user-select: none;
    }
    .view_show {
      width: 100vw;
      height: 100vh;

      top: 60px;
      left: 200px;

      position: fixed;
    }
    .view_music_player{
      width: 100vw;height: 100vh;
      z-index: 10;
      position: absolute;bottom: 0;left: 0;
      transition: height 0.2s;

      background-image: url(../src/assets/2024-01-26_203351.png);
      background-size: 100vw auto;
      background-repeat: no-repeat;
      background-position: center;
    }
    .view_music_player-active {
      height: 100vh;
    }
    .bar_top_setapp{
      width: 100vw;
      height: 60px;

      z-index: 1;

      position: fixed;
      top: 0;
      left: 200px;

      -webkit-app-region: drag;
    }
    .win_min {
      float: right;
      margin-top: 20px;
      margin-right: 20px;
      width: 20px;
      height: 20px;
      border-radius: 15px;
      opacity: 0.8;
      background-color:#2BCB3B;
    }
    .win_max {
      float: right;
      margin-top: 20px;
      margin-right: 20px;
      width: 20px;
      height: 20px;
      border-radius: 15px;
      opacity: 0.8;
      background-color: #FEB732;
    }
    .win_close {
      float: right;
      margin-top: 20px;
      margin-right: 220px;
      width: 20px;
      height: 20px;
      border-radius: 15px;
      opacity: 0.8;
      background: #FE5F58;
    }
    nav {
      text-align: center;
      margin-left: -1rem;
      font-size: 1rem;

      padding: 1rem 0;
      margin-top: 1rem;
    }
}
</style>
