<script setup lang="ts">
  ////// this_app resource of vicons_svg
  import {
    ArrowMinimize16Regular,
    DarkTheme24Filled,
    DocumentHeart20Regular,
    Flag16Regular,
    Home28Regular,
    Maximize16Regular,
    PeopleCommunity16Regular,
    SlideMicrophone32Regular,
    TextIndentIncreaseLtr20Filled as lyric,
  } from '@vicons/fluent'
  import {AlbumFilled, LibraryMusicOutlined, MusicNoteRound} from '@vicons/material'
  import {Close, Hearing, Menu as MenuIcon, UserAvatarFilledAlt,} from '@vicons/carbon'

  ////// i18n auto lang
  import { useI18n } from 'vue-i18n'
  const { t, d, n } = useI18n({
    inheritLocale: true
  })
  const languages = [
    {
      label: '简体中文',
      value: 'zhHans',
    },
    {
      label: '繁體中文',
      value: 'zhHant',
    },
    {
      label: 'English',
      value: 'en',
    },
    {
      label: 'Čeština',
      value: 'cs',
    },
    {
      label: 'Español',
      value: 'es',
    },
    {
      label: 'Deutsch',
      value: 'de',
    },
    {
      label: 'Français',
      value: 'fr',
    },
    {
      label: 'Italiano',
      value: 'it',
    },
    {
      label: '日本語',
      value: 'ja',
    },
    {
      label: 'Nederlands',
      value: 'nl',
    },
    {
      label: 'Português (Brasil)',
      value: 'ptBr',
    },
    {
      label: 'Polski',
      value: 'pl',
    },
    {
      label: 'Русский',
      value: 'ru',
    },
    {
      label: 'Srpski',
      value: 'sr',
    },
    {
      label: 'Svenska',
      value: 'sv',
    },
  ];
  function get_update_lang(value:any){
    console.log(value)
  }
  const computed_i18n_Label_ViewPageConfig_FilterAllSong_1 = computed(() => t('nsmusics.view_page.allSong'));
  const computed_i18n_Label_ViewPageConfig_FilterLoveSong_2 = computed(() => t('nsmusics.view_page.loveSong'));
  const computed_i18n_Label_ViewPageConfig_FilterAllAlbum_1 = computed(() => t('nsmusics.view_page.allAlbum'));
  const computed_i18n_Label_ViewPageConfig_FilterLoveAlbum_2 = computed(() => t('nsmusics.view_page.loveAlbum'));
  const computed_i18n_Label_ViewPageConfig_FilterAllArtist_1 = computed(() => t('nsmusics.view_page.allArtist'));
  const computed_i18n_Label_ViewPageConfig_FilterLoveArtist_2 = computed(() => t('nsmusics.view_page.loveArtist'));
  const computed_i18n_Label_ViewPageConfig_FilterRecentPlay = computed(() => t('nsmusics.view_page.recentPlay'));

  ////// this_app components of navie ui
  import type {GlobalTheme, MenuOption} from 'naive-ui'
  // app theme_color
  ////// this_app
  import {darkTheme, dateZhCN, lightTheme, NConfigProvider, NIcon, zhCN} from 'naive-ui'
  // vue3 function
  import {h, onMounted, ref, computed} from 'vue';
  import routers from './router'
  import {RouterLink, RouterView, useRouter} from 'vue-router';
  // audio_class & player_bar class
  import {Audio_howler} from '@/models/song_Audio_Out/Audio_howler';
  import Bar_Music_Player from '@/components/Bar_Music_Player.vue'
  // current_audioList class
  import Bar_Music_PlayList from '@/components/Bar_Music_PlayList.vue'
  // player class
  import View_Screen_Music_Player from '@/views/View_Screen_Music_Player.vue'
  import {Player_UI_Theme_State} from '@/features/player/Player_UI_Theme_State'
  import {System_Configs_Read} from '@/features/system/System_Configs_Read'
  import {App_Configs} from '@/models/app_Configs_For_Sqlite/class_App_Configs';
  import {Player_Configs_of_Audio_Info} from '@/models/app_Configs_For_Sqlite/class_Player_Configs_of_Audio_Info';
  import {Player_Configs_of_UI} from '@/models/app_Configs_For_Sqlite/class_Player_Configs_of_UI';

  const crypto = require('crypto');
  function generateEncryptedPassword(password: string): { salt: string, token: string } {
      const saltLength = 6;
      const salt = generateRandomString(saltLength);
      const token = crypto.createHash('md5').update(password + salt, 'utf8').digest('hex');
      return { salt, token };
  }
  function generateRandomString(length: number): string {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let randomString = '';
      for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters[randomIndex];
      }
      return randomString;
  }
  const { salt, token } = generateEncryptedPassword('sesame');
  console.log('s-Salt:', salt);
  console.log('t-Token:', token);

  // naive ui of n-menu(app left menu bar)
  function renderIcon (icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
  function renderRouterLink (nameValue: any,defaultValue: any){
    return () => h(RouterLink, {to: { name: nameValue }}, { default: () => defaultValue })
  }
  const create_menuOptions = (): MenuOption[] => {
    return [
      {label: computed(() => renderRouterLink('View_Menu_AppSetting',t('common.menu'))),key: 'go_back_menu',icon: renderIcon(MenuIcon),},
      {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
      {label: computed(() => renderRouterLink('View_Home',t('common.home'))),key: 'go_back_home',icon: renderIcon(Home28Regular),},
      {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
      {label: computed(() => renderRouterLink('View_Album_List_ALL',t('entity.album_other'))),key: 'go_albums_list',icon: renderIcon(AlbumFilled)},
      {label: computed(() => renderRouterLink('View_Song_List_ALL',t('entity.track_other'))),key: 'go_songs_list',icon: renderIcon(MusicNoteRound)},
      {label: computed(() => renderRouterLink('View_Artist_List_ALL',t('entity.artist_other'))),key: 'go_artist_list',icon: renderIcon(UserAvatarFilledAlt)},
      {label: computed(() => renderRouterLink('View_Home',t('entity.genre_other'))),key: 'go_other',icon: renderIcon(Flag16Regular)},
      {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
      {label: computed(() => renderRouterLink('View_Home',t('nsmusics.siderbar_menu.guessLike'))),key: 'go_other',icon: renderIcon(DocumentHeart20Regular)},
      {label: computed(() => renderRouterLink('View_Home',t('nsmusics.siderbar_menu.karaoke'))),key: 'go_other',icon: renderIcon(SlideMicrophone32Regular)},
      {label: computed(() => renderRouterLink('View_Home',t('nsmusics.siderbar_menu.identifySong'))),key: 'go_other',icon: renderIcon(Hearing)},
      {label: computed(() => renderRouterLink('View_Home',t('nsmusics.siderbar_menu.scoreGeneration'))),key: 'go_other',icon: renderIcon(LibraryMusicOutlined)},
      {label: computed(() => renderRouterLink('View_Home',t('nsmusics.siderbar_menu.lyricsProduction'))),key: 'go_other',icon: renderIcon(lyric)},
      {label: computed(() => renderRouterLink('View_Home',t('nsmusics.siderbar_menu.musicCommunity'))),key: 'go_other',icon: renderIcon(PeopleCommunity16Regular)},
    ]
  };
  const menuOptions = ref<MenuOption[]>(create_menuOptions())
  const app_left_menu_select_activeKey = ref<string | null>(null)
  const app_left_menu_collapsed = ref(false)
  // node function
  const path = require('path');
  const fs = require('fs');

  ////// this_app theme_color
  const theme = ref<GlobalTheme | null>(null)
  const theme_name = ref<string>()
  const theme_app =ref<GlobalTheme | null>(null)
  const theme_bar_top_setapp = ref('transparent')
  const change_page_header_color = ref(false)
  const theme_normal_mode_click = () => {
    theme.value = lightTheme
    theme_name.value = 'lightTheme'
    theme_app.value = lightTheme
    change_page_header_color.value = false
  }
  const theme_dark_mode_click = () => {
    theme.value = darkTheme
    theme_name.value = 'darkTheme'
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

////// this_app sqlite db
  let navidrome_db = path.resolve('resources/navidrome.db');
  
  ////// this_app BrowserWindow
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
  const window_innerWidth = ref<number>(window.innerWidth)
  window.addEventListener('resize', () => {
    window_innerWidth.value = window.innerWidth;
  });

  ////// view musicplayer
  // player view of open&close
  const player_show_hight_animation_value = ref(100);
  const player_show = ref(false)
  const player_show_complete = ref(true)
  const get_playerbar_to_Switch_playerview = (value:any) => {
    player_show_complete.value = false

    if(value === 0)
      player_show.value = true
    setTimeout(() => {
      player_show_hight_animation_value.value = value
      setTimeout(() => {
        if(value === 0){
          theme_app.value = darkTheme
        }else{
          theme_app.value = theme.value
          player_show.value = false
        }
      }, 200);
    }, 30);

    // Vue UI WYSIWYG
    router_select_model_menu.value = false
    router_select_model_home.value = false
    router_select_model_media.value = false
    router_select_model_album.value = false
    router_select_model_artist.value = false
    setTimeout(() => {
      if(value != 0){
        if(app_left_menu_select_activeKey.value === 'go_back_menu'){
          router_select_model_menu.value = true;
        }else if(app_left_menu_select_activeKey.value === 'go_back_home'){
          router_select_model_home.value = true;
        }else if(app_left_menu_select_activeKey.value === 'go_albums_list'){
          router_select_model_album.value = true;
        }else if(app_left_menu_select_activeKey.value === 'go_songs_list'){
          router_select_model_media.value = true;
        }else if(app_left_menu_select_activeKey.value === 'go_artist_list'){
          router_select_model_artist.value = true;
        }
      }

      player_show_complete.value = true
    }, 600);

    ipcRenderer.send('window-gc');
    const { webFrame } = require('electron');
    webFrame.clearCache();
  }
  const player_collapsed_action_bar_of_Immersion_model = ref(false);
  const get_player_collapsed = (value:any) => {
    player_collapsed_action_bar_of_Immersion_model.value = value
  }
  const player_show_click = ref(false);
  const get_playerview_to_close_playerview = (value:any) => {
    player_show_click.value = value
    console.log('player_show_click：'+value)
  }
  // player view of theme_all
  const player_UI_Theme_State = ref(new Player_UI_Theme_State());
  const get_player_UI_Theme = (value: any) => {
    player_UI_Theme_State.value = value;
  }

  ////// open bar audio_playlist
  const Playlist_Show = ref(false);
  const get_Playlist_Show = (value:any) => {
    Playlist_Show.value = value
    console.log('Playlist_Show：'+value)
  }
  ////// open bar audio_sounde_effects
  const Player_Show_Sound_effects = ref(false);
  const get_Player_Show_Sound_effects = (value:any) => {
    Player_Show_Sound_effects.value = value
    console.log('Player_Show_Sound_effects：'+value)
  }
  ////// open bar audio_sounde_speed
  const Player_Show_Sound_speed = ref(false);
  const get_Player_Show_Sound_speed = (value:any) => {
    Player_Show_Sound_speed.value = value
    console.log('Player_Show_Sound_speed：'+value)
  }
  ////// open bar audio_more_info
  const Player_Show_Sound_more = ref(false);
  const get_Player_Show_Sound_more = (value:any) => {
    Player_Show_Sound_more.value = value
    console.log('Player_Show_Sound_more：'+value)
  }

  ////// player audio_info
  const this_audio_file_path = ref<string>('');
  function media_file_path(value: any) {
    this_audio_file_path.value = value
    get_this_audio_restart_play(true)
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

    media_Files_temporary.value.forEach((item, index) => {
      item.playing = item.id === this_audio_song_id.value;
    });
    playlist_Files_temporary.value.forEach((item, index) => {
      item.playing = item.id === this_audio_song_id.value;
    });
  }
  const this_audio_file_medium_image_url = ref(path.resolve('resources/img/error_album.jpg'));
  function get_media_file_medium_image_url(value: any) {
    this_audio_file_medium_image_url.value = value
    get_this_audio_restart_play(true)
    console.log('this_audio_file_medium_image_url'+value)

    page_top_album_image_url.value = '';
    page_top_album_image_url.value = value;
  }
  const this_audio_restart_play = ref<boolean>(false)
  function get_this_audio_restart_play(value: any) {
    this_audio_restart_play.value = value;
    console.log('this_audio_restart_play：'+value)
  }
  const this_audio_is_playing = ref<boolean>(true)
  function get_this_audio_is_playing(value: any) {
    this_audio_is_playing.value = value;
    console.log('this_audio_is_playing：'+value)
  }
  //
  const this_audio_singer_name = ref<string>('Xiang Cheng')
  function get_this_audio_singer_name(value: any) {
    this_audio_singer_name.value = value
    console.log('this_audio_singer_name：'+value)
  }
  const this_audio_singer_id = ref<string>('')
  function get_this_audio_singer_id(value: any) {
    this_audio_singer_id.value = value
    console.log('this_audio_singer_id：'+value)
  }
  const this_audio_singer_rating = ref<number>(0)
  function get_this_audio_singer_rating(value: any) {
    this_audio_singer_rating.value = value
    console.log('this_audio_singer_rating：'+value)
  }
  const this_audio_singer_favorite = ref<number>(0)
  function get_this_audio_singer_favorite(value: any) {
    this_audio_singer_favorite.value = value
    console.log('this_audio_singer_favorite：'+value)
  }
  const this_audio_song_name = ref<string>('NSMusicS')
  function get_this_audio_song_name(value: any) {
    this_audio_song_name.value = value
    console.log('this_audio_song_name：'+value)
  }
  const this_audio_song_id = ref<string>('')
  function get_this_audio_song_id(value: any) {
    this_audio_song_id.value = value
    console.log('this_audio_song_id：'+value)
  }
  const this_audio_song_rating = ref<number>(0)
  function get_this_audio_song_rating(value: any) {
    this_audio_song_rating.value = value
    console.log('this_audio_song_rating：'+value)

    media_Files_temporary.value.forEach((item, index) => {
      if(item.id === this_audio_song_id.value)
        item.rating = this_audio_song_rating.value
    });
  }
  const this_audio_song_favorite = ref<any>(0)
  function get_this_audio_song_favorite(value: any) {
    this_audio_song_favorite.value = value
    console.log('this_audio_song_favorite：'+value)

    media_Files_temporary.value.forEach((item, index) => {
      if(item.id === this_audio_song_id.value)
        item.favorite = this_audio_song_favorite.value
    });
  }
  const this_audio_album_name = ref<string>('A local music software that is expected to support multiple platforms with AI capabilities and multimodal features.')
  function get_this_audio_album_name(value: any) {
    this_audio_album_name.value = value
    console.log('this_audio_album_name：'+value)
    page_top_album_name.value = value;
  }
  const this_audio_album_id = ref<string>('')
  function get_this_audio_album_id(value: any) {
    this_audio_album_id.value = value
    console.log('this_audio_album_id：'+value)
    page_top_album_id.value = value;
  }
  const this_audio_album_rating = ref<string>('') // album model
  function get_this_audio_album_rating(value: any) {
    this_audio_album_rating.value = value
    console.log('this_audio_album_rating：'+value)
  }
  const this_audio_album_favorite = ref<string>('') // album model
  function get_this_audio_album_favorite(value: any) {
    this_audio_album_favorite.value = value
    console.log('this_audio_album_favorite：'+value)
  }
  //
  const this_audio_Index_of_absolute_positioning_in_list = ref<number>(-1)
  function get_this_audio_Index_of_absolute_positioning_in_list(value: any) {
    this_audio_Index_of_absolute_positioning_in_list.value = value
    console.log('this_audio_Index_of_absolute_positioning_in_list：'+value)
  }
  // player audio_info of router_page_init_data
  const page_top_album_image_url = ref<string>(path.resolve('resources/img/error_album.jpg'))
  const page_top_album_id = ref<string>('')
  const page_top_album_name = ref<string>('')
  // player audio_infos of playlist
  const playlist_Files_temporary = ref<Media_File[]>([]);
  const this_audio_file_path_from_playlist = ref(false);
  const fetchData_This_AlbumOrArtist_PlayMedia_Model = ref<boolean>(false);
  function get_this_audio_file_path_from_playlist (value: any) {
    this_audio_file_path_from_playlist.value = value
    console.log('this_audio_file_path_from_playlist：'+value)
  }
  // player audio_infos of audio_page
  const media_Files_temporary = ref<Media_File[]>([])
  const media_Files_selected = ref<Media_File[]>([])
  function set_media_Files_selected(value: Media_File) {
    if (value.selected) {
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
    if (value) {
      media_Files_selected.value = media_Files_temporary.value.slice();
    } else {
      media_Files_selected.value = [];
    }
    console.log('media_Files_selected：'+value)
  }

  ////// player lyric_info
  const this_audio_lyrics_string = ref<string>('')
  const this_audio_lyrics_info_line = ref<string[]>([])
  const this_audio_lyrics_info_time = ref<number[]>([])
  const this_audio_lyrics_info_line_num = ref(28)
  function get_this_audio_lyrics_string(value: any) {
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
      this_audio_lyrics_info_time.value[i] = get_player_go_lyricline_index_of_audio_play_progress_of_convertToMilliseconds(line_times[i]);
    }
    //
    // console.log('this_audio_lyrics：'+value)
  }

  ////// this_app audio(Media) Class
  let player = new Audio_howler();
  const player_silder_currentTime_added_value = ref(0);
  function get_player_silder_currentTime_added_value(value: any) {
    player_silder_currentTime_added_value.value = value
    console.log('player_silder_currentTime_added_value：'+value)
  }
  const player_go_lyricline_index_of_audio_play_progress = ref(0);
  function get_player_go_lyricline_index_of_audio_play_progress(value: any) {
    player_go_lyricline_index_of_audio_play_progress.value = value
    console.log('get_play_go_index_time：'+value)
  }
  function get_player_go_lyricline_index_of_audio_play_progress_of_convertToMilliseconds(timeString: { split: (arg0: string) => [any, any] }) {
    const [minutes, seconds] = timeString.split(':');
    return (parseInt(minutes) * 60 + parseInt(seconds)) * 1000;
  }

  ///// view of View_Home
  const fetchData_Home = async () => { 

  };
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

  ///// view of media
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
      page_songlists_keyword.value = '';
      fix_router_history_of_Media_scroller_value(router_history_model_of_Media_scroller_value.value) // 保留此滚轮值(上次浏览位置)
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
    
    app_left_menu_select_activeKey.value = 'go_songs_list'
    router.push('View_Song_List_ALL')
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
  const Init_page_songlists_statistic_Data = (db: any) => {
    const stmt_media_file_count = db.prepare('SELECT COUNT(*) AS count FROM media_file');
    page_songlists_options.value = [];
    page_songlists_statistic.value = [];
    page_songlists.value = []
    //////
    const temp_Play_List_ALL: Play_List = {
      label: '所有歌曲',
      value: 'song_list_all',
      id: 'song_list_all',
      name: '所有歌曲',
      comment: '所有歌曲',
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

      // Init media_model data
      Init_page_songlists_statistic_Data(db)
      
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
        stmt_media_file_string = `SELECT * FROM media_file ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
        stmt_media_file = db.prepare(stmt_media_file_string);
        try{ // if stmt_media_file is empty, then try to find artist_id or album_id
          if(stmt_media_file.get() === undefined){
            keywordFilter = `WHERE artist_id = '${page_songlists_keyword.value}'`
            stmt_media_file_string = `SELECT * FROM media_file ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
            stmt_media_file = db.prepare(stmt_media_file_string);
            if(stmt_media_file.get() === undefined){
              keywordFilter = `WHERE album_id = '${page_songlists_keyword.value}'`
              stmt_media_file_string = `SELECT * FROM media_file ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
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
          menu_select_active_key: 'go_songs_list',
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
          page_lists_scrollindex: router_history_model_of_Media_scroller_value.value,
        };
        add_router_history_of_Media(routerDate);// 重复路由不添加
        //////
      }else{
        if (router_select_history_date_of_Media.value){
          router.push('View_Song_List_ALL')
          app_left_menu_select_activeKey.value = 'go_songs_list'
          router_select_model_media.value = true;
          page_songlists_keyword.value = router_select_history_date_of_Media.value.page_lists_keyword;
          page_songlists_selected.value = router_select_history_date_of_Media.value.page_lists_selected;
          page_songlists_options_Sort_key.value = [
            {
              columnKey:router_select_history_date_of_Media.value.columnKey,
              order:router_select_history_date_of_Media.value.order
            }
          ];
          router_history_model_of_Media_scroller_value.value = router_select_history_date_of_Media.value.page_lists_scrollindex;
          stmt_media_file = db.prepare(router_select_history_date_of_Media.value.stmt_string);
        }
        router_history_model_of_Media.value = 0;
      }
      const rows = stmt_media_file.all();
      rows.forEach((row: Media_File, index: number) => {
        row.absoluteIndex = index;
        row.selected = false;
        row.duration_txt = formatTime(row.duration);
        if (row.path.indexOf('mp3') > 0)
          row.medium_image_url = row.path.replace('mp3', 'jpg');
        else if (row.path.indexOf('flac') > 0)
          row.medium_image_url = row.path.replace('flac', 'jpg');
        else
          row.medium_image_url = '../../../resources/img/error_album.jpg';
        media_Files_temporary.value.push(row);
      });
      ////// find favorite for media_Files_temporary
      const stmt_media_Annotation_Starred_Items = db.prepare(`
        SELECT item_id FROM annotation 
        WHERE starred = 1 AND item_type='media_file'
      `);
      const annotations = stmt_media_Annotation_Starred_Items.all();
      for (let i = 0; i < media_Files_temporary.value.length; i++) {
        media_Files_temporary.value[i].favorite = !!annotations.some((annotation: {
          item_id: string
        }) => annotation.item_id === media_Files_temporary.value[i].id);
      }
      ////// find rating for media_Files_temporary
      const stmt_media_Annotation_Rating_Items = db.prepare(`
          SELECT item_id, rating FROM annotation 
          WHERE rating > 0 AND item_type='media_file'
      `);
      const annotations_rating = stmt_media_Annotation_Rating_Items.all();
      for (let i = 0; i < media_Files_temporary.value.length; i++) {
          const mediaFile = media_Files_temporary.value[i];
          const matchingAnnotation = annotations_rating.find((annotation: { item_id: string, rating: number }) => annotation.item_id === mediaFile.id);
          if (matchingAnnotation)
              mediaFile.rating = matchingAnnotation.rating;
          else
              mediaFile.rating = 0;
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
      media_Files_temporary.value.forEach((item, index) => {
        item.absoluteIndex = index + 1;
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      db.close();
      console.log('db.close().......');
      db = null;
    }
  };

  ////// view of album
  const album_Files_temporary = ref<Album[]>([]);
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
      page_albumlists_keyword.value = '';
      fix_router_history_of_Album_scroller_value(router_history_model_of_Album_scroller_value.value) // 保留此滚轮值(上次浏览位置)
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
  const Init_page_albumlists_statistic_Data = (db: any) => {
    const stmt_album_count = db.prepare('SELECT COUNT(*) AS count FROM album');
    //
    page_albumlists_options.value = [];
    page_albumlists_statistic.value = [];
    page_albumlists.value = []
    //////
    const temp_Play_List_ALL: Play_List = {
      label: '所有专辑',
      value: 'album_list_all',
      id: 'album_list_all',
      name: '所有专辑',
      comment: '所有专辑',
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

      // Init album_model data
      Init_page_albumlists_statistic_Data(db)

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
        stmt_album_string = `SELECT * FROM album ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
        stmt_album = db.prepare(stmt_album_string);
        //////
        if (router_select_history_date_of_Album.value && page_albumlists_keyword_reset.value === true){
          remove_router_history_of_Album(router_select_history_date_of_Album.value.id);// 若存在新操作，则覆盖后续的路由
          page_albumlists_keyword_reset.value = false;
        }
        const routerDate: Router_date = {
          id: router_history_datas_of_Album.value ? router_history_datas_of_Album.value.length + 1 : 1,
          menu_select_active_key: 'go_albums_list',
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
          page_lists_scrollindex: router_history_model_of_Album_scroller_value.value,
        };
        add_router_history_of_Album(routerDate);// 重复路由不添加
        //////
      }else{
        if (router_select_history_date_of_Album.value){
          router.push('View_Album_List_ALL')
          app_left_menu_select_activeKey.value = 'go_albums_list'
          router_select_model_album.value = true;
          page_albumlists_keyword.value = router_select_history_date_of_Album.value.page_lists_keyword;
          page_albumlists_selected.value = router_select_history_date_of_Album.value.page_lists_selected;
          page_albumlists_options_Sort_key.value = [
            {
              columnKey:router_select_history_date_of_Album.value.columnKey,
              order:router_select_history_date_of_Album.value.order
            }
          ];
          router_history_model_of_Album_scroller_value.value = router_select_history_date_of_Album.value.page_lists_scrollindex;
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
          row.medium_image_url = '../../../resources/img/error_album.jpg';
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
      moment = null;
      ////// find favorite for album_Files_temporary
      const stmt_album_Annotation_Starred_Items = db.prepare(`
        SELECT item_id FROM annotation 
        WHERE starred = 1 AND item_type='album'
      `);
      const annotations = stmt_album_Annotation_Starred_Items.all();
      for (let i = 0; i < album_Files_temporary.value.length; i++) {
        album_Files_temporary.value[i].favorite = !!annotations.some((annotation: {
          item_id: string
        }) => annotation.item_id === album_Files_temporary.value[i].id);
      }
      ////// find rating for album_Files_temporary
      const stmt_album_Annotation_Rating_Items = db.prepare(`
          SELECT item_id, rating FROM annotation 
          WHERE rating > 0 AND item_type='album'
      `);
      const annotations_rating = stmt_album_Annotation_Rating_Items.all();
      for (let i = 0; i < album_Files_temporary.value.length; i++) {
          const albumFile = album_Files_temporary.value[i];
          const matchingAnnotation = annotations_rating.find((annotation: { item_id: string, rating: number }) => annotation.item_id === albumFile.id);
          if (matchingAnnotation)
              albumFile.rating = matchingAnnotation.rating;
          else
              albumFile.rating = 0;
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
      album_Files_temporary.value.forEach((item, index) => {
        item.absoluteIndex = index + 1;
      });
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
      get_this_audio_album_favorite(playlist_Files_temporary.value[0].favorite)
      get_this_audio_album_name(playlist_Files_temporary.value[0].album)
      get_this_audio_Index_of_absolute_positioning_in_list(playlist_Files_temporary.value[0].absoluteIndex)
    }
  }

  ////// view of artist
  const artist_Files_temporary = ref<Artist[]>([]);
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
      page_artistlists_keyword.value = '';
      fix_router_history_of_Artist_scroller_value(router_history_model_of_Artist_scroller_value.value) // 保留此滚轮值(上次浏览位置)
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
  const Init_page_artistlists_statistic_Data = (db: any) => {
    const stmt_artist_count = db.prepare('SELECT COUNT(*) AS count FROM artist');
    //
    page_artistlists_options.value = [];
    page_artistlists_statistic.value = [];
    page_artistlists.value = []
    //////
    const temp_Play_List_ALL: Play_List = {
      label: '所有歌手',
      value: 'artist_list_all',
      id: 'artist_list_all',
      name: '所有歌手',
      comment: '所有歌手',
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

      // Init artist_model data
      Init_page_artistlists_statistic_Data(db)

      // load artist_Files_temporary data
      if(router_history_model_of_Artist.value === 0){
        const sortKey = page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
          page_artistlists_options_Sort_key.value[0].columnKey : 'id';
        const sortOrder = page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
          page_artistlists_options_Sort_key.value[0].order.replace('end', '') : '';
        let keywordFilter = page_artistlists_keyword.value.length > 0 ?
          `WHERE name LIKE '%${page_artistlists_keyword.value}%' OR external_info_updated_at LIKE '%${page_artistlists_keyword.value}%'` :
          '';
        stmt_artist_string = `SELECT * FROM artist ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
        stmt_artist = db.prepare(stmt_artist_string);
        //////
        if (router_select_history_date_of_Artist.value && page_artistlists_keyword_reset.value === true){
          remove_router_history_of_Artist(router_select_history_date_of_Artist.value.id);// 若存在新操作，则覆盖后续的路由
          page_artistlists_keyword_reset.value = false;
        }
        const routerDate: Router_date = {
          id: router_history_datas_of_Artist.value ? router_history_datas_of_Artist.value.length + 1 : 1,
          menu_select_active_key: 'go_artist_list',
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
          page_lists_scrollindex: router_history_model_of_Artist_scroller_value.value,
        };
        add_router_history_of_Artist(routerDate);// 重复路由不添加
        //////
      }else{
        if (router_select_history_date_of_Artist.value){
          router.push('View_Artist_List_ALL')
          app_left_menu_select_activeKey.value = 'go_artist_list'
          router_select_model_artist.value = true;
          page_artistlists_keyword.value = router_select_history_date_of_Artist.value.page_lists_keyword;
          page_artistlists_selected.value = router_select_history_date_of_Artist.value.page_lists_selected;
          page_artistlists_options_Sort_key.value = [
            {
              columnKey:router_select_history_date_of_Artist.value.columnKey,
              order:router_select_history_date_of_Artist.value.order
            }
          ];
          router_history_model_of_Artist_scroller_value.value = router_select_history_date_of_Artist.value.page_lists_scrollindex;
          stmt_artist = db.prepare(router_select_history_date_of_Artist.value.stmt_string);
        }
        router_history_model_of_Artist.value = 0;
      }
      const stmt_media_file = db.prepare(`SELECT * FROM media_file`);
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
              row.medium_image_url = '../../../resources/img/error_album.jpg';
            break;
          }
          if (j === pathfiles.length - 1) {
            row.medium_image_url = '../../../resources/img/error_album.jpg';
          }
        }
        artist_Files_temporary.value.push(row);
      });
      rows.length = 0
      ////// find favorite for artist_Files_temporary
      const stmt_artist_Annotation_Starred_Items = db.prepare(`
        SELECT item_id FROM annotation 
        WHERE starred = 1 AND item_type='artist'
      `);
      const annotations = stmt_artist_Annotation_Starred_Items.all();
      for (let i = 0; i < artist_Files_temporary.value.length; i++) {
        artist_Files_temporary.value[i].favorite = !!annotations.some((annotation: {
          item_id: string
        }) => annotation.item_id === artist_Files_temporary.value[i].id);
      }
      ////// find rating for artist_Files_temporary
      const stmt_artist_Annotation_Rating_Items = db.prepare(`
          SELECT item_id, rating FROM annotation 
          WHERE rating > 0 AND item_type='artist'
      `);
      const annotations_rating = stmt_artist_Annotation_Rating_Items.all();
      for (let i = 0; i < artist_Files_temporary.value.length; i++) {
          const artistFile = artist_Files_temporary.value[i];
          const matchingAnnotation = annotations_rating.find((annotation: { item_id: string, rating: number }) => annotation.item_id === artistFile.id);
          if (matchingAnnotation)
              artistFile.rating = matchingAnnotation.rating;
          else
              artistFile.rating = 0;
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
      get_this_audio_album_favorite(playlist_Files_temporary.value[0].favorite)
      get_this_audio_album_name(playlist_Files_temporary.value[0].album)
      get_this_audio_Index_of_absolute_positioning_in_list(playlist_Files_temporary.value[0].absoluteIndex)
    }
  }

  ////// router custom for history_search 
  // history_search model basic info
  const find_music_model = ref<Boolean>(false)
  const find_album_model = ref<Boolean>(false)
  const find_artist_model = ref<Boolean>(false)
  function get_media_list_of_album_id_by_album_info(value: any) {
    console.log('get_media_list_of_album_model：'+value)
    // open media_files model，keywords set
    page_songlists_keyword.value = value
    page_songlists_get_keyword_model_num.value = 3
    find_music_model.value = true

    router.push('View_Song_List_ALL')
    app_left_menu_select_activeKey.value = 'go_songs_list'
  }
  function get_album_list_of_artist_id_by_album_info(value: any) {
    console.log('get_album_list_of_artist_model：'+value)
    // open album_files model，keywords set
    page_albumlists_keyword.value = value
    page_albumlists_get_keyword_model_num.value = 2
    find_album_model.value = true
  }
  function get_album_list_of_artist_id_by_artist_info(value: any) {
    console.log('get_album_list_of_artist_model：'+value)
    // open album_files model，keywords set
    page_albumlists_keyword.value = value
    page_albumlists_get_keyword_model_num.value = 2
    find_artist_model.value = false

    router.push('View_Album_List_ALL')
    app_left_menu_select_activeKey.value = 'go_albums_list'
  }
  // router Data_sources and rendering
  const router_select_model_menu = ref<Boolean>(false)
  const router_select_model_home = ref<Boolean>(false)
  const router_select_model_media = ref<Boolean>(false)
  const router_select_model_album = ref<Boolean>(false)
  const router_select_model_artist = ref<Boolean>(false)
  function clear_Files_temporary() {
    router_select_model_menu.value = false
    router_select_model_home.value = false
    router_select_model_media.value = false
    router_select_model_album.value = false
    router_select_model_artist.value = false
    media_Files_temporary.value = [];
    album_Files_temporary.value = [];
    artist_Files_temporary.value = [];
    ipcRenderer.send('window-gc');
    const { webFrame } = require('electron');
    webFrame.clearCache();
  }
  // router custom class
  const router = useRouter();
  const router_name = ref('')
  routers.beforeEach((to, from, next) => {
    if(to.name !== from.name){
      clear_Files_temporary()
      next();
    }
  });
  routers.afterEach((to, from) => {
    if(to.name !== from.name){
      clear_Files_temporary()
      if(to.name === 'View_Menu_AppSetting'){
        router_select_model_menu.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Home'){
        router_select_model_home.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Song_List_ALL'){
        router_select_model_media.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Album_List_ALL'){
        router_select_model_album.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Artist_List_ALL'){
        router_select_model_artist.value = true
        router_name.value = to.name
      }
    }
  });
  const get_router_select = (value: any) => {
    ////// 
    if(value === 'View_Home'){
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
  // history router of media
  const router_history_model_of_Media_scroll = ref<Boolean>(false)
  const get_router_history_model_of_Media_scroll = (value: any) => {
    router_history_model_of_Media_scroll.value = value
    console.log('router_history_model_of_Media_scroll：'+value)
  }
  const router_history_model_of_Media_scroller_value = ref<number>(0)
  function get_router_history_model_of_Media_scroller_value (value: any) {
    if(value !== 0){
      router_history_model_of_Media_scroller_value.value = value
      console.log('router_history_model_of_Media_scroller_value：'+value)
    }
  }
  const router_history_model_of_Media = ref<number>(0)
  function get_router_history_model_of_Media(value: any) {
    if (value !== 0) {
      router_history_model_of_Media.value = value;
      const currentIndex = router_history_datas_of_Media.value.findIndex(item => item.id === (router_select_history_date_of_Media.value?.id ?? ''));
      if (currentIndex !== -1) {
        const newIndex = currentIndex + value;
        if (newIndex >= 0 && newIndex < router_history_datas_of_Media.value.length) {      
          fix_router_history_of_Media_scroller_value(router_history_model_of_Media_scroller_value.value) // 保留此滚轮值(上次浏览位置)
          router_select_history_date_of_Media.value = router_history_datas_of_Media.value[newIndex];
          clear_Files_temporary();
          const selectedRouterName = router_select_history_date_of_Media.value.router_name;
          if (selectedRouterName === 'View_Song_List_ALL') {
            router_select_model_media.value = true;
            fetchData_Media();
            router_history_model_of_Media_scroll.value = true;
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
  const fix_router_history_of_Media_scroller_value = (value: number) => {
    const index = router_history_datas_of_Media.value.findIndex(item => item.id === (router_select_history_date_of_Media.value?.id ?? ''));
    if (index !== -1) {
      router_history_datas_of_Media.value[index].page_lists_scrollindex = value;
    }  
  }
  // history router of album
  const router_history_model_of_Album_scroll = ref<Boolean>(false)
  const get_router_history_model_of_Album_scroll = (value: any) => {
    router_history_model_of_Album_scroll.value = value
    console.log('router_history_model_of_Album_scroll：'+value)
  }
  const router_history_model_of_Album_scroller_value = ref<number>(0)
  function get_router_history_model_of_Album_scroller_value (value: any) {
    if(value !== 0){
      router_history_model_of_Album_scroller_value.value = value
      console.log('router_history_model_of_Album_scroller_value：'+value)
    }
  }
  const router_history_model_of_Album = ref<number>(0)
  function get_router_history_model_of_Album(value: any) {
    if (value !== 0) {
      router_history_model_of_Album.value = value;
      const currentIndex = router_history_datas_of_Album.value.findIndex(item => item.id === (router_select_history_date_of_Album.value?.id ?? ''));
      if (currentIndex !== -1) {
        const newIndex = currentIndex + value;
        if (newIndex >= 0 && newIndex < router_history_datas_of_Album.value.length) {
          fix_router_history_of_Album_scroller_value(router_history_model_of_Album_scroller_value.value) // 保留此滚轮值(上次浏览位置)
          router_select_history_date_of_Album.value = router_history_datas_of_Album.value[newIndex];
          clear_Files_temporary();
          const selectedRouterName = router_select_history_date_of_Album.value.router_name;
          if (selectedRouterName === 'View_Album_List_ALL') {
            router_select_model_album.value = true;
            fetchData_Album();
            router_history_model_of_Album_scroll.value = true;
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
  const fix_router_history_of_Album_scroller_value = (value: number) => {
    const index = router_history_datas_of_Album.value.findIndex(item => item.id === (router_select_history_date_of_Album.value?.id ?? ''));
    if (index !== -1) {
      router_history_datas_of_Album.value[index].page_lists_scrollindex = value;
    }  
  }
  // history router of artist
  const router_history_model_of_Artist_scroll = ref<Boolean>(false)
  const get_router_history_model_of_Artist_scroll = (value: any) => {
    router_history_model_of_Artist_scroll.value = value
    console.log('router_history_model_of_Artist_scroll：'+value)
  }
  const router_history_model_of_Artist_scroller_value = ref<number>(0)
  function get_router_history_model_of_Artist_scroller_value (value: any) {
    if(value !== 0){
      router_history_model_of_Artist_scroller_value.value = value
      console.log('router_history_model_of_Artist_scroller_value：'+value)
    }
  }
  const router_history_model_of_Artist = ref<number>(0)
  function get_router_history_model_of_Artist(value: any) {
    if (value !== 0) {
      router_history_model_of_Artist.value = value;
      const currentIndex = router_history_datas_of_Artist.value.findIndex(item => item.id === (router_select_history_date_of_Artist.value?.id ?? ''));
      if (currentIndex !== -1) {
        const newIndex = currentIndex + value;
        if (newIndex >= 0 && newIndex < router_history_datas_of_Artist.value.length) {
          fix_router_history_of_Artist_scroller_value(router_history_model_of_Artist_scroller_value.value) // 保留此滚轮值(上次浏览位置)
          router_select_history_date_of_Artist.value = router_history_datas_of_Artist.value[newIndex];
          clear_Files_temporary();
          const selectedRouterName = router_select_history_date_of_Artist.value.router_name;
          if (selectedRouterName === 'View_Artist_List_ALL') {
            router_select_model_artist.value = true;
            fetchData_Artist();
            router_history_model_of_Artist_scroll.value = true;
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
  const fix_router_history_of_Artist_scroller_value = (value: number) => {
    const index = router_history_datas_of_Artist.value.findIndex(item => item.id === (router_select_history_date_of_Artist.value?.id ?? ''));
    if (index !== -1) {
      router_history_datas_of_Artist.value[index].page_lists_scrollindex = value;
    }  
  }

  ////// Load this_app Configs
  onMounted(() => {
    let system_Configs_Read = new System_Configs_Read();
    /// App_Configs load
    if((''+system_Configs_Read.app_Configs.value['theme']) === 'lightTheme'){
      change_page_header_color.value = false;
      theme.value = lightTheme;
    }
    else{
      change_page_header_color.value = true;
      theme.value = darkTheme;
    }
    theme_name.value = ''+system_Configs_Read.app_Configs.value['theme']
    app_left_menu_select_activeKey.value = ''+system_Configs_Read.app_Configs.value['app_left_menu_select_activeKey']
    app_left_menu_collapsed.value = ''+system_Configs_Read.app_Configs.value['app_left_menu_collapsed'] === 'true'
    router_name.value = ''+system_Configs_Read.app_Configs.value['router_name']
    router.push(router_name.value)
    /// player_Configs_For_UI
    player_UI_Theme_State.value.player_collapsed_album = ''+system_Configs_Read.player_Configs_of_UI.value['player_collapsed_album']==='true'
    player_UI_Theme_State.value.player_collapsed_skin = ''+system_Configs_Read.player_Configs_of_UI.value['player_collapsed_skin']==='true'
    player_UI_Theme_State.value.player_lyric_fontSize = ''+system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontSize']
    player_UI_Theme_State.value.player_lyric_fontWeight = ''+system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontWeight']
    player_UI_Theme_State.value.player_lyric_color = ''+system_Configs_Read.player_Configs_of_UI.value['player_lyric_color']
    player_UI_Theme_State.value.player_theme_Styles_Selected = Number(''+system_Configs_Read.player_Configs_of_UI.value['player_theme_Styles_Selected'])
    player_UI_Theme_State.value.player_background_model_num = Number(''+system_Configs_Read.player_Configs_of_UI.value['player_background_model_num'])
    /// player_Configs_of_Audio_Info
    this_audio_file_path.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_path']
    this_audio_file_medium_image_url.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_medium_image_url']
    this_audio_singer_name.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_singer_name']
    this_audio_song_name.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_name']
    this_audio_album_name.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_name']
    this_audio_album_id.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_id']
    this_audio_album_favorite.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_favorite']
    this_audio_Index_of_absolute_positioning_in_list.value = Number(''+system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_Index_of_absolute_positioning_in_list'])
    //
    page_top_album_image_url.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_image_url']
    page_top_album_id.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_id']
    page_top_album_name.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_name']
    //
    this_audio_file_path_from_playlist.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_path_from_playlist']==='true'
    fetchData_This_AlbumOrArtist_PlayMedia_Model.value = ''+system_Configs_Read.player_Configs_of_Audio_Info.value['fetchData_This_AlbumOrArtist_PlayMedia_Model']==='true'
    /// playlist_File_Configs
    playlist_Files_temporary.value = system_Configs_Read.playlist_File_Configs.value
  });
  ////// Save this_app Configs
  function save_system_config(){
    const app_Configs = ref(
      new App_Configs({
        theme: theme_name.value,
        router_name: String(router_name.value),
        app_left_menu_select_activeKey: String(app_left_menu_select_activeKey.value),
        app_left_menu_collapsed: String(app_left_menu_collapsed.value)
      }));
    const player_Configs_of_UI = ref(
      new Player_Configs_of_UI({
        player_collapsed_album: String(player_UI_Theme_State.value.player_collapsed_album),
        player_collapsed_skin: String(player_UI_Theme_State.value.player_collapsed_skin),
        player_lyric_fontSize: String(player_UI_Theme_State.value.player_lyric_fontSize),
        player_lyric_fontWeight: String(player_UI_Theme_State.value.player_lyric_fontWeight),
        player_lyric_color: String(player_UI_Theme_State.value.player_lyric_color),
        player_theme_Styles_Selected: String(player_UI_Theme_State.value.player_theme_Styles_Selected),
        player_background_model_num: String(player_UI_Theme_State.value.player_background_model_num),
      }))
    const player_Configs_of_Audio_Info = ref(
      new Player_Configs_of_Audio_Info({
        this_audio_file_path: String(this_audio_file_path.value),
        this_audio_file_medium_image_url: String(this_audio_file_medium_image_url.value),
        this_audio_singer_name: String(this_audio_singer_name.value),
        this_audio_singer_id: String(this_audio_singer_id.value),
        this_audio_song_name: String(this_audio_song_name.value),
        this_audio_song_id: String(this_audio_song_id.value),
        this_audio_song_rating: String(this_audio_song_rating.value),
        this_audio_song_favorite: String(this_audio_song_favorite.value),
        this_audio_album_name: String(this_audio_album_name.value),
        this_audio_album_id: String(this_audio_album_id.value),
        this_audio_Index_of_absolute_positioning_in_list: String(this_audio_Index_of_absolute_positioning_in_list.value),
    
        page_top_album_image_url: String(page_top_album_image_url.value),
        page_top_album_id: String(page_top_album_id.value),
        page_top_album_name: String(page_top_album_name.value),
    
        this_audio_file_path_from_playlist: String(this_audio_file_path_from_playlist.value),
        fetchData_This_AlbumOrArtist_PlayMedia_Model: String(fetchData_This_AlbumOrArtist_PlayMedia_Model.value),
      }));
    ipcRenderer.send('config-save',app_Configs,player_Configs_of_UI,player_Configs_of_Audio_Info)
  }


</script>
<template>
  <!-- App Bady View-->
  <n-config-provider class="this_App" :theme="theme" :locale="zhCN" :date-locale="dateZhCN">
    <n-global-style />
    <n-message-provider class="this_App">
      <n-layout has-sider class="this_App">
        <!--Left Router_Menu-->
        <n-layout-sider
          class="n_layout_sider"
          show-trigger="bar"
          collapse-mode="width"
          :collapsed-width="64"
          :width="160"
          :collapsed="app_left_menu_collapsed"
          @collapse="app_left_menu_collapsed = true"
          @expand="app_left_menu_collapsed = false">
          <n-menu
            v-if="!player_show"
            v-model:value="app_left_menu_select_activeKey"
            :collapsed="app_left_menu_collapsed"
            :collapsed-width="64"
            :collapsed-icon-size="22"
            :options="menuOptions"/>
        </n-layout-sider>
        <!--Right Router_View-->
        <n-layout embedded style="height: calc(100vh);">
          <RouterView
            class="view_show_data"
            v-if="router_select_model_menu"
            @router_select="get_router_select"
            @update_lang="get_update_lang"
            :app_left_menu_collapsed="app_left_menu_collapsed"
            :window_innerWidth="window_innerWidth">

          </RouterView>
          <RouterView
            class="view_show_data"
            v-else-if="router_select_model_home"
            @router_select="get_router_select"
            :app_left_menu_collapsed="app_left_menu_collapsed"
            :window_innerWidth="window_innerWidth">

          </RouterView>
          <!--Media View-->
          <RouterView
            class="view_show_table"
            v-else-if="router_select_model_media"
            @router_select="get_router_select"
            :app_left_menu_collapsed="app_left_menu_collapsed"
            :window_innerWidth="window_innerWidth"

            @router_history_model="get_router_history_model_of_Media"
            :router_select_history_date="router_select_history_date_of_Media"
            :router_history_datas="router_history_datas_of_Media"
            :router_history_model_of_Media_scroller_value="router_history_model_of_Media_scroller_value"
            @router_history_model_of_Media_scroller_value="get_router_history_model_of_Media_scroller_value"
            :router_history_model_of_Media_scroll="router_history_model_of_Media_scroll"
            @router_history_model_of_Media_scroll="get_router_history_model_of_Media_scroll"

            @this_audio_lyrics_string="get_this_audio_lyrics_string"
            @media_file_path="media_file_path"
            @media_file_path_from_playlist="get_this_audio_file_path_from_playlist"
            @media_file_medium_image_url="get_media_file_medium_image_url"
            @this_audio_singer_name="get_this_audio_singer_name"
            @this_audio_singer_id="get_this_audio_singer_id"
            @this_audio_song_name="get_this_audio_song_name"
            @this_audio_song_id="get_this_audio_song_id"
            @this_audio_song_rating="get_this_audio_song_rating"
            @this_audio_song_favorite="get_this_audio_song_favorite"
            :this_audio_album_name="this_audio_album_name"
            @this_audio_album_name="get_this_audio_album_name"
            @this_audio_album_id="get_this_audio_album_id"
            @this_audio_Index_of_absolute_positioning_in_list="get_this_audio_Index_of_absolute_positioning_in_list"
            :media_Files_temporary="media_Files_temporary"
            :media_Files_selected="media_Files_selected"
            @media_Files_selected_set="set_media_Files_selected"
            @media_Files_selected_set_all="set_media_Files_selected_all"
            :page_songlists_options_Sort_key="page_songlists_options_Sort_key"
            @page_songlists_options_Sort_key="get_page_songlists_options_Sort_key"

            :page_songlists_keyword=page_songlists_keyword
            @page_songlists_keyword="page_songlists_get_keyword"

            @page_songlists_reset_data="page_songlists_get_reset_data"
            :page_top_album_image_url="page_top_album_image_url"
            :page_top_album_id="page_top_album_id"
            :page_top_album_name="page_top_album_name"
            :page_songlists_options="page_songlists_options"
            :page_songlists_statistic="page_songlists_statistic"
            :page_songlists="page_songlists"
            :page_songlists_selected="page_songlists_selected"
            @page_songlists_selected="get_page_songlists_selected"

            :change_page_header_color="change_page_header_color"
          >
          
          </RouterView>
          <!--Album View-->
          <RouterView
            class="view_show_table"
            v-else-if="router_select_model_album"
            @router_select="get_router_select"
            :app_left_menu_collapsed="app_left_menu_collapsed"
            :window_innerWidth="window_innerWidth"

            @router_history_model="get_router_history_model_of_Album"
            :router_select_history_date="router_select_history_date_of_Album"
            :router_history_datas="router_history_datas_of_Album"
            :router_history_model_of_Album_scroller_value="router_history_model_of_Album_scroller_value"
            @router_history_model_of_Album_scroller_value="get_router_history_model_of_Album_scroller_value"
            :router_history_model_of_Album_scroll="router_history_model_of_Album_scroll"
            @router_history_model_of_Album_scroll="get_router_history_model_of_Album_scroll"

            :album_Files_temporary="album_Files_temporary"
            :page_albumlists_options_Sort_key="page_albumlists_options_Sort_key"
            @page_albumlists_options_Sort_key="get_page_albumlists_options_Sort_key"
            :page_albumlists_keyword="page_albumlists_keyword"
            @page_albumlists_keyword="page_albumlists_get_keyword"
            @page_albumlists_reset_data="page_albumlists_get_reset_data"
            :page_top_album_image_url="page_top_album_image_url"
            :page_top_album_id="page_top_album_id"
            :page_top_album_name="page_top_album_name"
            :page_albumlists_options="page_albumlists_options"
            :page_albumlists_statistic="page_albumlists_statistic"
            :page_albumlists="page_albumlists"
            :page_albumlists_selected="page_albumlists_selected"
            @page_albumlists_selected="get_page_albumlists_selected"

            @media_list_of_album_id="get_media_list_of_album_id_by_album_info"
            @media_list_of_artist_id="get_album_list_of_artist_id_by_album_info"
            @play_this_album_song_list="fetchData_This_Album_SongList"

            :change_page_header_color="change_page_header_color"
            :this_audio_album_name="this_audio_album_name"
          >

          </RouterView>
          <!--Artist View-->
          <RouterView
            class="view_show_table"
            v-else-if="router_select_model_artist"
            @router_select="get_router_select"
            :app_left_menu_collapsed="app_left_menu_collapsed"
            :window_innerWidth="window_innerWidth"

            @router_history_model="get_router_history_model_of_Artist"
            :router_select_history_date="router_select_history_date_of_Artist"
            :router_history_datas="router_history_datas_of_Artist"
            :router_history_model_of_Artist_scroller_value="router_history_model_of_Artist_scroller_value"
            @router_history_model_of_Artist_scroller_value="get_router_history_model_of_Artist_scroller_value"
            :router_history_model_of_Artist_scroll="router_history_model_of_Artist_scroll"
            @router_history_model_of_Artist_scroll="get_router_history_model_of_Artist_scroll"

            :artist_Files_temporary="artist_Files_temporary"
            :page_artistlists_options_Sort_key="page_artistlists_options_Sort_key"
            @page_artistlists_options_Sort_key="get_page_artistlists_options_Sort_key"
            :page_artistlists_keyword="page_artistlists_keyword"
            @page_artistlists_keyword="page_artistlists_get_keyword"
            @page_artistlists_reset_data="page_artistlists_get_reset_data"
            :page_top_album_image_url="page_top_album_image_url"
            :page_top_album_id="page_top_album_id"
            :page_top_album_name="page_top_album_name"
            :page_artistlists_options="page_artistlists_options"
            :page_artistlists_statistic="page_artistlists_statistic"
            :page_artistlists="page_artistlists"
            :page_artistlists_selected="page_artistlists_selected"
            @page_artistlists_selected="get_page_artistlists_selected"

            @album_list_of_artist_id_artist="get_album_list_of_artist_id_by_artist_info"
            @play_this_artist_song_list="fetchData_This_Artist_SongList"

            :change_page_header_color="change_page_header_color"
            :this_audio_album_name="this_audio_album_name"
          >
          
          </RouterView>
          
          <!--Top Bar-->
          <div class="bar_top_setapp" :style="{ backgroundColor: theme_bar_top_setapp }">
            <section  
              style="
                -webkit-app-region: no-drag;
                width: auto;
                position: absolute;right: 0;top:30px;
                text-align:center;
                z-index: 99;
              ">
              <n-button quaternary circle size="medium" style="margin-right:4px" @click="theme_mode_change_click">
                <template #icon>
                  <n-icon size="20" :depth="2"><DarkTheme24Filled/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" style="margin-right:4px" @click="minimize">
                <template #icon>
                  <n-icon size="18" :depth="2"><ArrowMinimize16Regular/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" style="margin-right:4px" @click="maximize">
                <template #icon>
                  <n-icon size="24" :depth="2"><Maximize16Regular/></n-icon>
                </template>
              </n-button>
              <n-button quaternary circle size="medium" style="margin-right:30px" @click="closeWindow">
                <template #icon>
                  <n-icon size="28" :depth="2"><Close/></n-icon>
                </template>
              </n-button>
            </section>
          </div>
        </n-layout>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
  <!-- bottom PlayerBar and PlayerView -->
  <n-config-provider :theme="theme_app">
    <!-- n-card can change Bar_Music_Player(text color) -->
    <n-card
      style=" 
        position: fixed;left: 0;bottom: 0;
        width: 100vw;height: 80px;
        background-color: #00000000;
        z-index: 100;
        border-radius: 12px 12px 0 0;border: 0 #00000000">
      <Bar_Music_Player
        :player="player"
        @this_audio_is_playing="get_this_audio_is_playing"
        
        @player_silder_currentTime_added_value="get_player_silder_currentTime_added_value"
        :player_go_lyricline_index_of_audio_play_progress="player_go_lyricline_index_of_audio_play_progress"

        :player_collapsed_action_bar_of_Immersion_model="player_collapsed_action_bar_of_Immersion_model"
        @player_collapsed_action_bar_of_Immersion_model="get_player_collapsed"
        :player_show="player_show"
        :collapsed="app_left_menu_collapsed"

        @this_audio_Index_of_absolute_positioning_in_list="get_this_audio_Index_of_absolute_positioning_in_list"
        @this_audio_lyrics_string="get_this_audio_lyrics_string"

        :this_audio_file_path="this_audio_file_path"
        @this_audio_file_path="get_this_audio_file_path"
        :this_audio_file_medium_image_url="this_audio_file_medium_image_url"
        @this_audio_file_medium_image_url="get_media_file_medium_image_url"
        :this_audio_restart_play="this_audio_restart_play"
        @this_audio_restart_play="get_this_audio_restart_play"

        @page_songlists_keyword="page_songlists_get_keyword"
        
        :this_audio_singer_name="this_audio_singer_name"
        @this_audio_singer_name="get_this_audio_singer_name"
        :this_audio_singer_id="this_audio_singer_id"
        @this_audio_singer_id="get_this_audio_singer_id"
        :this_audio_song_name="this_audio_song_name"
        @this_audio_song_name="get_this_audio_song_name"
        :this_audio_song_id="this_audio_song_id"
        @this_audio_song_id="get_this_audio_song_id"
        :this_audio_song_rating="this_audio_song_rating"
        @this_audio_song_rating="get_this_audio_song_rating"
        :this_audio_song_favorite="this_audio_song_favorite"
        @this_audio_song_favorite="get_this_audio_song_favorite"
        :this_audio_album_name="this_audio_album_name"
        @this_audio_album_name="get_this_audio_album_name"
        :this_audio_album_id="this_audio_album_id"
        @this_audio_album_id="get_this_audio_album_id"

        :playlist_Files_temporary="playlist_Files_temporary"

        :player_show_click="player_show_click"
        @player_show_click="get_playerview_to_close_playerview"
        :player_show_complete="player_show_complete"
        @player_show_height="get_playerbar_to_Switch_playerview"
        @Playlist_Show="get_Playlist_Show"
        :Player_Show_Sound_effects="Player_Show_Sound_effects"
        @Player_Show_Sound_effects="get_Player_Show_Sound_effects"
        :Player_Show_Sound_speed="Player_Show_Sound_speed"
        @Player_Show_Sound_speed="get_Player_Show_Sound_speed"
        :Player_Show_Sound_more="Player_Show_Sound_more"
        @Player_Show_Sound_more="get_Player_Show_Sound_more"/>
    </n-card>
    <View_Screen_Music_Player 
      class="view_music_player"
      v-if="player_show"
      :style="{ height: `calc(100vh - ${player_show_hight_animation_value}vh)` }"

      :player_collapsed_action_bar_of_Immersion_model="player_collapsed_action_bar_of_Immersion_model"
      @player_collapsed_action_bar_of_Immersion_model="get_player_collapsed"

      :player_UI_Theme_State="player_UI_Theme_State"
      @player_UI_Theme_State="get_player_UI_Theme"
      
      :player="player"
      :this_audio_is_playing="this_audio_is_playing"
      :player_silder_currentTime_added_value="player_silder_currentTime_added_value"
      @player_go_lyricline_index_of_audio_play_progress="get_player_go_lyricline_index_of_audio_play_progress"
      :this_audio_lyrics_info_line_num="this_audio_lyrics_info_line_num"

      :this_audio_lyrics_string="this_audio_lyrics_string"
      :this_audio_lyrics_info_line="this_audio_lyrics_info_line"
      :this_audio_lyrics_info_time="this_audio_lyrics_info_time"
      
      :this_audio_file_path="this_audio_file_path"
      :this_audio_file_medium_image_url="this_audio_file_medium_image_url"
      :this_audio_restart_play="this_audio_restart_play"
      :this_audio_singer_name="this_audio_singer_name"
      :this_audio_song_name="this_audio_song_name"
      :this_audio_album_id="this_audio_album_id"
      :this_audio_album_favorite="this_audio_album_favorite"
      :this_audio_album_name="this_audio_album_name"
      
      @player_show_click="get_playerview_to_close_playerview"
      :player_show_complete="player_show_complete">

    </View_Screen_Music_Player>
  </n-config-provider>
  <!-- right drwaer of music_playlist -->
  <n-config-provider :theme="darkTheme">
    <n-drawer 
      v-model:show="Playlist_Show" 
      :width="440" 
      style="
        border-radius: 12px 0 0 12px;
        border: 1.5px solid #FFFFFF20;
        background-color: rgba(127, 127, 127, 0.1); 
        backdrop-filter: blur(10px);
        margin-top: 88px;margin-bottom:88px;
      ">
      <n-drawer-content v-if="Playlist_Show">
        <template #default>
          <Bar_Music_PlayList
            v-if="Playlist_Show"

            @this_audio_lyrics_string="get_this_audio_lyrics_string"
            @media_file_path="media_file_path"
            @media_file_path_from_playlist="get_this_audio_file_path_from_playlist"
            @media_file_medium_image_url="get_media_file_medium_image_url"

            @this_audio_singer_name="get_this_audio_singer_name"
            @this_audio_singer_id="get_this_audio_singer_id"
            :this_audio_singer_rating="this_audio_singer_rating"
            @this_audio_singer_rating="get_this_audio_singer_rating"
            :this_audio_singer_favorite="this_audio_singer_favorite"
            @this_audio_singer_favorite="get_this_audio_singer_favorite"
            @this_audio_song_name="get_this_audio_song_name"
            @this_audio_song_id="get_this_audio_song_id"
            @this_audio_song_rating="get_this_audio_song_rating"
            @this_audio_song_favorite="get_this_audio_song_favorite"
            @this_audio_album_name="get_this_audio_album_name"
            @this_audio_album_id="get_this_audio_album_id"
            :this_audio_album_rating="this_audio_album_rating"
            @this_audio_album_rating="get_this_audio_album_rating"
            :this_audio_album_favorite="this_audio_album_favorite"
            @this_audio_album_favorite="get_this_audio_album_favorite"
            
            :this_audio_Index_of_absolute_positioning_in_list="this_audio_Index_of_absolute_positioning_in_list"
            @this_audio_Index_of_absolute_positioning_in_list="get_this_audio_Index_of_absolute_positioning_in_list"

            :playlist_Files_temporary="playlist_Files_temporary"
            >
          </Bar_Music_PlayList>
        </template>
      </n-drawer-content>
    </n-drawer>
  </n-config-provider>
  <!-- bottom drwaer of player_bar(more,sound speed,sound effect) -->
  <n-config-provider :theme="darkTheme">
    <n-drawer 
      v-model:show="Player_Show_Sound_more"
      :width="440" 
      style="
        border-radius: 12px 0 0 12px;
        border: 1.5px solid #FFFFFF20;
        background-color: rgba(127, 127, 127, 0.1); 
        backdrop-filter: blur(10px);
        margin-top: calc(50vh - 280px);height: 560px;
      ">
      <n-drawer-content v-if="Player_Show_Sound_more">
        <template #default>
          更多设置：开发中
        </template>
      </n-drawer-content>
    </n-drawer>
    <n-drawer 
      v-model:show="Player_Show_Sound_speed"
      :width="440" 
      style="
        border-radius: 12px 0 0 12px;
        border: 1.5px solid #FFFFFF20;
        background-color: rgba(127, 127, 127, 0.1); 
        backdrop-filter: blur(10px);
        margin-top: calc(50vh - 280px);height: 560px;
      ">
      <n-drawer-content v-if="Player_Show_Sound_speed">
        <template #default>
          播放设置：开发中
        </template>
      </n-drawer-content>
    </n-drawer>
    <n-drawer 
      v-model:show="Player_Show_Sound_effects"
      :width="440" 
      style="
        border-radius: 12px 0 0 12px;
        border: 1.5px solid #FFFFFF20;
        background-color: rgba(127, 127, 127, 0.1); 
        backdrop-filter: blur(10px);
        margin-top: calc(50vh - 280px);height: 560px;
      ">
      <n-drawer-content v-if="Player_Show_Sound_effects">
        <template #default>
          <n-tabs type="line" animated>
            <n-tab-pane name="001" tab="九歌音效">
              九歌音效
            </n-tab-pane>
            <n-tab-pane name="004" tab="多音轨">
              多音轨
            </n-tab-pane>
            <n-tab-pane name="002" tab="均衡器(简易)">
              均衡器(简易)
            </n-tab-pane>
            <n-tab-pane name="003" tab="均衡器(专业)">
              均衡器(专业)
            </n-tab-pane>
          </n-tabs>
        </template>
      </n-drawer-content>
    </n-drawer>
  </n-config-provider>
</template>
<style scoped>
.this_App {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}
.n_layout_sider {
  padding-top: 64px;
  border: 0;
}
.view_show_table {
  width: calc(100vw - 100px);
  height: calc(100vh - 200px);

  margin-top: 70px;
  margin-left: 30px;
}
.view_show_data {
  width: calc(100vw - 100px);
  height: calc(100vh - 150px);

  margin-top: 70px;
  margin-left: 30px;
}
.view_music_player{
  width: 100vw;
  z-index: 10;
  position: fixed;bottom: 0;left: 0;
  transition: height 0.2s;
}
.bar_top_setapp{
  width: 100vw;
  height: 60px;
  margin-left: 7px;

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
::-webkit-scrollbar {
  display: none;
}
</style>./features/system/System_Configs_Read./features/player/Player_UI_Theme_State