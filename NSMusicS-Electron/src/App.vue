<script setup lang="ts">
  ////// resource of vicons_svg
  import {
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
  import {AlbumFilled, LibraryMusicOutlined, MusicNoteRound, BrowserUpdatedFilled ,MinusRound} from '@vicons/material'
  import {Close, Hearing, Menu as MenuIcon, UserAvatarFilledAlt,Clean} from '@vicons/carbon'

  ////// components
  import {darkTheme, NConfigProvider, NIcon} from 'naive-ui'
  import {h, onMounted, computed, watch, provide, ref} from 'vue';
  import {RouterLink, RouterView, useRouter} from 'vue-router';
  import Bar_Music_Player from '@/components/player_bar/Bar_Music_Player.vue'
  import Bar_Music_PlayList from '@/components/player_list/View_Player_PlayList.vue'
  import View_Screen_Music_Player from '@/views/view_page_player/View_Screen_Music_Player.vue'
  import {store_app_configs_info} from '@/store/app/store_app_configs_info'
  import {store_player_appearance} from "@/store/player/store_player_appearance";
  import {store_player_sound_effects} from "@/store/player/store_player_sound_effects";
  import {store_player_sound_speed} from "@/store/player/store_player_sound_speed";
  import {store_player_sound_more} from "@/store/player/store_player_sound_more";
  import {store_playlist_appearance} from '@/store/view/playlist/store_playlist_appearance'
  import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info"
  import {store_playlist_list_logic} from "@/store/view/playlist/store_playlist_list_logic"
  import {store_server_users} from '@/store/server/store_server_users'
  import {store_server_user_model} from '@/store/server/store_server_user_model'
  import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
  import {store_view_album_page_logic} from "@/store/view/album/store_view_album_page_logic"
  import {store_view_artist_page_info} from "@/store/view/artist/store_view_artist_page_info"
  import {store_router_data_info} from "@/store/router/store_router_data_info";
  import {store_router_data_logic} from "@/store/router/store_router_data_logic";
  import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
  import {store_app_configs_logic_load} from "@/store/app/store_app_configs_logic_load";
  import {store_app_configs_logic_theme} from "@/store/app/store_app_configs_logic_theme";
  import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";
  import {store_view_home_page_fetchData} from "@/store/view/home/store_view_home_page_fetchData";
  import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";
  import {store_view_artist_page_fetchData} from "@/store/view/artist/store_view_artist_page_fetchData";

  ////// BrowserWindow
  const { ipcRenderer } = require('electron');
  window.addEventListener('resize', () => {
    store_app_configs_info.window_innerWidth = window.innerWidth;
    store_app_configs_info.window_innerHeight = window.innerHeight;

    if(window.innerHeight > 900) {
      store_player_appearance.player_lyric_color_hidden_coefficient = 12
    }
    else{
      store_player_appearance.player_lyric_color_hidden_coefficient = 15
      console.log(15)
    }
    console.log(store_player_appearance.player_lyric_color_hidden_coefficient)
  });

  ////// i18n auto lang
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({
    inheritLocale: true
  })
  function renderIcon (icon: any) {
    return () => h(NIcon, null, { default: () => h(icon) })
  }
  function renderRouterLink (nameValue: any,defaultValue: any){
    return () => h(RouterLink, {to: { name: nameValue }}, { default: () => defaultValue })
  }
  store_app_configs_info.menuOptions_appBar = [
    {label: computed(() => renderRouterLink('View_Menu_AppSetting',t('common.menu'))),key: 'View_Menu_AppSetting',icon: renderIcon(MenuIcon),},
    {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
    {label: computed(() => renderRouterLink('View_Home_MusicLibrary_Browse',t('common.home'))),key: 'View_Home_MusicLibrary_Browse',icon: renderIcon(Home28Regular),},
    {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
    {label: computed(() => renderRouterLink('View_Album_List_ALL',t('entity.album_other'))),key: 'View_Album_List_ALL',icon: renderIcon(AlbumFilled)},
    {label: computed(() => renderRouterLink('View_Song_List_ALL',t('entity.track_other'))),key: 'View_Song_List_ALL',icon: renderIcon(MusicNoteRound)},
    {label: computed(() => renderRouterLink('View_Artist_List_ALL',t('entity.artist_other'))),key: 'View_Artist_List_ALL',icon: renderIcon(UserAvatarFilledAlt)},
    {label: computed(() => renderRouterLink('View_Updateing',t('entity.genre_other'))),key: 'View_Updateing',icon: renderIcon(Flag16Regular)},
    {key: 'divider-1',type: 'divider',props: {style: {marginLeft: '22px'}}},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.guessLike'))),key: 'View_Updateing',icon: renderIcon(DocumentHeart20Regular)},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.karaoke'))),key: 'View_Updateing',icon: renderIcon(SlideMicrophone32Regular)},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.identifySong'))),key: 'View_Updateing',icon: renderIcon(Hearing)},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.scoreGeneration'))),key: 'View_Updateing',icon: renderIcon(LibraryMusicOutlined)},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.lyricsProduction'))),key: 'View_Updateing',icon: renderIcon(lyric)},
    {label: computed(() => renderRouterLink('View_Updateing',t('nsmusics.siderbar_menu.musicCommunity'))),key: 'View_Updateing',icon: renderIcon(PeopleCommunity16Regular)},
  ]

  ////// player view
  async function get_playerbar_to_switch_playerview(value: any) {
    store_player_appearance.player_show_complete = false;
    if (store_router_data_logic.clear_Memory_Model) {
      store_router_data_logic.clear_Files_temporary(); // Memory Model
    }
    if (value === 0) {
      store_player_appearance.player_show = true;
      if (store_router_data_logic.clear_Memory_Model) {
        store_app_configs_info.menuOptions_appBar_show = false;
      }
    }
    setTimeout(() => {
      store_player_appearance.player_show_hight_animation_value = value;
      setTimeout(() => {
        if (value === 0) {
          store_app_configs_info.theme_app = darkTheme;
        } else {
          store_app_configs_info.theme_app = store_app_configs_info.theme;
          store_player_appearance.player_show = false;
          if (store_router_data_logic.clear_Memory_Model) {
            store_app_configs_info.menuOptions_appBar_show = true;
          }
        }
      }, 200);
    }, 30);
    setTimeout(async () => {
      if (value !== 0) {
        await handleMenuSelection();
      }
      store_player_appearance.player_show_complete = true;
      ipcRenderer.send('window-gc');
    }, 600);
  }
  async function handleMenuSelection() {
    const menuActions: { [key: string]: () => void | Promise<void> } = {
      'View_Menu_AppSetting': () => {
        clearFilesIfNeeded();
        store_router_data_info.router_select_model_menu = true;
      },
      'View_Home_MusicLibrary_Browse': () => {
        clearFilesIfNeeded('home');
        store_router_data_info.router_select_model_home = true;
        fetchDataIfNeeded('home');
      },
      'View_Updateing': () => {
        clearFilesIfNeeded();
        store_router_data_info.router_select_model_updateing = true;
      },
      'View_Album_List_ALL': () => {
        clearFilesIfNeeded('album');
        fetchDataIfNeeded('album');
        store_router_data_info.router_select_model_album = true;
      },
      'View_Song_List_ALL': async () => {
        clearFilesIfNeeded('media');
        await fetchDataIfNeeded('media');
        store_router_data_info.router_select_model_media = true;
      },
      'View_Artist_List_ALL': () => {
        clearFilesIfNeeded('artist');
        fetchDataIfNeeded('artist');
        store_router_data_info.router_select_model_artist = true;
      },
    };
    const selectedAction = menuActions[store_app_configs_info.app_left_menu_select_activeKey];
    if (selectedAction) {
      await selectedAction();
    }
  }
  function clearFilesIfNeeded(except?: 'home' | 'album' | 'media' | 'artist') {
    if (!store_router_data_logic.clear_Memory_Model) {
      if (except === 'home') {
        store_router_data_logic.clear_Files_temporary_except_home();
      } else if (except === 'album') {
        store_router_data_logic.clear_Files_temporary_except_album();
      } else if (except === 'media') {
        store_router_data_logic.clear_Files_temporary_except_media();
      } else if (except === 'artist') {
        store_router_data_logic.clear_Files_temporary_except_artist();
      } else {
        store_router_data_logic.clear_Files_temporary();
      }
    }
  }
  function fetchDataIfNeeded(type: 'home' | 'album' | 'media' | 'artist') {
    if (store_router_data_logic.clear_Memory_Model) {
      if (type === 'home') {
        store_view_home_page_fetchData.fetchData_Home();
      } else if (type === 'album') {
        store_view_album_page_fetchData.fetchData_Album();
      } else if (type === 'media') {
        store_view_media_page_fetchData.fetchData_Media();
      } else if (type === 'artist') {
        store_view_artist_page_fetchData.fetchData_Artist();
      }
    }
  }
  provide('get_playerbar_to_switch_playerview', get_playerbar_to_switch_playerview);

  ////// router custom class
  store_router_data_info.router = useRouter();
  import routers from './router'
  import {store_app_configs_logic_update} from "@/store/app/store_app_configs_logic_update";
  import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
  import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
  import {store_view_album_page_info} from "@/store/view/album/store_view_album_page_info";
  routers.beforeEach((to, from, next) => {
    if(to.name !== from.name){
      store_router_data_logic.clear_Files_temporary()
      next();
    }
  });
  routers.afterEach(async (to, from) => {
    if(to.name !== from.name){
      store_router_data_logic.get_page_top_info()
      store_router_data_logic.clear_Files_temporary()
      if(to.name === 'View_Menu_AppSetting'){
        store_router_data_info.router_select_model_menu = true
        store_router_data_info.router_name = to.name
      }else if(to.name === 'View_Home_MusicLibrary_Browse'){
        store_router_data_info.router_select_model_home = true
        store_router_data_info.router_name = to.name
      }else if(to.name === 'View_Updateing'){
        store_router_data_info.router_select_model_updateing = true
        store_router_data_info.router_name = to.name
      }else if(to.name === 'View_Song_List_ALL'){
        store_router_data_info.router_select_model_media = true
        store_router_data_info.router_name = to.name
        Init_page_songlists_statistic_Data();
      }else if(to.name === 'View_Album_List_ALL'){
        store_router_data_info.router_select_model_album = true
        store_router_data_info.router_name = to.name
        Init_page_albumlists_statistic_Data()
      }else if(to.name === 'View_Artist_List_ALL'){
        store_router_data_info.router_select_model_artist = true
        store_router_data_info.router_name = to.name
        Init_page_artistlists_statistic_Data()
      }
      store_app_configs_info.app_left_menu_select_activeKey = to.name
      console.log(to.name)
      store_app_configs_logic_save.save_system_config_of_View_Router_History()
      ///
      if(!store_router_data_logic.clear_UserExperience_Model) {
        if (to.name != 'View_Song_List_ALL') {
          try {
            const memoryUsage = await ipcRenderer.invoke('window-get-memory')
            if (memoryUsage.rss > store_router_data_info.MEMORY_THRESHOLD) {
              ipcRenderer.send('window-reset-data')
            }
          } catch { }
        }
      }
    }
  });

  ///// view of media
  const Init_page_songlists_statistic_Data = () => {
    store_view_media_page_logic.page_songlists_options = [];
    store_view_media_page_logic.page_songlists_statistic = [];
    store_view_media_page_logic.page_songlists = []
    ///
    const temp_Play_List_ALL: Play_List = {
      label: computed(() => t('nsmusics.view_page.allSong')),
      value: 'song_list_all',
      id: 'song_list_all',
      name: computed(() => t('nsmusics.view_page.allSong')),
      comment: computed(() => t('nsmusics.view_page.allSong')),
      duration: 0,
      song_count: store_view_media_page_info.media_item_count + ' *',
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
    store_view_media_page_logic.page_songlists_options.push(temp_Play_List_ALL);
    store_view_media_page_logic.page_songlists_statistic.push({
      label: temp_Play_List_ALL.label,
      song_count: temp_Play_List_ALL.song_count.toString(),
      id: temp_Play_List_ALL.id
    });
    store_view_media_page_logic.page_songlists.push(temp_Play_List_ALL)
    ///
    const temp_Play_List_Love: Play_List = {
      label: computed(() => t('nsmusics.view_page.loveSong')),
      value: 'song_list_love',
      id: '`song_list_love`',
      name: computed(() => t('nsmusics.view_page.loveSong')),
      comment: computed(() => t('nsmusics.view_page.loveSong')),
      duration: 0,
      song_count: store_view_media_page_info.media_starred_count + ' *',
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
    store_view_media_page_logic.page_songlists_options.push(temp_Play_List_Love);
    store_view_media_page_logic.page_songlists_statistic.push({
      label: temp_Play_List_Love.label,
      song_count: temp_Play_List_Love.song_count.toString(),
      id: temp_Play_List_Love.id
    });
    store_view_media_page_logic.page_songlists.push(temp_Play_List_Love)
    ///
    const temp_Play_List_Recently: Play_List = {
      label: computed(() => t('nsmusics.view_page.recentPlay')),
      value: 'song_list_recently',
      id: 'song_list_recently',
      name: computed(() => t('nsmusics.view_page.recentPlay')),
      comment: computed(() => t('nsmusics.view_page.recentPlay')),
      duration: 0,
      song_count: store_view_media_page_info.media_recently_count > 0 ? store_view_media_page_info.media_recently_count : '*' + ' *',
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
    store_view_media_page_logic.page_songlists_options.push(temp_Play_List_Recently);
    store_view_media_page_logic.page_songlists_statistic.push({
      label: temp_Play_List_Recently.label,
      song_count: temp_Play_List_Recently.song_count.toString(),
      id: temp_Play_List_Recently.id
    });
    store_view_media_page_logic.page_songlists.push(temp_Play_List_Recently)
    //////
    store_view_media_page_logic.page_songlists_statistic.push({
      label: computed(() => t('entity.playlist_other')),
      song_count: store_view_media_page_info.media_playlist_count + ' *',
      id: 'song_list_all_PlayList'
    });
    //////
    store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.forEach((item: any) =>{
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
      store_view_media_page_logic.page_songlists_options.push(temp_playlist);
      // store_view_media_page_logic.page_songlists_statistic.push({
      //   label: temp_playlist.label,
      //   song_count: temp_playlist.song_count.toString(),
      //   id: temp_playlist.id
      // });
      store_view_media_page_logic.page_songlists.push(temp_playlist)
    });
  }
  ////// view of album
  const Init_page_albumlists_statistic_Data = () => {
    store_view_album_page_logic.page_albumlists_options = [];
    store_view_album_page_logic.page_albumlists_statistic = [];
    store_view_album_page_logic.page_albumlists = []
    //////
    const temp_Play_List_ALL: Play_List = {
      label: computed(() => t('nsmusics.view_page.allAlbum')),
      value: 'album_list_all',
      id: 'album_list_all',
      name: computed(() => t('nsmusics.view_page.allAlbum')),
      comment: computed(() => t('nsmusics.view_page.allAlbum')),
      duration: 0,
      song_count: store_view_album_page_info.album_item_count + ' *',
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
    store_view_album_page_logic.page_albumlists_options.push(temp_Play_List_ALL);
    store_view_album_page_logic.page_albumlists_statistic.push({
      label: temp_Play_List_ALL.label,
      album_count: temp_Play_List_ALL.song_count.toString(),
      id: temp_Play_List_ALL.id
    });
    store_view_album_page_logic.page_albumlists.push(temp_Play_List_ALL)
    //////
    const temp_Play_List_Love: Play_List = {
      label: computed(() => t('nsmusics.view_page.loveAlbum')),
      value: 'album_list_love',
      id: 'album_list_love',
      name: computed(() => t('nsmusics.view_page.loveAlbum')),
      comment: computed(() => t('nsmusics.view_page.loveAlbum')),
      duration: 0,
      song_count: store_view_album_page_info.album_starred_count + ' *',
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
    store_view_album_page_logic.page_albumlists_options.push(temp_Play_List_Love);
    store_view_album_page_logic.page_albumlists_statistic.push({
      label: temp_Play_List_Love.label,
      album_count: temp_Play_List_Love.song_count.toString(),
      id: temp_Play_List_Love.id
    });
    store_view_album_page_logic.page_albumlists.push(temp_Play_List_Love)
    //////
    const temp_Play_List_Recently: Play_List = {
      label: computed(() => t('nsmusics.view_page.recentPlay')),
      value: 'album_list_recently',
      id: 'album_list_recently',
      name: computed(() => t('nsmusics.view_page.recentPlay')),
      comment: computed(() => t('nsmusics.view_page.recentPlay')),
      duration: 0,
      song_count: store_view_album_page_info.album_recently_count > 0 ? store_view_album_page_info.album_recently_count : '*' + ' *',
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
    store_view_album_page_logic.page_albumlists_options.push(temp_Play_List_Recently);
    store_view_album_page_logic.page_albumlists_statistic.push({
      label: temp_Play_List_Recently.label,
      album_count: temp_Play_List_Recently.song_count.toString(),
      id: temp_Play_List_Recently.id
    });
    store_view_album_page_logic.page_albumlists.push(temp_Play_List_Recently)
    //////
    store_view_album_page_logic.page_albumlists_statistic.push({
      label: computed(() => t('entity.playlist_other')),
      album_count: store_view_media_page_info.media_playlist_count + ' *',
      id: 'album_list_all_PlayList'
    });
  }
  ////// view of artist
  const Init_page_artistlists_statistic_Data = () => {
    store_view_artist_page_info.page_artistlists_options = [];
    store_view_artist_page_info.page_artistlists_statistic = [];
    store_view_artist_page_info.page_artistlists = []
    //////
    const temp_Play_List_ALL: Play_List = {
      label: computed(() => t('nsmusics.view_page.allArtist')),
      value: 'artist_list_all',
      id: 'artist_list_all',
      name: computed(() => t('nsmusics.view_page.allArtist')),
      comment: computed(() => t('nsmusics.view_page.allArtist')),
      duration: 0,
      song_count: store_view_artist_page_info.artist_item_count + ' *',
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
    store_view_artist_page_info.page_artistlists_options.push(temp_Play_List_ALL);
    store_view_artist_page_info.page_artistlists_statistic.push({
      label: temp_Play_List_ALL.label,
      artist_count: temp_Play_List_ALL.song_count.toString(),
      id: temp_Play_List_ALL.id
    });
    store_view_artist_page_info.page_artistlists.push(temp_Play_List_ALL)
    //////
    const temp_Play_List_Love: Play_List = {
      label: computed(() => t('nsmusics.view_page.loveArtist')),
      value: 'artist_list_love',
      id: 'artist_list_love',
      name: computed(() => t('nsmusics.view_page.loveArtist')),
      comment: computed(() => t('nsmusics.view_page.loveArtist')),
      duration: 0,
      song_count: store_view_artist_page_info.artist_starred_count + ' *',
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
    store_view_artist_page_info.page_artistlists_options.push(temp_Play_List_Love);
    store_view_artist_page_info.page_artistlists_statistic.push({
      label: temp_Play_List_Love.label,
      artist_count: temp_Play_List_Love.song_count.toString(),
      id: temp_Play_List_Love.id
    });
    store_view_artist_page_info.page_artistlists.push(temp_Play_List_Love)
    //////
    const temp_Play_List_Recently: Play_List = {
      label: computed(() => t('nsmusics.view_page.recentPlay')),
      value: 'artist_list_recently',
      id: 'artist_list_recently',
      name: computed(() => t('nsmusics.view_page.recentPlay')),
      comment: computed(() => t('nsmusics.view_page.recentPlay')),
      duration: 0,
      song_count: store_view_artist_page_info.artist_recently_count > 0 ? store_view_artist_page_info.artist_recently_count : '*' + ' *',
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
    store_view_artist_page_info.page_artistlists_options.push(temp_Play_List_Recently);
    store_view_artist_page_info.page_artistlists_statistic.push({
      label: temp_Play_List_Recently.label,
      artist_count: temp_Play_List_Recently.song_count.toString(),
      id: temp_Play_List_Recently.id
    });
    store_view_artist_page_info.page_artistlists.push(temp_Play_List_Recently)
    //////
    store_view_artist_page_info.page_artistlists_statistic.push({
      label: computed(() => t('entity.playlist_other')),
      artist_count: store_view_media_page_info.media_playlist_count + ' *',
      id: 'artist_list_all_PlayList'
    });
  }

  ///// view of playlist
  watch(() => store_playlist_list_logic.playlist_names_StartUpdate, (newValue) => {
    if(newValue) {
      Init_page_songlists_statistic_Data();
      store_playlist_list_logic.playlist_names_StartUpdate = false
      console.log("store_playlist_list_logic.playlist_names_StartUpdate")
    }
  });

  ////
  const { shell } = require('electron');
  const openLink = (url: string) => {
    shell.openExternal(url);
  };
  const computed_i18n_Label_Update = computed(() => t('filter.recentlyUpdated'));

  ////
  import { provide } from "vue";
  import {store_player_tag_modify} from "@/store/player/store_player_tag_modify";
  import View_Edit_Tag from "@/components/tag_list/View_Edit_Tag.vue";
  const playlist_contextmenu = ref(null as any)
  provide("message", playlist_contextmenu);

  ////// Load Configs
  onMounted(async () => {
    store_app_configs_info.navidrome_db = await ipcRenderer.invoke('window-get-navidrome-db');
    store_app_configs_info.nsmusics_db = await ipcRenderer.invoke('window-get-nsmusics-db');
    console.log(store_app_configs_info.navidrome_db)
    console.log(store_app_configs_info.nsmusics_db)

    await store_app_configs_logic_load.load_app_config()
    await ipcRenderer.invoke('i18n-tray-label-menu',
        [
          t('player.play'),
          t('player.pause'),
          t('player.previous'),
          t('player.next'),
          t('nsmusics.view_page.desktop_lyrics'),
          t('common.quit'),
          t('nsmusics.siderbar_player.playback_1'),
          t('nsmusics.siderbar_player.playback_2'),
          t('nsmusics.siderbar_player.playback_3'),
          t('nsmusics.siderbar_player.playback_4')
        ]
    );
    await ipcRenderer.invoke('i18n-tray-music-order',
        store_player_audio_logic.play_order
    );

    try {
      store_app_configs_info.version = '1.0.8';
      console.log('Current Version:', store_app_configs_info.version);
      const xmlUrl = 'https://github.com/Super-Badmen-Viper/NSMusicS/releases/download/NSMusicS-Win-Update/NSMusicS.xml';
      await store_app_configs_logic_update.fetchAndParseXML(xmlUrl);
      console.log('Last Version:', store_app_configs_logic_update.getVersion());
      store_app_configs_info.version_update_explain = store_app_configs_logic_update.changelog_explain.replace(/;/g, '<br>')
      store_app_configs_info.version_update_address = store_app_configs_logic_update.url
      if (store_app_configs_info.version < store_app_configs_logic_update.getVersion()) {
        store_app_configs_info.version_updated = 1;
      }
    }catch {
      store_app_configs_info.version_updated = 0;
    }
  });
  function drawer_close_of_player_bar(){
    store_player_audio_logic.drawer_order_show = false;
    store_player_audio_logic.drawer_volume_show = false;
  }
</script>
<template>
  <n-message-provider>
    <!-- App Bady View-->
    <n-config-provider class="this_App" :theme="store_app_configs_info.theme">
      <n-global-style />
      <n-message-provider class="this_App">
        <n-layout has-sider class="this_App" embedded @click="drawer_close_of_player_bar">
          <!--Left Router_Menu-->
          <n-layout-sider
            style="border: 0;"
            collapse-mode="width"
            :collapsed-width="66"
            :width="160"
            :collapsed="true"
            @collapse="store_app_configs_info.app_left_menu_collapsed = true"
            @expand="store_app_configs_info.app_left_menu_collapsed = false">
            <n-flex vertical justify="space-between" style="height: 100vh">
              <div></div>
              <n-menu
                v-if="store_app_configs_info.menuOptions_appBar_show"
                v-model:value="store_app_configs_info.app_left_menu_select_activeKey"
                :collapsed="store_app_configs_info.app_left_menu_collapsed"
                :collapsed-width="66"
                :collapsed-icon-size="22"
                :options="store_app_configs_info.menuOptions_appBar"/>
              <div></div>
            </n-flex>
          </n-layout-sider>
          <!--Right Router_View-->
          <n-layout
            embedded style="height: calc(100vh - 150px);margin-top: 70px;">
            <!--Menu View -->
            <RouterView class="view_show_data"
                        v-if="store_router_data_info.router_select_model_menu"></RouterView>
            <!--Home View -->
            <RouterView class="view_show_data"
                        v-else-if="store_router_data_info.router_select_model_home"></RouterView>
            <!--Updateing View-->
            <RouterView class="view_show_data"
                        v-else-if="store_router_data_info.router_select_model_updateing"></RouterView>
            <!--Media View-->
            <RouterView class="view_show_table"
                        v-else-if="store_router_data_info.router_select_model_media"></RouterView>
            <!--Album View-->
            <RouterView class="view_show_table"
                        v-else-if="store_router_data_info.router_select_model_album"></RouterView>
            <!--Artist View-->
            <RouterView class="view_show_table"
                        v-else-if="store_router_data_info.router_select_model_artist"></RouterView>
            <!--Top Bar-->
            <div class="bar_top_setapp" style="background-color: transparent" @click="drawer_close_of_player_bar">
              <n-badge :value="store_app_configs_info.version_updated" :offset="[-17, -4]"
                       :type="store_app_configs_info.version_updated === 1 ? 'error' : 'info'"
                       style="
                          z-index: 100;
                          margin-top: 34.5px;margin-right:260px;
                          -webkit-app-region: no-drag;
                        ">
                <n-button quaternary circle
                          @click="store_app_configs_info.update_show = !store_app_configs_info.update_show">
                  <template #icon>
                    <n-icon size="20" :depth="2"><BrowserUpdatedFilled/></n-icon>
                  </template>
                </n-button>
              </n-badge>
              <section
                style="
                  -webkit-app-region: no-drag;
                  width: auto;
                  position: absolute;right: 0;top:30px;
                  text-align:center;
                  z-index: 99;
                ">
                <n-button
                  quaternary circle
                  style="margin-right:4px;"
                  @click="async () => {
                    if(store_server_user_model.model_server_type_of_web){
                      await ipcRenderer.invoke('mpv-stopped');
                    }
                    ipcRenderer.send('window-reset-data');
                  }">
                  <template #icon>
                    <n-icon size="20" :depth="2"><clean/></n-icon>
                  </template>
                  <!--<span style="font-weight: 500;">{{ $t('setting.clearQueryCache') }}</span>-->
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:4px"
                          @click="store_app_configs_logic_theme.theme_mode_change_click()">
                  <template #icon>
                    <n-icon size="20" :depth="2"><DarkTheme24Filled/></n-icon>
                  </template>
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:4px;"
                          @click="ipcRenderer.send('window-fullscreen');">
                  <template #icon>
                    <n-icon size="20" :depth="2" style="margin-top: 1px;"><FullScreenMaximize16Regular/></n-icon>
                  </template>
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:4px"
                          @click="ipcRenderer.send('window-min');">
                  <template #icon>
                    <n-icon size="24" :depth="2"><MinusRound/></n-icon>
                  </template>
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:4px"
                          @click="ipcRenderer.send('window-max');">
                  <template #icon>
                    <n-icon size="24" :depth="2"><Maximize16Regular/></n-icon>
                  </template>
                </n-button>
                <n-button quaternary circle size="medium" style="margin-right:30px"
                          @click="ipcRenderer.send('window-close');">
                  <template #icon>
                    <n-icon size="28" :depth="2"><Close/></n-icon>
                  </template>
                </n-button>
              </section>
            </div>
          </n-layout>
        </n-layout>
      </n-message-provider>
    </n-config-provider  >
    <!-- bottom PlayerBar and PlayerView -->
    <n-config-provider :theme="store_app_configs_info.theme_app">
      <!-- n-card can change Bar_Music_Player(text color) -->
      <n-card
        style="
          position: fixed;left: 0;bottom: 0;
          width: 100vw;height: 80px;
          background-color: #00000000;
          z-index: 100;
          border-radius: 12px 12px 0 0;border: 0 #00000000">
        <Bar_Music_Player/>
      </n-card>
      <View_Screen_Music_Player
        class="view_music_player"
        v-if="store_player_appearance.player_show"
        :style="{ height: `calc(100vh - ${store_player_appearance.player_show_hight_animation_value}vh)` }">
      </View_Screen_Music_Player>
    </n-config-provider>
    <!-- right drwaer of music_playlist -->
    <n-config-provider :theme="darkTheme">
      <n-drawer
        v-model:show="store_playlist_appearance.playlist_show"
        :width="520"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: 88px;margin-bottom:88px;
          z-index: 100;
        ">
        <n-drawer-content style="z-index: 100;">
          <template #default>
            <Bar_Music_PlayList
              v-if="store_playlist_appearance.playlist_show"
              style="z-index: 100;">
            </Bar_Music_PlayList>
          </template>
        </n-drawer-content>
      </n-drawer>
    </n-config-provider>
    <!-- bottom drwaer of player_bar(more,sound speed,sound effect) -->
    <n-config-provider :theme="darkTheme">
      <n-drawer
        v-model:show="store_player_sound_more.player_show_sound_more"
        :width="440"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 280px);height: 560px;
        ">
        <n-drawer-content v-if="store_player_sound_more.player_show_sound_more">
          <template #default>
            Not open || 未开放
          </template>
        </n-drawer-content>
      </n-drawer>
      <n-drawer
        v-model:show="store_player_sound_speed.player_show_sound_speed"
        :width="440"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 280px);height: 560px;
        ">
        <n-drawer-content v-if="store_player_sound_speed.player_show_sound_speed">
          <template #default>
            Not open || 未开放
          </template>
        </n-drawer-content>
      </n-drawer>
      <n-drawer
        v-model:show="store_player_sound_effects.player_show_sound_effects"
        :width="440"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 280px);height: 560px;
        ">
        <n-drawer-content v-if="store_player_sound_effects.player_show_sound_effects">
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
    <!-- right drwaer of tag_modify -->
    <n-config-provider :theme="darkTheme">
      <n-drawer
          v-model:show="store_player_tag_modify.player_show_tag_modify"
          :width="680"
          style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: 88px;margin-bottom:88px;
        ">
        <n-drawer-content>
          <template #default>
            <View_Edit_Tag></View_Edit_Tag>
          </template>
        </n-drawer-content>
      </n-drawer>
    </n-config-provider>
    <!-- right drwaer of update -->
    <n-config-provider :theme="darkTheme">
      <n-drawer
        v-model:show="store_app_configs_info.update_show"
        :width="640"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: 88px;margin-bottom:88px;
        ">
        <n-drawer-content>
          <template #default>
            <n-card :title="computed_i18n_Label_Update" size="medium" style="background-color: transparent">
              <n-space vertical style="font-size: 16px; font-weight: bolder;">
                <div>{{$t('nsmusics.view_page.current')}}{{$t('common.version')}} : {{ store_app_configs_info.version }}</div>
                <div>{{$t('nsmusics.view_page.last_next')}}{{$t('common.version')}} : {{ store_app_configs_logic_update.version }}</div>
                <br>
                NSMusicS{{$t('nsmusics.view_page.install')}}{{$t('common.description')}} :
                <a class="link" @click="openLink('https://github.com/Super-Badmen-Viper/NSMusicS/releases')">
                  https://github.com/Super-Badmen-Viper/NSMusicS/releases
                </a>
                <br>
                NSMusicS{{$t('nsmusics.view_page.download')}}{{$t('common.description')}} : <a class="link" @click="openLink(store_app_configs_info.version_update_address)">{{ store_app_configs_info.version_update_address }}</a>
                <br>
                <div v-html="store_app_configs_info.version_update_explain"></div>
              </n-space>
            </n-card>
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

.link {
  color: #FFFFFF;
  font-size: 15px;
  text-decoration: underline ;
}
.link:hover {
  color: #3DC3FF;
  background-color: transparent;
}
::-webkit-scrollbar {
  display: none;
}
</style>