<script setup lang="ts">
  import { h, Component, onMounted } from 'vue'
  import { NIcon } from 'naive-ui'
  import type { MenuOption } from 'naive-ui'
  import {
    Home28Regular,
    Flag16Regular,
    SlideMicrophone32Regular,
    DocumentHeart20Regular,
    TextIndentIncreaseLtr20Filled as lyric,
    PeopleCommunity16Regular
  } from '@vicons/fluent'
  import {
    AlbumFilled,
    MusicNoteRound,
    LibraryMusicOutlined
  } from '@vicons/material'
  import {
    UserAvatarFilledAlt,
    Hearing,
  } from '@vicons/carbon'
  function renderIcon (icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
  const menuOptions: MenuOption[] = [
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'home',
            }
          },
          { default: () => '主页' }
        ),
      key: 'go-back-home',
      icon: renderIcon(Home28Regular)
    },
    {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
    {
      label: () =>
        h(
          RouterLink,
          {
            to: {
              name: 'View_Album_List_ALL',
            }
          },
          { default: () => '专辑' }
        ),
      key: 'go-albums-list',
      icon: renderIcon(AlbumFilled)
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
          { default: () => '乐曲' }
        ),
      key: 'go-songs-list',
      icon: renderIcon(MusicNoteRound)
    },
    {label: () => h(RouterLink,{to: {name: 'View_Artist_List_ALL',}},{ default: () => '艺术家' }),key: 'go-artist-list',icon: renderIcon(UserAvatarFilledAlt)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => '流派' }),key: 'go-Other',icon: renderIcon(Flag16Regular)},
    {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => '猜你喜欢' }),key: 'go-Other',icon: renderIcon(DocumentHeart20Regular)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => 'K歌' }),key: 'go-Other',icon: renderIcon(SlideMicrophone32Regular)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => '听歌识曲' }),key: 'go-Other',icon: renderIcon(Hearing)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => '乐谱生成' }),key: 'go-Other',icon: renderIcon(LibraryMusicOutlined)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => '歌词制作' }),key: 'go-Other',icon: renderIcon(lyric)},
    {label: () => h(RouterLink,{to: {name: 'home',}},{ default: () => '音乐社区' }),key: 'go-Other',icon: renderIcon(PeopleCommunity16Regular)},
  ]
  const collapsed = ref(false)
  const activeKey = ref<string | null>(null)

  import { RouterLink, RouterView } from 'vue-router'
  import Bar_Music_Player from '../src/components/Bar_Music_Player.vue'
  import View_Screen_Music_Player from '../src/views/View_Screen_Music_Player.vue'

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
  // const this_App_background_color = ref('#FFFFFF');

  // System Bind Media Info
  const this_audio_file_path = ref('');//'C:/Users/17741/Music/G.E.M.邓紫棋 - 你把我灌醉.mp3'
  function media_file_path(value: any) {
    this_audio_file_path.value = value
    get_this_audio_refresh(true)
    console.log('this_audio_file_path：'+value)
  }
  const this_playList_num= ref(0);
  const this_audio_file_medium_image_url = ref('');
  function get_media_file_medium_image_url(value: any) {
    this_audio_file_medium_image_url.value = value
    get_this_audio_refresh(true)
    console.log('this_audio_file_medium_image_url'+value)
  }
  const this_audio_refresh = ref<boolean>(false)//重播触发
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
  const page_Size = ref<number>(10)
  function get_page_Size(value: number) {
    page_Size.value = value
    console.log('page_Size：'+value)
  }
  const page_num = ref<Media_File[]>([]);
  function get_page_num(value: any) {
    page_num.value = value
    console.log('page：'+value)
  }
  const album_page_num = ref<number>(1)
  function get_album_page_num(value: any) {
    album_page_num.value = value
    console.log('album_page_num：'+value)

    Album_Files_temporary.value = Album_Files.value.slice(
      (value - 1) * album_page_Size.value,
      (value - 1) * album_page_Size.value + album_page_Size.value
    );
  }
  const album_page_Size = ref<number>(30)
  function get_album_page_Size(value: any) {
    album_page_Size.value = value
    console.log('album_page_Size：'+value)

    Album_Files_temporary.value = Album_Files.value.slice(
      0,
      album_page_Size.value
    );
  }
  //
  const media_Files = ref<Media_File[]>([]);
  const media_Files_temporary = ref<Media_File[]>([]);// data.slice() BUG Error: Because Init
  const Album_Files = ref<Item_Album[]>([]);
  const Album_Files_temporary = ref<Item_Album[]>([]);
  const Album_PageCount = ref<number>();
  //
  const options_Sort_key = ref<{ columnKey: string; order: string }[]>([]);
  function get_options_Sort_key(value: { columnKey: string; order: string }[] = []) {
    if (value != null) {
      options_Sort_key.value = value;
      sortByColumnKeys(value);
    }
  }
  //
  function formatTime(currentTime: number): string {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;

    let formattedMinutes = String(minutes);
    let formattedSeconds = String(seconds);

    if(formattedMinutes.length == 1)
      formattedMinutes = '0' + formattedMinutes;
    formattedMinutes = formattedMinutes.replace('.','');
    formattedMinutes = formattedMinutes.substring(0, 2);

    formattedSeconds = formattedSeconds.substring(0,formattedSeconds.indexOf('.'));
    if(formattedSeconds.length == 1)
      formattedSeconds = '0' + formattedSeconds;
    formattedSeconds = formattedSeconds.substring(0, 2);

    return `${formattedMinutes}:${formattedSeconds}`;
  }
  function sortByColumnKeys(sortersArray: { columnKey: string; order: string }[] = []) {
    let sortedData = media_Files_temporary.value.slice(); // 克隆数组以避免直接修改原数组
    let bool_default = false;
    for (let i = 0; i < sortersArray.length; i++) {
      sortedData = sortedData.sort((a, b) => {
        const columnKey = sortersArray[i].columnKey;
        const order = sortersArray[i].order;
        const valueA = (a as any)[columnKey];
        const valueB = (b as any)[columnKey];

        if (valueA !== valueB) {
          return order === 'ascend' ? (valueA < valueB ? -1 : 1) : (valueA > valueB ? -1 : 1);
        }
        return 0;
      });
    }
    sortedData.forEach((item, index) => {
      item.absoluteIndex = index + 1;
    });
    if (sortersArray.length === 0 || bool_default) {
      sortedData = media_Files.value.slice(); // 恢复原始数据
      sortedData.forEach((item, index) => {
        item.absoluteIndex = index + 1;
      });
    }
    media_Files_temporary.value = sortedData;
  }
  function get_keyword(value: any) {
    media_Files_temporary.value = media_Files.value.filter((item: Media_File) => {
      const { title, artist, album, path } = item;
      const lowerValue = value.toLowerCase();
      return title.toLowerCase().includes(lowerValue) ||
        artist.toLowerCase().includes(lowerValue) ||
        album.toLowerCase().includes(lowerValue) ||
        path.toLowerCase().includes(lowerValue);
    });
    media_Files_temporary.value.forEach((item: Media_File, index: number) => {
      item.absoluteIndex = index + 1;
    });
  }
  function get_reset_data(value: any) {
    media_Files_temporary.value = media_Files.value.slice();
    media_Files_temporary.value.forEach((item: Media_File, index: number) => {
      item.absoluteIndex = index + 1;
    });
  }
  const fetchData = async () => {
    media_Files.value = []; // 清空数组
    const moment = require('moment');
    let path = require('path');
    let Database = require('better-sqlite3');
    let dbPath = path.resolve('resources/navidrome.db');
    let db = new Database(dbPath, { verbose: console.log }); 
    try {
      let stmt_media_file = db.prepare(`SELECT * FROM media_file`);
      let stmt_album = db.prepare(`SELECT * FROM album`);
      let rows = stmt_media_file.all();
      let imagefiles = stmt_album.all();
      for (let row of rows) {
        row.duration_txt = formatTime(row.duration);
        let medium_image_url = row.path.replace('mp3','jpg');
        if(imagefiles[0].image_files.indexOf(medium_image_url) > 0)
          row.medium_image_url = medium_image_url

        media_Files.value.push(row);
      }
      rows = []

      const stmt = db.prepare(`SELECT * FROM album`);
      rows = stmt.all();
      rows.forEach((row: Item_Album) => {
        row.medium_image_url = row.embed_art_path.replace('mp3','jpg');
        let fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/);
        let fileNameWithExtension: string | null = fileNameMatch ? fileNameMatch[0] : null;
        let fileNameWithoutExtension: string | null = fileNameWithExtension ? fileNameWithExtension.replace(/\.[^.]+$/, '') : null;
        const fileNameWithoutPrefix: string | null = fileNameWithoutExtension ? fileNameWithoutExtension.replace(/.*?-\s*/, '') : null;
        if(fileNameWithoutPrefix != null)
          row.title = fileNameWithoutPrefix;
        row.album_title = row.title+"<br>"+row.artist
        row.updated_time = row.updated_at ? moment(row.updated_at, moment.ISO_8601).format('YYYY-MM-DD') : '';

        Album_Files.value.push(row);
      });
    } catch (err: any) {
      console.error(err.message);
    } finally {
      db.close();
    }
  };
  onMounted(async () => {
    await fetchData().then(() => {
      media_Files.value.forEach((item: { absoluteIndex: any }, index: number) => {
        item.absoluteIndex = index + 1;
      });
      media_Files_temporary.value = media_Files.value.slice();
      this_playList_num.value = media_Files_temporary.value.length;

      Album_Files_temporary.value = Album_Files.value.slice(0,30);
      Album_PageCount.value = Math.floor(Album_Files.value.length / album_page_Size.value) + 1
    });
  });

  //
  import { darkTheme } from 'naive-ui'
  import type { GlobalTheme } from 'naive-ui'
  const theme = ref<GlobalTheme | null>(null)
  //
  import { zhCN, dateZhCN } from 'naive-ui'
  import type { NLocale, NDateLocale } from 'naive-ui'
  const locale = ref<NLocale | null>(null)
  const dateLocale = ref<NDateLocale | null>(null)
  //
  const window_innerWidth = ref<number>(window.innerWidth)
  window.addEventListener('resize', () => {
    window_innerWidth.value = window.innerWidth;
  });
</script>
<template>
  <n-config-provider :theme="theme" :locale="locale" :date-locale="dateLocale">
    <n-message-provider>
      <!-- :style="{ backgroundColor:this_App_background_color }" -->
      <n-space vertical>
          <!-- <n-switch v-model:value="collapsed" /> -->
        <n-layout has-sider class="this_App">
          <n-layout-sider
            class="n_layout_sider"
            bordered
            show-trigger
            collapse-mode="width"
            :collapsed-width="64"
            :width="160"
            :collapsed="collapsed"
            @collapse="collapsed = true"
            @expand="collapsed = false">
            <n-menu
              v-model:value="activeKey"
              :collapsed="collapsed"
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"/>
            </n-layout-sider>
            <n-layout embedded style="height: calc(100vh - 80px);">
              <RouterView
                class="view_show" v-slot="{ Component }"
                :collapsed="collapsed"
                :window_innerWidth="window_innerWidth"
                @media_file_path="media_file_path"
                @media_file_medium_image_url="get_media_file_medium_image_url"
                @this_audio_singer_name="get_this_audio_singer_name"
                @this_audio_song_name="get_this_audio_song_name"
                @this_audio_album_name="get_this_audio_album_name"
                @data_select_Index="get_data_select_Index"
                @page_song_index="get_page_song_index"
                @page_num="get_page_num"
                @page_Size="get_page_Size"
                :media_Files="media_Files"
                :media_Files_temporary="media_Files_temporary"
                :options_Sort_key="options_Sort_key"
                @options_Sort_key="get_options_Sort_key"
                @keyword="get_keyword"
                @reset_data="get_reset_data"
                
                :Album_Files="Album_Files"
                :Album_Files_temporary="Album_Files_temporary"
                :Album_PageCount="Album_PageCount"
                @album_page_num="get_album_page_num"
                @album_page_Size="get_album_page_Size">
              </RouterView>
              <div class="bar_top_setapp">
                <section  style="
                          -webkit-app-region: no-drag;
                          width: auto;/*设置为 auto 即为单分布，100vw 为多分布(左，中，右) */
                          position: absolute;right: 0;
                          text-align:center;
                          z-index: 99;
                          ">
                          <n-button @click="() => {locale = null,dateLocale = null}">英文</n-button>
                          <n-button @click="() => {locale = zhCN,dateLocale = dateZhCN}">中文</n-button>
                          <n-button @click="theme = darkTheme">深色</n-button>
                          <n-button @click="theme = null">浅色</n-button>
                          <div type="button" class="win_close" @click="closeWindow"></div>
                          <div type="button" class="win_max" @click="maximize"></div>
                          <div type="button" class="win_min" @click="minimize"></div>
                </section>
              </div>
          </n-layout>
        </n-layout>
        <n-layout-footer
          position="absolute"
          bordered>
          <Bar_Music_Player 
            :this_audio_file_path="this_audio_file_path"
            :this_playList_num="this_playList_num"
            :this_audio_file_medium_image_url="this_audio_file_medium_image_url"
            :this_audio_refresh="this_audio_refresh"
            @this_audio_refresh="get_this_audio_refresh"
            :this_audio_singer_name="this_audio_singer_name"
            :this_audio_song_name="this_audio_song_name"
            :this_audio_album_name="this_audio_album_name"
            @on-click="get_send_onclick" />
        </n-layout-footer>
      </n-space>
      <View_Screen_Music_Player 
        class="view_music_player" 
        v-if="isVisible"
        :style="{ height: `calc(100vh - ${margin_top_value_view_music_player}vh)` }">

      </View_Screen_Music_Player>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped>
/*Auto：当min-width < 512px*/

/*当min-width >= 512px*/
@media screen and (min-width: 512px) {
    .this_App{
      width: 100vw;
      height: 100vh;
      position: absolute;
      top: 0;left: 0;
    }
    .n_layout_sider{
      margin:60px 0px 80px 0px;
    }
    .view_show {
      width: calc(100vw - 100px);
      height: calc(100vh - 200px);

      margin-top: 60px;
      margin-left: 30px;
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
