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
    FullScreenMaximize16Regular,
  } from '@vicons/fluent'
  import {AlbumFilled, LibraryMusicOutlined, MusicNoteRound} from '@vicons/material'
  import {Close, Hearing, Menu as MenuIcon, UserAvatarFilledAlt,Clean} from '@vicons/carbon'

  ////// i18n auto lang
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({
    inheritLocale: true
  })
  const update_lang = ref('en')
  async function get_update_lang(value:any){
    update_lang.value = value;
    console.log(value)
    save_system_config_of_App_Configs()
  }

  ////// this_app components of navie ui
  import type {GlobalTheme, MenuOption} from 'naive-ui'
  // app theme_color
  ////// this_app
  import {darkTheme, lightTheme, NConfigProvider, NIcon} from 'naive-ui'
  // vue3 function
  import {h, onMounted, ref, computed, watch} from 'vue';
  import routers from './router'
  import {RouterLink, RouterView, useRouter} from 'vue-router';
  // audio_class & player_bar class
  import {Audio_howler} from '@/models/song_Audio_Out/Audio_howler';
  import Bar_Music_Player from '@/components/Bar_Music_Player.vue'
  // current_audioList class
  import Bar_Music_PlayList from '@/components/Bar_Music_PlayList.vue'
  // player_configs class
  import View_Screen_Music_Player from '@/views/View_Screen_Music_Player.vue'
  import {Player_UI_Theme_State} from '@/features/player_configs/Player_UI_Theme_State'
  import {System_Configs_Read} from '@/features/system_configs/System_Configs_Read'
  import {App_Configs} from '@/models/app_Configs/class_App_Configs';
  import {Player_Configs_of_Audio_Info} from '@/models/app_Configs/class_Player_Configs_of_Audio_Info';
  import {Player_Configs_of_UI} from '@/models/app_Configs/class_Player_Configs_of_UI';
  import {System_Configs_Write} from "@/features/system_configs/System_Configs_Write";

  ////// naive ui of n-menu(app left menu bar)
  function renderIcon (icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
  function renderRouterLink (nameValue: any,defaultValue: any){
    return () => h(RouterLink, {to: { name: nameValue }}, { default: () => defaultValue })
  }
  const create_menuOptions_appBar = (): MenuOption[] => {
    return [
      {label: computed(() => renderRouterLink('View_Menu_AppSetting',t('common.menu'))),key: 'go_back_menu',icon: renderIcon(MenuIcon),},
      {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
      {label: computed(() => renderRouterLink('View_Home_MusicLibrary_Browse',t('common.home'))),key: 'go_back_home',icon: renderIcon(Home28Regular),},
      {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
      {label: computed(() => renderRouterLink('View_Album_List_ALL',t('entity.album_other'))),key: 'go_albums_list',icon: renderIcon(AlbumFilled)},
      {label: computed(() => renderRouterLink('View_Song_List_ALL',t('entity.track_other'))),key: 'go_songs_list',icon: renderIcon(MusicNoteRound)},
      {label: computed(() => renderRouterLink('View_Artist_List_ALL',t('entity.artist_other'))),key: 'go_artist_list',icon: renderIcon(UserAvatarFilledAlt)},
      {label: computed(() => renderRouterLink('View_Updateing',t('entity.genre_other'))),key: 'go_other',icon: renderIcon(Flag16Regular)},
      {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.guessLike'))),key: 'go_other',icon: renderIcon(DocumentHeart20Regular)},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.karaoke'))),key: 'go_other',icon: renderIcon(SlideMicrophone32Regular)},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.identifySong'))),key: 'go_other',icon: renderIcon(Hearing)},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.scoreGeneration'))),key: 'go_other',icon: renderIcon(LibraryMusicOutlined)},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.lyricsProduction'))),key: 'go_other',icon: renderIcon(lyric)},
      {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.musicCommunity'))),key: 'go_other',icon: renderIcon(PeopleCommunity16Regular)},
    ]
  };
  const menuOptions_appBar = ref<MenuOption[]>(create_menuOptions_appBar())
  function get_menuOptions_appBar(value: any){
    menuOptions_appBar.value = value
    console.log(value)
  }
  const selectd_props_app_sidebar = ref<(string | number)[]>(['2', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14']);
  function get_selectd_props_app_sidebar(value: any){
    selectd_props_app_sidebar.value = value
  }
  const app_left_menu_select_activeKey = ref<string | null>(null)
  watch(() => app_left_menu_select_activeKey.value, (newValue) => {
    save_system_config_of_App_Configs()
  });
  const app_left_menu_collapsed = ref(false)
  watch(() => app_left_menu_collapsed.value, (newValue) => {
    save_system_config_of_App_Configs()
  });
  // node function
  const path = require('path');

  ////// this_app setting of menu
  const menu_appsetting_select_tab_name = ref('tab_pane_1')
  function get_menu_appsetting_select_tab_name(value: any){
    menu_appsetting_select_tab_name.value = value
  }

  ////// this_app server of user_selected
  const server_config_of_current_user_of_sqlite = ref<Server_Configs_Props>()
  async function get_server_config_of_current_user_of_sqlite(value: Server_Configs_Props) {
    server_config_of_current_user_of_sqlite.value = value
    server_config_of_current_user_of_sqlite_of_select.value = value
    server_config_of_current_user_of_sqlite_of_select_servername.value = value.server_name
    console.log(value)
    /// begin import server data
    const {salt, token} = generateEncryptedPassword(server_config_of_current_user_of_sqlite.value?.password);
    let set_Navidrome_Data_To_LocalSqlite = new Set_Navidrome_Data_To_LocalSqlite()
    await set_Navidrome_Data_To_LocalSqlite.Set_Read_Navidrome_Api_BasicInfo_Add_LocalSqlite(
        server_config_of_current_user_of_sqlite.value?.url + '/rest',
        server_config_of_current_user_of_sqlite.value?.user_name, token, salt,
    )
    /// reset app data
    ipcRenderer.send('window-reset-data');
  }
  const server_config_of_all_user_of_sqlite = ref<Server_Configs_Props[]>([])
  function get_server_config_of_all_user_of_sqlite(value: Server_Configs_Props[]){
    server_config_of_all_user_of_sqlite.value = value
    server_config_of_all_user_of_select.value = []
    value.forEach((item) => {
      server_config_of_all_user_of_select.value.push(
      {
        label: item.server_name,
        value: item.id
      });
    });
    const index = server_config_of_all_user_of_sqlite.value.findIndex(item => item.id === server_config_of_current_user_of_sqlite_of_select.value?.value);
    if (index === 0) {
      server_config_of_current_user_of_sqlite.value = null
      server_config_of_current_user_of_sqlite_of_select.value = null
      server_config_of_current_user_of_sqlite_of_select_servername.value = ''
    }
  }
  const server_config_of_current_user_of_sqlite_of_select_servername = ref('')
  const server_config_of_current_user_of_sqlite_of_select = ref<{label: string;value: string}>()
  const server_config_of_all_user_of_select = ref<{label: string;value: string}[]>([])
  //////
  function generateEncryptedPassword(password: string): { salt: string, token: string } {
    const saltLength = 6;
    const salt = generateRandomString(saltLength);
    const crypto = require('crypto');
    const token = crypto.createHash('md5').update(password + salt, 'utf8').digest('hex');
    return { salt, token };
  }
  function generateRandomString(length: number): string {
    const characters = 'dfeVYUY9iu239iBUYHuji46h39BHUJ8u42nmrfhDD3r4ouj123890fvn48u95h';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
  }
  //////
  import { store_sqlite_table_info } from '@/store/store_sqlite_table_info'
  const model_select = ref('local')
  function get_model_select(value: any){
    model_select.value = value
    save_system_config_of_App_Configs()
    /// playlist configs
    playlist_All_of_list.value = []
    playlist_Tracks_temporary.value = []
    try{
      let get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
      const playlist_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist()
      playlist_temporary.forEach((item:Play_List) =>{
        playlist_All_of_list.value.push({
          label: item.name,
          value: item.id
        })
        playlist_Tracks_temporary.value.push({
          playlist: item,
          playlist_tracks: get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Tracks(item.id)
        })
      });
    }catch (e) { console.error(e) }
  }

  ////// this_app library
  const library_path = ref('')
  function get_library_path(value: any){
    library_path.value = value
    save_system_library_config()
    router_name.value = 'View_Song_List_ALL';
    app_left_menu_select_activeKey.value = 'go_songs_list';
    save_system_config_of_View_Router_History()
  }

  ////// this_app theme_color
  const theme = ref<GlobalTheme | null>(null)
  const theme_name = ref<string>()
  const theme_app =ref<GlobalTheme | null>(null)
  const theme_bar_top_setapp = ref('transparent')
  const update_theme = ref(false)
  function get_update_theme (value:any){
    if(value === 'lightTheme')
      update_theme.value = true;
    else
      update_theme.value = false;
    theme_mode_change_click()
    save_system_config_of_App_Configs()
  }
  const theme_normal_mode_click = () => {
    theme.value = lightTheme
    theme_name.value = 'lightTheme'
    theme_app.value = lightTheme
    update_theme.value = false
  }
  const theme_dark_mode_click = () => {
    theme.value = darkTheme
    theme_name.value = 'darkTheme'
    theme_app.value = darkTheme
    update_theme.value = true
  }
  const theme_mode_change_click = async () => {
    if (update_theme.value) {
      theme_normal_mode_click()
    } else {
      theme_dark_mode_click()
    }
  }

  ////// this_app sqlite db
  let navidrome_db = path.resolve('resources/navidrome.db');
  let nsmusics_db = path.resolve('resources/nsmusics.db');
  
  ////// this_app BrowserWindow
  const { ipcRenderer } = require('electron');
  function minimize() {
    ipcRenderer.send('window-min');
  }
  function maximize() {
    ipcRenderer.send('window-max');
  }
  function maximize_screen() {
    ipcRenderer.send('window-fullscreen');
  }
  function closeWindow() {
    ipcRenderer.send('window-close');
  }
  const window_innerWidth = ref<number>(window.innerWidth)
  window.addEventListener('resize', () => {
    window_innerWidth.value = window.innerWidth;
  });

  ////// view musicplayer
  // player_configs view of open&close
  const player_show_hight_animation_value = ref(100);
  const player_show = ref(false)
  const player_show_complete = ref(true)
  const get_playerbar_to_Switch_playerview = (value:any) => {
    player_show_complete.value = false
    clear_Files_temporary()

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
    router_select_model_updateing.value = false;
    router_select_model_media.value = false
    router_select_model_album.value = false
    router_select_model_artist.value = false
    setTimeout(() => {
      if(value != 0){
        if(app_left_menu_select_activeKey.value === 'go_back_menu'){
          router_select_model_menu.value = true;
        }else if(app_left_menu_select_activeKey.value === 'go_back_home') {
          router_select_model_home.value = true;
        }else if(app_left_menu_select_activeKey.value === 'go_other'){
          router_select_model_updateing.value = true;
        }else if(app_left_menu_select_activeKey.value === 'go_albums_list'){
          router_select_model_album.value = true;
        }else if(app_left_menu_select_activeKey.value === 'go_songs_list'){
          router_select_model_media.value = true;
        }else if(app_left_menu_select_activeKey.value === 'go_artist_list'){
          router_select_model_artist.value = true;
        }
      }
      player_show_complete.value = true

      clear_session_clearCache()
    }, 600);
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
  // player_configs view of theme_all
  const player_UI_Theme_State = ref(new Player_UI_Theme_State());
  const get_player_UI_Theme = (value: any) => {
    player_UI_Theme_State.value = value;
    player_use_lottie_animation.value = player_UI_Theme_State.value.player_use_lottie_animation
    save_system_config_of_Player_Configs_of_UI()
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

  ////// player_configs audio_info
  const this_audio_file_path = ref<string>('');
  function media_file_path(value: any) {
    this_audio_file_path.value = value
    get_this_audio_restart_play(true)
    console.log('this_audio_file_path：'+value)
    //
    if(this_audio_file_path_from_playlist.value === false){
      playlist_Files_temporary.value = [...media_Files_temporary.value];
      playlist_Tracks_Current_Media_File_id_of_list.value = media_Files_temporary.value.map(item => item.id);
      save_system_playlist_item_id_config();
    }
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
    let set_MediaInfo_To_LocalSqlite = new Set_MediaInfo_To_LocalSqlite()
    set_MediaInfo_To_LocalSqlite.Set_MediaInfo_To_PlayCount_of_Media_File(value)
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
  // player_configs audio_info of router_page_init_data
  const page_top_album_image_url = ref<string>(path.resolve('resources/img/error_album.jpg'))
  const page_top_album_id = ref<string>('')
  const page_top_album_name = ref<string>('')
  // player_configs audio_infos of all_playlist
  import { Get_PlaylistInfo_From_LocalSqlite } from "@/features/sqlite3_local_configs/class_Get_PlaylistInfo_From_LocalSqlite";
  import { Set_PlaylistInfo_To_LocalSqlite } from "@/features/sqlite3_local_configs/class_Set_PlaylistInfo_To_LocalSqlite";
  import { Set_MediaInfo_To_LocalSqlite } from "@/features/sqlite3_local_configs/class_Set_MediaInfo_To_LocalSqlite";
  import { Set_AnnotationInfo_To_LocalSqlite } from "@/features/sqlite3_local_configs/class_Set_AnnotationInfo_To_LocalSqlite";
  const playlist_Tracks_Current_Media_File_id_of_list = ref<string[]>([])
  const playlist_All_of_list = ref<{label: string;value: string}[]>([])
  const playlist_Tracks_temporary = ref<{playlist:Play_List,playlist_tracks:Play_list_Track[]}[]>([])
  function get_playlist_Tracks_temporary_add(value: any){
    let set_PlaylistInfo_From_LocalSqlite = new Set_PlaylistInfo_To_LocalSqlite();
    const playlist = set_PlaylistInfo_From_LocalSqlite.Set_PlaylistInfo_To_Update_CreatePlaylist_of_ND(
        value,
        'admin',0,0,0,'admin'
    )
    playlist_Tracks_temporary.value.push({
      playlist: playlist,
      playlist_tracks: []
    })
    let db = require('better-sqlite3')(navidrome_db);
    db.pragma('journal_mode = WAL');
    Init_page_songlists_statistic_Data(db);
    db.close();
    playlist_All_of_list.value = []
    playlist_Tracks_temporary.value.forEach((item) => {
      playlist_All_of_list.value.push({
        label: item.playlist.name,
        value: item.playlist.id
      })
    })
  }
  function get_playlist_Tracks_temporary_update(value: any){
    let set_PlaylistInfo_From_LocalSqlite = new Set_PlaylistInfo_To_LocalSqlite();
    set_PlaylistInfo_From_LocalSqlite.Set_PlaylistInfo_To_Update_SetPlaylist_of_ND(
      value.id,value.name,
      'admin',0,0,0,'admin'
    )
    const index = playlist_Tracks_temporary.value.findIndex(list => list.playlist.id === value.id);
    if (index >= 0) {
      playlist_Tracks_temporary.value[index].playlist.name = value.name;
      let db = require('better-sqlite3')(navidrome_db);
      db.pragma('journal_mode = WAL');
      Init_page_songlists_statistic_Data(db);
      db.close();
      playlist_All_of_list.value = []
      playlist_Tracks_temporary.value.forEach((item) => {
        playlist_All_of_list.value.push({
          label: item.playlist.name,
          value: item.playlist.id
        })
      })
    }
  }
  function get_playlist_Tracks_temporary_delete(value: any){
    let set_PlaylistInfo_From_LocalSqlite = new Set_PlaylistInfo_To_LocalSqlite();
    set_PlaylistInfo_From_LocalSqlite.Set_PlaylistInfo_To_Update_DeletePlaylist_of_ND(value)
    const index = playlist_Tracks_temporary.value.findIndex(list => list.playlist.id === value);
    if (index >= 0) {
      playlist_Tracks_temporary.value.splice(index,1)
      let db = require('better-sqlite3')(navidrome_db);
      db.pragma('journal_mode = WAL');
      Init_page_songlists_statistic_Data(db);
      db.close();
      playlist_All_of_list.value = []
      playlist_Tracks_temporary.value.forEach((item) => {
        playlist_All_of_list.value.push({
          label: item.playlist.name,
          value: item.playlist.id
        })
      })
    }
  }
  function get_playlist_Tracks_temporary_update_media_file(value: any){
    playlist_All_of_list.value = []
    playlist_Tracks_temporary.value = []
    let get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
    const playlist_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist()
    playlist_temporary.forEach((item:Play_List) =>{
      playlist_All_of_list.value.push({
        label: item.name,
        value: item.id
      })
      playlist_Tracks_temporary.value.push({
        playlist: item,
        playlist_tracks: get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Tracks(item.id)
      })
    });
    fetchData_Media()
  }
  // player_configs audio_infos of current_playlist
  const playlist_Files_temporary = ref<Media_File[]>([]);
  const this_audio_file_path_from_playlist = ref(false);
  const fetchData_This_AlbumOrArtist_PlayMedia_Model = ref<boolean>(false);
  function get_this_audio_file_path_from_playlist (value: any) {
    this_audio_file_path_from_playlist.value = value
    console.log('this_audio_file_path_from_playlist：'+value)
  }
  // player_configs audio_infos of audio_page
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
  function get_selected_playlist_addMediaFile(value: any){
    console.log('selected_playlist_addMediaFile',value)
    const ids = media_Files_selected.value.map(file => file.id);
    let set_PlaylistInfo_From_LocalSqlite = new Set_PlaylistInfo_To_LocalSqlite();
    set_PlaylistInfo_From_LocalSqlite.Set_Selected_MediaInfo_Add_Selected_Playlist(ids,value)
    get_playlist_Tracks_temporary_update_media_file(true)
  }
  function get_selected_lovelist_addMediaFile(value: any){
    console.log('selected_lovelist_addMediaFile',value)
    const ids = media_Files_selected.value.map(file => file.id);
    let set_AnnotationInfo_To_LocalSqlite = new Set_AnnotationInfo_To_LocalSqlite()
    set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_Add_Selected_Favorite(ids,true)
    get_playlist_Tracks_temporary_update_media_file(true)
  }
  function get_selected_playlist_deleteMediaFile(value: any){
    console.log('selected_playlist_deleteMediaFile',value)
    const ids = media_Files_selected.value.map(file => file.id);
    let set_PlaylistInfo_From_LocalSqlite = new Set_PlaylistInfo_To_LocalSqlite();
    set_PlaylistInfo_From_LocalSqlite.Set_Selected_MediaInfo_Delete_Selected_Playlist(ids,value)
    get_playlist_Tracks_temporary_update_media_file(true)
  }
  function get_selected_locallist_deleteMediaFile(value: any){
    console.log('selected_locallist_deleteMediaFile',value)
    const ids = media_Files_selected.value.map(file => file.id);
    let set_LibraryInfo_To_LocalSqlite = new Set_LibraryInfo_To_LocalSqlite();
    set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Delete_Selected_Playlist(ids)
    get_playlist_Tracks_temporary_update_media_file(true)
  }
  function get_selected_lovelist_deleteMediaFile(value: any){
    console.log('selected_lovelist_deleteMediaFile',value)
    const ids = media_Files_selected.value.map(file => file.id);
    let set_AnnotationInfo_To_LocalSqlite = new Set_AnnotationInfo_To_LocalSqlite();
    set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_Delete_Selected_Favorite(ids,value)
    get_playlist_Tracks_temporary_update_media_file(true)
  }
  function get_selected_recentlist_deletetMediaFile(value: any){
    console.log('selected_recentlist_deletetMediaFile',value)
    const ids = media_Files_selected.value.map(file => file.id);
    let set_AnnotationInfo_To_LocalSqlite = new Set_AnnotationInfo_To_LocalSqlite();
    set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_To_Selected_PlayCount_of_Delete(ids,value)
    get_playlist_Tracks_temporary_update_media_file(true)
  }

  ////// player_configs lyric_info
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
  // let player = new Audio_howler();
  let player = new Audio_node_mpv();
  const player_fade_value = ref<number>(2000)
  function get_player_fade_value(value: any){
    player_fade_value.value = value
  }
  const player_use_lottie_animation = ref(false);
  function get_player_use_lottie_animation(value: any){
    player_use_lottie_animation.value = value
    player_UI_Theme_State.value.player_use_lottie_animation = value
    console.log('实验性lottie动画状态：'+value)
    save_system_config_of_Player_Configs_of_UI()
  }
  //
  function player_save_new_data(value: any){
    save_system_config_of_Player_Configs_of_Audio_Info()
  }
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

  ///// view of View_Home_MusicLibrary_Browse
  import {Get_HomeDataInfos_From_LocalSqlite} from '@/features/sqlite3_local_configs/class_Get_HomeDataInfos_From_LocalSqlite'
  import {Audio_node_mpv} from "@/models/song_Audio_Out/Audio_node_mpv";
  import {
    Set_ReadLocalMusic_To_LocalSqlite
  } from "@/features/sqlite3_local_configs/class_Set_ReadLocalMusic_To_LocalSqlite";
  import {Library_Configs} from "@/models/app_Configs/class_Library_Configs";
  import {Set_AlbumInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_AlbumInfo_To_LocalSqlite";
  import {Set_ArtistInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_ArtistInfo_To_LocalSqlite";
  import {Set_LibraryInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_LibraryInfo_To_LocalSqlite";
  import {User_ApiService_of_ND} from "@/features/servers_configs/navidrome_api/services/user_management/index_service";
  import {Set_ServerInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_ServerInfo_To_LocalSqlite";
  import {Searching_ApiService_of_ND} from "@/features/servers_configs/navidrome_api/services/searching/index_service";
  import crypto from "crypto";
  import {Get_PageInfo_of_Song_of_ND} from "../src_example/get_PageInfo_of_Song";
  import {
    Set_Navidrome_Data_To_LocalSqlite
  } from "@/features/servers_configs/navidrome_api/middleware/class_Set_Navidrome_Data_To_LocalSqlite";
  let get_HomeDataInfos_From_LocalSqlite = new Get_HomeDataInfos_From_LocalSqlite()
  const home_Files_temporary_maximum_playback = ref<Album[]>([])
  const home_Files_temporary_random_search = ref<Album[]>([])
  const home_Files_temporary_recently_added = ref<Album[]>([])
  const home_Files_temporary_recently_played = ref<Album[]>([])
  const home_selected_top_album = ref<Album>()
  function get_home_selected_top_album(value: any){
    home_selected_top_album.value = (home_Files_temporary_random_search.value && home_Files_temporary_random_search.value.length > 0) ? home_Files_temporary_random_search.value[value] : undefined;
  }
  function get_refresh_home_temporary(value: any){
    fetchData_Home()
  }
  const fetchData_Home = async () => {
    home_Files_temporary_maximum_playback.value = []
    home_Files_temporary_random_search.value = []
    home_Files_temporary_recently_added.value = []
    home_Files_temporary_recently_played.value = []
    home_selected_top_album.value = undefined;
    home_Files_temporary_maximum_playback.value = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Maximum_Playback()
    home_Files_temporary_random_search.value = get_HomeDataInfos_From_LocalSqlite.Get_AlbumFiles_Random_Search()
    home_Files_temporary_recently_added.value = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Recently_Added()
    home_Files_temporary_recently_played.value = get_HomeDataInfos_From_LocalSqlite.Get_Annotation_Recently_Played()
    home_selected_top_album.value = (home_Files_temporary_random_search.value && home_Files_temporary_random_search.value.length > 0) ? home_Files_temporary_random_search.value[0] : undefined;
  };
  function formatTime(currentTime: number): string {
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);

    let formattedMinutes = String(minutes);
    let formattedSeconds = String(seconds);

    if (formattedMinutes.length == 1)
      formattedMinutes = '0' + formattedMinutes;

    if (formattedSeconds.length == 1)
      formattedSeconds = '0' + formattedSeconds;

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
    save_system_config_of_Player_Configs_of_Audio_Info()
    save_system_config_of_View_Router_History()
  }
  ///
  const Init_page_songlists_statistic_Data = (db: any) => {
    page_songlists_options.value = [];
    page_songlists_statistic.value = [];
    page_songlists.value = []
    //////
    const stmt_media_file_count = db.prepare(`SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.media_file}`);
    const temp_Play_List_ALL: Play_List = {
      label: computed(() => t('nsmusics.view_page.allSong')),
      value: 'song_list_all',
      id: 'song_list_all',
      name: computed(() => t('nsmusics.view_page.allSong')),
      comment: computed(() => t('nsmusics.view_page.allSong')),
      duration: 0,
      song_count: stmt_media_file_count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
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
      SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.annotation}
      WHERE starred = 1 AND item_type='media_file'
    `);
    const temp_Play_List_Love: Play_List = {
      label: computed(() => t('nsmusics.view_page.loveSong')),
      value: 'song_list_love',
      id: 'song_list_love',
      name: computed(() => t('nsmusics.view_page.loveSong')),
      comment: computed(() => t('nsmusics.view_page.loveSong')),
      duration: 0,
      song_count: stmt_media_Annotation_Starred_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
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
      SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.annotation}
      WHERE item_type='media_file'
    `);
    const temp_Play_List_Recently: Play_List = {
      label: computed(() => t('nsmusics.view_page.recentPlay')),
      value: 'song_list_recently',
      id: 'song_list_recently',
      name: computed(() => t('nsmusics.view_page.recentPlay')),
      comment: computed(() => t('nsmusics.view_page.recentPlay')),
      duration: 0,
      song_count: stmt_media_Annotation_Recently_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
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
      SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.playlist}
    `);
    page_songlists_statistic.value.push({
      label: computed(() => t('entity.playlist_other')),
      song_count: stmt_media_Annotation_PlayList_Count.get().count + ' *',
      id: 'song_list_all_PlayList'
    });
    //////
    playlist_Tracks_temporary.value.forEach((item) =>{
      const temp_playlist: Play_List = {
        label: item.playlist.name,
        value: item.playlist.id,
        id: item.playlist.id,
        name: item.playlist.name,
        comment: item.playlist.comment,
        duration: item.playlist.duration,
        song_count: item.playlist.song_count + ' *',
        public: item.playlist.public,
        created_at: item.playlist.created_at,
        updated_at: item.playlist.updated_at,
        path: item.playlist.path,
        sync: item.playlist.sync,
        size: item.playlist.size,
        rules: item.playlist.rules,
        evaluated_at: item.playlist.evaluated_at,
        owner_id: item.playlist.owner_id
      }
      page_songlists_options.value.push(temp_playlist);
      // page_songlists_statistic.value.push({
      //   label: temp_playlist.label,
      //   song_count: temp_playlist.song_count.toString(),
      //   id: temp_playlist.id
      // });
      page_songlists.value.push(temp_playlist)
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
      if (router_history_model_of_Media.value === 0) {
        const sortKey = page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
            page_songlists_options_Sort_key.value[0].columnKey : 'id';
        const sortOrder = page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
            page_songlists_options_Sort_key.value[0].order.replace('end', '') : '';
        let keywordFilter = page_songlists_keyword.value.length > 0 ?
            `WHERE title LIKE '%${page_songlists_keyword.value}%' OR artist LIKE '%${page_songlists_keyword.value}%' OR album LIKE '%${page_songlists_keyword.value}%'` :
            '';
        if (find_music_model.value === true) {
          keywordFilter = `WHERE album_id = '${page_songlists_keyword.value}'`
          find_music_model.value = false;
        } else if (find_artist_model.value === true) {
          keywordFilter = `WHERE artist_id = '${page_songlists_keyword.value}'`
          find_artist_model.value = false;
        } else {
          if (page_songlists_get_keyword_model_num.value != 0) {
            if (keywordFilter.length > 0) {
              keywordFilter = keywordFilter.replace('LIKE', '=').replace(/%/g, '');
            }
            page_songlists_get_keyword_model_num.value = 0;
          }
        }
        try {
          stmt_media_file_string = `SELECT * FROM ${store_sqlite_table_info.media_file} ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
          stmt_media_file = db.prepare(stmt_media_file_string);
          // if stmt_media_file is empty, then try to find artist_id or album_id
          if (stmt_media_file.get() === undefined) {
            keywordFilter = `WHERE artist_id = '${page_songlists_keyword.value}'`
            stmt_media_file_string = `SELECT * FROM ${store_sqlite_table_info.media_file} ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
            stmt_media_file = db.prepare(stmt_media_file_string);
            if (stmt_media_file.get() === undefined) {
              keywordFilter = `WHERE album_id = '${page_songlists_keyword.value}'`
              stmt_media_file_string = `SELECT * FROM ${store_sqlite_table_info.media_file} ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
              stmt_media_file = db.prepare(stmt_media_file_string);
            }
          }
        } catch (err: any) {
          console.error(err);
        }
        //////
        if (router_select_history_date_of_Media.value && page_songlists_keyword_reset.value === true) {
          remove_router_history_of_Media(router_select_history_date_of_Media.value.id);// 若存在新操作，则覆盖后续的路由
          page_songlists_keyword_reset.value = false;
        }
        const routerDate: Interface_View_Router_Date = {
          id: router_history_datas_of_Media.value ? router_history_datas_of_Media.value.length + 1 : 1,
          menu_select_active_key: 'go_songs_list',
          router_name: 'View_Song_List_ALL',
          router_select_model_media: true,
          router_select_model_album: false,
          router_select_model_artist: false,
          page_lists_keyword: page_songlists_keyword.value,
          stmt_string: stmt_media_file_string,
          page_lists_selected: page_songlists_selected.value,
          columnKey: page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
              page_songlists_options_Sort_key.value[0].columnKey : 'id',
          order: page_songlists_options_Sort_key.value.length > 0 && page_songlists_options_Sort_key.value[0].order !== 'default' ?
              page_songlists_options_Sort_key.value[0].order.replace('end', '') : '',
          page_lists_scrollindex: router_history_model_of_Media_scroller_value.value,
        };
        add_router_history_of_Media(routerDate);// 重复路由不添加
        //////
      }
      else {
        if (router_select_history_date_of_Media.value) {
          router.push('View_Song_List_ALL')
          app_left_menu_select_activeKey.value = 'go_songs_list'
          router_select_model_media.value = true;
          page_songlists_keyword.value = router_select_history_date_of_Media.value.page_lists_keyword;
          page_songlists_selected.value = router_select_history_date_of_Media.value.page_lists_selected;
          page_songlists_options_Sort_key.value = [
            {
              columnKey: router_select_history_date_of_Media.value.columnKey,
              order: router_select_history_date_of_Media.value.order
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
        if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
          if (row.path.indexOf('mp3') > 0)
            row.medium_image_url = row.path.replace('mp3', 'jpg');
          else if (row.path.indexOf('flac') > 0)
            row.medium_image_url = row.path.replace('flac', 'jpg');
          else
            row.medium_image_url = '../../../resources/img/error_album.jpg';
        }
        media_Files_temporary.value.push(row);
      });
      ////// find favorite for media_Files_temporary
      const stmt_media_Annotation_Starred_Items = db.prepare(`
        SELECT item_id FROM ${store_sqlite_table_info.annotation}
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
        SELECT item_id, rating FROM ${store_sqlite_table_info.annotation}
        WHERE rating > 0 AND item_type='media_file'
      `);
      const annotations_rating = stmt_media_Annotation_Rating_Items.all();
      for (let i = 0; i < media_Files_temporary.value.length; i++) {
        const mediaFile = media_Files_temporary.value[i];
        const matchingAnnotation = annotations_rating.find((annotation: {
          item_id: string,
          rating: number
        }) => annotation.item_id === mediaFile.id);
        if (matchingAnnotation)
          mediaFile.rating = matchingAnnotation.rating;
        else
          mediaFile.rating = 0;
      }
      ////// filter selected_list for media_Files_temporary
      let order_play_date:any[] = [];
      media_Files_temporary.value = media_Files_temporary.value.filter((item) => {
        if (page_songlists_selected.value === 'song_list_all') {
          return true;
        } else if (page_songlists_selected.value === 'song_list_love') {
          return annotations.some((annotation: any) => annotation.item_id === item.id);
        } else if (page_songlists_selected.value === 'song_list_recently') {
          const stmt_media_Annotation_Recently_Items = db.prepare(`
          SELECT item_id FROM ${store_sqlite_table_info.annotation}
          WHERE item_type='media_file'
          ORDER BY play_date DESC
        `);
          const annotations = stmt_media_Annotation_Recently_Items.all().map((annotation: any) => annotation.item_id);
          order_play_date = annotations;
          return annotations.includes(item.id);
        } else {
          const index = playlist_Tracks_temporary.value.findIndex(list => list.playlist.id === page_songlists_selected.value);
          if (index >= 0) {
            const result = playlist_Tracks_temporary.value[index].playlist_tracks.map(track => track.media_file_id);
            return result.includes(item.id);
          } else {
            return true;
          }
        }
      });
      if (page_songlists_selected.value === 'song_list_recently') {
        let new_sort: Media_File[] = media_Files_temporary.value.slice();
        media_Files_temporary.value = [];
        order_play_date.forEach((id) => {
          const index = new_sort.findIndex(item => item.id === id);
          if (index !== -1) {
            media_Files_temporary.value.push(new_sort[index]);
            new_sort.splice(index, 1);
          }
        });
      }
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
    const stmt_album_count = db.prepare(`SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.album}`);
    //
    page_albumlists_options.value = [];
    page_albumlists_statistic.value = [];
    page_albumlists.value = []
    //////
    const temp_Play_List_ALL: Play_List = {
      label: computed(() => t('nsmusics.view_page.allAlbum')),
      value: 'album_list_all',
      id: 'album_list_all',
      name: computed(() => t('nsmusics.view_page.allAlbum')),
      comment: computed(() => t('nsmusics.view_page.allAlbum')),
      duration: 0,
      song_count: stmt_album_count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
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
      SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.annotation}
      WHERE starred = 1 AND item_type='album'
    `);
    const temp_Play_List_Love: Play_List = {
      label: computed(() => t('nsmusics.view_page.loveAlbum')),
      value: 'album_list_love',
      id: 'album_list_love',
      name: computed(() => t('nsmusics.view_page.loveAlbum')),
      comment: computed(() => t('nsmusics.view_page.loveAlbum')),
      duration: 0,
      song_count: stmt_album_Annotation_Starred_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
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
      SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.annotation}
      WHERE item_type='album'
    `);
    const temp_Play_List_Recently: Play_List = {
      label: computed(() => t('nsmusics.view_page.recentPlay')),
      value: 'album_list_recently',
      id: 'album_list_recently',
      name: computed(() => t('nsmusics.view_page.recentPlay')),
      comment: computed(() => t('nsmusics.view_page.recentPlay')),
      duration: 0,
      song_count: stmt_album_Annotation_Recently_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
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
      SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.playlist}
    `);
    page_albumlists_statistic.value.push({
      label: computed(() => t('entity.playlist_other')),
      album_count: stmt_album_Annotation_PlayList_Count.get().count + ' *',
      id: 'album_list_all_PlayList'
    });
  }
  const fetchData_Album = async () => {
    let db: any = null;
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
      if (router_history_model_of_Album.value === 0) {
        const sortKey = page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
            page_albumlists_options_Sort_key.value[0].columnKey : 'id';
        const sortOrder = page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
            page_albumlists_options_Sort_key.value[0].order.replace('end', '') : '';
        let keywordFilter = page_albumlists_keyword.value.length > 0 ?
            `WHERE id LIKE '%${page_albumlists_keyword.value}%' OR name LIKE '%${page_albumlists_keyword.value}%' OR artist LIKE '%${page_albumlists_keyword.value}%' OR created_at LIKE '%${page_albumlists_keyword.value}%'` :
            '';
        if (find_album_model.value === true) {
          if (page_albumlists_get_keyword_model_num.value != 1)
            keywordFilter = `WHERE artist_id = '${page_albumlists_keyword.value}'`
          else
            keywordFilter = `WHERE created_at LIKE '${page_albumlists_keyword.value}'`
          find_album_model.value = false;
        } else {
          if (page_albumlists_get_keyword_model_num.value != 0) {
            if (keywordFilter.length > 0) {
              keywordFilter = keywordFilter.replace('LIKE', '=').replace(/%/g, '').replace('artist', 'artist_id');
            }
          }
        }
        stmt_album_string = `SELECT * FROM ${store_sqlite_table_info.album} ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
        stmt_album = db.prepare(stmt_album_string);
        //////
        if (router_select_history_date_of_Album.value && page_albumlists_keyword_reset.value === true) {
          remove_router_history_of_Album(router_select_history_date_of_Album.value.id);// 若存在新操作，则覆盖后续的路由
          page_albumlists_keyword_reset.value = false;
        }
        const routerDate: Interface_View_Router_Date = {
          id: router_history_datas_of_Album.value ? router_history_datas_of_Album.value.length + 1 : 1,
          menu_select_active_key: 'go_albums_list',
          router_name: 'View_Album_List_ALL',
          router_select_model_media: false,
          router_select_model_album: true,
          router_select_model_artist: false,
          page_lists_keyword: page_albumlists_keyword.value,
          stmt_string: stmt_album_string,
          page_lists_selected: page_albumlists_selected.value,
          columnKey: page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
              page_albumlists_options_Sort_key.value[0].columnKey : 'id',
          order: page_albumlists_options_Sort_key.value.length > 0 && page_albumlists_options_Sort_key.value[0].order !== 'default' ?
              page_albumlists_options_Sort_key.value[0].order.replace('end', '') : '',
          page_lists_scrollindex: router_history_model_of_Album_scroller_value.value,
        };
        add_router_history_of_Album(routerDate);// 重复路由不添加
        //////
      } else {
        if (router_select_history_date_of_Album.value) {
          router.push('View_Album_List_ALL')
          app_left_menu_select_activeKey.value = 'go_albums_list'
          router_select_model_album.value = true;
          page_albumlists_keyword.value = router_select_history_date_of_Album.value.page_lists_keyword;
          page_albumlists_selected.value = router_select_history_date_of_Album.value.page_lists_selected;
          page_albumlists_options_Sort_key.value = [
            {
              columnKey: router_select_history_date_of_Album.value.columnKey,
              order: router_select_history_date_of_Album.value.order
            }
          ];
          router_history_model_of_Album_scroller_value.value = router_select_history_date_of_Album.value.page_lists_scrollindex;
          stmt_album = db.prepare(router_select_history_date_of_Album.value.stmt_string);
        }
        router_history_model_of_Album.value = 0;
      }
      let rows = stmt_album.all();
      rows.forEach((row: Album) => {
        if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
          if (row.embed_art_path.indexOf('mp3') > 0)
            row.medium_image_url = row.embed_art_path.replace('mp3', 'jpg');
          else if (row.embed_art_path.indexOf('flac') > 0)
            row.medium_image_url = row.embed_art_path.replace('flac', 'jpg');
          else
            row.medium_image_url = '../../../resources/img/error_album.jpg';
        }
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
      SELECT item_id FROM ${store_sqlite_table_info.annotation}
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
        SELECT item_id, rating FROM ${store_sqlite_table_info.annotation}
        WHERE rating > 0 AND item_type='album'
    `);
      const annotations_rating = stmt_album_Annotation_Rating_Items.all();
      for (let i = 0; i < album_Files_temporary.value.length; i++) {
        const albumFile = album_Files_temporary.value[i];
        const matchingAnnotation = annotations_rating.find((annotation: {
          item_id: string,
          rating: number
        }) => annotation.item_id === albumFile.id);
        if (matchingAnnotation)
          albumFile.rating = matchingAnnotation.rating;
        else
          albumFile.rating = 0;
      }
      ////// filter selected_list for album_Files_temporary
      let order_play_date:any[] = [];
      album_Files_temporary.value = album_Files_temporary.value.filter((item) => {
        if (page_albumlists_selected.value === 'album_list_all') {
          return true;
        } else if (page_albumlists_selected.value === 'album_list_love') {
          return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
        } else if (page_albumlists_selected.value === 'album_list_recently') {
          const stmt_album_Annotation_Recently_Items = db.prepare(`
          SELECT item_id FROM ${store_sqlite_table_info.annotation}
          WHERE item_type='album'
          ORDER BY play_date DESC
        `);
          const annotations = stmt_album_Annotation_Recently_Items.all().map((annotation: any) => annotation.item_id);
          order_play_date = annotations;
          return annotations.includes(item.id);
        } else if (page_albumlists_selected.value === 'album_list_all_PlayList') {
          return true;
        }
      });
      if (page_albumlists_selected.value === 'album_list_recently') {
        let new_sort: Album[] = album_Files_temporary.value.slice();
        album_Files_temporary.value = [];
        order_play_date.forEach((id) => {
          const index = new_sort.findIndex(item => item.id === id);
          if (index !== -1) {
            album_Files_temporary.value.push(new_sort[index]);
            new_sort.splice(index, 1);
          }
        });
      }
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

    playlist_Files_temporary.value = [...media_Files_temporary.value];
    playlist_Tracks_Current_Media_File_id_of_list.value = media_Files_temporary.value.map(item => item.id);
    save_system_playlist_item_id_config();
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
      ///
      get_this_audio_song_id(playlist_Files_temporary.value[0].id)
      get_this_audio_song_rating(playlist_Files_temporary.value[0].rating)
      get_this_audio_song_favorite(playlist_Files_temporary.value[0].favorite)
    }

    let set_AlbumInfo_To_LocalSqlite = new Set_AlbumInfo_To_LocalSqlite()
    set_AlbumInfo_To_LocalSqlite.Set_AlbumInfo_To_PlayCount_of_Album(album_id)
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
    const stmt_artist_count = db.prepare(`SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.artist}`);
    //
    page_artistlists_options.value = [];
    page_artistlists_statistic.value = [];
    page_artistlists.value = []
    //////
    const temp_Play_List_ALL: Play_List = {
      label: computed(() => t('nsmusics.view_page.allArtist')),
      value: 'artist_list_all',
      id: 'artist_list_all',
      name: computed(() => t('nsmusics.view_page.allArtist')),
      comment: computed(() => t('nsmusics.view_page.allArtist')),
      duration: 0,
      song_count: stmt_artist_count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
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
      SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.annotation}
      WHERE starred = 1 AND item_type='artist'
    `);
    const temp_Play_List_Love: Play_List = {
      label: computed(() => t('nsmusics.view_page.loveArtist')),
      value: 'artist_list_love',
      id: 'artist_list_love',
      name: computed(() => t('nsmusics.view_page.loveArtist')),
      comment: computed(() => t('nsmusics.view_page.loveArtist')),
      duration: 0,
      song_count: stmt_artist_Annotation_Starred_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
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
      SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.annotation}
      WHERE item_type='artist'
    `);
    const temp_Play_List_Recently: Play_List = {
      label: computed(() => t('nsmusics.view_page.recentPlay')),
      value: 'artist_list_recently',
      id: 'artist_list_recently',
      name: computed(() => t('nsmusics.view_page.recentPlay')),
      comment: computed(() => t('nsmusics.view_page.recentPlay')),
      duration: 0,
      song_count: stmt_artist_Annotation_Recently_Count.get().count + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
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
      SELECT COUNT(*) AS count FROM ${store_sqlite_table_info.playlist}
    `);
    page_artistlists_statistic.value.push({
      label: computed(() => t('entity.playlist_other')),
      artist_count: stmt_artist_Annotation_PlayList_Count.get().count + ' *',
      id: 'artist_list_all_PlayList'
    });
  }
  const fetchData_Artist = async () => {
    let db: any = null;
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
      if (router_history_model_of_Artist.value === 0) {
        const sortKey = page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
            page_artistlists_options_Sort_key.value[0].columnKey : 'id';
        const sortOrder = page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
            page_artistlists_options_Sort_key.value[0].order.replace('end', '') : '';
        let keywordFilter = page_artistlists_keyword.value.length > 0 ?
            `WHERE name LIKE '%${page_artistlists_keyword.value}%' OR external_info_updated_at LIKE '%${page_artistlists_keyword.value}%'` :
            '';
        stmt_artist_string = `SELECT * FROM ${store_sqlite_table_info.artist} ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
        stmt_artist = db.prepare(stmt_artist_string);
        //////
        if (router_select_history_date_of_Artist.value && page_artistlists_keyword_reset.value === true) {
          remove_router_history_of_Artist(router_select_history_date_of_Artist.value.id);// 若存在新操作，则覆盖后续的路由
          page_artistlists_keyword_reset.value = false;
        }
        const routerDate: Interface_View_Router_Date = {
          id: router_history_datas_of_Artist.value ? router_history_datas_of_Artist.value.length + 1 : 1,
          menu_select_active_key: 'go_artist_list',
          router_name: 'View_Artist_List_ALL',
          router_select_model_media: false,
          router_select_model_album: false,
          router_select_model_artist: true,
          page_lists_keyword: page_artistlists_keyword.value,
          stmt_string: stmt_artist_string,
          page_lists_selected: page_artistlists_selected.value,
          columnKey: page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
              page_artistlists_options_Sort_key.value[0].columnKey : 'id',
          order: page_artistlists_options_Sort_key.value.length > 0 && page_artistlists_options_Sort_key.value[0].order !== 'default' ?
              page_artistlists_options_Sort_key.value[0].order.replace('end', '') : '',
          page_lists_scrollindex: router_history_model_of_Artist_scroller_value.value,
        };
        add_router_history_of_Artist(routerDate);// 重复路由不添加
        //////
      } else {
        if (router_select_history_date_of_Artist.value) {
          router.push('View_Artist_List_ALL')
          app_left_menu_select_activeKey.value = 'go_artist_list'
          router_select_model_artist.value = true;
          page_artistlists_keyword.value = router_select_history_date_of_Artist.value.page_lists_keyword;
          page_artistlists_selected.value = router_select_history_date_of_Artist.value.page_lists_selected;
          page_artistlists_options_Sort_key.value = [
            {
              columnKey: router_select_history_date_of_Artist.value.columnKey,
              order: router_select_history_date_of_Artist.value.order
            }
          ];
          router_history_model_of_Artist_scroller_value.value = router_select_history_date_of_Artist.value.page_lists_scrollindex;
          stmt_artist = db.prepare(router_select_history_date_of_Artist.value.stmt_string);
        }
        router_history_model_of_Artist.value = 0;
      }
      const stmt_media_file = db.prepare(`SELECT * FROM ${store_sqlite_table_info.media_file}`);
      const pathfiles = stmt_media_file.all();
      let rows = stmt_artist.all();
      rows.forEach((row: Artist) => {
        for (let j = 0; j < pathfiles.length; j++) {
          if (pathfiles[j].artist_id === row.id) {
            if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
              if (pathfiles[j].path.indexOf('mp3') > 0)
                row.medium_image_url = pathfiles[j].path.replace('mp3', 'jpg');
              else if (pathfiles[j].path.indexOf('flac') > 0)
                row.medium_image_url = pathfiles[j].path.replace('flac', 'jpg');
              else
                row.medium_image_url = '../../../resources/img/error_album.jpg';
            }
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
      SELECT item_id FROM ${store_sqlite_table_info.annotation}
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
        SELECT item_id, rating FROM ${store_sqlite_table_info.annotation}
        WHERE rating > 0 AND item_type='artist'
    `);
      const annotations_rating = stmt_artist_Annotation_Rating_Items.all();
      for (let i = 0; i < artist_Files_temporary.value.length; i++) {
        const artistFile = artist_Files_temporary.value[i];
        const matchingAnnotation = annotations_rating.find((annotation: {
          item_id: string,
          rating: number
        }) => annotation.item_id === artistFile.id);
        if (matchingAnnotation)
          artistFile.rating = matchingAnnotation.rating;
        else
          artistFile.rating = 0;
      }
      ////// filter selected_list for artist_Files_temporary
      let order_play_date:any[] = [];
      artist_Files_temporary.value = artist_Files_temporary.value.filter((item) => {
        if (page_artistlists_selected.value === 'artist_list_all') {
          return true;
        } else if (page_artistlists_selected.value === 'artist_list_love') {
          return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
        } else if (page_artistlists_selected.value === 'artist_list_recently') {
          const stmt_artist_Annotation_Recently_Items = db.prepare(`
          SELECT item_id FROM ${store_sqlite_table_info.annotation}
          WHERE item_type='artist'
          ORDER BY play_date DESC
        `);
          const annotations = stmt_artist_Annotation_Recently_Items.all().map((annotation: any) => annotation.item_id);
          order_play_date = annotations;
          return annotations.includes(item.id);
        } else if (page_artistlists_selected.value === 'artist_list_all_PlayList') {
          return true;
        }
      });
      if (page_artistlists_selected.value === 'artist_list_recently') {
        let new_sort: Artist[] = artist_Files_temporary.value.slice();
        artist_Files_temporary.value = [];
        order_play_date.forEach((id) => {
          const index = new_sort.findIndex(item => item.id === id);
          if (index !== -1) {
            artist_Files_temporary.value.push(new_sort[index]);
            new_sort.splice(index, 1);
          }
        });
      }
      // artist_Files_temporary.value.forEach((item, index) => {
      //   item.absoluteIndex = index + 1;
      // });
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

    playlist_Files_temporary.value = [...media_Files_temporary.value];
    playlist_Tracks_Current_Media_File_id_of_list.value = media_Files_temporary.value.map(item => item.id);
    save_system_playlist_item_id_config();
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
      ///
      get_this_audio_song_id(playlist_Files_temporary.value[0].id)
      get_this_audio_song_rating(playlist_Files_temporary.value[0].rating)
      get_this_audio_song_favorite(playlist_Files_temporary.value[0].favorite)
    }

    let set_ArtistInfo_To_LocalSqlite = new Set_ArtistInfo_To_LocalSqlite()
    set_ArtistInfo_To_LocalSqlite.Set_ArtistInfo_To_PlayCount_of_Artist(playlist_Files_temporary.value[0].artist_id)
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
  /// router Data_sources and rendering
  const router_select_model_menu = ref<Boolean>(false)
  const router_select_model_home = ref<Boolean>(false)
  const router_select_model_updateing = ref<Boolean>(false)
  const router_select_model_media = ref<Boolean>(false)
  const router_select_model_album = ref<Boolean>(false)
  const router_select_model_artist = ref<Boolean>(false)
  function clear_Files_temporary() {
    router_select_model_menu.value = false
    router_select_model_home.value = false
    router_select_model_updateing.value = false
    router_select_model_media.value = false
    router_select_model_album.value = false
    router_select_model_artist.value = false
    home_Files_temporary_maximum_playback.value = []
    home_Files_temporary_random_search.value = []
    home_Files_temporary_recently_added.value = []
    home_Files_temporary_recently_played.value = []
    media_Files_temporary.value = [];
    album_Files_temporary.value = [];
    artist_Files_temporary.value = [];
    /// gc
    clear_session_clearCache()
  }
  function clear_session_clearCache() {
    ipcRenderer.send('window-gc');
  }
  /// router custom class
  const router = useRouter();
  const router_name = ref('')
  routers.beforeEach((to, from, next) => {
    if(to.name !== from.name){
      clear_Files_temporary()
      next();
    }
  });
  routers.afterEach(async (to, from) => {
    if(to.name !== from.name){
      clear_Files_temporary()
      if(to.name === 'View_Menu_AppSetting'){
        router_select_model_menu.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Home_MusicLibrary_Browse'){
        router_select_model_home.value = true
        router_name.value = to.name
      }else if(to.name === 'View_Updateing'){
        router_select_model_updateing.value = true
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
      save_system_config_of_View_Router_History()
      ///
      try {
        const memoryUsage = await ipcRenderer.invoke('window-get-memory')
        if (memoryUsage.rss > MEMORY_THRESHOLD) {
          ipcRenderer.send('window-reset-data')
        }
      }catch{}
    }
  });
  const MEMORY_THRESHOLD = 240 * 1024 * 1024; // 240MB
  const get_router_select = (value: any) => {
    ////// 
    if(value === 'View_Home_MusicLibrary_Browse'){
      router_select_model_home.value = true
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
    // console.log('router_history_model_of_Media_scroll：'+value)
  }
  const router_history_model_of_Media_scroller_value = ref<number>(0)
  function get_router_history_model_of_Media_scroller_value (value: any) {
    if(value !== 0){
      router_history_model_of_Media_scroller_value.value = value
      // console.log('router_history_model_of_Media_scroller_value：'+value)
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
  const router_history_datas_of_Media = ref<Interface_View_Router_Date[]>([])
  const router_select_history_date_of_Media = ref<Interface_View_Router_Date>()
  const add_router_history_of_Media = (new_Router_date: Interface_View_Router_Date) => {
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
    // console.log('router_history_model_of_Album_scroll：'+value)
  }
  const router_history_model_of_Album_scroller_value = ref<number>(0)
  function get_router_history_model_of_Album_scroller_value (value: any) {
    if(value !== 0){
      router_history_model_of_Album_scroller_value.value = value
      // console.log('router_history_model_of_Album_scroller_value：'+value)
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
  const router_history_datas_of_Album = ref<Interface_View_Router_Date[]>([])
  const router_select_history_date_of_Album = ref<Interface_View_Router_Date>()
  const add_router_history_of_Album = (new_Router_date: Interface_View_Router_Date) => {
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
    // console.log('router_history_model_of_Artist_scroll：'+value)
  }
  const router_history_model_of_Artist_scroller_value = ref<number>(0)
  function get_router_history_model_of_Artist_scroller_value (value: any) {
    if(value !== 0){
      router_history_model_of_Artist_scroller_value.value = value
      // console.log('router_history_model_of_Artist_scroller_value：'+value)
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
  const router_history_datas_of_Artist = ref<Interface_View_Router_Date[]>([])
  const router_select_history_date_of_Artist = ref<Interface_View_Router_Date>()
  const add_router_history_of_Artist = (new_Router_date: Interface_View_Router_Date) => {
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
    /// system configs
    try {
      let system_Configs_Read = new System_Configs_Read();
      /// App_Configs load
      model_select.value = '' + system_Configs_Read.app_Configs.value['model_select']
      model_select.value === 'navidrome' ?
        store_sqlite_table_info.switchToMode_Navidrome_Api()
        :
        store_sqlite_table_info.switchToMode_Local()
      if (('' + system_Configs_Read.app_Configs.value['theme']) === 'lightTheme') {
        update_theme.value = false;
        theme.value = lightTheme;
        theme_app.value = lightTheme;
      } else {
        update_theme.value = true;
        theme.value = darkTheme;
        theme_app.value = darkTheme;
      }
      theme_name.value = '' + system_Configs_Read.app_Configs.value['theme']
      update_lang.value = '' + system_Configs_Read.app_Configs.value['lang']
      app_left_menu_select_activeKey.value = '' + system_Configs_Read.app_Configs.value['app_left_menu_select_activeKey']
      app_left_menu_collapsed.value = '' + system_Configs_Read.app_Configs.value['app_left_menu_collapsed'] === 'true'
      router_name.value = '' + system_Configs_Read.app_Configs.value['router_name']
      /// library_Config
      library_path.value = '' + system_Configs_Read.library_Configs.value['library']
      console.log(library_path)
      /// player_Configs_For_UI
      player_UI_Theme_State.value.player_collapsed_album = '' + system_Configs_Read.player_Configs_of_UI.value['player_collapsed_album'] === 'true'
      player_UI_Theme_State.value.player_collapsed_skin = '' + system_Configs_Read.player_Configs_of_UI.value['player_collapsed_skin'] === 'true'
      player_UI_Theme_State.value.player_lyric_fontSize = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontSize']
      player_UI_Theme_State.value.player_lyric_fontWeight = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontWeight']
      player_UI_Theme_State.value.player_lyric_color = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_color']
      player_UI_Theme_State.value.player_theme_Styles_Selected = Number('' + system_Configs_Read.player_Configs_of_UI.value['player_theme_Styles_Selected'])
      player_UI_Theme_State.value.player_background_model_num = Number('' + system_Configs_Read.player_Configs_of_UI.value['player_background_model_num'])
      player_UI_Theme_State.value.player_use_lottie_animation = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lottie_animation'] === 'true'
      player_use_lottie_animation.value = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lottie_animation'] === 'true'
      /// player_Configs_of_Audio_Info
      this_audio_file_path.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_path']
      this_audio_file_medium_image_url.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_medium_image_url']
      this_audio_lyrics_string.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_lyric']
      get_this_audio_lyrics_string(this_audio_lyrics_string.value)
      this_audio_singer_name.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_singer_name']
      this_audio_song_name.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_name']
      this_audio_album_name.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_name']
      this_audio_album_id.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_id']
      this_audio_album_favorite.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_favorite']
      this_audio_Index_of_absolute_positioning_in_list.value = Number('' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_Index_of_absolute_positioning_in_list'])
      page_songlists_selected.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_songlists_selected']
      //
      page_top_album_image_url.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_image_url']
      page_top_album_id.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_id']
      page_top_album_name.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_name']
      //
      this_audio_file_path_from_playlist.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_path_from_playlist'] === 'true'
      fetchData_This_AlbumOrArtist_PlayMedia_Model.value = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['fetchData_This_AlbumOrArtist_PlayMedia_Model'] === 'true'

      /// view_router_history
      // router_history_datas_of_Media.value = system_Configs_Read.view_Media_History_Configs.value
      // router_history_datas_of_Album.value = system_Configs_Read.view_Album_History_Configs.value
      // router_history_datas_of_Artist.value = system_Configs_Read.view_Artist_History_Configs.value
      router_select_history_date_of_Media.value = system_Configs_Read.view_Media_History_select_Configs.value
      router_select_history_date_of_Album.value = system_Configs_Read.view_Media_History_select_Configs.value
      router_select_history_date_of_Artist.value = system_Configs_Read.view_Media_History_select_Configs.value

      /// server
      server_config_of_all_user_of_sqlite.value = system_Configs_Read.server_Configs.value
      server_config_of_current_user_of_sqlite.value = system_Configs_Read.server_Configs_Current.value
      if (server_config_of_current_user_of_sqlite.value) {
        server_config_of_all_user_of_sqlite.value.forEach((item) => {
          server_config_of_all_user_of_select.value.push(
              {
                label: item.server_name,
                value: item.id
              });
        });
        server_config_of_current_user_of_sqlite_of_select.value = server_config_of_current_user_of_sqlite.value
        server_config_of_current_user_of_sqlite_of_select_servername.value = server_config_of_current_user_of_sqlite.value?.server_name
      }
      save_system_config_of_Servers_Config()

      /// playlist media_file_id_of_list
      playlist_Tracks_Current_Media_File_id_of_list.value = system_Configs_Read.playlist_File_Configs.value
      let get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
      playlist_Files_temporary.value = get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Media_File_Id_of_list(playlist_Tracks_Current_Media_File_id_of_list.value)
    }catch (e) { console.error(e) }

    /// playlist configs
    try{
      let get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
      const playlist_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist()
      playlist_temporary.forEach((item:Play_List) =>{
        playlist_All_of_list.value.push({
          label: item.name,
          value: item.id
        })
        playlist_Tracks_temporary.value.push({
          playlist: item,
          playlist_tracks: get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Tracks(item.id)
        })
      });
    }catch (e) { console.error(e) }

    /// close
    router.push(router_name.value)
  });
  ////// Save this_app Configs
  function save_system_config_of_App_Configs(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    const app_Configs = ref(
        new App_Configs({
          theme: theme_name.value,
          lang: update_lang.value,
          router_name: String(router_name.value),
          app_left_menu_select_activeKey: String(app_left_menu_select_activeKey.value),
          app_left_menu_collapsed: String(app_left_menu_collapsed.value),
          model_select: String(model_select.value)
        }));
    let system_Configs_Write = new System_Configs_Write()
    system_Configs_Write.system_app_config(
        db,
        app_Configs.value)
    console.log('save config succuessful')
    db.close();db = null;
  }
  function save_system_library_config(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    const library_Configs = ref(
        new Library_Configs({
          library: String(library_path.value)
        }))
    let system_Configs_Write = new System_Configs_Write()
    system_Configs_Write.system_library_config(
        db,
        library_Configs.value)
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
  function save_system_config_of_Player_Configs_of_UI(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    const player_Configs_of_UI = ref(
        new Player_Configs_of_UI({
          player_collapsed_album: String(player_UI_Theme_State.value.player_collapsed_album),
          player_collapsed_skin: String(player_UI_Theme_State.value.player_collapsed_skin),
          player_lyric_fontSize: String(player_UI_Theme_State.value.player_lyric_fontSize),
          player_lyric_fontWeight: String(player_UI_Theme_State.value.player_lyric_fontWeight),
          player_lyric_color: String(player_UI_Theme_State.value.player_lyric_color),
          player_theme_Styles_Selected: String(player_UI_Theme_State.value.player_theme_Styles_Selected),
          player_background_model_num: String(player_UI_Theme_State.value.player_background_model_num),
          player_use_lottie_animation: String(player_UI_Theme_State.value.player_use_lottie_animation),
        }))
    let system_Configs_Write = new System_Configs_Write()
    system_Configs_Write.system_player_config_of_ui(
        db,
        player_Configs_of_UI.value)
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
  function save_system_config_of_Player_Configs_of_Audio_Info(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    const player_Configs_of_Audio_Info = ref(
        new Player_Configs_of_Audio_Info({
          this_audio_file_path: String(this_audio_file_path.value),
          this_audio_file_medium_image_url: String(this_audio_file_medium_image_url.value),
          this_audio_file_lyric: String(this_audio_lyrics_string.value),
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

          page_songlists_selected: String(page_songlists_selected.value),

          this_audio_file_path_from_playlist: String(this_audio_file_path_from_playlist.value),
          fetchData_This_AlbumOrArtist_PlayMedia_Model: String(fetchData_This_AlbumOrArtist_PlayMedia_Model.value),
        }));
    let system_Configs_Write = new System_Configs_Write()
    system_Configs_Write.system_player_config_of_audio(
        db,
        player_Configs_of_Audio_Info.value)
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
  function save_system_playlist_item_id_config(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    let system_Configs_Write = new System_Configs_Write();
    system_Configs_Write.system_playlist_item_id_config(
      db,
      playlist_Tracks_Current_Media_File_id_of_list.value
    )
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
  function save_system_config_of_View_Router_History(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    let system_Configs_Write = new System_Configs_Write();
    system_Configs_Write.system_view_history(
        db,
        router_select_history_date_of_Media.value,
        [],
        undefined,
        // router_select_history_date_of_Album.value,
        [],
        undefined,
        // router_select_history_date_of_Artist.value,
        [],
    )
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
  function save_system_config_of_Servers_Config(){
    let db:any = null;
    db = require('better-sqlite3')(nsmusics_db);
    db.pragma('journal_mode = WAL');
    let system_Configs_Write = new System_Configs_Write()
    system_Configs_Write.system_servers_config(
        db,
        server_config_of_all_user_of_sqlite.value)
    save_system_config_of_App_Configs()
    db.close();db = null;
  }
</script>
<template>
  <n-message-provider>
    <!-- App Bady View-->
    <n-config-provider class="this_App" :theme="theme">
      <n-global-style />
      <n-message-provider class="this_App">
        <n-layout has-sider class="this_App" embedded>
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
              :options="menuOptions_appBar"/>
          </n-layout-sider>
          <!--Right Router_View-->
          <n-layout embedded style="height: calc(100vh - 150px);margin-top: 70px;">
            <!--Menu View -->
            <RouterView
              class="view_show_data"
              v-if="router_select_model_menu"
              @router_select="get_router_select"
              :menu_appsetting_select_tab_name="menu_appsetting_select_tab_name"
              @menu_appsetting_select_tab_name="get_menu_appsetting_select_tab_name"
              :server_config_of_current_user_of_sqlite_of_select_servername="server_config_of_current_user_of_sqlite_of_select_servername"
              :server_config_of_current_user_of_sqlite_of_select="server_config_of_current_user_of_sqlite_of_select"
              :server_config_of_all_user_of_select="server_config_of_all_user_of_select"
              :server_config_of_current_user_of_sqlite="server_config_of_current_user_of_sqlite"
              @server_config_of_current_user_of_sqlite="get_server_config_of_current_user_of_sqlite"
              :server_config_of_all_user_of_sqlite="server_config_of_all_user_of_sqlite"
              @server_config_of_all_user_of_sqlite="get_server_config_of_all_user_of_sqlite"
              @update_lang="get_update_lang"
              :update_theme="update_theme"
              @update_theme="get_update_theme"
              :model_select="model_select"
              @model_select="get_model_select"
              :library_path="library_path"
              @library_path="get_library_path"
              :menuOptions_appBar="menuOptions_appBar"
              @menuOptions_appBar="get_menuOptions_appBar"
              :selectd_props_app_sidebar="selectd_props_app_sidebar"
              @selectd_props_app_sidebar="get_selectd_props_app_sidebar"
              :player_fade_value="player_fade_value"
              @player_fade_value="get_player_fade_value"
              :player_use_lottie_animation="player_use_lottie_animation"
              @player_use_lottie_animation="get_player_use_lottie_animation"
              :app_left_menu_collapsed="app_left_menu_collapsed"
              :window_innerWidth="window_innerWidth">

            </RouterView>
            <!--Home View -->
            <RouterView
              class="view_show_data"
              v-else-if="router_select_model_home"
              @router_select="get_router_select"
              :app_left_menu_collapsed="app_left_menu_collapsed"
              :window_innerWidth="window_innerWidth"
              :update_theme="update_theme"
              :home_Files_temporary_maximum_playback="home_Files_temporary_maximum_playback"
              :home_Files_temporary_random_search="home_Files_temporary_random_search"
              :home_Files_temporary_recently_added="home_Files_temporary_recently_added"
              :home_Files_temporary_recently_played="home_Files_temporary_recently_played"
              :home_selected_top_album="home_selected_top_album"
              @home_selected_top_album="get_home_selected_top_album"
              @refresh_home_temporary="get_refresh_home_temporary"
              @media_list_of_album_id="get_media_list_of_album_id_by_album_info"
              @play_this_album_song_list="fetchData_This_Album_SongList"
            >

            </RouterView>
            <!--Updateing View-->
            <RouterView
              class="view_show_data"
              v-else-if="router_select_model_updateing"
              @router_select="get_router_select"
              :app_left_menu_collapsed="app_left_menu_collapsed"
              :window_innerWidth="window_innerWidth"
            >
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

              :playlist_All_of_list="playlist_All_of_list"
              :playlist_Tracks_temporary="playlist_Tracks_temporary"
              @playlist_Tracks_temporary_add="get_playlist_Tracks_temporary_add"
              @playlist_Tracks_temporary_update="get_playlist_Tracks_temporary_update"
              @playlist_Tracks_temporary_delete="get_playlist_Tracks_temporary_delete"
              @playlist_Tracks_temporary_update_media_file="get_playlist_Tracks_temporary_update_media_file"
              @selected_playlist_addMediaFile="get_selected_playlist_addMediaFile"
              @selected_playlist_deleteMediaFile="get_selected_playlist_deleteMediaFile"
              @selected_locallist_deleteMediaFile="get_selected_locallist_deleteMediaFile"
              @selected_lovelist_addMediaFile="get_selected_lovelist_addMediaFile"
              @selected_lovelist_deleteMediaFile="get_selected_lovelist_deleteMediaFile"
              @selected_recentlist_deletetMediaFile="get_selected_recentlist_deletetMediaFile"

              @page_songlists_reset_data="page_songlists_get_reset_data"
              :page_top_album_image_url="page_top_album_image_url"
              :page_top_album_id="page_top_album_id"
              :page_top_album_name="page_top_album_name"
              :page_songlists_options="page_songlists_options"
              :page_songlists_statistic="page_songlists_statistic"
              :page_songlists="page_songlists"
              :page_songlists_selected="page_songlists_selected"
              @page_songlists_selected="get_page_songlists_selected"

              :update_theme="update_theme"
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

              :update_theme="update_theme"
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

              :update_theme="update_theme"
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
                <n-button quaternary circle style="margin-right:4px;" @click="ipcRenderer.send('window-reset-data');">
                  <template #icon>
                    <n-icon size="20" :depth="2"><clean/></n-icon>
                  </template>
                  <!--<span style="font-weight: 500;">{{ $t('setting.clearQueryCache') }}</span>-->
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:4px" @click="theme_mode_change_click">
                  <template #icon>
                    <n-icon size="20" :depth="2"><DarkTheme24Filled/></n-icon>
                  </template>
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:4px;" @click="maximize_screen">
                  <template #icon>
                    <n-icon size="20" :depth="2" style="margin-top: 1px;"><FullScreenMaximize16Regular/></n-icon>
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
          @player_save_new_data="player_save_new_data"
          :player_fade_value="player_fade_value"
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
        :player_use_lottie_animation="player_use_lottie_animation"

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
  </n-message-provider>
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

  margin-left: 30px;
}
.view_show_data {
  width: calc(100vw - 100px);
  height: calc(100vh - 150px);

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
</style>