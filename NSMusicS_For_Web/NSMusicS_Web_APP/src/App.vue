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
    {label: () => h(RouterLink,{to: {name: 'home',}}, { default: () => '主页' }),key: 'go-back-home',icon: renderIcon(Home28Regular)},
    {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
    {label: () => h(RouterLink,{to: {name: 'View_Album_List_ALL',}},{ default: () => '专辑' }),key: 'go-albums-list',icon: renderIcon(AlbumFilled)},
    {label: () => h(RouterLink,{to: {name: 'View_Song_List_ALL',}},{ default: () => '乐曲' }),key: 'go-songs-list',icon: renderIcon(MusicNoteRound)},
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

  import { RouterLink, RouterView, RouterViewProps } from 'vue-router'
  import Bar_Music_Player from '../src/components/Bar_Music_Player.vue'
  import View_Screen_Music_Player from '../src/views/View_Screen_Music_Player.vue'

  ////// System BrowserWindow Set
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

  ////// open view musicplayer
  import { ref,watch } from 'vue';
  const margin_top_value_view_music_player = ref(100);
  const get_send_onclick = (value:any) => margin_top_value_view_music_player.value = value
  const isVisible = ref(true);
  ////// watch监听 margin_top_value_view_music_player 的变化
  watch(isVisible, (newValue) => {
    if (newValue) {
      setTimeout(() => {
        isVisible.value = false;
      }, 200); ////// 调整动画持续时间
    }
  });

  ////// System Bind Media Info
  const this_audio_file_path = ref('');//////'C:/Users/17741/Music/G.E.M.邓紫棋 - 你把我灌醉.mp3'
  function media_file_path(value: any) {
    this_audio_file_path.value = value
    get_this_audio_refresh(true)
    console.log('this_audio_file_path：'+value)
  }
  const this_playList_num= ref(0);
  const this_audio_file_medium_image_url = ref('../../../resources/00album.png');
  function get_media_file_medium_image_url(value: any) {
    this_audio_file_medium_image_url.value = value
    get_this_audio_refresh(true)
    console.log('this_audio_file_medium_image_url'+value)

    page_top_album_image_url.value = '';
    page_top_album_image_url.value = value;
  }
  const this_audio_refresh = ref<boolean>(false)//////重播触发
  function get_this_audio_refresh(value: any) {
    this_audio_refresh.value = value;
    console.log('this_audio_refresh：'+value)
  }
  const this_audio_singer_name = ref<string>('Xiang Cheng')
  function get_this_audio_singer_name(value: any) {
    this_audio_singer_name.value = value
    console.log('this_audio_singer_name：'+value)
  }
  const this_audio_song_name = ref<string>('NSMusicS')
  function get_this_audio_song_name(value: any) {
    this_audio_song_name.value = value
    console.log('this_audio_song_name：'+value)
  }
  const this_audio_album_name = ref<string>('A local music software that is expected to support multiple platforms with AI capabilities and multimodal features.')
  function get_this_audio_album_name(value: any) {
    this_audio_album_name.value = value
    console.log('this_audio_album_name：'+value)
    page_top_album_name.value = value;
  }

  //////
  const media_Files_temporary = ref<Media_File[]>([]);////// data.slice() BUG Error: Because Init
  const media_Files_selected = ref<Media_File[]>([])
  function get_media_Files_selected(value: Media_File) {
    if (value.selected === true) {
      media_Files_temporary.value.forEach((item, index) => {
        if (item.id === value.id) {
          media_Files_temporary.value[index].selected = true;
        }
      });
      media_Files_selected.value.push(value)
      console.log('media_Files_selected：'+value.path+'  '+value.selected)
    } else {
      media_Files_temporary.value.forEach((item, index) => {
        if (item.id === value.id) {
          media_Files_temporary.value[index].selected = false;
        }
      });
      media_Files_selected.value = media_Files_selected.value.filter(item => item.id !== value.id);
      console.log('media_Files_selected：'+value.path+'  '+value.selected)
    }
  }
  const media_Files_selected_temp = ref<Media_File[]>([])
  function set_media_Files_selected(value: boolean) {
    if (value === true) {
      media_Files_temporary.value.forEach((item, index) => {
        media_Files_temporary.value[index].selected = true;
      });
      media_Files_selected.value = media_Files_temporary.value.slice();
    } else {
      media_Files_temporary.value.forEach((item, index) => {
        media_Files_temporary.value[index].selected = false;
      });
      media_Files_selected.value = [];
    }
  }
  const media_page_length = ref<number>(0);
  const media_file_count = ref<number>(0);
  //////
  const Album_Files_temporary = ref<Item_Album[]>([]);
  const album_Page_length = ref<number>(0);
  const album_file_count = ref<number>(0);
  //////
  const options_Sort_key = ref<{ columnKey: string; order: string }[]>([]);
  function get_options_Sort_key(value: { columnKey: string; order: string }[] = []) {
    if (value != null) {
      options_Sort_key.value = value;
      fetchData_Media()
    }
  }
  // 弃用
  function sortByColumnKeys(sortersArray: { columnKey: string; order: string }[] = []) {
    let sortedData = media_Files_temporary.value.slice();
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
      sortedData = media_Files_temporary.value.slice();
      sortedData.forEach((item, index) => {
        item.absoluteIndex = index + 1;
      });
    }
    media_Files_temporary.value = sortedData;
  }
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
  //////
  const keyword = ref<string>('');
  const model_num_accurate_search = ref<number>(0);
  function get_keyword(value: any) {
    if(value.indexOf('accurate_search') > 0){
      value = value.replace('accurate_search','');
      if(value.indexOf('__title__') > 0){
        value = value.replace('__title__','');
        model_num_accurate_search.value = 1;
      }else if(value.indexOf('__artist__') > 0){
        value = value.replace('__artist__','');
        model_num_accurate_search.value = 2;
      }else if(value.indexOf('__album__') > 0){
        value = value.replace('__album__','');
        model_num_accurate_search.value = 3;
      }
    }else{  
      model_num_accurate_search.value = 0;
    }
    keyword.value = value;
    console.log('keyword:' + value)
    fetchData_Media()
  }
  function get_reset_data(value: any) {
    keyword.value = '';
    console.log('reset_data?:' + value)
    fetchData_Media()
  }
  //////
  const data_select_Index = ref<number>(-1)//////绝对index
  function get_data_select_Index(value: any) {
    data_select_Index.value = value
    console.log('data_select_Index：'+value)
  }
  const page_song_index = ref(0)//////相对index
  function get_page_song_index(value: any) {
    page_song_index.value = value
    console.log('page_song_index：'+value)
  }
  // 弃用
  const media_page_num = ref<number>(1);
  function get_media_page_num(value: any) {
    media_page_num.value = value
    console.log('media_page_num：'+value)
    fetchData_Media()
  }
  const media_page_size = ref<number>(30)
  function get_media_page_size(value: number) {
    if(media_file_count.value != null)
      media_page_length.value = Math.floor(media_file_count.value / media_page_size.value) + 1
    media_page_size.value = value
    console.log('media_page_size：'+value)
    media_page_num.value = 1
    fetchData_Media()
  }
  const album_page_num = ref<number>(1)
  function get_album_page_num(value: any) {
    album_page_num.value = value
    console.log('album_page_num：'+value)
    fetchData_Album()
  }
  const album_page_size = ref<number>(30)
  function get_album_PageSize(value: any) {
    if(album_file_count.value != null)
      album_Page_length.value = Math.floor(album_file_count.value / album_page_size.value) + 1
    album_page_size.value = value
    console.log('album_PageSize：'+value)
    album_page_num.value = 1
    fetchData_Album()
  }
  //////
  const path = require('path');
  const fs = require('fs');
  function fileExists(filePath: string) {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (error: any) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
  /////
  const fetchData_Home = () => {
    
  }
  //
  const page_top_album_image_url = ref<string>('../../../resources/00album.png')
  const page_top_album_name = ref<string>('')
  const page_songlists_options = ref<{label: string;value: string}[]>([])
  const page_songlists_statistic = ref<{label: string;song_count: string;id: string;}[]>([])
  const page_songlists = ref<Play_List[]>([])
  const page_songlists_selected = ref<string>('song_list_all')
  const get_page_songlists_selected = (value: any) => {
    page_songlists_selected.value = value
    console.log('page_songlists_selected：'+value)
    fetchData_Media()
  }
  const fetchData_Media = async () => {
    let db:any = null;
    clear_Files_temporary()
    try {
      db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
      db.pragma('journal_mode = WAL');

      // load media_model data
      const stmt_media_file_count = db.prepare('SELECT COUNT(*) AS count FROM media_file');
      media_file_count.value = stmt_media_file_count.get().count;   
      if (media_file_count.value != null)
        media_page_length.value = Math.floor(media_file_count.value / media_page_size.value) + 1;
      media_Files_temporary.value.forEach((item: { absoluteIndex: any }, index: number) => {
        item.absoluteIndex = index + offset + 1;
      });
      //
      page_songlists_options.value = [];
      page_songlists_statistic.value = [];
      page_songlists.value = []
      //////
      const temp_Play_List_ALL: Play_List = {
        label: '全部歌曲',
        value: 'song_list_all',
        id: 'song_list_all',
        name: '全部歌曲',
        comment: '全部歌曲',
        duration: 0,
        song_count: stmt_media_file_count.get().count + ' 首',
        public: false,
        created_at: null,
        updated_at: null,
        path: '',
        sync: false,
        size: 0,
        rules: null,
        evaluated_at: null,
        owner_id: ''
      }
      page_songlists_options.value.push(temp_Play_List_ALL);
      page_songlists_statistic.value.push({
        label: temp_Play_List_ALL.label,
        song_count: temp_Play_List_ALL.song_count.toString(),
        id: temp_Play_List_ALL.id
      });
      page_songlists.value.push(temp_Play_List_ALL)
      //////
      const stmt_media_Annotation_Starred_Count = db.prepare(`
        SELECT COUNT(*) AS count FROM annotation 
        WHERE starred = 1 AND item_type='media_file'
      `);
      const temp_Play_List_Love: Play_List = {
        label: '收藏歌曲',
        value: 'song_list_love',
        id: 'song_list_love',
        name: '收藏歌曲',
        comment: '收藏歌曲',
        duration: 0,
        song_count: stmt_media_Annotation_Starred_Count.get().count + ' 首',
        public: false,
        created_at: null,
        updated_at: null,
        path: '',
        sync: false,
        size: 0,
        rules: null,
        evaluated_at: null,
        owner_id: ''
      }
      page_songlists_options.value.push(temp_Play_List_Love);
      page_songlists_statistic.value.push({
        label: temp_Play_List_Love.label,
        song_count: temp_Play_List_Love.song_count.toString(),
        id: temp_Play_List_Love.id
      });
      page_songlists.value.push(temp_Play_List_Love)
      //////
      const stmt_media_Annotation_Recently_Count = db.prepare(`
        SELECT COUNT(*) AS count FROM annotation 
        WHERE play_count >= 1 AND item_type='media_file'
      `);
      const temp_Play_List_Recently: Play_List = {
        label: '最近播放',
        value: 'song_list_recently',
        id: 'song_list_recently',
        name: '最近播放',
        comment: '最近播放',
        duration: 0,
        song_count: stmt_media_Annotation_Recently_Count.get().count + ' 首',
        public: false,
        created_at: null,
        updated_at: null,
        path: '',
        sync: false,
        size: 0,
        rules: null,
        evaluated_at: null,
        owner_id: ''
      }
      page_songlists_options.value.push(temp_Play_List_Recently);
      page_songlists_statistic.value.push({
        label: temp_Play_List_Recently.label,
        song_count: temp_Play_List_Recently.song_count.toString(),
        id: temp_Play_List_Recently.id
      });
      page_songlists.value.push(temp_Play_List_Recently)
      //////
      const stmt_media_Annotation_PlayList_Count = db.prepare(`
        SELECT COUNT(*) AS count FROM playlist
      `);
      page_songlists_statistic.value.push({
        label: '播放列表',
        song_count: stmt_media_Annotation_PlayList_Count.get().count + ' 组',
        id: 'song_list_all_PlayList'
      });
      //////
      
      // load media_Files_temporary data
      const offset = (media_page_num.value - 1) * media_page_size.value;
      const sortKey = options_Sort_key.value.length > 0 && options_Sort_key.value[0].order !== 'default' ?
        options_Sort_key.value[0].columnKey : 'created_at';
      const sortOrder = options_Sort_key.value.length > 0 && options_Sort_key.value[0].order !== 'default' ?
        options_Sort_key.value[0].order.replace('end', '') : '';
      let keywordFilter = keyword.value.length > 0 ?
        `WHERE title LIKE '%${keyword.value}%' OR artist LIKE '%${keyword.value}%' OR album LIKE '%${keyword.value}%'` :
        '';
      if (model_num_accurate_search.value != 0) {
        if (keywordFilter.length > 0) {
          keywordFilter = keywordFilter.replace('LIKE', '=').replace(/%/g, '');
        }
        model_num_accurate_search.value = 0;
      }

      const stmt_media_file = db.prepare(`
        SELECT id, title, artist, album, duration, path 
        FROM media_file 
        ${keywordFilter}
        ORDER BY ${sortKey} ${sortOrder}
      `);
      const stmt_album_limit_1_imagefiles = db.prepare('SELECT * FROM album LIMIT 1');
      const rows = stmt_media_file.all();
      const imagefiles = stmt_album_limit_1_imagefiles.all();

      rows.forEach((row: Media_File) => {
        row.selected = false;
        row.duration_txt = formatTime(row.duration);
        const medium_image_url = row.path.replace('mp3', 'jpg');
        if (imagefiles[0].image_files.indexOf(medium_image_url) > 0)
          row.medium_image_url = medium_image_url;
        else
          row.medium_image_url = '../../../resources/error_album.jpg';
        media_Files_temporary.value.push(row);
      });

      media_Files_temporary.value = media_Files_temporary.value.filter((item) => {
        if (page_songlists_selected.value === 'song_list_all') {
          return true;
        } else if (page_songlists_selected.value === 'song_list_love') {
          const stmt_media_Annotation_Starred_Items = db.prepare(`
            SELECT item_id FROM annotation 
            WHERE starred = 1 AND item_type='media_file'
          `);
          const annotations = stmt_media_Annotation_Starred_Items.all();
          return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
        } else if (page_songlists_selected.value === 'song_list_recently') {
          const stmt_media_Annotation_Recently_Items = db.prepare(`
            SELECT item_id FROM annotation 
            WHERE play_count >= 1 AND item_type='media_file'
          `);
          const annotations = stmt_media_Annotation_Recently_Items.all();
          return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
        } else if (page_songlists_selected.value === 'song_list_all_PlayList') {
          return true;
        }
      });

      rows.value = [];
      imagefiles.value = [];
      //////

    } catch (err: any) {
      console.error(err);
    } finally {
      db.close();
      console.log('db.close().......');
      db = null;
    }

    page_top_album_image_url.value = '';
    if(media_Files_temporary.value.length > 0)
      for (let i = 0; i < media_Files_temporary.value.length; i++) {
        if (await fileExists(media_Files_temporary.value[i].path) === true) {
          page_top_album_image_url.value = media_Files_temporary.value[i].medium_image_url;
          page_top_album_name.value = media_Files_temporary.value[i].album;
          break;  
        }
      }
    // delete require.cache[require.resolve('better-sqlite3')];
  };
  const fetchData_Album = () => {
    let moment = require('moment');
    clear_Files_temporary()
    let rows = [];
    let album_file_count_value = 0;
    let album_Page_length_value = 0;

    let db:any = null;

    try {
      db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
      db.pragma('journal_mode = WAL');

      //////   LIMIT ${album_page_size.value} 
      //////   OFFSET ${offset}`);
      const stmt_album = db.prepare(`
        SELECT id,name,embed_art_path,artist,updated_at,medium_image_url
        FROM album`);
      rows = stmt_album.all();

      rows.forEach((row: Item_Album) => {
        row.medium_image_url = row.embed_art_path.replace('mp3','jpg');

        const fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/);
        const fileNameWithExtension = fileNameMatch ? fileNameMatch[0] : null;
        const fileNameWithoutExtension = fileNameWithExtension ? fileNameWithExtension.replace(/\.[^.]+$/, '') : null;
        const fileNameWithoutPrefix = fileNameWithoutExtension ? fileNameWithoutExtension.replace(/.*?-\s*/, '') : null;

        if (fileNameWithoutPrefix !== null) {
          row.title = fileNameWithoutPrefix;
        }

        row.album_title = row.title + "<br>" + row.artist;
        row.updated_time = row.updated_at ? moment(row.updated_at, moment.ISO_8601).format('YYYY-MM-DD') : '';

        Album_Files_temporary.value.push(row);
      });
      rows.length = 0
      rows = []
      
      const stmt_album_count = db.prepare('SELECT COUNT(*) AS count FROM album');
      album_file_count_value = stmt_album_count.get().count;
      if (album_file_count_value !== null) {
        album_Page_length_value = Math.floor(album_file_count_value / album_page_size.value) + 1;
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      rows = [];
      album_file_count.value = album_file_count_value;
      album_Page_length.value = album_Page_length_value;

      db.close();
      console.log('db.close().......');
      db = null;

      moment = null;
    }

    delete require.cache[require.resolve('better-sqlite3')];
  }
  const fetchData_Artist = () => {
    
  }
  //////
  function get_router_select(value: any) {
    ////// 
    if(value === 'home'){
      fetchData_Home()
    }else if(value === 'View_Song_List_ALL'){
      fetchData_Media()
    }else if(value === 'View_Album_List_ALL'){
      fetchData_Album()
    }else if(value === 'View_Artist_List_ALL'){
      fetchData_Artist()
    }
  }
  //////
  import router from './router'
  router.beforeEach((to, from, next) => {
    keyword.value = '';
    clear_Files_temporary()
    next();
  });
  router.afterEach((to, from) => {
    clear_Files_temporary()
  });
  const clear_Files_temporary = () => {
    media_Files_temporary.value.splice(0, media_Files_temporary.value.length);
    Album_Files_temporary.value.splice(0, Album_Files_temporary.value.length);
  }
  onMounted(() => {
    
  });

  //////
  import { darkTheme } from 'naive-ui'
  import type { GlobalTheme } from 'naive-ui'
  const theme = ref<GlobalTheme | null>(null)
  const theme_bar_top_setapp = ref('transparent')
  const change_page_header_color = ref(false)
  const theme_normal_mode_click = () => {
    theme.value = null
    change_page_header_color.value = false
  }
  const theme_dark_mode_click = () => {
    theme.value = darkTheme
    change_page_header_color.value = true
  }
  //////
  import { zhCN, dateZhCN } from 'naive-ui'
  import type { NLocale, NDateLocale } from 'naive-ui'
  //////
  const locale = ref<NLocale | null>(zhCN)
  const dateLocale = ref<NDateLocale | null>(dateZhCN)
  //////
  const window_innerWidth = ref<number>(window.innerWidth)
  window.addEventListener('resize', () => {
    window_innerWidth.value = window.innerWidth;
  });
</script>
<template>
  <n-config-provider :theme="theme" :locale="locale" :date-locale="dateLocale">
    <n-message-provider>
      <n-space vertical>
        <n-layout has-sider class="this_App">
          <n-layout-sider
            class="n_layout_sider"
            show-trigger="bar"
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
                class="view_show"

                @router_select="get_router_select"

                :collapsed="collapsed"
                :window_innerWidth="window_innerWidth"
                @media_file_path="media_file_path"
                @media_file_medium_image_url="get_media_file_medium_image_url"
                @this_audio_singer_name="get_this_audio_singer_name"
                @this_audio_song_name="get_this_audio_song_name"
                @this_audio_album_name="get_this_audio_album_name"
                @data_select_Index="get_data_select_Index"
                @page_song_index="get_page_song_index"
                :media_page_num="media_page_num"
                @media_page_num="get_media_page_num"
                :media_page_size="media_page_size"
                @media_page_size="get_media_page_size"
                :media_page_length="media_page_length"
                :media_Files_temporary="media_Files_temporary"
                :media_Files_selected="media_Files_selected"
                @media_Files_selected="get_media_Files_selected"
                @media_Files_selected_temp="set_media_Files_selected"
                :options_Sort_key="options_Sort_key"
                @options_Sort_key="get_options_Sort_key"
                @keyword="get_keyword"
                @reset_data="get_reset_data"
                :page_top_album_image_url="page_top_album_image_url"
                :page_top_album_name="page_top_album_name"
                :page_songlists_options="page_songlists_options"
                :page_songlists_statistic="page_songlists_statistic"
                :page_songlists="page_songlists"
                :page_songlists_selected="page_songlists_selected"
                @page_songlists_selected="get_page_songlists_selected"
                
                :Album_Files_temporary="Album_Files_temporary"
                :album_page_num="album_page_num"
                @album_page_num="get_album_page_num"
                :album_page_size="album_page_size"
                @album_page_size="get_album_PageSize"
                :album_Page_length="album_Page_length"
                :change_page_header_color="change_page_header_color"

                :this_audio_album_name="this_audio_album_name">
                
              </RouterView>
              <div class="bar_top_setapp" :style="{ backgroundColor: theme_bar_top_setapp }">
                <section  style="
                          -webkit-app-region: no-drag;
                          width: auto;/*设置为 auto 即为单分布，100vw 为多分布(左，中，右) */
                          position: absolute;right: 0;
                          text-align:center;
                          z-index: 99;
                          ">
                          <n-button @click="() => {locale = null,dateLocale = null}">英文</n-button>
                          <n-button @click="() => {locale = zhCN,dateLocale = dateZhCN}">中文</n-button>
                          <n-button @click="theme_dark_mode_click">深色</n-button>
                          <n-button @click="theme_normal_mode_click">浅色</n-button>
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
    .n_layout_sider {
      margin: 60px 0px 80px 0px;
      border-radius: 0px 20px 20px 0px;
      border: 0px;
    }
    /* .n_layout_sider:hover {
      border: 1px solid #7FE7C4;
      box-shadow: 0 0 5px #7FE7C4;
    } */
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
      left: 160px;

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
