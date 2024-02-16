<script setup lang="ts">
  import { h, Component } from 'vue'
  import { NIcon } from 'naive-ui'
  import type { MenuOption } from 'naive-ui'
  import {
    BookOutline as BookIcon,
    PersonOutline as PersonIcon,
    WineOutline as WineIcon,
    HomeOutline as HomeIcon,
  } from '@vicons/ionicons5'
  function renderIcon (icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
  const menuOptions: MenuOption[] = [
    {
      label: '九歌',
      icon: () => h(NIcon, null, { default: () => h(HomeIcon) }),
      props: {
        style: {
          height:'100px',marginTop:'20px'
        }
      }
    },
    {
      key: 'divider-1',
      type: 'divider',
      props: {
        style: {
          marginLeft: '0px',marginTop:'20px'
        }
      }
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'home',
            }
          },
          { default: () => 'Home' }
        ),
      key: 'go-back-home',
      icon: renderIcon(HomeIcon)
    },
    {
      key: 'divider-1',
      type: 'divider',
      props: {
        style: {
          marginLeft: '22px'
        }
      }
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'View_Song_List_Love',
            }
          },
          { default: () => '我的收藏' }
        ),
      key: 'go-View_Song_List_Love',
      icon: renderIcon(HomeIcon)
    },
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'View_Song_List_ALL',
            }
          },
          { default: () => '本地音乐' }
        ),
      key: 'go-View_Song_List_ALL',
      icon: renderIcon(HomeIcon)
    },
    {
      label: '舞，舞，舞',
      key: 'dance-dance-dance',
      icon: renderIcon(BookIcon),
      children: [
        {
          type: 'group',
          label: '人物',
          key: 'people',
          children: [
            {
              label: '叙事者',
              key: 'narrator',
              icon: renderIcon(PersonIcon)
            },
            {
              label: '羊男',
              key: 'sheep-man',
              icon: renderIcon(PersonIcon)
            }
          ]
        },
        {
          label: '饮品',
          key: 'beverage',
          icon: renderIcon(WineIcon),
          children: [
            {
              label: '威士忌',
              key: 'whisky'
            }
          ]
        },
        {
          label: '食物',
          key: 'food',
          children: [
            {
              label: '三明治',
              key: 'sandwich'
            }
          ]
        },
        {
          label: '过去增多，未来减少',
          key: 'the-past-increases-the-future-recedes'
        }
      ]
    },
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => 'Other' }),key: 'go-Other',icon: renderIcon(HomeIcon)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => 'Other' }),key: 'go-Other',icon: renderIcon(HomeIcon)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => 'Other' }),key: 'go-Other',icon: renderIcon(HomeIcon)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => 'Other' }),key: 'go-Other',icon: renderIcon(HomeIcon)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => 'Other' }),key: 'go-Other',icon: renderIcon(HomeIcon)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => 'Other' }),key: 'go-Other',icon: renderIcon(HomeIcon)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => 'Other' }),key: 'go-Other',icon: renderIcon(HomeIcon)},
  ]
  const collapsed = ref(false)
  const activeKey = ref<string | null>(null)

  import { RouterLink, RouterView } from 'vue-router'
  import Bar_Music_Player from '../src/components/Bar_Music_Player.vue'
  import View_Screen_Music_Player from '../src/views/View_Screen_Music_Player.vue'
  import Bar_Left_Select_Area from '../src/views/bar/Bar_Left_Select_Area.vue'

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

  // System Bind Media Info
  const this_audio_file_path = ref('');//'C:/Users/17741/Music/G.E.M.邓紫棋 - 你把我灌醉.mp3'
  function media_file_path(value: any) {
    this_audio_file_path.value = value
    get_this_audio_refresh(true)
    console.log('this_audio_file_path：'+value)
  }
  const this_audio_refresh = ref<boolean>(false)
  function get_this_audio_refresh(value: any) {
    this_audio_refresh.value = value;
    console.log('this_audio_refresh：'+value)
  }
  const this_audio_singer_name = ref<string>('G.E.M 邓紫棋')
  function get_this_audio_singer_name(value: any) {
    this_audio_singer_name.value = value
    console.log('this_audio_singer_name：'+value)
  }
  const this_audio_song_name = ref<string>('你把我灌醉')
  function get_this_audio_song_name(value: any) {
    this_audio_song_name.value = value
    console.log('this_audio_song_name：'+value)
  }
  const this_audio_album_name = ref<string>('The Best of G.E.M. 2008 - 2012 (Deluxe Version)')
  function get_this_audio_album_name(value: any) {
    this_audio_album_name.value = value
    console.log('this_audio_album_name：'+value)
  }

  //
  const data_select_Index = ref<number>(-1)//绝对index
  function get_data_select_Index(value: any) {
    data_select_Index.value = value
    console.log('data_select_Index：'+value)
  }
  //
  const page_song_index = ref(0)//相对index
  function get_page_song_index(value: any) {
    page_song_index.value = value
    console.log('page_song_index：'+value)
  }
  //
  const page_num = ref<Media_File[]>([]);
  function get_page_num(value: any) {
    page_num.value = value
    console.log('page：'+value)
  }
  //
  const media_Files = ref<Media_File[]>([]);
  function get_media_Files(value: Media_File[]) {
    media_Files.value = value
    console.log('media_Files：'+media_Files.value)
  }
  const media_PageFiles = ref<Media_File[]>([]);
  function get_media_PageFiles(value: Media_File[]) {
    media_PageFiles.value = value
    console.log('media_PageFiles：'+media_PageFiles.value)
  }
  //
</script>
<template>
  <n-message-provider>
    <div class="this_App" :style="{ backgroundColor:this_App_background_color }">
      <n-space vertical>
        <!-- <n-switch v-model:value="collapsed" /> -->
        <n-layout has-sider>
          <n-layout-sider
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :collapsed="collapsed"
            show-trigger
            @collapse="collapsed = true"
            @expand="collapsed = false"
          >
            <n-menu
              v-model:value="activeKey"
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
            />
          </n-layout-sider>
          <n-layout>
            <RouterView 
              class="view_show" 
              @media_file_path="media_file_path"
              @this_audio_singer_name="get_this_audio_singer_name"
              @this_audio_song_name="get_this_audio_song_name"
              @this_audio_album_name="get_this_audio_album_name"
              @data_select_Index="get_data_select_Index"
              @page_song_index="get_page_song_index"
              @page_num="get_page_num"
              @media_Files="get_media_Files"
              @media_PageFiles="get_media_PageFiles"/>
          </n-layout>
        </n-layout>
      </n-space>
      <!-- <div class="bar_select_view">
        <div class="wrapper">
          <span class="select_view_area_1">☊-♪-我的音乐--------------------------</span>
          <nav>
            <RouterLink class="routerLink" to="/View_Song_List_Love">我的收藏</RouterLink>
            <RouterLink class="routerLink" to="/View_Song_List_ALL">本地音乐</RouterLink>
            <RouterLink class="routerLink" to="/">自定义歌单</RouterLink>
          </nav>
        </div>
      </div> -->

      <View_Screen_Music_Player 
        class="view_music_player" 
        v-if="isVisible"
        :style="{ height: `calc(100vh - ${margin_top_value_view_music_player}vh)` }">

      </View_Screen_Music_Player>

      <Bar_Music_Player 
        :this_audio_file_path="this_audio_file_path"
        :this_audio_refresh="this_audio_refresh"
        @this_audio_refresh="get_this_audio_refresh"
        :this_audio_singer_name="this_audio_singer_name"
        :this_audio_song_name="this_audio_song_name"
        :this_audio_album_name="this_audio_album_name"
        @on-click="get_send_onclick" />

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
    </div>
  </n-message-provider>
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
      margin-left: 0px;
      width: 200px;
    }
    .bar_select_view .wrapper .select_view_area_1{
      margin-left: 30px;margin-top: 30px;
      color: #646B7C;
      font-size: 10px;text-wrap: nowrap;
    }
    .bar_select_view .wrapper nav{
      margin-top: -4px;
      margin-left: 20px;
    }
    .bar_select_view .wrapper .routerLink{
      width: 150px;
      height: 36px;
      text-align: left;
      padding-top: 4px;
      padding-left: 40px;
      border-radius: 10px;

      /* background-image: url('../src/assets/logo.svg');
      background-repeat: no-repeat;
      background-size: 20px;
      background-position:10%; */

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

      /* background-image: url(../src/assets/2024-01-26_203351.png);
      background-size: 100vw auto;
      background-repeat: no-repeat;
      background-position: center; */
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
