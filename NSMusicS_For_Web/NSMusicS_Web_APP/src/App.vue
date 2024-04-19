<script setup lang="ts">
  import { h, onMounted } from 'vue'
  import { NIcon } from 'naive-ui'
  import type { MenuOption } from 'naive-ui'
  import {
    Home28Regular,
    Flag16Regular,
    SlideMicrophone32Regular,
    DocumentHeart20Regular,
    TextIndentIncreaseLtr20Filled as lyric,
    PeopleCommunity16Regular,
    ArrowMinimize16Regular,Maximize16Regular,ColorBackground20Regular,
    AddSquareMultiple20Regular,Delete16Regular
  } from '@vicons/fluent'
  import {
    AlbumFilled,
    MusicNoteRound,
    LibraryMusicOutlined
  } from '@vicons/material'
  import {
    UserAvatarFilledAlt,
    Hearing,
    Close,Settings,Menu as MenuIcon,
  } from '@vicons/carbon'
  function renderIcon (icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
  // Prohibiting the use of trigger events in this Naive UI menu item will cause Vue in RouterView Internal error in Js, 
  // try to use native Vue.js operation RouterLink as much as possible
  const menuOptions: MenuOption[] = [
    {label: () => h(RouterLink,{to: {name: 'home',}}, { default: () => '主页' }),key: 'go-back-home',icon: renderIcon(Home28Regular)},
    {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
    {label: () => h(RouterLink,{to: {name: 'View_Album_List_ALL',}},{ default: () => '专辑' }),key: 'go-albums-list',icon: renderIcon(AlbumFilled)},
    {label: () => h(RouterLink,{to: {name: 'View_Song_List_ALL',}},{ default: () => '乐曲' }),key: 'go-songs-list',icon: renderIcon(MusicNoteRound)},
    {label: () => h(RouterLink,{to: {name: 'View_Artist_List_ALL',}},{ default: () => '歌手' }),key: 'go-artist-list',icon: renderIcon(UserAvatarFilledAlt)},
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
  const menu_select_activeKey = ref<string | null>(null)

  import { RouterLink, RouterView } from 'vue-router'
  import Bar_Music_Player from '../src/components/Bar_Music_Player.vue'
  import Bar_Music_PlayList from '../src/components/Bar_Music_PlayList.vue'
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
  const player_show_click = ref(false);
  const get_player_show_click = (value:any) => {
    player_show_click.value = value
    console.log('player_show_click：'+value)
  }
  const margin_top_value_view_music_player = ref(100);
  const view_music_player_show = ref(false)
  const view_music_player_show_complete = ref(true)
  const get_send_onclick = (value:any) => {
    view_music_player_show_complete.value = false

    if(value === 0)
      view_music_player_show.value = true
    setTimeout(() => {
      margin_top_value_view_music_player.value = value
      setTimeout(() => {
        if(value === 0){
          theme_app.value = darkTheme
        }else{
          theme_app.value = theme.value
          view_music_player_show.value = false
        }
      }, 200);
    }, 30);

    // Vue UI WYSIWYG
    setTimeout(() => {
      if(value === 0){
        router_select_model_album.value = false;
        router_select_model_media.value = false;
        router_select_model_artist.value = false;
      }else{
        if(menu_select_activeKey.value === 'go-albums-list'){
          router_select_model_album.value = true;
        }else if(menu_select_activeKey.value === 'go-songs-list'){
          router_select_model_media.value = true;
        }else if(menu_select_activeKey.value === 'go-artist-list'){
          router_select_model_artist.value = true;
        }
      }

      view_music_player_show_complete.value = true
    }, 400);
  }
  ////// open bar musicplaylist
  const isVisible_Music_PlayList = ref(false);
  const get_isVisible_Music_PlayList = (value:any) => {
    isVisible_Music_PlayList.value = value
    console.log('isVisible_Music_PlayList：'+value)
  }
  ////// open bar player sounde effects
  const isVisible_Player_Sound_effects = ref(false);
  const get_isVisible_Player_Sound_effects = (value:any) => {
    isVisible_Player_Sound_effects.value = value
    console.log('isVisible_Player_Sound_effects：'+value)
  }

  ////// System Bind Media Info
  const path = require('path');
  const fs = require('fs');
  import { Audio_Players } from '../src/models/song_Audio_Out/Audio_Players';
  let player = new Audio_Players();
  function get_player(value: Audio_Players) {
    player.releaseMemory(true);

    player = value
    console.log('player：'+value)
  }
  const currentTime_added_value = ref(0);
  function get_currentTime_added_value(value: any) {
    currentTime_added_value.value = value
    console.log('currentTime_added_value：'+value)
  }
  //
  const this_audio_file_path_from_playlist = ref(false);
  const fetchData_This_AlbumOrArtist_PlayMedia_Model = ref<boolean>(false);
  function get_this_audio_file_path_from_playlist (value: any) {
    this_audio_file_path_from_playlist.value = value
    console.log('this_audio_file_path_from_playlist：'+value)
  }
  const this_audio_file_path = ref('');
  function media_file_path(value: any) {
    this_audio_file_path.value = value
    get_this_audio_refresh(true)
    console.log('this_audio_file_path：'+value)
    //
    if(this_audio_file_path_from_playlist.value === false){
      playlist_Files_temporary.value = [];
      playlist_Files_temporary.value = [...media_Files_temporary.value];
    }
    //
  }
  function get_this_audio_file_path(value: any) {
    this_audio_file_path.value = value
    console.log('this_audio_file_path：'+value)
  }
  const this_audio_lyrics_string = ref<string>('')
  const this_audio_lyrics_info_line = ref<string[]>([])
  const this_audio_lyrics_info_time = ref<number[]>([])
  const this_audio_lyrics_info_line_num = ref(28)// Prevent page up movement caused by scrolling lyrics based on block: center
  function get_this_audio_lyrics_string(value: any) {
    // this_audio_lyrics_info_line_num.value = Math.floor(window.innerHeight / 50) - 9;

    this_audio_lyrics_string.value = value
    // split lyrics
    this_audio_lyrics_info_line.value = []
    for (let i = 0; i < this_audio_lyrics_info_line_num.value; i++) {
      this_audio_lyrics_info_line.value.push('')
    }
    this_audio_lyrics_info_time.value = []
    //
    let line_all = value.split('\n')
    let line_times = []
    for (let i = 0; i < line_all.length; i++) {
      let line = line_all[i].split(']')
      if (line.length > 1) {
        line_times.push(line[0].replace('[', ''))
        this_audio_lyrics_info_line.value.push(line[1])
      }
    }
    for (let i = 0; i < this_audio_lyrics_info_line_num.value; i++) {
      this_audio_lyrics_info_line.value.push('')
    }
    //
    for (let i = 0; i < line_times.length; i++) {
      this_audio_lyrics_info_time.value[i] = convertToMilliseconds(line_times[i]);
    }
    //
    // console.log('this_audio_lyrics：'+value)
  }
  const play_go_index_time = ref(0);
  function get_play_go_index_time(value: any) {
    play_go_index_time.value = value
    console.log('get_play_go_index_time：'+value)
  }
  function convertToMilliseconds(timeString: { split: (arg0: string) => [any, any] }) {
    const [minutes, seconds] = timeString.split(':');
    const totalMilliseconds = (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
    return totalMilliseconds;
  }
  //////
  const this_audio_file_medium_image_url = ref(path.resolve('resources/error_album.jpg'));
  function get_media_file_medium_image_url(value: any) {
    this_audio_file_medium_image_url.value = value
    get_this_audio_refresh(true)
    console.log('this_audio_file_medium_image_url'+value)

    page_songlists_top_album_image_url.value = '';
    page_songlists_top_album_image_url.value = value;
    page_albumlists_top_album_image_url.value = '';
    page_albumlists_top_album_image_url.value = value;
    page_artistlists_top_artist_image_url.value = '';
    page_artistlists_top_artist_image_url.value = value;
  }
  const this_audio_refresh = ref<boolean>(false)//////restart play media
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
    page_songlists_top_album_name.value = value;
    page_albumlists_top_album_name.value = value;
    page_artistlists_top_artist_name.value = value;
  }
  const this_audio_album_id = ref<string>('')
  function get_this_audio_album_id(value: any) {
    this_audio_album_id.value = value
    console.log('this_audio_album_id：'+value)
    page_songlists_top_album_id.value = value;
    page_albumlists_top_album_id.value = value;
    page_artistlists_top_artist_id.value = value;
  }
  //////
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
  //////
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
  const router_history_data = ref<Router_date[]>([]);
  const fetchData_Home = () => {
    
  }
  // media model
  const media_Files_temporary = ref<Media_File[]>([]);////// data.slice() BUG Error: Because Init
  const media_Files_selected = ref<Media_File[]>([])
  function set_media_Files_selected(value: Media_File) {
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
  function set_media_Files_selected_all(value: boolean) {
    media_Files_temporary.value.forEach((item, index) => {
      media_Files_temporary.value[index].selected = value;
    });
    if (value === true) {
      media_Files_selected.value = media_Files_temporary.value.slice();
    } else {
      media_Files_selected.value = [];
    }
    console.log('media_Files_selected：'+value)
  }
  ////// page_songlists
  const page_songlists_top_album_image_url = ref<string>(path.resolve('resources/error_album.jpg'))
  const page_songlists_top_album_id = ref<string>('')
  const page_songlists_top_album_name = ref<string>('')
  const page_songlists_options = ref<{label: string;value: string}[]>([])
  const page_songlists_statistic = ref<{label: string;song_count: string;id: string;}[]>([])
  const page_songlists = ref<Play_List[]>([])
  const page_songlists_selected = ref<string>('song_list_all')
  const page_songlists_keyword_reset = ref<boolean>(false)
  const page_songlists_keyword = ref<string>('');
  const page_songlists_get_keyword_model_num = ref<number>(0);
  const page_songlists_options_Sort_key = ref<{ columnKey: string; order: string }[]>([]);
  function get_page_songlists_options_Sort_key(value: { columnKey: string; order: string }[] = []) {
    if (value != null) {
      page_songlists_options_Sort_key.value = value;
      fetchData_Media()
    }
  }
  function page_songlists_get_keyword(value: any) {
    if(value.indexOf('accurate_search') > 0){
      value = value.replace('accurate_search','');
      if(value.indexOf('__title__') > 0){
        value = value.replace('__title__','');
        page_songlists_get_keyword_model_num.value = 1;
        find_music_model.value = true;
      }else if(value.indexOf('__artist__') > 0){
        value = value.replace('__artist__','');
        page_songlists_get_keyword_model_num.value = 2;
        
      }else if(value.indexOf('__album__') > 0){
        value = value.replace('__album__','');
        page_songlists_get_keyword_model_num.value = 3;
        find_music_model.value = true;
      }      
    }else{  
      page_songlists_get_keyword_model_num.value = 0;
      find_music_model.value = false;
    }
    page_songlists_keyword.value = value;
    page_songlists_keyword_reset.value = true;
    console.log('page_songlists_keyword:' + value)
    fetchData_Media()
  }
  function page_songlists_get_reset_data(value: any) {
    page_songlists_keyword.value = '';
    find_music_model.value = false;
    console.log('page_songlists_reset_data?:' + value)
    fetchData_Media()

    router_history_datas_of_Media.value = [];
    if(router_select_history_date_of_Media.value){
      router_select_history_date_of_Media.value.id = 1;
      router_history_datas_of_Media.value.push(router_select_history_date_of_Media.value);
    }
  }
  const get_page_songlists_selected = (value: any) => {
    page_songlists_selected.value = value
    console.log('page_songlists_selected：'+value)
    fetchData_Media()
  }
  const fetchData_Media = async () => {     
    let db:any = null;
    // clear RouterView of vue-virtual-scroller data
    if(fetchData_This_AlbumOrArtist_PlayMedia_Model.value === true){
      fetchData_This_AlbumOrArtist_PlayMedia_Model.value = false;
    }else{
      clear_Files_temporary()
      router_select_model_media.value = true;
    }

    try {
      db = require('better-sqlite3')(navidrome_db);
      db.pragma('journal_mode = WAL');
      let stmt_media_file = null;
      let stmt_media_file_string = '';

      // load media_model data
      try{
        const stmt_media_file_count = db.prepare('SELECT COUNT(*) AS count FROM media_file');
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
      }catch (err: any) {
        console.error(err);
      }
      //////
      
      // load media_Files_temporary data
      if(router_history_model_of_Media.value === 0){
        const sortKey = page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
          page_songlists_options_Sort_key.value[0].columnKey : 'id';
        const sortOrder = page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
          page_songlists_options_Sort_key.value[0].order.replace('end', '') : '';
        let keywordFilter = page_songlists_keyword.value.length > 0 ?
          `WHERE title LIKE '%${page_songlists_keyword.value}%' OR artist LIKE '%${page_songlists_keyword.value}%' OR album LIKE '%${page_songlists_keyword.value}%'` :
          '';
        if (find_music_model.value === true){
          keywordFilter = `WHERE album_id = '${page_songlists_keyword.value}'`
          find_music_model.value = false;
        }else if(find_artist_model.value === true){
          keywordFilter = `WHERE artist_id = '${page_songlists_keyword.value}'`
          find_artist_model.value = false;
        }else{
          if (page_songlists_get_keyword_model_num.value != 0) {
            if (keywordFilter.length > 0) {
              keywordFilter = keywordFilter.replace('LIKE', '=').replace(/%/g, '');
            }
            page_songlists_get_keyword_model_num.value = 0;
          }
        }
        stmt_media_file_string = `
          SELECT id, title, artist,artist_id, album,album_id, duration, path ,lyrics
          FROM media_file 
          ${keywordFilter}
          ORDER BY ${sortKey} ${sortOrder}
        `;
        stmt_media_file = db.prepare(stmt_media_file_string);
        try{ // if stmt_media_file is empty, then try to find artist_id or album_id
          if(stmt_media_file.get() === undefined){
            keywordFilter = `WHERE artist_id = '${page_songlists_keyword.value}'`
            stmt_media_file_string = `
              SELECT id, title, artist,artist_id, album,album_id, duration, path ,lyrics
              FROM media_file 
              ${keywordFilter}
              ORDER BY ${sortKey} ${sortOrder}
            `;
            stmt_media_file = db.prepare(stmt_media_file_string);
            if(stmt_media_file.get() === undefined){
              keywordFilter = `WHERE album_id = '${page_songlists_keyword.value}'`
              stmt_media_file_string = `
                SELECT id, title, artist,artist_id, album,album_id, duration, path ,lyrics
                FROM media_file 
                ${keywordFilter}
                ORDER BY ${sortKey} ${sortOrder}
              `;
              stmt_media_file = db.prepare(stmt_media_file_string);
            }
          }
        }catch (err: any) {
          console.error(err);
        }
        //////
        if (router_select_history_date_of_Media.value && page_songlists_keyword_reset.value === true){
          remove_router_history_of_Media(router_select_history_date_of_Media.value.id);// 若存在新操作，则覆盖后续的路由
          page_songlists_keyword_reset.value = false;
        }
        const routerDate: Router_date = {
          id: router_history_datas_of_Media.value ? router_history_datas_of_Media.value.length + 1 : 1,
          menu_select_active_key: 'go-songs-list',
          router_name: 'View_Song_List_ALL',
          router_select_model_media: true,
          router_select_model_album: false,
          router_select_model_artist: false,
          page_lists_keyword: page_songlists_keyword.value,
          stmt_string: stmt_media_file_string,
          page_lists_selected: page_songlists_selected.value,
          columnKey:page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
            page_songlists_options_Sort_key.value[0].columnKey : 'id',
          order:page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
            page_songlists_options_Sort_key.value[0].order.replace('end', '') : '',
        };
        add_router_history_of_Media(routerDate);// 重复路由不添加
        //////
      }else{
        if (router_select_history_date_of_Media.value){
          router.push('View_Song_List_ALL')
          menu_select_activeKey.value = 'go-songs-list'
          router_select_model_media.value = true;
          page_songlists_keyword.value = router_select_history_date_of_Media.value.page_lists_keyword;
          page_songlists_selected.value = router_select_history_date_of_Media.value.page_lists_selected;
          page_songlists_options_Sort_key.value = [
            {
              columnKey:router_select_history_date_of_Media.value.columnKey,
              order:router_select_history_date_of_Media.value.order
            }
          ];
          stmt_media_file = db.prepare(router_select_history_date_of_Media.value.stmt_string);
        }
        router_history_model_of_Media.value = 0;
      }
      const stmt_album_limit_1_imagefiles = db.prepare('SELECT * FROM album LIMIT 1');
      const rows = stmt_media_file.all();
      const imagefiles = stmt_album_limit_1_imagefiles.all();
      rows.forEach((row: Media_File) => {
        row.selected = false;
        row.duration_txt = formatTime(row.duration);
        if (row.path.indexOf('mp3') > 0)
          row.medium_image_url = row.path.replace('mp3', 'jpg');
        else if (row.path.indexOf('flac') > 0)
          row.medium_image_url = row.path.replace('flac', 'jpg');
        else
          row.medium_image_url = '../../../resources/error_album.jpg';
        media_Files_temporary.value.push(row);
      });
      ////// find favorite for media_Files_temporary
      const stmt_media_Annotation_Starred_Items = db.prepare(`
        SELECT item_id FROM annotation 
        WHERE starred = 1 AND item_type='media_file'
      `);
      const annotations = stmt_media_Annotation_Starred_Items.all();
      for (let i = 0; i < media_Files_temporary.value.length; i++) {
        if (annotations.some((annotation: { item_id: string }) => annotation.item_id === media_Files_temporary.value[i].id)) {
          media_Files_temporary.value[i].favorite = true;
        } else {
          media_Files_temporary.value[i].favorite = false;
        }
      }
      ////// filter selected_list for media_Files_temporary
      media_Files_temporary.value = media_Files_temporary.value.filter((item) => {
        if (page_songlists_selected.value === 'song_list_all') {
          return true;
        } else if (page_songlists_selected.value === 'song_list_love') {
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
      ////// update page_songlists_top_album_image_url and page_songlists_top_album_name
      try{
        page_songlists_top_album_image_url.value = '';
        if(media_Files_temporary.value.length > 0)
          for (let i = 0; i < media_Files_temporary.value.length; i++) {
            if (await fileExists(media_Files_temporary.value[i].path) === true) {
              page_songlists_top_album_image_url.value = media_Files_temporary.value[i].medium_image_url;
              page_songlists_top_album_id.value = media_Files_temporary.value[i].album_id;
              page_songlists_top_album_name.value = media_Files_temporary.value[i].album;
              break;  
            }
          }
      }catch (err: any) {
        console.error(err);
      }
      ////// 

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
  };
  // album model
  const album_Files_temporary = ref<Album[]>([]);
  ////// page_albumlists
  const page_albumlists_top_album_image_url = ref<string>('../../../resources/error_album.png')
  const page_albumlists_top_album_id = ref<string>('')
  const page_albumlists_top_album_name = ref<string>('')
  const page_albumlists_options = ref<{label: string;value: string}[]>([])
  const page_albumlists_statistic = ref<{label: string;album_count: string;id: string;}[]>([])
  const page_albumlists = ref<Play_List[]>([])
  const page_albumlists_selected = ref<string>('album_list_all')
  const page_albumlists_keyword_reset = ref<boolean>(false)
  const page_albumlists_keyword = ref<string>('');
  const page_albumlists_get_keyword_model_num = ref<number>(0);
  const page_albumlists_options_Sort_key = ref<{ columnKey: string; order: string }[]>([]);
  function get_page_albumlists_options_Sort_key(value: { columnKey: string; order: string }[] = []) {
    if (value != null) {
      page_albumlists_options_Sort_key.value = value;
      fetchData_Album()
    }
  }
  function page_albumlists_get_keyword(value: string) {
    if(value.indexOf('accurate_search') > 0){
      value = value.replace('accurate_search','');
      if(value.indexOf('__title__') > 0){
        value = value.replace('__title__','');
        page_albumlists_get_keyword_model_num.value = 1;
      }else if(value.indexOf('__artist__') > 0){
        value = value.replace('__artist__','');
        page_albumlists_get_keyword_model_num.value = 2;
      }else if(value.indexOf('__album__') > 0){
        value = value.replace('__album__','');
        page_albumlists_get_keyword_model_num.value = 3;
      }
      find_album_model.value = true;
    }else{  
      page_albumlists_get_keyword_model_num.value = 0;
    }
    page_albumlists_keyword.value = value;
    page_albumlists_keyword_reset.value = true;
    console.log('page_albumlists_keyword:' + value)
    fetchData_Album()
  }
  function page_albumlists_get_reset_data(value: any) {
    page_albumlists_keyword.value = '';
    console.log('page_albumlists_reset_data?:' + value)
    fetchData_Album()

    router_history_datas_of_Album.value = [];
    if(router_select_history_date_of_Album.value){
      router_select_history_date_of_Album.value.id = 1;
      router_history_datas_of_Album.value.push(router_select_history_date_of_Album.value);
    }
  }
  const get_page_albumlists_selected = (value: any) => {
    page_albumlists_selected.value = value
    console.log('page_albumlists_selected：'+value)
    fetchData_Album()
  }
  const fetchData_Album = async () => {
    let db:any = null;
    let moment = require('moment');
    // clear RouterView of vue-virtual-scroller data
    clear_Files_temporary()
    router_select_model_album.value = true;

    try {
      db = require('better-sqlite3')(navidrome_db);
      db.pragma('journal_mode = WAL');  
      let stmt_album = null;
      let stmt_album_string = '';

      // load album_model data
      try {
        const stmt_album_count = db.prepare('SELECT COUNT(*) AS count FROM album');
        //
        page_albumlists_options.value = [];
        page_albumlists_statistic.value = [];
        page_albumlists.value = []
        //////
        const temp_Play_List_ALL: Play_List = {
          label: '全部专辑',
          value: 'album_list_all',
          id: 'album_list_all',
          name: '全部专辑',
          comment: '全部专辑',
          duration: 0,
          song_count: stmt_album_count.get().count + ' 组',
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
        page_albumlists_options.value.push(temp_Play_List_ALL);
        page_albumlists_statistic.value.push({
          label: temp_Play_List_ALL.label,
          album_count: temp_Play_List_ALL.song_count.toString(),
          id: temp_Play_List_ALL.id
        });
        page_albumlists.value.push(temp_Play_List_ALL)
        //////
        const stmt_album_Annotation_Starred_Count = db.prepare(`
          SELECT COUNT(*) AS count FROM annotation 
          WHERE starred = 1 AND item_type='album'
        `);
        const temp_Play_List_Love: Play_List = {
          label: '收藏专辑',
          value: 'album_list_love',
          id: 'album_list_love',
          name: '收藏专辑',
          comment: '收藏专辑',
          duration: 0,
          song_count: stmt_album_Annotation_Starred_Count.get().count + ' 组',
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
        page_albumlists_options.value.push(temp_Play_List_Love);
        page_albumlists_statistic.value.push({
          label: temp_Play_List_Love.label,
          album_count: temp_Play_List_Love.song_count.toString(),
          id: temp_Play_List_Love.id
        });
        page_albumlists.value.push(temp_Play_List_Love)
        //////
        const stmt_album_Annotation_Recently_Count = db.prepare(`
          SELECT COUNT(*) AS count FROM annotation 
          WHERE play_count >= 1 AND item_type='album'
        `);
        const temp_Play_List_Recently: Play_List = {
          label: '最近播放',
          value: 'album_list_recently',
          id: 'album_list_recently',
          name: '最近播放',
          comment: '最近播放',
          duration: 0,
          song_count: stmt_album_Annotation_Recently_Count.get().count + ' 组',
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
        page_albumlists_options.value.push(temp_Play_List_Recently);
        page_albumlists_statistic.value.push({
          label: temp_Play_List_Recently.label,
          album_count: temp_Play_List_Recently.song_count.toString(),
          id: temp_Play_List_Recently.id
        });
        page_albumlists.value.push(temp_Play_List_Recently)
        //////
        const stmt_album_Annotation_PlayList_Count = db.prepare(`
          SELECT COUNT(*) AS count FROM playlist
        `);
        page_albumlists_statistic.value.push({
          label: '播放列表',
          album_count: stmt_album_Annotation_PlayList_Count.get().count + ' 组',
          id: 'album_list_all_PlayList'
        });
      }catch (err: any) {
        console.error(err);
      }
      //////

      // load album_Files_temporary data
      if(router_history_model_of_Album.value === 0){
        const sortKey = page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
          page_albumlists_options_Sort_key.value[0].columnKey : 'id';
        const sortOrder = page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
          page_albumlists_options_Sort_key.value[0].order.replace('end', '') : '';
        let keywordFilter = page_albumlists_keyword.value.length > 0 ?
          `WHERE id LIKE '%${page_albumlists_keyword.value}%' OR name LIKE '%${page_albumlists_keyword.value}%' OR artist LIKE '%${page_albumlists_keyword.value}%' OR created_at LIKE '%${page_albumlists_keyword.value}%'` :
          '';
        if (find_album_model.value === true){
          if(page_albumlists_get_keyword_model_num.value != 1)
            keywordFilter = `WHERE artist_id = '${page_albumlists_keyword.value}'`
          else
            keywordFilter = `WHERE created_at LIKE '${page_albumlists_keyword.value}'`
          find_album_model.value = false;
        }
        else{
          if (page_albumlists_get_keyword_model_num.value != 0) {
            if (keywordFilter.length > 0) {
              keywordFilter = keywordFilter.replace('LIKE', '=').replace(/%/g, '').replace('artist', 'artist_id');
            }
          }
        }
        stmt_album_string = `
          SELECT id,name,embed_art_path,artist,artist_id,created_at,updated_at,medium_image_url
          FROM album
          ${keywordFilter}
          ORDER BY ${sortKey} ${sortOrder}  
        `;
        stmt_album = db.prepare(stmt_album_string);
        //////
        if (router_select_history_date_of_Album.value && page_albumlists_keyword_reset.value === true){
          remove_router_history_of_Album(router_select_history_date_of_Album.value.id);// 若存在新操作，则覆盖后续的路由
          page_albumlists_keyword_reset.value = false;
        }
        const routerDate: Router_date = {
          id: router_history_datas_of_Album.value ? router_history_datas_of_Album.value.length + 1 : 1,
          menu_select_active_key: 'go-albums-list',
          router_name: 'View_Album_List_ALL',
          router_select_model_media: false,
          router_select_model_album: true,
          router_select_model_artist: false,
          page_lists_keyword: page_albumlists_keyword.value,
          stmt_string: stmt_album_string,
          page_lists_selected: page_albumlists_selected.value,
          columnKey:page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
            page_albumlists_options_Sort_key.value[0].columnKey : 'id',
          order:page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
            page_albumlists_options_Sort_key.value[0].order.replace('end', '') : '',
        };
        add_router_history_of_Album(routerDate);// 重复路由不添加
        //////
      }else{
        if (router_select_history_date_of_Album.value){
          router.push('View_Album_List_ALL')
          menu_select_activeKey.value = 'go-albums-list'
          router_select_model_album.value = true;
          page_albumlists_keyword.value = router_select_history_date_of_Album.value.page_lists_keyword;
          page_albumlists_selected.value = router_select_history_date_of_Album.value.page_lists_selected;
          page_albumlists_options_Sort_key.value = [
            {
              columnKey:router_select_history_date_of_Album.value.columnKey,
              order:router_select_history_date_of_Album.value.order
            }
          ];
          stmt_album = db.prepare(router_select_history_date_of_Album.value.stmt_string);
        }
        router_history_model_of_Album.value = 0;
      }
      let rows = stmt_album.all();
      rows.forEach((row: Album) => {
        if (row.embed_art_path.indexOf('mp3') > 0)
          row.medium_image_url = row.embed_art_path.replace('mp3', 'jpg');
        else if (row.embed_art_path.indexOf('flac') > 0)
          row.medium_image_url = row.embed_art_path.replace('flac', 'jpg');
        else 
          row.medium_image_url = '../../../resources/error_album.jpg';
        const fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/);
        const fileNameWithExtension = fileNameMatch ? fileNameMatch[0] : null;
        const fileNameWithoutExtension = fileNameWithExtension ? fileNameWithExtension.replace(/\.[^.]+$/, '') : null;
        const fileNameWithoutPrefix = fileNameWithoutExtension ? fileNameWithoutExtension.replace(/.*?-\s*/, '') : null;
        if (fileNameWithoutPrefix !== null) {
          row.title = fileNameWithoutPrefix;
        }
        row.album_title = row.title + "<br>" + row.artist;
        row.updated_time = row.updated_at ? moment(row.updated_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
        row.created_time = row.created_at ? moment(row.created_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
        album_Files_temporary.value.push(row);
      });
      rows.length = 0
      rows = []
      moment = null;
      ////// find favorite for album_Files_temporary
      const stmt_album_Annotation_Starred_Items = db.prepare(`
        SELECT item_id FROM annotation 
        WHERE starred = 1 AND item_type='album'
      `);
      const annotations = stmt_album_Annotation_Starred_Items.all();
      for (let i = 0; i < album_Files_temporary.value.length; i++) {
        if (annotations.some((annotation: { item_id: string }) => annotation.item_id === album_Files_temporary.value[i].id)) {
          album_Files_temporary.value[i].favorite = true;
        } else {
          album_Files_temporary.value[i].favorite = false;
        }
      }
      ////// filter selected_list for album_Files_temporary
      album_Files_temporary.value = album_Files_temporary.value.filter((item) => {
        if (page_albumlists_selected.value === 'album_list_all') {
          return true;
        } else if (page_albumlists_selected.value === 'album_list_love') {
          return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
        } else if (page_albumlists_selected.value === 'album_list_recently') {
          const stmt_album_Annotation_Recently_Items = db.prepare(`
            SELECT item_id FROM annotation 
            WHERE play_count >= 1 AND item_type='album'
          `);
          const annotations = stmt_album_Annotation_Recently_Items.all();
          return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
        } else if (page_albumlists_selected.value === 'album_list_all_PlayList') {
          return true;
        }
      });
      ////// update page_albumlists_top_album_image_url and page_albumlists_top_album_name
      try{
        page_albumlists_top_album_image_url.value = '';
        if(album_Files_temporary.value.length > 0)
          for (let i = 0; i < album_Files_temporary.value.length; i++) {
            if (await fileExists(album_Files_temporary.value[i].medium_image_url) === true) {
              page_albumlists_top_album_image_url.value = album_Files_temporary.value[i].medium_image_url;
              page_albumlists_top_album_name.value = album_Files_temporary.value[i].name;
              page_albumlists_top_album_id.value = album_Files_temporary.value[i].id;
              break;  
            }
          }
      }catch (err: any) {
        console.error(err);
      }

    } catch (err: any) {
      console.error(err);
    } finally {
      db.close();
      console.log('db.close().......');
      db = null;
    }
  }
  const fetchData_This_Album_SongList = (album_id:any) => {
    fetchData_This_AlbumOrArtist_PlayMedia_Model.value = true;

    page_songlists_keyword.value = album_id;
    page_songlists_selected.value = 'song_list_all'
    media_Files_temporary.value = [];

    find_music_model.value = true;
    find_album_model.value = false;
    find_artist_model.value = false;
    fetchData_Media()
    find_music_model.value = false;

    playlist_Files_temporary.value = [];
    playlist_Files_temporary.value = [...media_Files_temporary.value];
    page_songlists_keyword.value = '';
    
    router_select_model_album.value = true
    
    if(playlist_Files_temporary.value.length > 0){
      get_this_audio_file_path_from_playlist(false)
      media_file_path(playlist_Files_temporary.value[0].path)
      get_this_audio_lyrics_string(playlist_Files_temporary.value[0].lyrics)
      get_media_file_medium_image_url(playlist_Files_temporary.value[0].medium_image_url)
      get_this_audio_singer_name(playlist_Files_temporary.value[0].artist)
      get_this_audio_song_name(playlist_Files_temporary.value[0].title)
      get_this_audio_album_id(playlist_Files_temporary.value[0].album_id)
      get_this_audio_album_name(playlist_Files_temporary.value[0].album)
      get_data_select_Index(playlist_Files_temporary.value[0].absoluteIndex)
    }
  }
  // artist model
  const artist_Files_temporary = ref<Artist[]>([]);
  ////// page_artistlists
  const page_artistlists_top_artist_image_url = ref<string>('../../../resources/error_album.png')
  const page_artistlists_top_artist_id = ref<string>('')
  const page_artistlists_top_artist_name = ref<string>('')
  const page_artistlists_options = ref<{label: string;value: string}[]>([])
  const page_artistlists_statistic = ref<{label: string;artist_count: string;id: string;}[]>([])
  const page_artistlists = ref<Play_List[]>([])
  const page_artistlists_selected = ref<string>('artist_list_all')
  const page_artistlists_keyword_reset = ref<boolean>(false)
  const page_artistlists_keyword = ref<string>('');
  const page_artistlists_get_keyword_model_num = ref<number>(0);
  const page_artistlists_options_Sort_key = ref<{ columnKey: string; order: string }[]>([]);
  function get_page_artistlists_options_Sort_key(value: { columnKey: string; order: string }[] = []) {
    if (value != null) {
      page_artistlists_options_Sort_key.value = value;
      fetchData_Artist()
    }
  }
  function page_artistlists_get_keyword(value: any) {
    if(value.indexOf('accurate_search') > 0){
      value = value.replace('accurate_search','');
      if(value.indexOf('__title__') > 0){
        value = value.replace('__title__','');
        page_artistlists_get_keyword_model_num.value = 1;
      }else if(value.indexOf('__artist__') > 0){
        value = value.replace('__artist__','');
        page_artistlists_get_keyword_model_num.value = 2;
      }else if(value.indexOf('__album__') > 0){
        value = value.replace('__album__','');
        page_artistlists_get_keyword_model_num.value = 3;
      }
    }else{  
      page_artistlists_get_keyword_model_num.value = 0;
    }
    page_artistlists_keyword.value = value;
    page_artistlists_keyword_reset.value = true;
    console.log('page_artistlists_keyword:' + value)
    fetchData_Artist()
  }
  function page_artistlists_get_reset_data(value: any) {
    page_artistlists_keyword.value = '';
    console.log('page_artistlists_reset_data?:' + value)
    fetchData_Artist()

    router_history_datas_of_Artist.value = [];
    if(router_select_history_date_of_Artist.value){
      router_select_history_date_of_Artist.value.id = 1;
      router_history_datas_of_Artist.value.push(router_select_history_date_of_Artist.value);
    }
  }
  const get_page_artistlists_selected = (value: any) => {
    page_artistlists_selected.value = value
    console.log('page_artistlists_selected：'+value)
    fetchData_Artist()
  }
  const fetchData_Artist = async () => {
    let db:any = null;
    // clear RouterView of vue-virtual-scroller data
    clear_Files_temporary()
    router_select_model_artist.value = true;

    try {
      db = require('better-sqlite3')(navidrome_db);
      db.pragma('journal_mode = WAL');
      let stmt_artist = null;
      let stmt_artist_string = '';

      // load artist_model data
      try {
        const stmt_artist_count = db.prepare('SELECT COUNT(*) AS count FROM artist');
        //
        page_artistlists_options.value = [];
        page_artistlists_statistic.value = [];
        page_artistlists.value = []
        //////
        const temp_Play_List_ALL: Play_List = {
          label: '全部歌手',
          value: 'artist_list_all',
          id: 'artist_list_all',
          name: '全部歌手',
          comment: '全部歌手',
          duration: 0,
          song_count: stmt_artist_count.get().count + ' 组',
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
        page_artistlists_options.value.push(temp_Play_List_ALL);
        page_artistlists_statistic.value.push({
          label: temp_Play_List_ALL.label,
          artist_count: temp_Play_List_ALL.song_count.toString(),
          id: temp_Play_List_ALL.id
        });
        page_artistlists.value.push(temp_Play_List_ALL)
        //////
        const stmt_artist_Annotation_Starred_Count = db.prepare(`
          SELECT COUNT(*) AS count FROM annotation 
          WHERE starred = 1 AND item_type='artist'
        `);
        const temp_Play_List_Love: Play_List = {
          label: '收藏歌手',
          value: 'artist_list_love',
          id: 'artist_list_love',
          name: '收藏歌手',
          comment: '收藏歌手',
          duration: 0,
          song_count: stmt_artist_Annotation_Starred_Count.get().count + ' 组',
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
        page_artistlists_options.value.push(temp_Play_List_Love);
        page_artistlists_statistic.value.push({
          label: temp_Play_List_Love.label,
          artist_count: temp_Play_List_Love.song_count.toString(),
          id: temp_Play_List_Love.id
        });
        page_artistlists.value.push(temp_Play_List_Love)
        //////
        const stmt_artist_Annotation_Recently_Count = db.prepare(`
          SELECT COUNT(*) AS count FROM annotation 
          WHERE play_count >= 1 AND item_type='artist'
        `);
        const temp_Play_List_Recently: Play_List = {
          label: '最近播放',
          value: 'artist_list_recently',
          id: 'artist_list_recently',
          name: '最近播放',
          comment: '最近播放',
          duration: 0,
          song_count: stmt_artist_Annotation_Recently_Count.get().count + ' 组',
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
        page_artistlists_options.value.push(temp_Play_List_Recently);
        page_artistlists_statistic.value.push({
          label: temp_Play_List_Recently.label,
          artist_count: temp_Play_List_Recently.song_count.toString(),
          id: temp_Play_List_Recently.id
        });
        page_artistlists.value.push(temp_Play_List_Recently)
        //////
        const stmt_artist_Annotation_PlayList_Count = db.prepare(`
          SELECT COUNT(*) AS count FROM playlist
        `);
        page_artistlists_statistic.value.push({
          label: '播放列表',
          artist_count: stmt_artist_Annotation_PlayList_Count.get().count + ' 组',
          id: 'artist_list_all_PlayList'
        });
      }catch (err: any) {
        console.error(err);
      }
      //////

      // load artist_Files_temporary data
      if(router_history_model_of_Artist.value === 0){
        const sortKey = page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
          page_artistlists_options_Sort_key.value[0].columnKey : 'id';
        const sortOrder = page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
          page_artistlists_options_Sort_key.value[0].order.replace('end', '') : '';
        let keywordFilter = page_artistlists_keyword.value.length > 0 ?
          `WHERE name LIKE '%${page_artistlists_keyword.value}%' OR external_info_updated_at LIKE '%${page_artistlists_keyword.value}%'` :
          '';
        const stmt_album_limit_1_imagefiles = db.prepare('SELECT * FROM album LIMIT 1');
        const imagefiles = stmt_album_limit_1_imagefiles.all();
        stmt_artist_string = `
          SELECT id,name,album_count,song_count,medium_image_url,external_info_updated_at
          FROM artist
          ${keywordFilter}
          ORDER BY ${sortKey} ${sortOrder}  
        `;
        stmt_artist = db.prepare(stmt_artist_string);
        //////
        if (router_select_history_date_of_Artist.value && page_artistlists_keyword_reset.value === true){
          remove_router_history_of_Artist(router_select_history_date_of_Artist.value.id);// 若存在新操作，则覆盖后续的路由
          page_artistlists_keyword_reset.value = false;
        }
        const routerDate: Router_date = {
          id: router_history_datas_of_Artist.value ? router_history_datas_of_Artist.value.length + 1 : 1,
          menu_select_active_key: 'go-artist-list',
          router_name: 'View_Artist_List_ALL',
          router_select_model_media: false,
          router_select_model_album: false,
          router_select_model_artist: true,
          page_lists_keyword: page_artistlists_keyword.value,
          stmt_string: stmt_artist_string,
          page_lists_selected: page_artistlists_selected.value,
          columnKey:page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
            page_artistlists_options_Sort_key.value[0].columnKey : 'id',
          order:page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
            page_artistlists_options_Sort_key.value[0].order.replace('end', '') : '',
        };
        add_router_history_of_Artist(routerDate);// 重复路由不添加
        //////
      }else{
        if (router_select_history_date_of_Artist.value){
          router.push('View_Artist_List_ALL')
          menu_select_activeKey.value = 'go-artist-list'
          router_select_model_artist.value = true;
          page_artistlists_keyword.value = router_select_history_date_of_Artist.value.page_lists_keyword;
          page_artistlists_selected.value = router_select_history_date_of_Artist.value.page_lists_selected;
          page_artistlists_options_Sort_key.value = [
            {
              columnKey:router_select_history_date_of_Artist.value.columnKey,
              order:router_select_history_date_of_Artist.value.order
            }
          ];
          stmt_artist = db.prepare(router_select_history_date_of_Artist.value.stmt_string);
        }
        router_history_model_of_Artist.value = 0;
      }
      const stmt_media_file = db.prepare(`SELECT id, title, artist,artist_id, album,album_id, duration, path FROM media_file`);
      const pathfiles = stmt_media_file.all();
      let rows = stmt_artist.all();
      rows.forEach((row: Artist) => {
        for (let j = 0; j < pathfiles.length; j++) {
          if (pathfiles[j].artist_id === row.id) {
            if (pathfiles[j].path.indexOf('mp3') > 0)
              row.medium_image_url = pathfiles[j].path.replace('mp3', 'jpg');
            else if (pathfiles[j].path.indexOf('flac') > 0)
              row.medium_image_url = pathfiles[j].path.replace('flac', 'jpg');
            else
              row.medium_image_url = '../../../resources/error_album.jpg';
            break;
          }
          if (j === pathfiles.length - 1) {
            row.medium_image_url = '../../../resources/error_album.jpg';
          }
        }
        artist_Files_temporary.value.push(row);
      });
      rows.length = 0
      rows = []
      ////// find favorite for artist_Files_temporary
      const stmt_artist_Annotation_Starred_Items = db.prepare(`
        SELECT item_id FROM annotation 
        WHERE starred = 1 AND item_type='artist'
      `);
      const annotations = stmt_artist_Annotation_Starred_Items.all();
      for (let i = 0; i < artist_Files_temporary.value.length; i++) {
        if (annotations.some((annotation: { item_id: string }) => annotation.item_id === artist_Files_temporary.value[i].id)) {
          artist_Files_temporary.value[i].favorite = true;
        } else {
          artist_Files_temporary.value[i].favorite = false;
        }
      }
      ////// filter selected_list for artist_Files_temporary
      artist_Files_temporary.value = artist_Files_temporary.value.filter((item) => {
        if (page_artistlists_selected.value === 'artist_list_all') {
          return true;
        } else if (page_artistlists_selected.value === 'artist_list_love') {
          return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
        } else if (page_artistlists_selected.value === 'artist_list_recently') {
          const stmt_artist_Annotation_Recently_Items = db.prepare(`
            SELECT item_id FROM annotation 
            WHERE play_count >= 1 AND item_type='artist'
          `);
          const annotations = stmt_artist_Annotation_Recently_Items.all();
          return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
        } else if (page_artistlists_selected.value === 'artist_list_all_PlayList') {
          return true;
        }
      });
      ////// update page_artistlists_top_artist_image_url and page_artistlists_top_artist_name
      try{
        page_artistlists_top_artist_image_url.value = '';
        if(artist_Files_temporary.value.length > 0)
          for (let i = 0; i < artist_Files_temporary.value.length; i++) {
            if (await fileExists(artist_Files_temporary.value[i].medium_image_url) === true) {
              page_artistlists_top_artist_image_url.value = artist_Files_temporary.value[i].medium_image_url;
              page_artistlists_top_artist_name.value = artist_Files_temporary.value[i].name;
              page_artistlists_top_artist_id.value = artist_Files_temporary.value[i].id;
              break;  
            }
          }
      }catch (err: any) {
        console.error(err);
      }

    } catch (err: any) {
      console.error(err);
    } finally {
      db.close();
      console.log('db.close().......');
      db = null;
    }
  }
  const fetchData_This_Artist_SongList = (artist_id:any) => {
    fetchData_This_AlbumOrArtist_PlayMedia_Model.value = true;

    page_songlists_keyword.value = artist_id;
    page_songlists_selected.value = 'song_list_all'
    media_Files_temporary.value = [];

    find_music_model.value = false;
    find_album_model.value = false;
    find_artist_model.value = true;
    fetchData_Media()
    find_artist_model.value = false;

    playlist_Files_temporary.value = [];
    playlist_Files_temporary.value = [...media_Files_temporary.value];
    page_songlists_keyword.value = '';
    
    router_select_model_artist.value = true
    
    if(playlist_Files_temporary.value.length > 0){
      get_this_audio_file_path_from_playlist(false)
      media_file_path(playlist_Files_temporary.value[0].path)
      get_this_audio_lyrics_string(playlist_Files_temporary.value[0].lyrics)
      get_media_file_medium_image_url(playlist_Files_temporary.value[0].medium_image_url)
      get_this_audio_singer_name(playlist_Files_temporary.value[0].artist)
      get_this_audio_song_name(playlist_Files_temporary.value[0].title)
      get_this_audio_album_id(playlist_Files_temporary.value[0].album_id)
      get_this_audio_album_name(playlist_Files_temporary.value[0].album)
      get_data_select_Index(playlist_Files_temporary.value[0].absoluteIndex)
    }
  }
  // playlist model
  const playlist_Files_temporary = ref<Media_File[]>([]);
  const playlist_Files_selected = ref<Media_File[]>([])
  function set_playlist_Files_selected(value: Media_File) {
    if (value.selected === true) {
      playlist_Files_temporary.value.forEach((item, index) => {
        if (item.id === value.id) {
          playlist_Files_temporary.value[index].selected = true;
        }
      });
      playlist_Files_selected.value.push(value)
      console.log('playlist_Files_selected：'+value.path+'  '+value.selected)
    } else {
      playlist_Files_temporary.value.forEach((item, index) => {
        if (item.id === value.id) {
          playlist_Files_temporary.value[index].selected = false;
        }
      });
      playlist_Files_selected.value = playlist_Files_selected.value.filter(item => item.id !== value.id);
      console.log('playlist_Files_selected：'+value.path+'  '+value.selected)
    }
  }
  function set_playlist_Files_selected_all(value: boolean) {
    playlist_Files_temporary.value.forEach((item, index) => {
      playlist_Files_temporary.value[index].selected = value;
    });
    if (value === true) {
      playlist_Files_selected.value = playlist_Files_temporary.value.slice();
    } else {
      playlist_Files_selected.value = [];
    }
    console.log('playlist_Files_selected：'+value)
  }
  // history and search model
  const find_music_model = ref<Boolean>(false)
  const find_album_model = ref<Boolean>(false)
  const find_artist_model = ref<Boolean>(false)
  // album -> media_file
  function get_media_list_of_album_id(value: any) {
    console.log('get_media_list_of_album_model：'+value)
    // open media_files model，keywords set
    page_songlists_keyword.value = value
    page_songlists_get_keyword_model_num.value = 3
    find_music_model.value = true

    router.push('View_Song_List_ALL')
    menu_select_activeKey.value = 'go-songs-list'
  }
  // album -> album(artist)
  function get_album_list_of_artist_id(value: any) {
    console.log('get_album_list_of_artist_model：'+value)
    // open album_files model，keywords set
    page_albumlists_keyword.value = value
    page_albumlists_get_keyword_model_num.value = 2
    find_album_model.value = true
  }
  // artist -> album
  function get_album_list_of_artist_id_artist(value: any) {
    console.log('get_album_list_of_artist_model：'+value)
    // open album_files model，keywords set
    page_albumlists_keyword.value = value
    page_albumlists_get_keyword_model_num.value = 2
    find_artist_model.value = false

    router.push('View_Album_List_ALL')
    menu_select_activeKey.value = 'go-albums-list'
  }

  //////
  function get_router_select(value: any) {
    ////// 
    if(value === 'home'){
      fetchData_Home()
    }else if(value === 'View_Song_List_ALL'){
      router_select_model_media.value = true
      fetchData_Media()
      
    }else if(value === 'View_Album_List_ALL'){
      router_select_model_album.value = true
      fetchData_Album()
      
    }else if(value === 'View_Artist_List_ALL'){
      router_select_model_artist.value = true
      fetchData_Artist()
      
    }
  }
  //////
  import { useRouter } from 'vue-router';
  const router = useRouter();
  import routers from './router'
  routers.beforeEach((to, from, next) => {
    if(to.name !== from.name){
      clear_Files_temporary()
      next();
    }
  });
  routers.afterEach((to, from) => {
    if(to.name !== from.name){
      clear_Files_temporary()
      if(to.name === 'View_Song_List_ALL'){
        router_select_model_media.value = true
      }else if(to.name === 'View_Album_List_ALL'){
        router_select_model_album.value = true
      }else if(to.name === 'View_Artist_List_ALL'){
        router_select_model_artist.value = true
      }
    }
  });
  const router_select_model_media = ref<Boolean>(false)
  const router_select_model_album = ref<Boolean>(false)
  const router_select_model_artist = ref<Boolean>(false)
  const clear_Files_temporary = () => {
    router_select_model_media.value = false
    router_select_model_album.value = false
    router_select_model_artist.value = false
    media_Files_temporary.value = [];
    album_Files_temporary.value = [];
    artist_Files_temporary.value = [];
  }
  // history model media
  const router_history_model_of_Media = ref<number>(0)
  function get_router_history_model_of_Media(value: any) {
    if (value !== 0) {
      router_history_model_of_Media.value = value;
      const currentIndex = router_history_datas_of_Media.value.findIndex(item => item.id === (router_select_history_date_of_Media.value?.id ?? ''));
      if (currentIndex !== -1) {
        const newIndex = currentIndex + value;
        if (newIndex >= 0 && newIndex < router_history_datas_of_Media.value.length) {
          router_select_history_date_of_Media.value = router_history_datas_of_Media.value[newIndex];
          clear_Files_temporary();
          const selectedRouterName = router_select_history_date_of_Media.value.router_name;
          if (selectedRouterName === 'View_Song_List_ALL') {
            router_select_model_media.value = true;
            fetchData_Media();
          } else if (selectedRouterName === 'View_Album_List_ALL') {
            router_select_model_album.value = true;
            fetchData_Album();
          } else if (selectedRouterName === 'View_Artist_List_ALL') {
            router_select_model_artist.value = true;
            fetchData_Artist();
          }
        }
      }
    }
  }
  const router_history_datas_of_Media = ref<Router_date[]>([])
  const router_select_history_date_of_Media = ref<Router_date>()
  const add_router_history_of_Media = (new_Router_date: Router_date) => {
    for (let i = 0; i < router_history_datas_of_Media.value.length; i++) {
      if (router_history_datas_of_Media.value[i].stmt_string === new_Router_date.stmt_string) {
        if (router_history_datas_of_Media.value[i].page_lists_keyword === new_Router_date.page_lists_keyword) {
          if (router_history_datas_of_Media.value[i].page_lists_selected === new_Router_date.page_lists_selected) {
            if(router_history_datas_of_Media.value[i].columnKey === new_Router_date.columnKey) {
              if(router_history_datas_of_Media.value[i].order === new_Router_date.order) {
                new_Router_date.id = router_history_datas_of_Media.value[i].id;
                router_history_datas_of_Media.value[i] = new_Router_date;
                router_select_history_date_of_Media.value = new_Router_date;
                return;
              }
            }
          }
        }
      }
    }
    if (router_history_datas_of_Media.value.length >= 36)
      router_history_datas_of_Media.value.shift();
    router_history_datas_of_Media.value.push(new_Router_date);  
    router_select_history_date_of_Media.value = new_Router_date;
  };
  const remove_router_history_of_Media = (id: number) => {
    const index = router_history_datas_of_Media.value.findIndex(item => item.id === id);  
    if (index !== -1) {
      router_history_datas_of_Media.value.splice(index + 1);  
    }  
  };
  // history model album
  const router_history_model_of_Album = ref<number>(0)
  function get_router_history_model_of_Album(value: any) {
    if (value !== 0) {
      router_history_model_of_Album.value = value;
      const currentIndex = router_history_datas_of_Album.value.findIndex(item => item.id === (router_select_history_date_of_Album.value?.id ?? ''));
      if (currentIndex !== -1) {
        const newIndex = currentIndex + value;
        if (newIndex >= 0 && newIndex < router_history_datas_of_Album.value.length) {
          router_select_history_date_of_Album.value = router_history_datas_of_Album.value[newIndex];
          clear_Files_temporary();
          const selectedRouterName = router_select_history_date_of_Album.value.router_name;
          if (selectedRouterName === 'View_Song_List_ALL') {
            router_select_model_media.value = true;
            fetchData_Media();
          } else if (selectedRouterName === 'View_Album_List_ALL') {
            router_select_model_album.value = true;
            fetchData_Album();
          } else if (selectedRouterName === 'View_Artist_List_ALL') {
            router_select_model_artist.value = true;
            fetchData_Artist();
          }
        }
      }
    }
  }
  const router_history_datas_of_Album = ref<Router_date[]>([])
  const router_select_history_date_of_Album = ref<Router_date>()
  const add_router_history_of_Album = (new_Router_date: Router_date) => {
    for (let i = 0; i < router_history_datas_of_Album.value.length; i++) {
      if (router_history_datas_of_Album.value[i].stmt_string === new_Router_date.stmt_string) {
        if (router_history_datas_of_Album.value[i].page_lists_keyword === new_Router_date.page_lists_keyword) {
          if (router_history_datas_of_Album.value[i].page_lists_selected === new_Router_date.page_lists_selected) {
            if(router_history_datas_of_Album.value[i].columnKey === new_Router_date.columnKey) {
              if(router_history_datas_of_Album.value[i].order === new_Router_date.order) {
                new_Router_date.id = router_history_datas_of_Album.value[i].id;
                router_history_datas_of_Album.value[i] = new_Router_date;
                router_select_history_date_of_Album.value = new_Router_date;
                return;
              }
            }
          }
        }
      }
    }
    if (router_history_datas_of_Album.value.length >= 36)
      router_history_datas_of_Album.value.shift();
    router_history_datas_of_Album.value.push(new_Router_date);  
    router_select_history_date_of_Album.value = new_Router_date;
  };
  const remove_router_history_of_Album = (id: number) => {
    const index = router_history_datas_of_Album.value.findIndex(item => item.id === id);  
    if (index !== -1) {
      router_history_datas_of_Album.value.splice(index + 1);  
    }  
  };
  // history model artist
  const router_history_model_of_Artist = ref<number>(0)
  function get_router_history_model_of_Artist(value: any) {
    if (value !== 0) {
      router_history_model_of_Artist.value = value;
      const currentIndex = router_history_datas_of_Artist.value.findIndex(item => item.id === (router_select_history_date_of_Artist.value?.id ?? ''));
      if (currentIndex !== -1) {
        const newIndex = currentIndex + value;
        if (newIndex >= 0 && newIndex < router_history_datas_of_Artist.value.length) {
          router_select_history_date_of_Artist.value = router_history_datas_of_Artist.value[newIndex];
          clear_Files_temporary();
          const selectedRouterName = router_select_history_date_of_Artist.value.router_name;
          if (selectedRouterName === 'View_Song_List_ALL') {
            router_select_model_media.value = true;
            fetchData_Media();
          } else if (selectedRouterName === 'View_Album_List_ALL') {
            router_select_model_album.value = true;
            fetchData_Album();
          } else if (selectedRouterName === 'View_Artist_List_ALL') {
            router_select_model_artist.value = true;
            fetchData_Artist();
          }
        }
      }
    }
  }
  const router_history_datas_of_Artist = ref<Router_date[]>([])
  const router_select_history_date_of_Artist = ref<Router_date>()
  const add_router_history_of_Artist = (new_Router_date: Router_date) => {
    for (let i = 0; i < router_history_datas_of_Artist.value.length; i++) {
      if (router_history_datas_of_Artist.value[i].stmt_string === new_Router_date.stmt_string) {
        if (router_history_datas_of_Artist.value[i].page_lists_keyword === new_Router_date.page_lists_keyword) {
          if (router_history_datas_of_Artist.value[i].page_lists_selected === new_Router_date.page_lists_selected) {
            if(router_history_datas_of_Artist.value[i].columnKey === new_Router_date.columnKey) {
              if(router_history_datas_of_Artist.value[i].order === new_Router_date.order) {
                new_Router_date.id = router_history_datas_of_Artist.value[i].id;
                router_history_datas_of_Artist.value[i] = new_Router_date;
                router_select_history_date_of_Artist.value = new_Router_date;
                return;
              }
            }
          }
        }
      }
    }
    if (router_history_datas_of_Artist.value.length >= 36)
      router_history_datas_of_Artist.value.shift();
    router_history_datas_of_Artist.value.push(new_Router_date);  
    router_select_history_date_of_Artist.value = new_Router_date;
  };
  const remove_router_history_of_Artist = (id: number) => {
    const index = router_history_datas_of_Artist.value.findIndex(item => item.id === id);  
    if (index !== -1) {
      router_history_datas_of_Artist.value.splice(index + 1);  
    }  
  };
  //////
  onMounted(() => {
    // fix init : if no access media_model,View_Screen_Music_Player will up animation
    clear_Files_temporary()
    router.push('View_Song_List_ALL')
    menu_select_activeKey.value = 'go-songs-list'
  });

  //////
  import { darkTheme,lightTheme } from 'naive-ui'
  import type { GlobalTheme } from 'naive-ui'
  const theme = ref<GlobalTheme | null>(null)
  const theme_app =ref<GlobalTheme | null>(null)
  const theme_bar_top_setapp = ref('transparent')
  const change_page_header_color = ref(false)
  const theme_normal_mode_click = () => {
    theme.value = lightTheme
    theme_app.value = lightTheme
    change_page_header_color.value = false
  }
  const theme_dark_mode_click = () => {
    theme.value = darkTheme
    theme_app.value = darkTheme
    change_page_header_color.value = true
  }
  const theme_mode_change_click = () => {
    if(change_page_header_color.value){
      theme_normal_mode_click()
    }else{
      theme_dark_mode_click()
    }
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
  //////
  const Show_View_System_List_ALL = () => {
    router.push('View_System_List_ALL')
    menu_select_activeKey.value = null
  }
  //////
  let navidrome_db = path.resolve('resources/navidrome.db');
  ////// disabled scroll
  const scrollContent_this_App = document.querySelector('.this_App');
  if (scrollContent_this_App){
    scrollContent_this_App.addEventListener('wheel', function(event) {
      event.stopPropagation();
    });
  }
</script>
<template>
  <n-config-provider :theme="theme" :locale="locale" :date-locale="dateLocale">
    <n-message-provider>
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
            v-model:value="menu_select_activeKey"
            :collapsed="collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"/>
        </n-layout-sider>
        <n-layout embedded style="height: calc(100vh - 80px);">
          <RouterView
            class="view_show"
            v-if="router_select_model_media"
            @router_select="get_router_select"
            :collapsed="collapsed"
            :window_innerWidth="window_innerWidth"

            @router_history_model="get_router_history_model_of_Media"
            :router_select_history_date="router_select_history_date_of_Media"
            :router_history_datas="router_history_datas_of_Media"

            @this_audio_lyrics_string="get_this_audio_lyrics_string"
            @media_file_path="media_file_path"
            @media_file_path_from_playlist="get_this_audio_file_path_from_playlist"
            @media_file_medium_image_url="get_media_file_medium_image_url"
            @this_audio_singer_name="get_this_audio_singer_name"
            @this_audio_song_name="get_this_audio_song_name"
            :this_audio_album_id="this_audio_album_id"
            @this_audio_album_id="get_this_audio_album_id"
            :this_audio_album_name="this_audio_album_name"
            @this_audio_album_name="get_this_audio_album_name"
            @data_select_Index="get_data_select_Index"
            @page_song_index="get_page_song_index"
            :media_Files_temporary="media_Files_temporary"
            :media_Files_selected="media_Files_selected"
            @media_Files_selected_set="set_media_Files_selected"
            @media_Files_selected_set_all="set_media_Files_selected_all"
            :page_songlists_options_Sort_key="page_songlists_options_Sort_key"
            @page_songlists_options_Sort_key="get_page_songlists_options_Sort_key"

            :page_songlists_keyword=page_songlists_keyword
            @page_songlists_keyword="page_songlists_get_keyword"

            @page_songlists_reset_data="page_songlists_get_reset_data"
            :page_songlists_top_album_image_url="page_songlists_top_album_image_url"
            :page_songlists_top_album_id="page_songlists_top_album_id"
            :page_songlists_top_album_name="page_songlists_top_album_name"
            :page_songlists_options="page_songlists_options"
            :page_songlists_statistic="page_songlists_statistic"
            :page_songlists="page_songlists"
            :page_songlists_selected="page_songlists_selected"
            @page_songlists_selected="get_page_songlists_selected"

            :change_page_header_color="change_page_header_color"
          >
          
          </RouterView>
          <RouterView
            class="view_show"
            v-else-if="router_select_model_album"
            @router_select="get_router_select"
            :collapsed="collapsed"
            :window_innerWidth="window_innerWidth"

            @router_history_model="get_router_history_model_of_Album"
            :router_select_history_date="router_select_history_date_of_Album"
            :router_history_datas="router_history_datas_of_Album"

            :album_Files_temporary="album_Files_temporary"
            :page_albumlists_options_Sort_key="page_albumlists_options_Sort_key"
            @page_albumlists_options_Sort_key="get_page_albumlists_options_Sort_key"
            :page_albumlists_keyword="page_albumlists_keyword"
            @page_albumlists_keyword="page_albumlists_get_keyword"
            @page_albumlists_reset_data="page_albumlists_get_reset_data"
            :page_albumlists_top_album_image_url="page_albumlists_top_album_image_url"
            :page_albumlists_top_album_id="page_albumlists_top_album_id"
            :page_albumlists_top_album_name="page_albumlists_top_album_name"
            :page_albumlists_options="page_albumlists_options"
            :page_albumlists_statistic="page_albumlists_statistic"
            :page_albumlists="page_albumlists"
            :page_albumlists_selected="page_albumlists_selected"
            @page_albumlists_selected="get_page_albumlists_selected"

            @media_list_of_album_id="get_media_list_of_album_id"
            @media_list_of_artist_id="get_album_list_of_artist_id"
            @play_this_album_song_list="fetchData_This_Album_SongList"

            :change_page_header_color="change_page_header_color"
            :this_audio_album_name="this_audio_album_name"
          >

          </RouterView>
          <RouterView
            class="view_show"
            v-else-if="router_select_model_artist"
            @router_select="get_router_select"
            :collapsed="collapsed"
            :window_innerWidth="window_innerWidth"

            @router_history_model="get_router_history_model_of_Artist"
            :router_select_history_date="router_select_history_date_of_Artist"
            :router_history_datas="router_history_datas_of_Artist"

            :artist_Files_temporary="artist_Files_temporary"
            :page_artistlists_options_Sort_key="page_artistlists_options_Sort_key"
            @page_artistlists_options_Sort_key="get_page_artistlists_options_Sort_key"
            :page_artistlists_keyword="page_artistlists_keyword"
            @page_artistlists_keyword="page_artistlists_get_keyword"
            @page_artistlists_reset_data="page_artistlists_get_reset_data"
            :page_artistlists_top_artist_image_url="page_artistlists_top_artist_image_url"
            :page_artistlists_top_artist_id="page_artistlists_top_artist_id"
            :page_artistlists_top_artist_name="page_artistlists_top_artist_name"
            :page_artistlists_options="page_artistlists_options"
            :page_artistlists_statistic="page_artistlists_statistic"
            :page_artistlists="page_artistlists"
            :page_artistlists_selected="page_artistlists_selected"
            @page_artistlists_selected="get_page_artistlists_selected"

            @album_list_of_artist_id_artist="get_album_list_of_artist_id_artist"
            @play_this_artist_song_list="fetchData_This_Artist_SongList"

            :change_page_header_color="change_page_header_color"
            :this_audio_album_name="this_audio_album_name"
          >
          
          </RouterView>
          <div class="bar_top_setapp" :style="{ backgroundColor: theme_bar_top_setapp }">
            <section  
              style="
                -webkit-app-region: no-drag;
                width: auto;/* auto 为单分布，100vw 为多分布(left，middle，right) */
                position: absolute;right: 0;top:30px;
                text-align:center;
                z-index: 99;
              ">
              <div v-if="false">
                <n-button tertiary circle size="medium" @click="() => {locale = null,dateLocale = null}">英文</n-button>
                <n-button tertiary circle size="medium" @click="() => {locale = zhCN,dateLocale = dateZhCN}">中文</n-button>
                <n-button tertiary circle size="medium" @click="theme_dark_mode_click">深色</n-button>
                <n-button tertiary circle size="medium" @click="theme_normal_mode_click">浅色</n-button>
                <n-button quaternary circle size="medium" style="margin-right:12px" @click="Show_View_System_List_ALL">
                  <template #icon>
                    <n-icon><Settings/></n-icon>
                  </template>
                </n-button>
              </div>

              <n-button quaternary circle size="medium" style="margin-right:4px" @click="theme_mode_change_click">
                <template #icon>
                  <n-icon size="20" :depth="3"><ColorBackground20Regular/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" style="margin-right:4px">
                <template #icon>
                  <n-icon size="20" :depth="3"><MenuIcon/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" style="margin-right:4px" @click="minimize">
                <template #icon>
                  <n-icon size="18" :depth="3"><ArrowMinimize16Regular/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" style="margin-right:4px" @click="maximize">
                <template #icon>
                  <n-icon size="24" :depth="3"><Maximize16Regular/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" style="margin-right:30px" @click="closeWindow">
                <template #icon>
                  <n-icon size="28" :depth="3"><Close/></n-icon>
                </template>
              </n-button>
            </section>
          </div>
        </n-layout>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
  <n-config-provider :theme="theme_app">
    <!-- n-card can change Bar_Music_Player(text color) -->
    <n-card
      style=" 
        position: fixed;left: 0;bottom: 0;
        width: 100vw;height: 80px;
        background-color: #00000000;
        z-index: 100;
        border-radius: 12px 12px 0px 0px;border: 0px #00000000">
      <Bar_Music_Player 
        :player="player"
        @player="get_player"
        @currentTime_added_value="get_currentTime_added_value"
        :play_go_index_time="play_go_index_time"

        @this_audio_lyrics_string="get_this_audio_lyrics_string"

        :this_audio_file_path="this_audio_file_path"
        @this_audio_file_path="get_this_audio_file_path"
        :this_audio_file_medium_image_url="this_audio_file_medium_image_url"
        @this_audio_file_medium_image_url="get_media_file_medium_image_url"
        :this_audio_refresh="this_audio_refresh"
        @this_audio_refresh="get_this_audio_refresh"
        :this_audio_singer_name="this_audio_singer_name"
        @this_audio_singer_name="get_this_audio_singer_name"
        :this_audio_song_name="this_audio_song_name"
        @this_audio_song_name="get_this_audio_song_name"
        :this_audio_album_id="this_audio_album_id"
        @this_audio_album_id="get_this_audio_album_id"
        :this_audio_album_name="this_audio_album_name"
        @this_audio_album_name="get_this_audio_album_name"

        :playlist_Files_temporary="playlist_Files_temporary"

        :player_show_click="player_show_click"
        @player_show_click="get_player_show_click"
        :view_music_player_show_complete="view_music_player_show_complete"
        @player_show_height="get_send_onclick"
        @isVisible_Music_PlayList="get_isVisible_Music_PlayList"
        @isVisible_Player_Sound_effects="get_isVisible_Player_Sound_effects"/>
    </n-card>
    <View_Screen_Music_Player 
      class="view_music_player"
      v-if="view_music_player_show"
      :style="{ height: `calc(100vh - ${margin_top_value_view_music_player}vh)` }"
      
      :player="player"
      :currentTime_added_value="currentTime_added_value"
      @play_go_index_time="get_play_go_index_time"
      :this_audio_lyrics_info_line_num="this_audio_lyrics_info_line_num"

      :this_audio_lyrics_string="this_audio_lyrics_string"
      :this_audio_lyrics_info_line="this_audio_lyrics_info_line"
      :this_audio_lyrics_info_time="this_audio_lyrics_info_time"
      
      :this_audio_file_path="this_audio_file_path"
      :this_audio_file_medium_image_url="this_audio_file_medium_image_url"
      :this_audio_refresh="this_audio_refresh"
      :this_audio_singer_name="this_audio_singer_name"
      :this_audio_song_name="this_audio_song_name"
      :this_audio_album_id="this_audio_album_id"
      :this_audio_album_name="this_audio_album_name"
      
      @player_show_click="get_player_show_click"
      :view_music_player_show_complete="view_music_player_show_complete">

    </View_Screen_Music_Player>
  </n-config-provider>
  <!-- right drwaer of music_playlist -->
  <n-config-provider :theme="null">
    <n-drawer 
      v-model:show="isVisible_Music_PlayList" 
      :width="470" 
      style="
        border-radius: 12px 0 0 12px;
        margin-top: 72px;margin-bottom:88px;
        background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);  
      ">
      <n-drawer-content v-if="isVisible_Music_PlayList">
        <template #header>
          <n-badge :value="playlist_Files_temporary.length" show-zero :max="9999" :offset="[24, 9]" style="margin-right:40px;">
            <span style="font-weight:600;font-size:20px;">播放列表</span>
          </n-badge>
          <n-button size="small" text style="position: absolute;right:140px;top:12px;" >
            <template #icon>
              <n-icon>
                <AddSquareMultiple20Regular/>
              </n-icon>
            </template>
            收藏全部
          </n-button>
          <n-button size="small" text style="position: absolute;right:70px;top:12px;">
            <template #icon>
              <n-icon>
                <Delete16Regular/>
              </n-icon>
            </template>
            清空
          </n-button>
        </template>
        <template #default>
          <Bar_Music_PlayList
            v-if="isVisible_Music_PlayList"

            @this_audio_lyrics_string="get_this_audio_lyrics_string"
            @media_file_path="media_file_path"
            @media_file_path_from_playlist="get_this_audio_file_path_from_playlist"
            @media_file_medium_image_url="get_media_file_medium_image_url"
            @this_audio_singer_name="get_this_audio_singer_name"
            @this_audio_song_name="get_this_audio_song_name"
            @this_audio_album_id="get_this_audio_album_id"
            @this_audio_album_name="get_this_audio_album_name"
            @data_select_Index="get_data_select_Index"
            @page_song_index="get_page_song_index"

            :playlist_Files_temporary="playlist_Files_temporary"
            :playlist_Files_selected="playlist_Files_selected"
            @playlist_Files_selected_set="set_playlist_Files_selected"
            @playlist_Files_selected_set_all="set_playlist_Files_selected_all">
          </Bar_Music_PlayList>
        </template>
      </n-drawer-content>
    </n-drawer>
  </n-config-provider>
  <!-- bottom drwaer of player sound effects -->
  <n-config-provider :theme="null">
    <n-drawer 
      v-model:show="isVisible_Player_Sound_effects"
      :width="500" 
      style="
        border-radius: 12px 0 0 12px;
        margin-top: calc(50vh - 280px);height: 560px;
        background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);  
      ">
      <n-drawer-content v-if="isVisible_Player_Sound_effects">
        <template #header>
          <span style="font-weight:600;font-size:20px;">音效设置</span>
        </template>
        <template #default>
          <n-tabs type="line" animated>
            <n-tab-pane name="001" tab="九歌音效插件">
              九歌音效插件
            </n-tab-pane>
            <n-tab-pane name="002" tab="均衡器(简易)">
              均衡器(简易)
            </n-tab-pane>
            <n-tab-pane name="003" tab="均衡器(专业)">
              均衡器(专业)
            </n-tab-pane>
            <n-tab-pane name="004" tab="多音轨">
              多音轨
            </n-tab-pane>
          </n-tabs>
        </template>
      </n-drawer-content>
    </n-drawer>
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
  .view_show {
    width: calc(100vw - 100px);
    height: calc(100vh - 200px);

    margin-top: 60px;
    margin-left: 30px;
  }
  .view_music_player{
    width: 100vw;
    z-index: 10;
    position: absolute;bottom: 0;left: 0;
    transition: height 0.2s;
  }
  .bar_top_setapp{
    width: 100vw;
    height: 60px;

    z-index: 1;

    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);

    -webkit-app-region: drag;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    background-color: #00000000;
  }
  nav {
    text-align: center;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
