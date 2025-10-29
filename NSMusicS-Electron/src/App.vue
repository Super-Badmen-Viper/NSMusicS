<script setup lang="ts">
////// resource of vicons_svg
import {
  DarkTheme24Filled,
  Home28Regular,
  FullScreenMaximize24Filled,
  FullScreenMinimize24Filled,
  Settings20Regular,
  WindowNew16Regular,
  ReceiptPlay24Regular,
  DataHistogram20Regular,
  TagMultiple24Regular,
  History20Filled,
} from '@vicons/fluent'
import {
  AlbumFilled,
  MusicNoteRound,
  BrowserUpdatedFilled,
  MinusRound,
  LibraryMusicOutlined,
  FindInPageFilled,
} from '@vicons/material'
import { Close, DataClass, UserAvatarFilledAlt } from '@vicons/carbon'
import { ArrowsMaximize, ArrowsMinimize } from '@vicons/tabler'

////// views_components
import { darkTheme, NConfigProvider, NIcon } from 'naive-ui'
import { h, onMounted, computed, watch, provide } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import Bar_Music_Player from '@/views/view_app/components/player_bar/Bar_Music_Player.vue'
import Bar_Music_PlayList from '@/views/view_app/drawer/View_Player_PlayList.vue'
import View_Screen_Music_Player from '@/views/view_app/page/page_player/View_Screen_Music_Player.vue'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { usePagePlayerSoundEffectsStore } from '@/data/data_status/app_status/page_status/player_store/usePagePlayerSoundEffectsStore'
import { usePagePlayerSoundSpeedStore } from '@/data/data_status/app_status/page_status/player_store/usePagePlayerSoundSpeedStore'
import { usePagePlayerSoundMoreStore } from '@/data/data_status/app_status/page_status/player_store/usePagePlayerSoundMoreStore'
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { storeToRefs } from 'pinia'
import { store_server_login_logic } from '@/views/view_server/page_login/store/store_server_login_logic'
import { store_server_model_statistics } from '@/data/data_stores/server_api_stores/server_api_core/model/model_statistics'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'

import { usePageArtistStore } from '@/data/data_status/app_status/page_status/artist_store/usePageArtistStore'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { store_system_configs_theme } from '@/data/data_stores/local_system_stores/store_system_configs_theme'
import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { store_general_model_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'
import { store_general_fetch_media_cue_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_cue_file/store_general_fetch_media_cue_list'
import { store_general_fetch_home_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_home/store_general_fetch_home_list'
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { store_general_fetch_artist_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_artist/store_general_fetch_artist_list'
import { usePageMediaCueStore } from '@/data/data_status/app_status/page_status/media_cue_store/usePageMediaCueStore'
import { usePagePlayerTagModifyStore } from '@/data/data_status/app_status/page_status/player_store/usePagePlayerTagModifyStore'

////// BrowserWindow
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
let mobile_model = false
// 在setup上下文中获取Store实例
const playerAppearanceStore = usePlayerAppearanceStore()
const playlistStore = usePlaylistStore()
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
const playerAudioStore = usePlayerAudioStore()
const playerSettingStore = usePlayerSettingStore()
const pageArtistStore = usePageArtistStore()
const pageMediaStore = usePageMediaStore()
const pageMediaCueStore = usePageMediaCueStore()
const playerSoundEffectsStore = usePagePlayerSoundEffectsStore()
const playerSoundSpeedStore = usePagePlayerSoundSpeedStore()
const playerSoundMoreStore = usePagePlayerSoundMoreStore()
const playerTagModifyStore = usePagePlayerTagModifyStore()
// 使用 storeToRefs 解构出所需的响应式属性
const {
  player_show,
  player_show_hight_animation_value,
  player_collapsed_action_bar_of_Immersion_model,
  player_lyric_fontSize_Num,
} = storeToRefs(playerAppearanceStore)
const { player_show_sound_effects } = storeToRefs(playerSoundEffectsStore)
const { player_show_sound_speed } = storeToRefs(playerSoundSpeedStore)
const { player_show_sound_more } = storeToRefs(playerSoundMoreStore)
const { player_show_tag_modify } = storeToRefs(playerTagModifyStore)

window.addEventListener('resize', () => {
  init_player_configs()
})

function init_player_configs() {
  store_system_configs_info.window_innerWidth = window.innerWidth
  store_system_configs_info.window_innerHeight = window.innerHeight

  mobile_model = window.innerWidth / window.innerHeight < 0.5

  playerAppearanceStore.player_lyric_fontSize_Num =
    playerAppearanceStore.player_use_lyric_skip_forward
      ? 36 + Math.floor((window.innerHeight - 880) / 200) * 6
      : 33 + Math.floor((window.innerHeight - 880) / 200) * 6
  playerAppearanceStore.player_lyric_fontSize = `${player_lyric_fontSize_Num}px`
}

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})
function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
function renderRouterLink(nameValue, defaultValue) {
  store_router_data_info.router_click = true
  return () => h(RouterLink, { to: { name: nameValue } }, { default: () => defaultValue })
}
function create_menuOptions_appBar() {
  store_system_configs_info.app_view_menuOptions = []
  store_system_configs_info.app_view_menuOptions.push(
    {
      label: computed(() => renderRouterLink('setting', t('HeaderAdmin') + t('Console'))),
      key: 'setting',
      icon: renderIcon(Settings20Regular),
    },
    { key: 'divider-1', type: 'divider', props: { style: { marginLeft: '22px' } } }
  )
  store_system_configs_info.app_view_menuOptions.push(
    {
      label: computed(() =>
        renderRouterLink('charts', t('Play') + t('nsmusics.siderbar_menu.charts'))
      ),
      key: 'charts',
      icon: renderIcon(DataHistogram20Regular),
    },
    {
      label: computed(() => renderRouterLink('recommend', t('nsmusics.view_page.recommend'))),
      key: 'recommend',
      icon: renderIcon(FindInPageFilled),
    },
    {
      label: computed(() => renderRouterLink('home', t('common.home'))),
      key: 'home',
      icon: renderIcon(Home28Regular),
    },
    { key: 'divider-1', type: 'divider', props: { style: { marginLeft: '22px' } } },
    {
      label: computed(() =>
        renderRouterLink(
          'recently_added',
          t('filter.recentlyAdded') + ' | ' + t('MediaInfoTimestamp')
        )
      ),
      key: 'recently_added',
      icon: renderIcon(History20Filled),
    },
    {
      label: computed(() => renderRouterLink('album', t('entity.album_other'))),
      key: 'album',
      icon: renderIcon(AlbumFilled),
    },
    {
      label: computed(() => renderRouterLink('media', t('entity.track_other'))),
      key: 'media',
      icon: renderIcon(MusicNoteRound),
    },
    {
      label: computed(() => renderRouterLink('artist', t('entity.artist_other'))),
      key: 'artist',
      icon: renderIcon(UserAvatarFilledAlt),
    },
    {
      label: computed(() => renderRouterLink('media_cue', 'CUE ' + t('nsmusics.view_page.disk'))),
      key: 'media_cue',
      icon: renderIcon(LibraryMusicOutlined),
    },
    { key: 'divider-1', type: 'divider', props: { style: { marginLeft: '22px' } } },
    {
      label: computed(() => renderRouterLink('tag', t('Metadata') + t('HeaderAdmin'))),
      key: 'tag',
      icon: renderIcon(TagMultiple24Regular),
    }
  )
  /// 兼容性代码，在更新多模态模式之后，将删除方法部分代码
  store_system_configs_info.menuOptions_selectd_model_1 = false
  store_system_configs_info.menuOptions_selectd_model_2 = false
  store_system_configs_info.menuOptions_selectd_model_3 = false
  store_system_configs_info.menuOptions_selectd_model_4 = false
}

////// player view
async function get_playerbar_to_switch_playerview(value) {
  playerAppearanceStore.player_show_complete = false
  if (store_router_data_logic.clear_Memory_Model) {
    store_router_data_logic.clearAllTemporaryFiles() // Memory Model
  }
  if (value === 0) {
    playerAppearanceStore.player_show = true
    if (store_router_data_logic.clear_Memory_Model) {
      store_system_configs_info.app_view_bar_show = false
    }
  }
  setTimeout(() => {
    playerAppearanceStore.player_show_hight_animation_value = value
    setTimeout(() => {
      if (value === 0) {
        store_system_configs_info.theme_app = darkTheme
      } else {
        store_system_configs_info.theme_app = store_system_configs_info.theme
        playerAppearanceStore.player_show = false
        if (store_router_data_logic.clear_Memory_Model) {
          store_system_configs_info.app_view_bar_show = true
        }
      }
    }, 200)
  }, 30)
  setTimeout(async () => {
    playerAppearanceStore.player_show_complete = true
    if (isElectron) {
      ipcRenderer.send('window-gc')
    }
  }, 600)
}
provide('get_playerbar_to_switch_playerview', get_playerbar_to_switch_playerview)

////// router_app custom class
store_router_data_info.router = useRouter()
import routers from './router'
import { store_system_configs_update } from '@/data/data_stores/local_system_stores/store_system_configs_update'
import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
routers.beforeEach((to, from, next) => {
  if (to.name !== from.name) {
    store_router_data_logic.clearAllTemporaryFiles()
    next()
  }
})
routers.afterEach(async (to, from) => {
  if (to.name !== from.name) {
    try {
      store_server_model_statistics.get_page_top_info()
    } catch (error) {
      console.error('获取页面顶部信息失败:', error)
    }
    store_router_data_logic.clearAllTemporaryFiles()
    store_router_data_info.router_select = to.name
    if (to.name === 'home') {
      store_router_data_info.router_name = to.name
    } else if (to.name === 'recently_added') {
      const pageHomeStore = usePageHomeStore()
      pageHomeStore.home_Files_temporary_recently_added_search = {
        start: 0,
        end: 30,
      }
      store_router_data_info.router_name = to.name
    } else if (to.name === 'charts') {
      store_router_data_info.router_name = to.name
    } else if (to.name === 'recommend') {
      store_router_data_info.router_name = to.name
    } else if (to.name === 'tag') {
      store_router_data_info.router_name = to.name
    } else if (to.name === 'media_cue') {
      store_router_data_info.router_name = to.name
      Init_page_cuelists_statistic_Data()
    } else if (to.name === 'update') {
      store_router_data_info.router_name = to.name
    } else if (to.name === 'media') {
      store_router_data_info.router_name = to.name
      Init_page_songlists_statistic_Data()
    } else if (to.name === 'album') {
      store_router_data_info.router_name = to.name
      Init_page_albumlists_statistic_Data()
    } else if (to.name === 'artist') {
      store_router_data_info.router_name = to.name
      Init_page_artistlists_statistic_Data()
    } else if (to.name === 'login') {
      if (!isElectron) {
        store_router_data_info.router_select_model_server_login = true
        store_router_data_info.router_name = to.name
      }
    } else if (to.name === 'library') {
      store_router_data_info.router_select_model_server_setting = true
      store_router_data_info.router_name = to.name
    } else {
      store_router_data_info.router_select_model_server_setting = true
      store_router_data_info.router_name = to.name
    }
    if (!store_router_data_info.router_name || store_router_data_info.router_name === 'null') {
      store_router_data_info.router_name = 'home'
    }
    store_system_configs_info.app_view_left_menu_select_activeKey = to.name
    if (
      !store_system_configs_info.app_view_left_menu_select_activeKey ||
      store_system_configs_info.app_view_left_menu_select_activeKey === 'null'
    ) {
      store_system_configs_info.app_view_left_menu_select_activeKey = 'home'
    }
    console.log(to.name)
    store_system_configs_info.app_view_left_menu_collapsed = true
    if (!store_router_data_logic.clear_UserExperience_Model) {
      if (to.name !== 'media') {
        try {
          if (isElectron) {
            const memoryUsage = await ipcRenderer.invoke('window-get-memory')
            if (memoryUsage.rss > store_router_data_info.MEMORY_THRESHOLD) {
              ipcRenderer.send('window-reset-data')
            }
          }
        } catch (error) {
          console.error('获取内存使用情况失败:', error)
        }
      }
    }
    if (to.name !== 'login') {
      sessionStorage.setItem('jwt_route', String('/' + to.name))
    }
  }
})
watch(
  () => store_router_data_info.router_select,
  // @ts-ignore - 忽略类型检查
  async (newValue: string) => {
    // @ts-ignore - 忽略store实例类型检查
    const playlistStore = usePlaylistStore()
    if (!playlistStore.playlist_show) {
      store_router_data_info.router_select = newValue
      if (newValue === 'home') {
        await store_general_fetch_home_list.fetchData_Home()
      } else if (newValue === 'recently_added') {
        await store_general_fetch_home_list.fetchData_Home()
      } else if (newValue === 'charts') {
      } else if (newValue === 'recommend') {
      } else if (newValue === 'tag') {
      } else if (newValue === 'media_cue') {
        if (store_router_data_info.router_click) {
          const pageMediaCueStore = usePageMediaCueStore()
          pageMediaCueStore.page_songlists_keyword = ''
          pageMediaCueStore.page_songlists_keywordFilter = ''
        }
        await store_general_fetch_media_cue_list.fetchData_Media()
      } else if (newValue === 'media') {
        if (store_router_data_info.router_click) {
          const pageMediaStore = usePageMediaStore()
          pageMediaStore.page_songlists_keyword = ''
          pageMediaStore.page_songlists_keywordFilter = ''
          //
          store_general_fetch_media_list._artist_id = ''
          store_general_fetch_media_list._album_id = ''
          store_general_fetch_media_list._album_artist_id = ''
          store_general_fetch_media_list._media_id = ''
        }
        await store_general_fetch_media_list.fetchData_Media()
        /// Synchronize API data
        if (store_server_user_model.model_select === 'server') {
          // get app all playlist
          await store_general_model_player_list.get_playlists_info()
        }
      } else if (newValue === 'album') {
        if (store_router_data_info.router_click) {
          const pageAlbumStore = usePageAlbumStore()
          pageAlbumStore.page_albumlists_keyword = ''
        }
        await store_general_fetch_album_list.fetchData_Album()
      } else if (newValue === 'artist') {
        await store_general_fetch_artist_list.fetchData_Artist()
      }
      store_router_data_info.router_click = false
    }
  }
)
watch(
  () => store_router_data_info.router_name,
  async (newValue) => {
    store_system_configs_info.app_view_left_menu_select_activeKey = newValue
  }
)

///// view of media
const Init_page_songlists_statistic_Data = () => {
  pageMediaStore.page_songlists_options = []
  pageMediaStore.page_songlists_statistic = []
  pageMediaStore.page_songlists = []
  ///
  const temp_Play_List_ALL: Play_List = {
    label: computed(() => t('nsmusics.view_page.allMedia')),
    value: 'song_list_all',
    id: 'song_list_all',
    name: computed(() => t('nsmusics.view_page.allMedia')),
    comment: computed(() => t('nsmusics.view_page.allMedia')),
    duration: 0,
    song_count: pageMediaStore.media_item_count + ' *',
    public: 0,
    created_at: '',
    updated_at: '',
    path: '',
    sync: 0,
    size: 0,
    rules: null,
    evaluated_at: '',
    owner_id: '',
  }
  pageMediaStore.page_songlists_options.push(temp_Play_List_ALL)
  pageMediaStore.page_songlists_statistic.push({
    label: temp_Play_List_ALL.label,
    song_count: temp_Play_List_ALL.song_count.toString(),
    id: temp_Play_List_ALL.id,
  })
  pageMediaStore.page_songlists.push(temp_Play_List_ALL)
  ///
  const temp_Play_List_Love: Play_List = {
    label: computed(() => t('nsmusics.view_page.loveMedia')),
    value: 'song_list_love',
    id: 'song_list_love',
    name: computed(() => t('nsmusics.view_page.loveMedia')),
    comment: computed(() => t('nsmusics.view_page.loveMedia')),
    duration: 0,
    song_count: pageMediaStore.media_starred_count + ' *',
    public: 0,
    created_at: '',
    updated_at: '',
    path: '',
    sync: 0,
    size: 0,
    rules: null,
    evaluated_at: '',
    owner_id: '',
  }
  pageMediaStore.page_songlists_options.push(temp_Play_List_Love)
  pageMediaStore.page_songlists_statistic.push({
    label: temp_Play_List_Love.label,
    song_count: temp_Play_List_Love.song_count.toString(),
    id: temp_Play_List_Love.id,
  })
  pageMediaStore.page_songlists.push(temp_Play_List_Love)
  ///
  const temp_Play_List_Recently: Play_List = {
    label: computed(() => t('nsmusics.view_page.recentPlay')),
    value: 'song_list_recently',
    id: 'song_list_recently',
    name: computed(() => t('nsmusics.view_page.recentPlay')),
    comment: computed(() => t('nsmusics.view_page.recentPlay')),
    duration: 0,
    song_count:
      pageMediaStore.media_recently_count > 0 ? pageMediaStore.media_recently_count : '*' + ' *',
    public: 0,
    created_at: '',
    updated_at: '',
    path: '',
    sync: 0,
    size: 0,
    rules: null,
    evaluated_at: '',
    owner_id: '',
  }
  pageMediaStore.page_songlists_options.push(temp_Play_List_Recently)
  pageMediaStore.page_songlists_statistic.push({
    label: temp_Play_List_Recently.label,
    song_count:
      store_server_user_model.model_server_type_of_local ||
      store_server_users.server_select_kind === 'ninesong'
        ? temp_Play_List_Recently.song_count.toString()
        : '*' + ' *',
    id: temp_Play_List_Recently.id,
  })
  pageMediaStore.page_songlists.push(temp_Play_List_Recently)
  //////
  pageMediaStore.page_songlists_statistic.push({
    label: computed(() => t('entity.playlist_other')),
    song_count: pageMediaStore.media_playlist_count + ' *',
    id: 'song_list_all_PlayList',
  })
  //////
  playlistStore.playlist_tracks_temporary_of_ALLLists.forEach((item: any) => {
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
      owner_id: item.playlist.owner_id,
    }
    pageMediaStore.page_songlists_options.push(temp_playlist)
    pageMediaStore.page_songlists.push(temp_playlist)
  })
}
///// view of media_cue
const Init_page_cuelists_statistic_Data = () => {
  pageMediaCueStore.page_songlists_options = []
  pageMediaCueStore.page_songlists_statistic = []
  pageMediaCueStore.page_songlists = []
  const temp_Play_List_ALL: Play_List = {
    label: computed(() => t('nsmusics.view_page.allDisk')),
    value: 'song_list_all',
    id: 'song_list_all',
    name: computed(() => t('nsmusics.view_page.allDisk')),
    comment: computed(() => t('nsmusics.view_page.allDisk')),
    duration: 0,
    song_count: pageMediaCueStore.media_item_count + ' *',
    public: 0,
    created_at: '',
    updated_at: '',
    path: '',
    sync: 0,
    size: 0,
    rules: null,
    evaluated_at: '',
    owner_id: '',
  }
  pageMediaCueStore.page_songlists_options.push(temp_Play_List_ALL)
  pageMediaCueStore.page_songlists_statistic.push({
    label: temp_Play_List_ALL.label,
    song_count: temp_Play_List_ALL.song_count.toString(),
    id: temp_Play_List_ALL.id,
  })
  pageMediaCueStore.page_songlists.push(temp_Play_List_ALL)
  const temp_Play_List_Love: Play_List = {
    label: computed(() => t('nsmusics.view_page.loveDisk')),
    value: 'song_list_love',
    id: 'song_list_love',
    name: computed(() => t('nsmusics.view_page.loveDisk')),
    comment: computed(() => t('nsmusics.view_page.loveDisk')),
    duration: 0,
    song_count: pageMediaCueStore.media_starred_count + ' *',
    public: 0,
    created_at: '',
    updated_at: '',
    path: '',
    sync: 0,
    size: 0,
    rules: null,
    evaluated_at: '',
    owner_id: '',
  }
  pageMediaCueStore.page_songlists_options.push(temp_Play_List_Love)
  pageMediaCueStore.page_songlists_statistic.push({
    label: temp_Play_List_Love.label,
    song_count: temp_Play_List_Love.song_count.toString(),
    id: temp_Play_List_Love.id,
  })
  pageMediaCueStore.page_songlists.push(temp_Play_List_Love)
  const temp_Play_List_Recently: Play_List = {
    label: computed(() => t('nsmusics.view_page.recentPlay')),
    value: 'song_list_recently',
    id: 'song_list_recently',
    name: computed(() => t('nsmusics.view_page.recentPlay')),
    comment: computed(() => t('nsmusics.view_page.recentPlay')),
    duration: 0,
    song_count:
      pageMediaCueStore.media_recently_count > 0
        ? pageMediaCueStore.media_recently_count
        : '*' + ' *',
    public: 0,
    created_at: '',
    updated_at: '',
    path: '',
    sync: 0,
    size: 0,
    rules: null,
    evaluated_at: '',
    owner_id: '',
  }
  pageMediaCueStore.page_songlists_options.push(temp_Play_List_Recently)
  pageMediaCueStore.page_songlists_statistic.push({
    label: temp_Play_List_Recently.label,
    song_count:
      store_server_user_model.model_server_type_of_local ||
      store_server_users.server_select_kind === 'ninesong'
        ? temp_Play_List_Recently.song_count.toString()
        : '*' + ' *',
    id: temp_Play_List_Recently.id,
  })
  pageMediaCueStore.page_songlists.push(temp_Play_List_Recently)
}
////// view of album
const Init_page_albumlists_statistic_Data = () => {
  const pageAlbumStore = usePageAlbumStore()
  pageAlbumStore.page_albumlists_options = []
  pageAlbumStore.page_albumlists_statistic = []
  pageAlbumStore.page_albumlists = []
  //////
  const temp_Play_List_ALL: Play_List = {
    label: computed(() => t('nsmusics.view_page.allAlbum')),
    value: 'album_list_all',
    id: 'album_list_all',
    name: computed(() => t('nsmusics.view_page.allAlbum')),
    comment: computed(() => t('nsmusics.view_page.allAlbum')),
    duration: 0,
    song_count: pageAlbumStore.album_item_count + ' *',
    public: 0,
    created_at: '',
    updated_at: '',
    path: '',
    sync: 0,
    size: 0,
    rules: null,
    evaluated_at: '',
    owner_id: '',
  }
  pageAlbumStore.page_albumlists_options.push(temp_Play_List_ALL)
  pageAlbumStore.page_albumlists_statistic.push({
    label: temp_Play_List_ALL.label,
    album_count: temp_Play_List_ALL.song_count.toString(),
    id: temp_Play_List_ALL.id,
  })
  pageAlbumStore.page_albumlists.push(temp_Play_List_ALL)
  //////
  const temp_Play_List_Love: Play_List = {
    label: computed(() => t('nsmusics.view_page.loveAlbum')),
    value: 'album_list_love',
    id: 'album_list_love',
    name: computed(() => t('nsmusics.view_page.loveAlbum')),
    comment: computed(() => t('nsmusics.view_page.loveAlbum')),
    duration: 0,
    song_count: pageAlbumStore.album_starred_count + ' *',
    public: 0,
    created_at: '',
    updated_at: '',
    path: '',
    sync: 0,
    size: 0,
    rules: null,
    evaluated_at: '',
    owner_id: '',
  }
  pageAlbumStore.page_albumlists_options.push(temp_Play_List_Love)
  pageAlbumStore.page_albumlists_statistic.push({
    label: temp_Play_List_Love.label,
    album_count: temp_Play_List_Love.song_count.toString(),
    id: temp_Play_List_Love.id,
  })
  pageAlbumStore.page_albumlists.push(temp_Play_List_Love)
  //////
  if (
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
      song_count:
        pageAlbumStore.album_recently_count > 0 ? pageAlbumStore.album_recently_count : '*' + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: '',
    }
    pageAlbumStore.page_albumlists_options.push(temp_Play_List_Recently)
    pageAlbumStore.page_albumlists_statistic.push({
      label: temp_Play_List_Recently.label,
      album_count: temp_Play_List_Recently.song_count.toString(),
      id: temp_Play_List_Recently.id,
    })
    pageAlbumStore.page_albumlists.push(temp_Play_List_Recently)
  }
  pageAlbumStore.page_albumlists_statistic.push({
    label: computed(() => t('entity.playlist_other')),
    album_count: pageMediaStore.media_playlist_count + ' *',
    id: 'album_list_all_PlayList',
  })
}
////// view of artist
const Init_page_artistlists_statistic_Data = () => {
  const pageArtistStore = usePageArtistStore()
  pageArtistStore.page_artistlists_options = []
  pageArtistStore.page_artistlists_statistic = []
  pageArtistStore.page_artistlists = []
  //////
  const temp_Play_List_ALL: Play_List = {
    label: computed(() => t('nsmusics.view_page.allArtist')),
    value: 'artist_list_all',
    id: 'artist_list_all',
    name: computed(() => t('nsmusics.view_page.allArtist')),
    comment: computed(() => t('nsmusics.view_page.allArtist')),
    duration: 0,
    song_count: pageArtistStore.artist_item_count + ' *',
    public: 0,
    created_at: '',
    updated_at: '',
    path: '',
    sync: 0,
    size: 0,
    rules: null,
    evaluated_at: '',
    owner_id: '',
  }
  pageArtistStore.page_artistlists_options.push(temp_Play_List_ALL)
  pageArtistStore.page_artistlists_statistic.push({
    label: temp_Play_List_ALL.label,
    artist_count: temp_Play_List_ALL.song_count.toString(),
    id: temp_Play_List_ALL.id,
  })
  pageArtistStore.page_artistlists.push(temp_Play_List_ALL)
  //////
  const temp_Play_List_Love: Play_List = {
    label: computed(() => t('nsmusics.view_page.loveArtist')),
    value: 'artist_list_love',
    id: 'artist_list_love',
    name: computed(() => t('nsmusics.view_page.loveArtist')),
    comment: computed(() => t('nsmusics.view_page.loveArtist')),
    duration: 0,
    song_count: pageArtistStore.artist_starred_count + ' *',
    public: 0,
    created_at: '',
    updated_at: '',
    path: '',
    sync: 0,
    size: 0,
    rules: null,
    evaluated_at: '',
    owner_id: '',
  }
  pageArtistStore.page_artistlists_options.push(temp_Play_List_Love)
  pageArtistStore.page_artistlists_statistic.push({
    label: temp_Play_List_Love.label,
    artist_count: temp_Play_List_Love.song_count.toString(),
    id: temp_Play_List_Love.id,
  })
  pageArtistStore.page_artistlists.push(temp_Play_List_Love)
  //////
  if (
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
      song_count:
        pageArtistStore.artist_recently_count > 0
          ? pageArtistStore.artist_recently_count
          : '*' + ' *',
      public: 0,
      created_at: '',
      updated_at: '',
      path: '',
      sync: 0,
      size: 0,
      rules: null,
      evaluated_at: '',
      owner_id: '',
    }
    pageArtistStore.page_artistlists_options.push(temp_Play_List_Recently)
    pageArtistStore.page_artistlists_statistic.push({
      label: temp_Play_List_Recently.label,
      artist_count: temp_Play_List_Recently.song_count.toString(),
      id: temp_Play_List_Recently.id,
    })
    pageArtistStore.page_artistlists.push(temp_Play_List_Recently)
  }
  pageArtistStore.page_artistlists_statistic.push({
    label: computed(() => t('entity.playlist_other')),
    artist_count: pageMediaStore.media_playlist_count + ' *',
    id: 'artist_list_all_PlayList',
  })
}

const { playlist_show, playlist_names_StartUpdate } = storeToRefs(playlistStore)

///// view of playlist
watch(
  () => playlist_names_StartUpdate.value,
  (newValue) => {
    if (newValue) {
      Init_page_songlists_statistic_Data()
      Init_page_cuelists_statistic_Data()
      playlist_names_StartUpdate.value = false
      console.log('playlist_names_StartUpdate.value')
    }
  }
)

////
import { openLink } from '@/utils/electron/openLink'
const computed_i18n_Label_Update = computed(() => t('filter.recentlyUpdated'))

////
import View_Edit_Tag from '@/views/view_app/drawer/View_Edit_Tag.vue'
import View_Player_Effect from '@/views/view_app/drawer/View_Player_Effect.vue'
import View_Mini_Music_Player from '@/views/view_app/page/page_player/View_Mini_Music_Player.vue'
import { usePageHomeStore } from '@/data/data_status/app_status/page_status/home_store/usePageHomeStore'

////// Load Configs
const { locale } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})
onMounted(() => {
  create_menuOptions_appBar()
})
onMounted(async () => {
  try {
    if (!isElectron) {
      // isLogin
      await store_server_login_logic.checkLoginStatus()
    } else {
      await store_system_configs_info.load_app()
      /// init tray
      try {
        await ipcRenderer.invoke('i18n-tray-label-menu', [
          t('player.play'),
          t('player.pause'),
          t('player.previous'),
          t('player.next'),
          t('nsmusics.view_page.desktop_lyrics'),
          t('common.quit'),
          t('nsmusics.siderbar_player.playback_1'),
          t('nsmusics.siderbar_player.playback_2'),
          t('nsmusics.siderbar_player.playback_3'),
          t('nsmusics.siderbar_player.playback_4'),
        ])
        await ipcRenderer.invoke('i18n-tray-music-order', playerSettingStore.play_order)
      } catch (e) {
        console.log(e)
      }
    }
  } catch (e) {
    console.error(e)
  }
  playerSettingStore.player_init_play = true
  store_router_data_info.router_click = false
  init_player_configs()
})
watch(
  () => store_system_configs_info.lang,
  async (newValue) => {
    locale.value = newValue
  }
)
if (isElectron) {
  ipcRenderer.on('tray-app-quit', () => {
    store_system_configs_save.save_system_config_of_Player_Configs_of_Audio_Info()
  })
}

function fullMaximize() {
  if (isElectron) {
    if (store_system_configs_info.desktop_system_kind === 'linux') {
      ipcRenderer.send('window-fullscreen')
      store_system_configs_info.window_full = !store_system_configs_info.window_full
      store_system_configs_info.window_max = store_system_configs_info.window_full
    } else {
      ipcRenderer.send('window-max')
      store_system_configs_info.window_max = !store_system_configs_info.window_max
      store_system_configs_info.window_full = false
    }
    //
    store_system_configs_info.window_innerWidth = window.innerWidth
    store_system_configs_info.window_innerHeight = window.innerHeight
  }
}
function fullScreen() {
  if (isElectron) {
    ipcRenderer.send('window-fullscreen')
  }
  store_system_configs_info.window_full = !store_system_configs_info.window_full
  store_system_configs_info.window_max = store_system_configs_info.window_full
  //
  store_system_configs_info.window_innerWidth = window.innerWidth
  store_system_configs_info.window_innerHeight = window.innerHeight
}
</script>
<template>
  <n-message-provider>
    <!-- Player Bady View-->
    <n-config-provider
      class="this_App"
      v-if="!store_router_data_info.router_select_model_server_login"
      :theme="store_system_configs_info.theme"
    >
      <n-global-style />
      <n-message-provider class="this_App">
        <n-layout has-sider class="this_App" embedded>
          <!--Left Router_Menu app_view_left_menu_collapsed-->
          <n-flex vertical justify="center" style="height: 100vh">
            <div></div>
            <n-layout-sider
              show-trigger="bar"
              v-if="store_system_configs_info.app_view_left_menu_collapsed"
              collapse-mode="width"
              :collapsed-width="66"
              :collapsed="store_system_configs_info.app_view_left_menu_collapsed"
              @collapse="store_system_configs_info.app_view_left_menu_collapsed = true"
              @expand="store_system_configs_info.app_view_left_menu_collapsed = false"
              :width="166"
              style="border-radius: 0 20px 20px 0"
              :style="{
                zIndex: player_show ? 200 : 208,
              }"
            >
              <n-flex vertical justify="center">
                <div></div>
                <n-menu
                  v-if="store_system_configs_info.app_view_bar_show"
                  v-model:value="store_system_configs_info.app_view_left_menu_select_activeKey"
                  :collapsed="store_system_configs_info.app_view_left_menu_collapsed"
                  :collapsed-width="66"
                  :collapsed-icon-size="22"
                  :icon-size="20"
                  :options="store_system_configs_info.app_view_menuOptions"
                  @click="
                    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_all_parms()
                  "
                />
                <div></div>
              </n-flex>
            </n-layout-sider>
            <div></div>
          </n-flex>
          <!--Left Router_Menu app_view_left_menu_show-->
          <n-drawer
            v-model:show="store_system_configs_info.app_view_left_menu_show"
            placement="left"
            :width="200"
            style="border: 0; border-radius: 0 20px 20px 0"
          >
            <n-layout-sider
              v-if="store_system_configs_info.app_view_left_menu_show"
              :width="200"
              style="border: 0; z-index: 200; height: 100vh"
            >
              <n-flex vertical justify="center" style="height: 100vh">
                <div></div>
                <n-menu
                  v-if="store_system_configs_info.app_view_bar_show"
                  v-model:value="store_system_configs_info.app_view_left_menu_select_activeKey"
                  :collapsed="store_system_configs_info.app_view_left_menu_collapsed"
                  :collapsed-width="66"
                  :collapsed-icon-size="22"
                  :icon-size="20"
                  :options="store_system_configs_info.app_view_menuOptions"
                  @click="
                    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_all_parms()
                  "
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
              height: calc(100vh - 150px);
              margin-top: 70px;
              position: absolute;
              left: 66px;
              z-index: 0;
            "
          >
            <!--Menu View -->
            <RouterView
              class="view_show_data"
              v-if="store_router_data_info.router_select === 'setting'"
            ></RouterView>
            <!--Home View -->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'home'"
            ></RouterView>
            <!--Recently Added View -->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'recently_added'"
            ></RouterView>
            <!--Charts View -->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'charts'"
            ></RouterView>
            <!--Recommend View -->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'recommend'"
            ></RouterView>
            <!--Tag View -->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'tag'"
            ></RouterView>
            <!--MediaCue View -->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'media_cue'"
            ></RouterView>
            <!--Updateing View-->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'update'"
            ></RouterView>
            <!--Media View-->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'media'"
            ></RouterView>
            <!--Album View-->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'album'"
            ></RouterView>
            <!--Artist View-->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'artist'"
            ></RouterView>
            <!--Genre View-->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select === 'genre'"
            ></RouterView>
            <!--Server_setting View-->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select_model_server_setting"
            ></RouterView>
            <!--Server_library View-->
            <RouterView
              class="view_show_data"
              v-else-if="store_router_data_info.router_select_model_server_library"
            ></RouterView>
            <!--Top Bar-->
            <div class="bar_top_setapp" style="background-color: transparent">
              <n-tooltip
                trigger="hover"
                placement="top"
                v-if="!store_system_configs_info.window_state_miniplayer"
              >
                <template #trigger>
                  <n-badge
                    :value="store_system_configs_info.version_updated"
                    :offset="[-17, -4]"
                    :type="store_system_configs_info.version_updated === 1 ? 'error' : 'info'"
                    :style="{
                      marginRight: isElectron
                        ? store_system_configs_info.desktop_system_kind !== 'darwin'
                          ? '257px'
                          : '106px'
                        : '76px',
                    }"
                    style="z-index: 100; margin-top: 34px; -webkit-app-region: no-drag"
                  >
                    <n-button
                      quaternary
                      circle
                      @click="
                        store_system_configs_info.update_show =
                          !store_system_configs_info.update_show
                      "
                    >
                      <template #icon>
                        <n-icon size="20" :depth="2"><BrowserUpdatedFilled /></n-icon>
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
                  position: absolute;
                  right: 0;
                  top: 30px;
                  text-align: center;
                  z-index: 99;
                "
              >
                <n-tooltip
                  trigger="hover"
                  placement="top"
                  v-if="!store_system_configs_info.window_state_miniplayer"
                >
                  <template #trigger>
                    <n-button
                      quaternary
                      circle
                      :style="{
                        marginRight: isElectron
                          ? store_system_configs_info.desktop_system_kind != 'darwin'
                            ? '4px'
                            : '4px'
                          : '36px',
                      }"
                      @click="store_system_configs_theme.theme_mode_change_click()"
                    >
                      <template #icon>
                        <n-icon size="20" :depth="2"><DarkTheme24Filled /></n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('LabelDashboardTheme') }}
                </n-tooltip>
                <n-tooltip
                  trigger="hover"
                  placement="top"
                  v-if="
                    isElectron &&
                    !store_system_configs_info.window_state_miniplayer &&
                    store_system_configs_info.desktop_system_kind != 'darwin'
                  "
                >
                  <template #trigger>
                    <n-button quaternary circle style="margin-right: 4px" @click="fullScreen">
                      <template #icon>
                        <n-icon size="19" :depth="2" v-if="store_system_configs_info.window_full">
                          <ArrowsMinimize />
                        </n-icon>
                        <n-icon size="19" :depth="2" v-else>
                          <ArrowsMaximize />
                        </n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('ButtonFullscreen') }}
                </n-tooltip>
                <n-tooltip trigger="hover" placement="top" v-if="isElectron">
                  <template #trigger>
                    <n-button
                      quaternary
                      circle
                      :style="{
                        marginRight:
                          store_system_configs_info.desktop_system_kind != 'darwin'
                            ? '4px'
                            : '30px',
                      }"
                      @click="
                        async () => {
                          if (isElectron) {
                            // 请不要更改这段诡异的代码，它依靠Electron的BUG运行，呵呵
                            store_system_configs_info.window_state_miniplayer_card = false
                            store_system_configs_info.window_state_miniplayer_desktop_lyric = false
                            store_system_configs_info.window_state_miniplayer_album = false
                            ipcRenderer.send('window-state-miniplayer-open')
                            ipcRenderer.send('window-state-miniplayer-open')
                            //
                            store_system_configs_info.window_state_miniplayer =
                              !store_system_configs_info.window_state_miniplayer
                            //await ipcRenderer.invoke('get-window-state-miniplayer');
                            player_collapsed_action_bar_of_Immersion_model = false
                            //
                            store_system_configs_info.window_full = false
                            store_system_configs_info.window_max = false
                          }
                        }
                      "
                    >
                      <template #icon>
                        <n-icon size="24" :depth="2"><WindowNew16Regular /></n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('nsmusics.view_player.view_player_mini') }}
                </n-tooltip>
                <n-tooltip
                  trigger="hover"
                  placement="top"
                  v-if="isElectron && store_system_configs_info.desktop_system_kind != 'darwin'"
                >
                  <template #trigger>
                    <n-button
                      quaternary
                      circle
                      style="margin-right: 4px"
                      @click="
                        () => {
                          if (isElectron) {
                            ipcRenderer.send('window-min')
                          }
                        }
                      "
                    >
                      <template #icon>
                        <n-icon size="24" :depth="2"><MinusRound /></n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('common.minimize') }}
                </n-tooltip>
                <n-tooltip
                  trigger="hover"
                  placement="top"
                  v-if="isElectron && store_system_configs_info.desktop_system_kind != 'darwin'"
                >
                  <template #trigger>
                    <n-button quaternary circle style="margin-right: 4px" @click="fullMaximize">
                      <template #icon>
                        <n-icon size="20" :depth="2" v-if="store_system_configs_info.window_max"
                          ><FullScreenMinimize24Filled
                        /></n-icon>
                        <n-icon size="20" :depth="2" v-else><FullScreenMaximize24Filled /></n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('common.maximize') }}
                </n-tooltip>
                <n-tooltip
                  trigger="hover"
                  placement="top"
                  v-if="isElectron && store_system_configs_info.desktop_system_kind != 'darwin'"
                >
                  <template #trigger>
                    <n-button
                      quaternary
                      circle
                      style="margin-right: 30px"
                      @click="
                        () => {
                          if (isElectron) {
                            ipcRenderer.send('window-close')
                          }
                        }
                      "
                    >
                      <template #icon>
                        <n-icon size="28" :depth="2"><Close /></n-icon>
                      </template>
                    </n-button>
                  </template>
                  {{ $t('Off') }}
                </n-tooltip>
              </section>
            </div>
          </n-layout>
          <!-- bottom PlayerBar and PlayerView -->
          <n-config-provider :theme="store_system_configs_info.theme_app" style="z-index: 205">
            <!-- n-card can change Bar_Music_Player(text color) -->
            <n-card
              style="
                position: fixed;
                left: 0;
                bottom: 0;
                width: 100vw;
                height: 80px;
                background-color: #00000000;
                border-radius: 12px 12px 0 0;
                border: 0 #00000000;
              "
            >
              <Bar_Music_Player />
            </n-card>
          </n-config-provider>
          <!-- bottom PlayerBar and PlayerView -->
          <n-config-provider :theme="store_system_configs_info.theme_app" style="z-index: 203">
            <View_Screen_Music_Player
              class="view_music_player"
              v-if="player_show && !store_system_configs_info.window_state_miniplayer"
              :style="{
                height: `calc(100vh - ${player_show_hight_animation_value}vh)`,
              }"
            >
            </View_Screen_Music_Player>
          </n-config-provider>
          <!-- bottom PlayerBar and PlayerView -->
          <n-config-provider :theme="store_system_configs_info.theme_app" style="z-index: 211">
            <View_Mini_Music_Player
              v-if="store_system_configs_info.window_state_miniplayer"
              class="view_music_player"
              style="height: 100vh"
            >
            </View_Mini_Music_Player>
          </n-config-provider>
          <n-config-provider :theme="darkTheme">
            <n-drawer
              v-model:show="store_system_configs_info.window_state_miniplayer_playlist"
              :width="310"
              z-index="100"
              style="
                border-radius: 12px 0 0 12px;
                border: 1.5px solid #ffffff20;
                background-color: rgba(127, 127, 127, 0.1);
                backdrop-filter: blur(10px);
                margin-top: 88px;
                margin-bottom: 88px;
              "
            >
              <n-drawer-content style="z-index: 100">
                <template #default>
                  <Bar_Music_PlayList style="z-index: 100"> </Bar_Music_PlayList>
                </template>
              </n-drawer-content>
            </n-drawer>
          </n-config-provider>
        </n-layout>
      </n-message-provider>
    </n-config-provider>
    <!-- app login-->
    <RouterView class="this_App" v-if="store_router_data_info.router_select_model_server_login">
    </RouterView>

    <!-- right drwaer -->
    <n-config-provider :theme="darkTheme">
      <!-- right drwaer of music_playlist -->
      <n-drawer
        :show="playlist_show"
        @update:show="(value) => (playlist_show = value)"
        :width="520"
        z-index="100"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #ffffff20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: 88px;
          margin-bottom: 88px;
        "
      >
        <n-drawer-content style="z-index: 100">
          <template #default>
            <Bar_Music_PlayList style="z-index: 100"> </Bar_Music_PlayList>
          </template>
        </n-drawer-content>
      </n-drawer>
      <!-- bottom drwaer of player_bar(more,sound speed,sound effect) -->
      <n-drawer
        v-model:show="player_show_sound_more"
        :width="440"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #ffffff20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 280px);
          height: 560px;
        "
      >
        <n-drawer-content v-if="player_show_sound_more">
          <template #default>
            <span style="font-size: 24px; font-weight: 800">Not open || 未开放</span>
          </template>
        </n-drawer-content>
      </n-drawer>
      <n-drawer
        v-model:show="player_show_sound_speed"
        :width="440"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #ffffff20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 280px);
          height: 560px;
        "
      >
        <n-drawer-content v-if="player_show_sound_speed">
          <template #default>
            <span style="font-size: 24px; font-weight: 800">Not open || 未开放</span>
          </template>
        </n-drawer-content>
      </n-drawer>
      <n-drawer
        v-model:show="player_show_sound_effects"
        :width="660"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #ffffff20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: calc(50vh - 280px);
          height: 560px;
        "
      >
        <n-drawer-content v-if="player_show_sound_effects">
          <template #default>
            <n-tabs type="line" animated>
              <n-tab-pane name="000">
                <template #tab>
                  {{ $t('page.setting.generalTab') }}
                </template>
                <View_Player_Effect />
              </n-tab-pane>
              <n-tab-pane name="001" tab="均衡器">
                <span style="font-weight: bold; font-size: 24px">
                  {{ $t('common.comingSoon') }}
                </span>
              </n-tab-pane>
              <n-tab-pane name="004" tab="多音轨">
                <span style="font-weight: bold; font-size: 24px">
                  {{ $t('common.comingSoon') }}
                </span>
              </n-tab-pane>
              <n-tab-pane name="002" tab="九歌音效">
                <span style="font-size: 24px; font-weight: 800">Not open || 未开放</span>
              </n-tab-pane>
              <n-tab-pane name="003" tab="声学适配">
                <span style="font-size: 24px; font-weight: 800">Not open || 未开放</span>
              </n-tab-pane>
              <n-tab-pane name="005" tab="音效制作">
                <span style="font-size: 24px; font-weight: 800">Not open || 未开放</span>
              </n-tab-pane>
            </n-tabs>
          </template>
        </n-drawer-content>
      </n-drawer>
      <!-- right drwaer of tag_modify -->
      <n-drawer
        v-model:show="player_show_tag_modify"
        :width="680"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #ffffff20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: 88px;
          margin-bottom: 88px;
        "
      >
        <n-drawer-content>
          <template #default>
            <View_Edit_Tag></View_Edit_Tag>
          </template>
        </n-drawer-content>
      </n-drawer>
      <!-- right drwaer of update -->
      <n-drawer
        v-model:show="store_system_configs_info.update_show"
        :width="640"
        style="
          border-radius: 12px 0 0 12px;
          border: 1.5px solid #ffffff20;
          background-color: rgba(127, 127, 127, 0.1);
          backdrop-filter: blur(10px);
          margin-top: 88px;
          margin-bottom: 88px;
        "
      >
        <n-drawer-content>
          <template #default>
            <n-card :title="computed_i18n_Label_Update" style="background-color: transparent">
              <n-space vertical style="font-size: 16px; font-weight: bolder">
                <div>
                  {{ $t('nsmusics.view_page.current') }}{{ $t('common.version') }} :
                  {{ store_system_configs_info.version }}
                </div>
                <div>
                  {{ $t('nsmusics.view_page.last_next') }}{{ $t('common.version') }} :
                  {{ store_system_configs_update.version }}
                </div>
                <br />
                NSMusicS{{ $t('nsmusics.view_page.install') }}{{ $t('common.description') }} :
                <a
                  class="link"
                  @click="openLink('https://github.com/Super-Badmen-Viper/NSMusicS/releases')"
                >
                  https://github.com/Super-Badmen-Viper/NSMusicS/releases
                </a>
                <br />
                <!--                NSMusicS{{$t('nsmusics.view_page.download')}}{{$t('common.description')}} : <a class="link" @click="openLink(store_system_configs_info.version_update_address)">{{ store_system_configs_info.version_update_address }}</a>-->
                <!--                <br>-->
                <div v-html="store_system_configs_info.version_update_explain"></div>
              </n-space>
            </n-card>
          </template>
        </n-drawer-content>
      </n-drawer>
    </n-config-provider>
  </n-message-provider>
</template>
<style scoped>
html,
body {
  scroll-behavior: smooth;
}

.this_App {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
}

.bar_top_setapp {
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
.view_show_data {
  width: calc(100vw - 104px);
  height: calc(100vh - 150px);

  margin-left: 30px;
}
.view_music_player {
  width: 100vw;
  z-index: 10;
  position: fixed;
  bottom: 0;
  left: 0;
  transition: height 0.2s;
}

.link {
  color: #ffffff;
  font-size: 15px;
  text-decoration: underline;
}
.link:hover {
  color: #3dc3ff;
  background-color: transparent;
}

::-webkit-scrollbar {
  display: none;
}

.n-base-selection .n-base-selection-label .n-base-selection-input .n-base-selection-input__content {
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.n-statistic .n-statistic__label {
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.n-statistic .n-statistic-value .n-statistic-value__content {
  font-size: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
</style>
