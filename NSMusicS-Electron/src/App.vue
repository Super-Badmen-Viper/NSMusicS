<script setup lang="ts">
////// resource of vicons_svg
import {
  DarkTheme24Filled,
  Home28Regular,
  FullScreenMaximize24Filled,
  FullScreenMinimize24Filled,
  PeopleCommunity16Regular,
  SlideMicrophone32Regular,
  TextIndentIncreaseLtr20Filled,
  Settings20Regular,
  WindowNew16Regular,
  Apps20Regular
} from '@vicons/fluent'
import {
  AlbumFilled,
  MusicNoteRound,
  BrowserUpdatedFilled ,
  MinusRound,
  LibraryMusicOutlined,
  VideoLibraryOutlined,
  PhotoLibraryOutlined,
  LibraryBooksOutlined,
  LocalLibraryOutlined
} from '@vicons/material'
import {
  Close,
  Hearing,
  UserAvatarFilledAlt,
  MediaCast,
  BareMetalServer,
  MediaLibrary,
  Categories
} from '@vicons/carbon'
import {
  ArrowsMaximize,
  ArrowsMinimize,
  SortAscending2,
} from '@vicons/tabler'

////// views_components
import {darkTheme, NConfigProvider, NIcon} from 'naive-ui'
import {h, onMounted, computed, watch, provide} from 'vue';
import {RouterLink, RouterView, useRouter} from 'vue-router';
import Bar_Music_Player from '@/views/view_app/page_metadata/page_folder/page_music/music_components/player_bar/Bar_Music_Player.vue'
import Bar_Music_PlayList from '@/views/view_app/page_metadata/page_folder/page_music/music_drawer/View_Player_PlayList.vue'
import View_Screen_Music_Player from '@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/View_Screen_Music_Player.vue'
import {store_app_configs_info} from '@/data/data_stores/app/store_app_configs_info'
import {store_player_appearance} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_appearance";
import {store_player_sound_effects} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_sound_effects";
import {store_player_sound_speed} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_sound_speed";
import {store_player_sound_more} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_sound_more";
import {store_playlist_appearance} from '@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_appearance'
import {store_playlist_list_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_info"
import {store_playlist_list_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_logic"
import {store_server_user_model} from '@/data/data_stores/server/store_server_user_model'
import {store_view_media_page_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_logic";
import {store_view_album_page_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_album/store/store_view_album_page_logic"
import {store_view_artist_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_artist/store/store_view_artist_page_info"
import {store_view_artist_page_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_artist/store/store_view_artist_page_logic"
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import {store_router_data_logic} from "@/router/router_store/store_router_data_logic";
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {store_app_configs_logic_theme} from "@/data/data_stores/app/store_app_configs_logic_theme";
import {store_general_fetch_media_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_file/store_general_fetch_media_list";
import {store_general_fetch_home_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_home/store_general_fetch_home_list";
import {store_general_fetch_album_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_album/store_general_fetch_album_list";
import {store_general_fetch_artist_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_artist/store_general_fetch_artist_list";

////// BrowserWindow
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';
window.addEventListener('resize', () => {
  store_app_configs_info.window_innerWidth = window.innerWidth;
  store_app_configs_info.window_innerHeight = window.innerHeight;

  store_player_appearance.player_lyric_fontSize_Num =
      store_player_appearance.player_use_lyric_skip_forward ?
          36 + Math.floor((window.innerHeight - 880) / 200) * 6 :
          33 + Math.floor((window.innerHeight - 880) / 200) * 6;
  store_player_appearance.player_lyric_fontSize = `${store_player_appearance.player_lyric_fontSize_Num}px`;
});

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true
})
function renderIcon (icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
function renderRouterLink (nameValue: any, defaultValue: any){
  return () => h(RouterLink, {to: { name: nameValue }}, { default: () => defaultValue })
}
function create_menuOptions_appBar(){
  store_app_configs_info.app_view_menuOptions = []
  store_app_configs_info.app_view_menuOptions.push(
      {
        label: computed(() => renderRouterLink('setting', t('HeaderAdmin') + t('Console'))),
        key: 'setting',
        icon: renderIcon(Settings20Regular)
      },
      {key: 'divider-1', type: 'divider', props: {style: {marginLeft: '22px'}}},
  )
  store_app_configs_info.app_view_menuOptions.push(
      {
        label: computed(() => renderRouterLink('home', t('common.home'))),
        key: 'home',
        icon: renderIcon(Home28Regular),
      },
      // {
      //   label: computed(() => renderRouterLink('categories', t('entity.smartPlaylist') + t('Categories'))),
      //   key: 'categories',
      //   icon: renderIcon(Apps20Regular),
      // },
      {
        label: computed(() => renderRouterLink('album', t('entity.album_other'))),
        key: 'album',
        icon: renderIcon(AlbumFilled)
      },
      {
        label: computed(() => renderRouterLink('song', t('entity.track_other'))),
        key: 'song',
        icon: renderIcon(MusicNoteRound)
      },
      {
        label: computed(() => renderRouterLink('artist', t('entity.artist_other'))),
        key: 'artist',
        icon: renderIcon(UserAvatarFilledAlt)
      },
  )
  /// 兼容性代码，在更新多模态模式之后，将删除方法部分代码
  store_app_configs_info.menuOptions_selectd_model_1 = false
  store_app_configs_info.menuOptions_selectd_model_2 = false
  store_app_configs_info.menuOptions_selectd_model_3 = false
  store_app_configs_info.menuOptions_selectd_model_4 = false
  store_app_configs_info.app_view_menuOptions.push(
      {key: 'divider-1', type: 'divider', props: {style: {marginLeft: '22px'}}},
      {
        label: computed(() => renderRouterLink('update', t('HeaderLibraries'))),
        key: 'library',
        icon: renderIcon(MediaLibrary)
      },
  )
  // store_app_configs_info.app_view_menuOptions.push(
  //     {
  //       label: computed(() => renderRouterLink('update', t('nsmusics.siderbar_menu.karaoke'))),
  //       key: 'update',
  //       icon: renderIcon(SlideMicrophone32Regular)
  //     },
  // )
  ///
  // if (store_app_configs_info.menuOptions_selectd_model_2)
  //   store_app_configs_info.app_view_menuOptions.push(
  //       {
  //         label: computed(() => renderRouterLink('update', t('nsmusics.siderbar_menu.karaoke'))),
  //         key: 'update',
  //         icon: renderIcon(SlideMicrophone32Regular)
  //       },
  //   )
  // if (store_app_configs_info.menuOptions_selectd_model_1)
  //   store_app_configs_info.app_view_menuOptions.push(
  //       {key: 'divider-1', type: 'divider', props: {style: {marginLeft: '22px'}}},
  //       {
  //         label: computed(() => renderRouterLink('setting', t('page.appMenu.manageServers'))),
  //         key: 'setting',
  //         icon: renderIcon(BareMetalServer)
  //       },
  //       {
  //         label: computed(() => renderRouterLink('update', t('HeaderLibraries'))),
  //         key: 'library',
  //         icon: renderIcon(MediaLibrary)
  //       },
  //   )
  // if (store_app_configs_info.menuOptions_selectd_model_3)
  //   store_app_configs_info.app_view_menuOptions.push(
  //       {
  //         label: computed(() =>
  //             renderRouterLink('update', t('HeaderVideos'))),
  //         key: 'update',
  //         icon: renderIcon(VideoLibraryOutlined)
  //       },
  //       {
  //         label: computed(() =>
  //             renderRouterLink('update', t('Photo'))),
  //         key: 'update',
  //         icon: renderIcon(PhotoLibraryOutlined)
  //       },
  //       {
  //         label: computed(() =>
  //             renderRouterLink('update', t('Books'))),
  //         key: 'update',
  //         icon: renderIcon(LibraryBooksOutlined)
  //       },
  //       {
  //         label: computed(() =>
  //             renderRouterLink('update', t('Folders'))),
  //         key: 'update',
  //         icon: renderIcon(LocalLibraryOutlined)
  //       },
  //   )
}

////// player view
async function get_playerbar_to_switch_playerview(value: any) {
  store_player_appearance.player_show_complete = false;
  if (store_router_data_logic.clear_Memory_Model) {
    store_router_data_logic.clear_Files_temporary(); // Memory Model
  }
  if (value === 0) {
    store_player_appearance.player_show = true;
    if (store_router_data_logic.clear_Memory_Model) {
      store_app_configs_info.app_view_bar_show = false;
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
          store_app_configs_info.app_view_bar_show = true;
        }
      }
    }, 200);
  }, 30);
  setTimeout(async () => {
    if (value !== 0) {
      await handleMenuSelection();
    }
    store_player_appearance.player_show_complete = true;
    if(isElectron) {
      ipcRenderer.send('window-gc');
    }
  }, 600);
}
async function handleMenuSelection() {
  const menuActions: { [key: string]: () => void | Promise<void> } = {
    'home': () => {
      clearFilesIfNeeded('home');
      store_router_data_info.router_select_model_home = true;
      fetchDataIfNeeded('home');
    },
    'categories': () => {
      clearFilesIfNeeded('categories');
      store_router_data_info.router_select_model_categories = true;
      fetchDataIfNeeded('categories');
    },
    'update': () => {
      clearFilesIfNeeded();
      store_router_data_info.router_select_model_update = true;
    },
    'album': () => {
      clearFilesIfNeeded('album');
      fetchDataIfNeeded('album');
      store_router_data_info.router_select_model_album = true;
    },
    'song': async () => {
      clearFilesIfNeeded('media');
      await fetchDataIfNeeded('media');
      store_router_data_info.router_select_model_media = true;
    },
    'artist': () => {
      clearFilesIfNeeded('artist');
      fetchDataIfNeeded('artist');
      store_router_data_info.router_select_model_artist = true;
    },
    'login': () => {
      clearFilesIfNeeded();
      store_router_data_info.router_select_model_server_login = true;
    },
    'setting': () => {
      clearFilesIfNeeded();
      store_router_data_info.router_select_model_server_setting = true;
    },
    'library': () => {
      clearFilesIfNeeded();
      store_router_data_info.router_select_model_server_setting = true;
    },
  };
  const selectedAction = menuActions[store_app_configs_info.app_view_left_menu_select_activeKey];
  if (selectedAction) {
    await selectedAction();
  }
}
function clearFilesIfNeeded(except?: 'home' | 'categories' | 'album' | 'media' | 'artist') {
  if (!store_router_data_logic.clear_Memory_Model) {
    if (except === 'home') {
      store_router_data_logic.clear_Files_temporary_except_home();
    } else if (except === 'categories') {
      store_router_data_logic.clear_Files_temporary_except_categories();
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
function fetchDataIfNeeded(type: 'home' | 'categories' | 'album' | 'media' | 'artist') {
  if (store_router_data_logic.clear_Memory_Model) {
    if (type === 'home') {
      store_general_fetch_home_list.fetchData_Home();
    } else if (type === 'categories') {
      store_general_fetch_home_list.fetchData_Home();
    } else if (type === 'album') {
      store_general_fetch_album_list.fetchData_Album();
    } else if (type === 'media') {
      store_general_fetch_media_list.fetchData_Media();
    } else if (type === 'artist') {
      store_general_fetch_artist_list.fetchData_Artist();
    }
  }
}
provide('get_playerbar_to_switch_playerview', get_playerbar_to_switch_playerview);

////// router_music custom class
store_router_data_info.router = useRouter();
import routers from './router'
import {store_app_configs_logic_update} from "@/data/data_stores/app/store_app_configs_logic_update";
import {store_player_audio_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_logic";
import {store_view_media_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_info";
import {store_view_album_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_album/store/store_view_album_page_info";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
routers.beforeEach((to, from, next) => {
  if(to.name !== from.name){
    store_router_data_logic.clear_Files_temporary()
    next();
  }
});
routers.afterEach(async (to, from) => {
  if(to.name !== from.name){
    try{
      store_server_model_statistics.get_page_top_info()
    }catch{}
    store_router_data_logic.clear_Files_temporary()
    if(to.name === 'home'){
      store_router_data_info.router_select_model_home = true
      store_router_data_info.router_name = to.name
    }else if (to.name === 'categories') {
      store_router_data_info.router_select_model_categories = true
      store_router_data_info.router_name = to.name
    }else if(to.name === 'update'){
      store_router_data_info.router_select_model_update = true
      store_router_data_info.router_name = to.name
    }else if(to.name === 'song'){
      store_router_data_info.router_select_model_media = true
      store_router_data_info.router_name = to.name
      Init_page_songlists_statistic_Data();
    }else if(to.name === 'album'){
      store_router_data_info.router_select_model_album = true
      store_router_data_info.router_name = to.name
      Init_page_albumlists_statistic_Data()
    }else if(to.name === 'artist'){
      store_router_data_info.router_select_model_artist = true
      store_router_data_info.router_name = to.name
      Init_page_artistlists_statistic_Data()
    }else if(to.name === 'login') {
      if(!isElectron) {
        store_router_data_info.router_select_model_server_login = true
        store_router_data_info.router_name = to.name
      }
    }else if(to.name === 'library'){
      store_router_data_info.router_select_model_server_setting = true
      store_router_data_info.router_name = to.name
    }else{
      store_router_data_info.router_select_model_server_setting = true
      store_router_data_info.router_name = to.name
    }
    ///
    store_app_configs_info.app_view_left_menu_select_activeKey = to.name
    console.log(to.name)
    store_app_configs_logic_save.save_system_config_of_View_Router_History()
    ///
    store_app_configs_info.app_view_left_menu_collapsed = true
    ///
    if(!store_router_data_logic.clear_UserExperience_Model) {
      if (to.name != 'song') {
        try {
          if(isElectron) {
            const memoryUsage = await ipcRenderer.invoke('window-get-memory')
            if (memoryUsage.rss > store_router_data_info.MEMORY_THRESHOLD) {
              ipcRenderer.send('window-reset-data')
            }
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
    label: computed(() => t('nsmusics.view_page.allMedia')),
    value: 'song_list_all',
    id: 'song_list_all',
    name: computed(() => t('nsmusics.view_page.allMedia')),
    comment: computed(() => t('nsmusics.view_page.allMedia')),
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
    label: computed(() => t('nsmusics.view_page.loveMedia')),
    value: 'song_list_love',
    id: 'song_list_love',
    name: computed(() => t('nsmusics.view_page.loveMedia')),
    comment: computed(() => t('nsmusics.view_page.loveMedia')),
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
    song_count:
        store_server_user_model.model_server_type_of_local || store_server_users.server_select_kind === 'ninesong' ?
            temp_Play_List_Recently.song_count.toString() : '*' + ' *',
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
  if(
      (store_server_users.server_select_kind != 'jellyfin' &&
      store_server_users.server_select_kind != 'emby') ||
      store_server_user_model.model_server_type_of_local
  ) {
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
  }
  //////
  store_view_album_page_logic.page_albumlists_statistic.push({
    label: computed(() => t('entity.playlist_other')),
    album_count: store_view_media_page_info.media_playlist_count + ' *',
    id: 'album_list_all_PlayList'
  });
}
////// view of artist
const Init_page_artistlists_statistic_Data = () => {
  store_view_artist_page_logic.page_artistlists_options = [];
  store_view_artist_page_logic.page_artistlists_statistic = [];
  store_view_artist_page_logic.page_artistlists = []
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
  store_view_artist_page_logic.page_artistlists_options.push(temp_Play_List_ALL);
  store_view_artist_page_logic.page_artistlists_statistic.push({
    label: temp_Play_List_ALL.label,
    artist_count: temp_Play_List_ALL.song_count.toString(),
    id: temp_Play_List_ALL.id
  });
  store_view_artist_page_logic.page_artistlists.push(temp_Play_List_ALL)
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
  store_view_artist_page_logic.page_artistlists_options.push(temp_Play_List_Love);
  store_view_artist_page_logic.page_artistlists_statistic.push({
    label: temp_Play_List_Love.label,
    artist_count: temp_Play_List_Love.song_count.toString(),
    id: temp_Play_List_Love.id
  });
  store_view_artist_page_logic.page_artistlists.push(temp_Play_List_Love)
  //////
  if(
      (store_server_users.server_select_kind != 'jellyfin' &&
      store_server_users.server_select_kind != 'emby') ||
      store_server_user_model.model_server_type_of_local
  ) {
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
    store_view_artist_page_logic.page_artistlists_options.push(temp_Play_List_Recently);
    store_view_artist_page_logic.page_artistlists_statistic.push({
      label: temp_Play_List_Recently.label,
      artist_count: temp_Play_List_Recently.song_count.toString(),
      id: temp_Play_List_Recently.id
    });
    store_view_artist_page_logic.page_artistlists.push(temp_Play_List_Recently)
  }
  //////
  store_view_artist_page_logic.page_artistlists_statistic.push({
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
import { openLink } from '@/utils/electron/openLink';
const computed_i18n_Label_Update = computed(() => t('filter.recentlyUpdated'));

////
import {store_player_tag_modify} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_tag_modify";
import View_Edit_Tag from "@/views/view_app/page_metadata/page_folder/page_music/music_drawer/View_Edit_Tag.vue";
import View_Player_Effect from "@/views/view_app/page_metadata/page_folder/page_music/music_drawer/View_Player_Effect.vue";
import View_Mini_Music_Player from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/View_Mini_Music_Player.vue";

////// Load Configs
const { locale } = useI18n({
  inheritLocale: true,
  useScope: 'global'
})
import {store_server_login_logic} from "@/views/view_server/page_metadata/page_login/store/store_server_login_logic";
import {store_server_login_info} from "@/views/view_server/page_metadata/page_login/store/store_server_login_info";
import {
  store_server_model_statistics
} from "@/data/data_stores/server/server_api_abstract/music_scene/model/model_statistics";
onMounted(()=>{
  create_menuOptions_appBar()
})
onMounted(async () => {
  try {
    if (!isElectron) {
      // isLogin
      await store_server_login_logic.checkLoginStatus();
    } else {
      await store_app_configs_info.load_app()
    }
  }catch (e) {
    console.error(e);
  }
  store_player_audio_logic.player_init_play = true;
});
watch(() => store_app_configs_info.lang, async (newValue) => {
  locale.value = newValue
});
if(isElectron) {
  ipcRenderer.on('tray-app-quit', () => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_Audio_Info()
  });
}
</script>
<template>
  <n-message-provider>
    <!-- Player Bady View-->
    <n-config-provider
        class="this_App" v-if="!store_router_data_info.router_select_model_server_login"
        :theme="store_app_configs_info.theme">
      <n-global-style />
      <n-message-provider class="this_App">
        <n-layout
            has-sider
            class="this_App"
            embedded>
          <!--Left Router_Menu app_view_left_menu_collapsed-->
          <n-flex vertical justify="center" style="height: 100vh;">
            <div></div>
            <n-layout-sider
              show-trigger="bar"
              v-if="store_app_configs_info.app_view_left_menu_collapsed"
              collapse-mode="width"
              :collapsed-width="66"
              :collapsed="store_app_configs_info.app_view_left_menu_collapsed"
              @collapse="store_app_configs_info.app_view_left_menu_collapsed = true"
              @expand="store_app_configs_info.app_view_left_menu_collapsed = false"
              :width="166"
              style="
                border-radius:  0 20px 20px 0;
              "
              :style="{
                zIndex: store_player_appearance.player_show ? 200 : 208,
              }"
            >
              <n-flex vertical justify="center">
                <div></div>
                <n-menu
                  v-if="store_app_configs_info.app_view_bar_show"
                  v-model:value="store_app_configs_info.app_view_left_menu_select_activeKey"
                  :collapsed="store_app_configs_info.app_view_left_menu_collapsed"
                  :collapsed-width="66"
                  :collapsed-icon-size="22"
                  :icon-size="20"
                  :options="store_app_configs_info.app_view_menuOptions"
                  @click="store_general_fetch_media_list.fetchData_Media_of_server_web_clear_all_parms()"
                />
                <div></div>
              </n-flex>
            </n-layout-sider>
            <div></div>
          </n-flex>
          <!--Left Router_Menu app_view_left_menu_show-->
          <n-drawer
            v-model:show="store_app_configs_info.app_view_left_menu_show"
            placement="left"
            :width="200"
            style="border: 0;border-radius:  0 20px 20px 0;"
          >
            <n-layout-sider
              v-if="store_app_configs_info.app_view_left_menu_show"
              :width="200"
              style="
                border: 0;
                z-index: 200;
                height: 100vh;
              "
            >
              <n-flex vertical justify="center" style="height: 100vh;">
                <div></div>
                <n-menu
                  v-if="store_app_configs_info.app_view_bar_show"
                  v-model:value="store_app_configs_info.app_view_left_menu_select_activeKey"
                  :collapsed="store_app_configs_info.app_view_left_menu_collapsed"
                  :collapsed-width="66"
                  :collapsed-icon-size="22"
                  :icon-size="20"
                  :options="store_app_configs_info.app_view_menuOptions"
                  @click="store_general_fetch_media_list.fetchData_Media_of_server_web_clear_all_parms()"
                />
                <div></div>
              </n-flex>
            </n-layout-sider>
          </n-drawer>
          <!--Right Router_View-->
          <n-layout
            embedded
            :native-scrollbar="false"
            style="
              height: calc(100vh - 150px);margin-top: 70px;
              position: absolute;left: 66px;
              z-index: 0;
            ">
            <!--Menu View -->
            <RouterView class="view_show_data"
                        v-if="store_router_data_info.router_select_model_menu"></RouterView>
            <!--Home View -->
            <RouterView class="view_show_data"
                        v-else-if="store_router_data_info.router_select_model_home"></RouterView>
            <!--Categories View -->
            <RouterView class="view_show_data"
                        v-else-if="store_router_data_info.router_select_model_categories"></RouterView>
            <!--Updateing View-->
            <RouterView class="view_show_data"
                        v-else-if="store_router_data_info.router_select_model_update"></RouterView>
            <!--Media View-->
            <RouterView class="view_show_table"
                        v-else-if="store_router_data_info.router_select_model_media"></RouterView>
            <!--Album View-->
            <RouterView class="view_show_table"
                        v-else-if="store_router_data_info.router_select_model_album"></RouterView>
            <!--Artist View-->
            <RouterView class="view_show_table"
                        v-else-if="store_router_data_info.router_select_model_artist"></RouterView>
            <!--Genre View-->
            <RouterView class="view_show_table"
                        v-else-if="store_router_data_info.router_select_model_genre"></RouterView>
            <!--Server_setting View-->
            <RouterView class="view_show_table"
                        v-else-if="store_router_data_info.router_select_model_server_setting"></RouterView>
            <!--Server_library View-->
            <RouterView class="view_show_table"
                        v-else-if="store_router_data_info.router_select_model_server_library"></RouterView>
            <!--Top Bar-->
            <div class="bar_top_setapp"
                 style="background-color: transparent">
              <n-tooltip trigger="hover" placement="top"
                         v-if="!store_app_configs_info.window_state_miniplayer">
                <template #trigger>
                  <n-badge :value="store_app_configs_info.version_updated" :offset="[-17, -4]"
                           :type="store_app_configs_info.version_updated === 1 ? 'error' : 'info'"
                           :style="{
                              marginRight: isElectron
                                ? (store_app_configs_info.desktop_system_kind !== 'darwin' ? '257px' : '106px')
                                : '76px'
                           }"
                           style="
                          z-index: 100;
                          margin-top: 34px;
                          -webkit-app-region: no-drag;
                        ">
                    <n-button quaternary circle
                              @click="store_app_configs_info.update_show = !store_app_configs_info.update_show">
                      <template #icon>
                        <n-icon size="20" :depth="2"><BrowserUpdatedFilled/></n-icon>
                      </template>
                    </n-button>
                  </n-badge>
                </template>
                {{ $t('filter.recentlyUpdated') }}
              </n-tooltip>
              <section
                style="
                  -webkit-app-region: no-drag;
                  width: auto;
                  position: absolute;right: 0;top:30px;
                  text-align:center;
                  z-index: 99;
                ">
                <n-tooltip trigger="hover" placement="top"
                           v-if="!store_app_configs_info.window_state_miniplayer">
                  <template #trigger>
                    <n-button quaternary circle
                              :style="{
                                marginRight:
                                  isElectron ?
                                  (store_app_configs_info.desktop_system_kind != 'darwin' ? '4px' : '4px') : '36px'
                              }"
                              @click="store_app_configs_logic_theme.theme_mode_change_click()">
                      <template #icon>
                        <n-icon size="20" :depth="2"><DarkTheme24Filled/></n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('LabelDashboardTheme') }}
                </n-tooltip>
                <n-tooltip trigger="hover" placement="top"
                           v-if="isElectron && !store_app_configs_info.window_state_miniplayer && store_app_configs_info.desktop_system_kind != 'darwin'">
                  <template #trigger>
                    <n-button quaternary circle style="margin-right:4px;"
                              @click="() => {
                            if(isElectron) {
                              ipcRenderer.send('window-fullscreen');
                            }
                            store_app_configs_info.window_full = !store_app_configs_info.window_full;
                            store_app_configs_info.window_max = store_app_configs_info.window_full;
                          }">
                      <template #icon>
                        <n-icon size="19" :depth="2"
                                v-if="store_app_configs_info.window_full">
                          <ArrowsMinimize/>
                        </n-icon>
                        <n-icon size="19" :depth="2"
                                v-else>
                          <ArrowsMaximize/>
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('ButtonFullscreen') }}
                </n-tooltip>
                <n-tooltip trigger="hover" placement="top"
                           v-if="isElectron">
                  <template #trigger>
                    <n-button quaternary circle 
                              :style="{
                                marginRight:
                                  store_app_configs_info.desktop_system_kind != 'darwin' ? '4px' : '30px'
                              }"
                            @click="async () => {
                            if(isElectron) {
                              // 请不要更改这段诡异的代码，它依靠Electron的BUG运行，呵呵
                              store_app_configs_info.window_state_miniplayer_card = false
                              store_app_configs_info.window_state_miniplayer_desktop_lyric = false
                              store_app_configs_info.window_state_miniplayer_album = false
                              ipcRenderer.send('window-state-miniplayer-open');
                              ipcRenderer.send('window-state-miniplayer-open');
                              //
                              store_app_configs_info.window_state_miniplayer = !store_app_configs_info.window_state_miniplayer
                              //await ipcRenderer.invoke('get-window-state-miniplayer');
                              store_player_appearance.player_collapsed_action_bar_of_Immersion_model = false
                              //
                              store_app_configs_info.window_full = false;
                              store_app_configs_info.window_max = false;
                            }
                          }">
                      <template #icon>
                        <n-icon size="24" :depth="2"><WindowNew16Regular/></n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('nsmusics.view_player.view_player_mini') }}
                </n-tooltip>
                <n-tooltip trigger="hover" placement="top"
                           v-if="isElectron && store_app_configs_info.desktop_system_kind != 'darwin'">
                  <template #trigger>
                    <n-button quaternary circle style="margin-right:4px"
                          @click="() => {
                            if(isElectron) {
                              ipcRenderer.send('window-min');
                            }
                          }">
                      <template #icon>
                        <n-icon size="24" :depth="2"><MinusRound/></n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('common.minimize') }}
                </n-tooltip>
                <n-tooltip trigger="hover" placement="top"
                           v-if="isElectron && store_app_configs_info.desktop_system_kind != 'darwin'">
                  <template #trigger>
                    <n-button 
                        quaternary circle 
                        style="margin-right:4px"
                          @click="() => {
                            if(isElectron) {
                              if(store_app_configs_info.desktop_system_kind === 'linux'){
                                ipcRenderer.send('window-fullscreen');
                                store_app_configs_info.window_full = !store_app_configs_info.window_full;
                                store_app_configs_info.window_max = store_app_configs_info.window_full;
                              }else{
                                ipcRenderer.send('window-max');
                                store_app_configs_info.window_max = !store_app_configs_info.window_max;
                                store_app_configs_info.window_full = false;
                              }
                            }
                          }">
                      <template #icon>
                        <n-icon size="20" :depth="2" v-if="store_app_configs_info.window_max"><FullScreenMinimize24Filled/></n-icon>
                        <n-icon size="20" :depth="2" v-else><FullScreenMaximize24Filled/></n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('common.maximize') }}
                </n-tooltip>
                <n-tooltip trigger="hover" placement="top"
                           v-if="isElectron && store_app_configs_info.desktop_system_kind != 'darwin'">
                  <template #trigger>
                    <n-button quaternary circle style="margin-right:30px"
                          @click="() => {
                            if(isElectron) {
                              ipcRenderer.send('window-close');
                            }
                          }">
                      <template #icon>
                        <n-icon size="28" :depth="2"><Close/></n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('Off') }}
                </n-tooltip>
              </section>
            </div>
          </n-layout>
          <!-- bottom PlayerBar and PlayerView -->
          <n-config-provider
              :theme="store_app_configs_info.theme_app"
              style="z-index: 205;">
            <!-- n-card can change Bar_Music_Player(text color) -->
            <n-card
              style="
                position: fixed;left: 0;bottom: 0;
                width: 100vw;
                height: 80px;
                background-color: #00000000;
                border-radius: 12px 12px 0 0;border: 0 #00000000">
              <Bar_Music_Player/>
            </n-card>
          </n-config-provider>
          <!-- bottom PlayerBar and PlayerView -->
          <n-config-provider
              :theme="store_app_configs_info.theme_app"
              style="z-index: 203;">
            <View_Screen_Music_Player
                class="view_music_player"
                v-if="store_player_appearance.player_show && !store_app_configs_info.window_state_miniplayer"
                :style="{ height: `calc(100vh - ${store_player_appearance.player_show_hight_animation_value}vh)` }">
            </View_Screen_Music_Player>
          </n-config-provider>
          <!-- bottom PlayerBar and PlayerView -->
          <n-config-provider
              :theme="store_app_configs_info.theme_app"
              style="z-index: 211;">
            <View_Mini_Music_Player
                v-if="store_app_configs_info.window_state_miniplayer"
                class="view_music_player" style="height: 100vh;">
            </View_Mini_Music_Player>
          </n-config-provider>
          <n-config-provider :theme="darkTheme">
            <n-drawer
              v-model:show="store_app_configs_info.window_state_miniplayer_playlist"
              :width="310"
              z-index="100"
              style="
                  border-radius: 12px 0 0 12px;
                  border: 1.5px solid #FFFFFF20;
                  background-color: rgba(127, 127, 127, 0.1);
                  backdrop-filter: blur(10px);
                  margin-top: 88px;margin-bottom:88px;
                ">
              <n-drawer-content style="z-index: 100;">
                <template #default>
                  <Bar_Music_PlayList style="z-index: 100;">
                  </Bar_Music_PlayList>
                </template>
              </n-drawer-content>
            </n-drawer>
          </n-config-provider>
        </n-layout>
      </n-message-provider>
    </n-config-provider>
    <!-- server login-->
    <RouterView
        class="this_App"
        v-if="store_router_data_info.router_select_model_server_login">
    </RouterView>

    <!-- right drwaer -->
    <n-config-provider :theme="darkTheme">
      <!-- right drwaer of music_playlist -->
      <n-drawer
        v-model:show="store_playlist_appearance.playlist_show"
        :width="520"
        z-index="100"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #FFFFFF20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: 88px;margin-bottom:88px;
        ">
        <n-drawer-content style="z-index: 100;">
          <template #default>
            <Bar_Music_PlayList style="z-index: 100;">
            </Bar_Music_PlayList>
          </template>
        </n-drawer-content>
      </n-drawer>
      <!-- bottom drwaer of player_bar(more,sound speed,sound effect) -->
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
            <span style="font-size: 30px;font-weight: 800;">Not open || 未开放</span>
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
            <span style="font-size: 30px;font-weight: 800;">Not open || 未开放</span>
          </template>
        </n-drawer-content>
      </n-drawer>
      <n-drawer
        v-model:show="store_player_sound_effects.player_show_sound_effects"
        :width="660"
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
              <n-tab-pane name="000">
                <template #tab>
                  {{ $t('page.setting.generalTab') }}
                </template>
                <View_Player_Effect/>
              </n-tab-pane>
              <n-tab-pane name="001" tab="均衡器">
                <span style="font-size: 30px;font-weight: 800;">Not open || 未开放</span>
              </n-tab-pane>
              <n-tab-pane name="002" tab="九歌音效">
                <span style="font-size: 30px;font-weight: 800;">Not open || 未开放</span>
              </n-tab-pane>
              <n-tab-pane name="003" tab="声学适配">
                <span style="font-size: 30px;font-weight: 800;">Not open || 未开放</span>
              </n-tab-pane>
              <n-tab-pane name="004" tab="多音轨">
                <span style="font-size: 30px;font-weight: 800;">Not open || 未开放</span>
              </n-tab-pane>
              <n-tab-pane name="005" tab="音效制作">
                <span style="font-size: 30px;font-weight: 800;">Not open || 未开放</span>
              </n-tab-pane>
            </n-tabs>
          </template>
        </n-drawer-content>
      </n-drawer>
      <!-- right drwaer of tag_modify -->
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
      <!-- right drwaer of update -->
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
            <n-card :title="computed_i18n_Label_Update" style="background-color: transparent">
              <n-space vertical style="font-size: 16px; font-weight: bolder;">
                <div>{{$t('nsmusics.view_page.current')}}{{$t('common.version')}} : {{ store_app_configs_info.version }}</div>
                <div>{{$t('nsmusics.view_page.last_next')}}{{$t('common.version')}} : {{ store_app_configs_logic_update.version }}</div>
                <br>
                NSMusicS{{$t('nsmusics.view_page.install')}}{{$t('common.description')}} :
                <a class="link" @click="openLink('https://github.com/Super-Badmen-Viper/NSMusicS/releases')">
                  https://github.com/Super-Badmen-Viper/NSMusicS/releases
                </a>
                <br>
<!--                NSMusicS{{$t('nsmusics.view_page.download')}}{{$t('common.description')}} : <a class="link" @click="openLink(store_app_configs_info.version_update_address)">{{ store_app_configs_info.version_update_address }}</a>-->
<!--                <br>-->
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
html, body { scroll-behavior:smooth; }

.this_App {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

.bar_top_setapp{
  width: calc(100vw - 60px);
  height: 60px;
  margin-left: 37px;

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