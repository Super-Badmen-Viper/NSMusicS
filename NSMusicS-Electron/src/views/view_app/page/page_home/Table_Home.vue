<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
import { NButton, NIcon, NImage, useMessage, useThemeVars } from 'naive-ui'
import { Icon } from '@vicons/utils'
import {
  PlayCircle24Regular,
  Heart24Regular,
  Heart28Filled,
  ChevronLeft16Filled,
  ChevronRight16Filled,
  Open28Filled,
  ArrowReset24Filled,
} from '@vicons/fluent'
import { Play } from '@vicons/ionicons5'

import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { usePageHomeStore } from '@/data/data_status/app_status/page_status/home_store/usePageHomeStore'
import { storeToRefs } from 'pinia'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'

import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_general_fetch_home_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_home/store_general_fetch_home_list'
import { store_local_data_set_albumInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_albumInfo'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'

import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { store_local_data_set_mediaInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_mediaInfo'
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
import { store_general_fetch_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import { store_general_model_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'

import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_general_fetch_artist_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_artist/store_general_fetch_artist_list'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'

import { store_general_fetch_media_cue_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_cue_file/store_general_fetch_media_cue_list'

import { useI18n } from 'vue-i18n'
import { store_view_recommend_page_info } from '@/views/view_app/page/page_recommend/store/store_view_recommend_page_info'

const { t } = useI18n({ inheritLocale: true })
const message = useMessage()
const themeVars = useThemeVars()

const pageMediaStore = usePageMediaStore()
const pageHomeStore = usePageHomeStore()
const { 
  home_Files_temporary_maximum_playback, 
  home_Files_temporary_random_search, 
  home_Files_temporary_recently_added, 
  home_Files_temporary_recently_played,
  home_Files_temporary_type_select,
  home_selected_top_album_subscript,
  home_selected_top_album,
  home_selected_top_album_medium_image_url,
  list_data_StartUpdate
} = storeToRefs(pageHomeStore)

const item_album = ref(160)
const item_album_image = ref(item_album.value - 20)
const item_album_txt = ref(item_album.value - 20)
const itemSize = ref(180)
const collapsed_width = ref(1090)
const errorHandled = ref(new Map())
const timer = ref()
let bool_watch = false
let before_rating = false
let after_rating = false

const dynamicScroller_maximum_playback = ref(null)
let offset_maximum_playback = 0
const dynamicScroller_random_search = ref(null)
let offset_random_search = 0
const dynamicScroller_recently_added = ref(null)
let offset_recently_added = 0
const dynamicScroller_recently_played = ref(null)
let offset_recently_played = 0

const contextmenu = ref(null)
const recently_added_contextmenu_of_emby = ref(false)
const menu_item_add_to_songlist = computed(() => t('form.addToPlaylist.title'))

const handleImageError = async (item: any) => {
  if (item == undefined) return
  let result_src = error_album
  if (errorHandled.value.has(item.id)) {
    item.medium_image_url = result_src
    return
  }
  errorHandled.value.set(item.id, true)
  if (isElectron) {
    const originalSrc = item.medium_image_url
    try {
      const newImagePath = await ipcRenderer.invoke('window-get-imagePath', originalSrc)
      item.medium_image_url = newImagePath.length > 0 ? newImagePath : result_src
    } catch (error) {
      console.error('Error handling image error:', error)
      item.medium_image_url = result_src
    }
  } else {
    item.medium_image_url = error_album
  }
}

function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href
}

const startTimer = () => {
  timer.value = setInterval(() => {
    bool_watch = true
  }, 1000)
}

const updateGridItems = () => {
  collapsed_width.value = 155
  const innerWidth = window.innerWidth
  let num
  if (innerWidth > 2460) {
    num = innerWidth / 7.53
    itemSize.value = Math.floor(num) + 40
  } else if (innerWidth > 1660) {
    num = innerWidth / 6.53
    itemSize.value = Math.floor(num) + 20
  } else {
    num = innerWidth / 5.53
    itemSize.value = Math.floor(num) + 10
  }
  item_album.value = Math.floor(num)
  item_album_image.value = item_album.value - 20
  item_album_txt.value = item_album.value - 20
}

const scrollTo = (
  direction: number,
  scrollerRef: any,
  offset: number,
  items: any[],
  itemWidth: number
) => {
  if (scrollerRef.value) {
    const scrollAmount = itemWidth * 2
    let newOffset = offset
    if (direction === -1) {
      newOffset = Math.max(0, offset - scrollAmount)
    } else if (direction === 1) {
      newOffset = offset + scrollAmount <= items.length * itemWidth ? offset + scrollAmount : 0
    }
    scrollerRef.value.$el.scrollLeft = newOffset
    return newOffset
  }
  return offset
}

const scrollTo_maximum_playback = (value: number) => {
  offset_maximum_playback = scrollTo(
    value,
    dynamicScroller_maximum_playback,
    offset_maximum_playback,
    pageHomeStore.home_Files_temporary_maximum_playback,
    224
  )
}
const scrollTo_random_search = (value: number) => {
  offset_random_search = scrollTo(
    value,
    dynamicScroller_random_search,
    offset_random_search,
    pageHomeStore.home_Files_temporary_random_search,
    224
  )
}
const scrollTo_recently_added = (value: number) => {
  offset_recently_added = scrollTo(
    value,
    dynamicScroller_recently_added,
    offset_recently_added,
    pageHomeStore.home_Files_temporary_recently_added,
    224
  )
}
const scrollTo_recently_played = (value: number) => {
  offset_recently_played = scrollTo(
    value,
    dynamicScroller_recently_played,
    offset_recently_played,
    pageHomeStore.home_Files_temporary_recently_played,
    224
  )
}

const Get_this_album_info = (item: any, list_name: string): string => {
  let temp_id = item.id
  if (store_server_user_model.model_server_type_of_web) {
    if (store_server_users.server_select_kind === 'jellyfin') {
      store_general_fetch_media_list._media_id = item.id
    } else if (store_server_users.server_select_kind === 'emby') {
      store_general_fetch_media_list.set_album_artist_id(
        list_name === 'recently_added' ? item.id : item.album_artist_id
      )
      if (list_name === 'recently_added') {
        store_general_fetch_player_list._album_artist_id = item.album_artist_id
        temp_id = item.album_artist_id
      } else {
        store_general_fetch_media_list._media_id = item.id
        temp_id = item.id
      }
    } else {
      store_general_fetch_media_list._album_id = item.id
    }
  }
  return temp_id
}

const Open_this_album_MediaList_click = (item: any, list_name: string) => {
  if (store_server_user_model.model_server_type_of_web) {
    playerAppearanceStore.player_mode_of_medialist_from_external_import = false
    if (store_server_users.server_select_kind === 'emby' && list_name != 'recently_added') {
      return
    }
  }
  const temp_id = Get_this_album_info(item, list_name)
  console.log('media_list_of_album_id：' + temp_id)
  store_router_data_logic.get_media_list_of_album_id_by_album_info(temp_id)
}

const Play_this_album_MediaList_click = async (item: any, list_name: string) => {
  // 兼容性代码，需要优化
  if (
    store_server_user_model.model_server_type_of_web &&
    store_server_users.server_select_kind === 'ninesong'
  ) {
    if (pageHomeStore.home_Files_temporary_type_select === 'artist') {
      if (store_server_user_model.model_server_type_of_web) {
        store_general_fetch_media_list.set_artist_id(item.id)
        pageMediaStore.page_songlists_selected = 'song_list_all'
        store_general_fetch_album_list.set_artist_id(item.id)
        pageAlbumStore.page_albumlists_selected = 'album_list_all'
        store_server_user_model.random_play_model = false
      }
      console.log('play_this_artist_song_list：' + item.id)
      await store_general_fetch_artist_list.fetchData_This_Artist_MediaList(item.id)
    } else if (pageHomeStore.home_Files_temporary_type_select === 'media') {
      if (store_server_user_model.model_server_type_of_web) {
        store_general_fetch_media_list.fetchData_Media_of_data_synchronization_to_playlist()
        store_server_user_model.random_play_model = false
      }
      await playerSettingStore.update_current_media_info(item, 0)
      playlistStore.media_page_handleItemDbClick = true
      playerAppearanceStore.player_mode_of_lock_playlist = false
      playerAudioStore.this_audio_restart_play = true
      //
      store_general_fetch_player_list.fetchData_PlayList(false)
      ////
      playlistStore.playlist_MediaFiles_temporary = []
      playlistStore.playlist_MediaFiles_temporary.push({
        ...item,
        play_id: item.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000,
      })
      playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.push(item.id)
    } else if (pageHomeStore.home_Files_temporary_type_select === 'media_cue') {
      if (store_server_user_model.model_server_type_of_web) {
        store_general_fetch_media_cue_list.fetchData_Media_of_data_synchronization_to_playlist()
        store_server_user_model.random_play_model = false
      }
      await playerSettingStore.update_current_media_info(item, '1-1')
      playlistStore.media_page_handleItemDbClick = true
      playerAppearanceStore.player_mode_of_lock_playlist = false
      playerAudioStore.this_audio_restart_play = true
      //
      store_general_fetch_player_list.fetchData_PlayList(true)
    }
    if (pageHomeStore.home_Files_temporary_type_select != 'album') {
      playlistStore.reset_carousel()
      return
    }
  }
  ///
  const temp_id = Get_this_album_info(item, list_name)
  if (store_server_user_model.model_server_type_of_web) {
    store_general_fetch_media_list.set_album_id(item.id)
    pageMediaStore.page_songlists_selected = 'song_list_all'
    store_server_user_model.random_play_model = false
  }
  console.log('play_this_item_click：' + temp_id)
  await store_general_fetch_album_list.fetchData_This_Album_MediaList(temp_id)
  playlistStore.reset_carousel()
}

const Play_Next_album_MediaList_click = (value: number) => {
  let current = pageHomeStore.home_selected_top_album_subscript
  if (value === 1) {
    current = current >= 17 ? 0 : current + 1
  } else {
    current = current === 0 ? 0 : current - 1
  }
  pageHomeStore.home_selected_top_album_subscript = current
  if (current === 0) {
    pageHomeStore.list_data_StartUpdate = true
  }
}

const handleItemClick_Favorite = (id: any, favorite: boolean) => {
  store_local_data_set_albumInfo.Set_AlbumInfo_To_Favorite(id, favorite)
}

const handleItemClick_Rating = (id_rating: any) => {
  const [id, rating] = id_rating.split('-')
  store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, after_rating ? 0 : rating)
}

async function update_playlist_addAlbum(id: any, playlist_id: any) {
  try {
    const is_web_local =
      (store_server_users.server_select_kind != 'jellyfin' &&
        store_server_users.server_select_kind != 'emby') ||
      store_server_user_model.model_server_type_of_local
    const is_emby_recently_added =
      store_server_users.server_select_kind === 'emby' && recently_added_contextmenu_of_emby.value

    recently_added_contextmenu_of_emby.value = false

    if (is_web_local || is_emby_recently_added) {
      await store_general_fetch_media_list.fetchData_Media_Find_This_Album(id)
      const matchingIds = pageMediaStore.media_Files_temporary
        .filter((item: Media_File) => item.album_id === id)
        .map((item: Media_File) => item.id)
      pageMediaStore.media_Files_temporary = []
      for (const item_id of matchingIds) {
        await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(
          item_id,
          playlist_id
        )
      }
    } else {
      await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(id, playlist_id)
    }
    message.success(t('common.add'))
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()
  } catch (e) {
    console.error(e)
  }
}

async function add_to_playlist(next: boolean) {
  let matchingItems = []
  const itemId = playlistStore.playlist_Menu_Item_Id
  // 兼容性代码，需要优化
  if (
    store_server_user_model.model_server_type_of_web &&
    store_server_users.server_select_kind === 'ninesong' &&
    pageHomeStore.home_Files_temporary_type_select != 'album'
  ) {
    if (pageHomeStore.home_Files_temporary_type_select === 'artist') {
      await store_general_fetch_media_list.fetchData_Media_Find_This_Artist(itemId)
      matchingItems = pageMediaStore.media_Files_temporary.filter(
        (item: Media_File) => item.artist_id === itemId
      )
    } else if (pageHomeStore.home_Files_temporary_type_select === 'media') {
      store_general_fetch_media_list._media_id = itemId
      await store_general_fetch_media_list.fetchData_Media()
      matchingItems = store_view_recommend_page_info.recommend_MediaFiles_temporary.filter(
        (item: Media_File) => item.id === itemId
      )
    }
  } else {
    ///
    const is_web_local =
      (store_server_users.server_select_kind != 'jellyfin' &&
        store_server_users.server_select_kind != 'emby') ||
      store_server_user_model.model_server_type_of_local
    const is_emby_recently_added =
      store_server_users.server_select_kind === 'emby' && recently_added_contextmenu_of_emby.value

    recently_added_contextmenu_of_emby.value = false

    if (is_web_local || is_emby_recently_added) {
      store_general_fetch_media_list._media_id = ''
      await store_general_fetch_media_list.fetchData_Media_Find_This_Album(itemId)
      matchingItems = pageMediaStore.media_Files_temporary.filter(
        (item: Media_File) => item.album_id === itemId
      )
    } else {
      store_general_fetch_media_list._media_id = itemId
      await store_general_fetch_media_list.fetchData_Media()
      matchingItems = pageMediaStore.media_Files_temporary.filter(
        (item: Media_File) => item.id === itemId
      )
    }
  }

  pageMediaStore.media_Files_temporary = []
  const newItems = matchingItems.map((item: any) => {
    const newItem = JSON.parse(JSON.stringify(item))
    newItem.play_id = newItem.id + 'copy&' + (Math.floor(Math.random() * 90000) + 10000)
    return newItem
  })

  if (next) {
    const index = playlistStore.playlist_MediaFiles_temporary.findIndex(
      (item: any) => item.id === playerAudioStore.this_audio_song_id
    )
    if (index !== -1) {
      playlistStore.playlist_MediaFiles_temporary.splice(index + 1, 0, ...newItems)
      playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.splice(
        index + 1,
        0,
        ...newItems.map((i) => i.id)
      )
    } else {
      console.error('Current audio song not found in playlist')
    }
  } else {
    playlistStore.playlist_MediaFiles_temporary.push(...newItems)
    playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.push(...newItems.map((i: any) => i.id))
  }

  playlistStore.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
    item.absoluteIndex = index
  })
  store_system_configs_save.save_system_playlist_item_id_config()
  contextmenu.value.hide()
}

const menu_item_add_to_playlist_end = () => add_to_playlist(false)
const menu_item_add_to_playlist_next = () => add_to_playlist(true)

const stopWatchCollapsed = watch(
    () => store_system_configs_info.app_view_left_menu_collapsed,
    () => updateGridItems()
  )

  const stopWatchWidth = watch(
    () => store_system_configs_info.window_innerWidth,
    () => {
      bool_watch = false
      updateGridItems()
      if (bool_watch) {
        startTimer()
      }
    }
  )

const stopWatchSubscript = watch(
  () => pageHomeStore.home_selected_top_album_subscript,
  (newValue) => {
    const searchResults = pageHomeStore.home_Files_temporary_random_search
    pageHomeStore.home_selected_top_album =
      searchResults && searchResults.length > 0 ? searchResults[newValue] : undefined
  }
)

onMounted(() => {
    startTimer()
    updateGridItems()
    if (store_server_user_model.model_server_type_of_web) {
      if (store_server_users.server_select_kind === 'navidrome') {
        pageHomeStore.home_Files_temporary_type_select = 'album'
      } else if (store_server_users.server_select_kind != 'ninesong') {
        pageHomeStore.home_Files_temporary_type_select = 'media'
      }
    } else {
      pageHomeStore.home_Files_temporary_type_select = 'album'
    }
  })

onBeforeUnmount(() => {
  stopWatchCollapsed()
  stopWatchWidth()
  stopWatchSubscript()
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
  dynamicScroller_maximum_playback.value = null
  dynamicScroller_random_search.value = null
  dynamicScroller_recently_added.value = null
  dynamicScroller_recently_played.value = null
})

const home_Files_temporary_type_options = ref([
  {
    label: computed(() => t('common.home') + ' : ' + t('entity.track_other')),
    value: 'media',
  },
  {
    label: computed(() => t('common.home') + ' : ' + t('entity.album_other')),
    value: 'album',
  },
  {
    label: computed(() => t('common.home') + ' : ' + t('entity.artist_other')),
    value: 'artist',
  },
  {
    label: computed(() => t('common.home') + ' : ' + 'CUE ' + t('nsmusics.view_page.disk')),
    value: 'media_cue',
  },
])
function change_home_Files_temporary_type() {
  store_general_fetch_home_list.fetchData_Home()
}

import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
const pageAlbumStore = usePageAlbumStore()
const playlistStore = usePlaylistStore()
const playerAudioStore = usePlayerAudioStore()
const playerAppearanceStore = usePlayerAppearanceStore()
const playerSettingStore = usePlayerSettingStore()
const { playlist_names_ALLLists, playlist_Menu_Item_Id, playlist_Menu_Item } =
  storeToRefs(playlistStore)
</script>

<template>
  <div class="home-wall-container">
    <n-space style="margin-top: 6px; margin-left: 8px" align="center">
      <n-select
        size="small"
        style="min-width: 156px"
        :disabled="
          !(
            store_server_user_model.model_server_type_of_web &&
            store_server_users.server_select_kind === 'ninesong'
          )
        "
        :options="home_Files_temporary_type_options"
        v-model:value="home_Files_temporary_type_select"
        @update:value="change_home_Files_temporary_type"
      />
      <div
        v-if="
        !(
          store_server_user_model.model_server_type_of_web &&
          store_server_users.server_select_kind === 'ninesong'
        )
      "
        style="font-size: 15px; font-weight: bold"
      >
        {{
          '-> ' +
          $t('Alternate') +
          $t('Data') +
          $t('LabelSource') +
          ', ' +
          $t('error.serverRequired') +
          ': NineSong'
        }}
        <br />
      </div>
    </n-space>
    <n-space vertical class="category-section">
      <n-space
        justify="space-between"
        align="center"
        class="category-header"
        style="margin-top: 12px"
        :style="{
          width: `calc(100vw - ${collapsed_width - 18}px)`,
        }"
      >
        <n-space align="center">
          <span class="category-title">
            {{
              $t('page.home.mostPlayed') +
              ' : ' +
              (store_server_users.server_select_kind === 'jellyfin' ||
              store_server_users.server_select_kind === 'emby'
                ? $t('entity.track_other')
                : store_server_users.server_select_kind === 'ninesong'
                  ? home_Files_temporary_type_select === 'media'
                    ? $t('entity.track_other')
                    : home_Files_temporary_type_select === 'album'
                      ? $t('entity.album_other')
                      : home_Files_temporary_type_select === 'artist'
                        ? $t('entity.artist_other')
                        : home_Files_temporary_type_select === 'media_cue'
                          ? 'CUE ' + $t('nsmusics.view_page.disk')
                          : $t('entity.album_other')
                  : $t('entity.album_other'))
            }}
          </span>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button
                quaternary
                @click="
              () => {
                store_general_fetch_home_list.fetchData_Home_of_maximum_playback()
                dynamicScroller_maximum_playback.$el.scrollLeft = 0
                    offset_maximum_playback = 0
              }
            "
              >
                <template #icon>
                  <n-icon :size="20"><ArrowReset24Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('common.refresh') }}
          </n-tooltip>
        </n-space>
        <n-space>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="scrollTo_maximum_playback(-1)">
                <n-icon size="20" :depth="2"><ChevronLeft16Filled /></n-icon>
              </n-button>
            </template>
            {{ $t('common.backward') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="scrollTo_maximum_playback(1)">
                <n-icon size="20" :depth="2"><ChevronRight16Filled /></n-icon>
              </n-button>
            </template>
            {{ $t('common.forward') }}
          </n-tooltip>
        </n-space>
      </n-space>
      <DynamicScroller
        class="home-wall"
        ref="dynamicScroller_maximum_playback"
        :style="{
          width: `calc(100vw - ${collapsed_width - 18}px)`,
          height: `${item_album_image + 80}px`,
        }"
        :items="home_Files_temporary_maximum_playback"
        :item-size="itemSize"
        :min-item-size="itemSize"
        direction="horizontal"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            v-contextmenu:contextmenu
            @contextmenu.prevent="
              () => {
                playlist_Menu_Item = item
                playlist_Menu_Item_Id = item.id
              }
            "
          >
            <div :key="item.id" class="home-album">
              <div
                class="home-album-cover-container"
                :style="{
                  width: `${item_album_image}px`,
                  height: `${item_album_image}px`,
                }"
              >
                <img
                  class="home-album-cover-image"
                  :src="item.medium_image_url"
                  @error="handleImageError(item)"
                  :style="{
                    width: `${item_album_image}px`,
                    height: `${item_album_image}px`,
                  }"
                  alt=""
                />
                <div
                  class="home-album-hover-overlay"
                  @dblclick="Open_this_album_MediaList_click(item, 'maximum')"
                >
                  <div class="home-album-hover-content">
                    <button
                      class="play-this-home-album-button"
                      @click="Play_this_album_MediaList_click(item, 'maximum')"
                    >
                      <icon :size="42" color="#FFFFFF"><PlayCircle24Regular /></icon>
                    </button>
                    <div
                      class="home-album-hover-buttons-top"
                      v-if="
                        (store_server_users.server_select_kind !== 'jellyfin' &&
                          store_server_users.server_select_kind !== 'emby') ||
                        store_server_user_model.model_server_type_of_local
                      "
                    >
                      <rate
                        class="viaSlot"
                        :length="5"
                        v-model="item.rating"
                        @before-rate="
                          () => {
                            before_rating = item.rating === 1
                          }
                        "
                        @after-rate="
                          (value) => {
                            after_rating = item.rating === 1 && before_rating
                            handleItemClick_Rating(`${item.id}-${value}`)
                            if (after_rating) {
                              item.rating = 0
                              after_rating = false
                            }
                          }
                        "
                      />
                    </div>
                    <div class="home-album-hover-buttons-bottom">
                      <button
                        v-if="
                          store_server_user_model.model_server_type_of_local ||
                          store_server_users.server_select_kind === 'navidrome' ||
                          (store_server_users.server_select_kind === 'ninesong' &&
                            home_Files_temporary_type_select === 'album')
                        "
                        class="open-this-home-artist-button"
                        @click="Open_this_album_MediaList_click(item, 'maximum')"
                      >
                        <icon :size="20" color="#FFFFFF"><Open28Filled /></icon>
                      </button>
                      <button
                        class="love-this-home-album-button"
                        @click="
                          () => {
                            handleItemClick_Favorite(item.id, item.favorite)
                            item.favorite = !item.favorite
                          }
                        "
                      >
                        <icon v-if="item.favorite" :size="20" color="red"><Heart28Filled /></icon>
                        <icon v-else :size="20" color="#FFFFFF"><Heart24Regular /></icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="home-album-info" :style="{ width: `${item_album_image}px` }">
                <div class="home-album-text" :style="{ width: `${item_album_txt}px` }">
                  <div class="home-album-name" :style="{ maxWidth: `${item_album_txt}px` }">
                    {{
                      store_server_user_model.model_server_type_of_web &&
                      store_server_users.server_select_kind === 'ninesong'
                        ? home_Files_temporary_type_select === 'media'
                          ? item.title
                          : item.name
                        : item.name
                    }}
                  </div>
                  <div class="home-artist-name" :style="{ maxWidth: `${item_album_txt}px` }">
                    {{ item.artist }}
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>

    <n-space vertical class="category-section">
      <n-space
        justify="space-between"
        align="center"
        class="category-header"
        :style="{ width: `calc(100vw - ${collapsed_width - 18}px)` }"
      >
        <n-space align="center">
          <span class="category-title">
            {{
              $t('page.home.explore') +
              ' : ' +
              (store_server_users.server_select_kind === 'jellyfin' ||
              store_server_users.server_select_kind === 'emby'
                ? $t('entity.track_other')
                : store_server_users.server_select_kind === 'ninesong'
                  ? home_Files_temporary_type_select === 'media'
                    ? $t('entity.track_other')
                    : home_Files_temporary_type_select === 'album'
                      ? $t('entity.album_other')
                      : home_Files_temporary_type_select === 'artist'
                        ? $t('entity.artist_other')
                        : home_Files_temporary_type_select === 'media_cue'
                          ? 'CUE ' + $t('nsmusics.view_page.disk')
                          : $t('entity.album_other')
                  : $t('entity.album_other'))
            }}
          </span>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button
                quaternary
                @click="
                  () => {
                    store_general_fetch_home_list.fetchData_Home_of_random_search()
                    dynamicScroller_random_search.$el.scrollLeft = 0
                    offset_random_search = 0
                  }
                "
              >
                <template #icon>
                  <n-icon :size="20"><ArrowReset24Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('common.refresh') }}
          </n-tooltip>
        </n-space>
        <n-space>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="scrollTo_random_search(-1)">
                <n-icon size="20" :depth="2"><ChevronLeft16Filled /></n-icon>
              </n-button>
            </template>
            {{ $t('common.backward') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="scrollTo_random_search(1)">
                <n-icon size="20" :depth="2"><ChevronRight16Filled /></n-icon>
              </n-button>
            </template>
            {{ $t('common.forward') }}
          </n-tooltip>
        </n-space>
      </n-space>
      <DynamicScroller
        class="home-wall"
        ref="dynamicScroller_random_search"
        :style="{
          width: `calc(100vw - ${collapsed_width - 18}px)`,
          height: `${item_album_image + 80}px`,
        }"
        :items="home_Files_temporary_random_search"
        :item-size="itemSize"
        :min-item-size="itemSize"
        direction="horizontal"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            v-contextmenu:contextmenu
            @contextmenu.prevent="
              () => {
                playlist_Menu_Item = item
                playlist_Menu_Item_Id = item.id
              }
            "
          >
            <div :key="item.id" class="home-album">
              <div
                class="home-album-cover-container"
                :style="{
                  width: `${item_album_image}px`,
                  height: `${item_album_image}px`,
                }"
              >
                <img
                  class="home-album-cover-image"
                  :src="item.medium_image_url"
                  @error="handleImageError(item)"
                  :style="{
                    width: `${item_album_image}px`,
                    height: `${item_album_image}px`,
                  }"
                  alt=""
                />
                <div
                  class="home-album-hover-overlay"
                  @dblclick="Open_this_album_MediaList_click(item, 'random')"
                >
                  <div class="home-album-hover-content">
                    <button
                      class="play-this-home-album-button"
                      @click="Play_this_album_MediaList_click(item, 'random')"
                    >
                      <icon :size="42" color="#FFFFFF"><PlayCircle24Regular /></icon>
                    </button>
                    <div
                      class="home-album-hover-buttons-top"
                      v-if="
                        (store_server_users.server_select_kind !== 'jellyfin' &&
                          store_server_users.server_select_kind !== 'emby') ||
                        store_server_user_model.model_server_type_of_local
                      "
                    >
                      <rate
                        class="viaSlot"
                        :length="5"
                        v-model="item.rating"
                        @before-rate="
                          () => {
                            before_rating = item.rating === 1
                          }
                        "
                        @after-rate="
                          (value) => {
                            after_rating = item.rating === 1 && before_rating
                            handleItemClick_Rating(`${item.id}-${value}`)
                            if (after_rating) {
                              item.rating = 0
                              after_rating = false
                            }
                          }
                        "
                      />
                    </div>
                    <div class="home-album-hover-buttons-bottom">
                      <button
                        v-if="
                          store_server_user_model.model_server_type_of_local ||
                          store_server_users.server_select_kind === 'navidrome' ||
                          (store_server_users.server_select_kind === 'ninesong' &&
                            home_Files_temporary_type_select === 'album')
                        "
                        class="open-this-home-artist-button"
                        @click="Open_this_album_MediaList_click(item, 'random')"
                      >
                        <icon :size="20" color="#FFFFFF"><Open28Filled /></icon>
                      </button>
                      <button
                        class="love-this-home-album-button"
                        @click="
                          () => {
                            handleItemClick_Favorite(item.id, item.favorite)
                            item.favorite = !item.favorite
                          }
                        "
                      >
                        <icon v-if="item.favorite" :size="20" color="red"><Heart28Filled /></icon>
                        <icon v-else :size="20" color="#FFFFFF"><Heart24Regular /></icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="home-album-info" :style="{ width: `${item_album_image}px` }">
                <div class="home-album-text" :style="{ width: `${item_album_txt}px` }">
                  <div class="home-album-name" :style="{ maxWidth: `${item_album_txt}px` }">
                    {{
                      store_server_user_model.model_server_type_of_web &&
                      store_server_users.server_select_kind === 'ninesong'
                        ? home_Files_temporary_type_select === 'media'
                          ? item.title
                          : item.name
                        : item.name
                    }}
                  </div>
                  <div class="home-artist-name" :style="{ maxWidth: `${item_album_txt}px` }">
                    {{ item.artist }}
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>

    <n-space vertical class="category-section">
      <n-space
        justify="space-between"
        align="center"
        class="category-header"
        :style="{ width: `calc(100vw - ${collapsed_width - 18}px)` }"
      >
        <n-space align="center">
          <span class="category-title">
            {{
              $t('page.home.newlyAdded') +
              ' : ' +
              (store_server_users.server_select_kind === 'jellyfin' ||
              store_server_users.server_select_kind === 'emby'
                ? $t('entity.track_other')
                : store_server_users.server_select_kind === 'ninesong'
                  ? home_Files_temporary_type_select === 'media'
                    ? $t('entity.track_other')
                    : home_Files_temporary_type_select === 'album'
                      ? $t('entity.album_other')
                      : home_Files_temporary_type_select === 'artist'
                        ? $t('entity.artist_other')
                        : home_Files_temporary_type_select === 'media_cue'
                          ? 'CUE ' + $t('nsmusics.view_page.disk')
                          : $t('entity.album_other')
                  : $t('entity.album_other'))
            }}
          </span>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button
                quaternary
                @click="
                  () => {
                    store_general_fetch_home_list.fetchData_Home_of_recently_added()
                    dynamicScroller_recently_added.$el.scrollLeft = 0
                    offset_recently_added = 0
                  }
                "
              >
                <template #icon>
                  <n-icon :size="20"><ArrowReset24Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('common.refresh') }}
          </n-tooltip>
        </n-space>
        <n-space>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="scrollTo_recently_added(-1)">
                <n-icon size="20" :depth="2"><ChevronLeft16Filled /></n-icon>
              </n-button>
            </template>
            {{ $t('common.backward') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="scrollTo_recently_added(1)">
                <n-icon size="20" :depth="2"><ChevronRight16Filled /></n-icon>
              </n-button>
            </template>
            {{ $t('common.forward') }}
          </n-tooltip>
        </n-space>
      </n-space>
      <DynamicScroller
        class="home-wall"
        ref="dynamicScroller_recently_added"
        :style="{
          width: `calc(100vw - ${collapsed_width - 18}px)`,
          height: `${item_album_image + 80}px`,
        }"
        :items="home_Files_temporary_recently_added"
        :item-size="itemSize"
        :min-item-size="itemSize"
        direction="horizontal"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            v-contextmenu:contextmenu
            @contextmenu.prevent="
              () => {
                playlist_Menu_Item = item
                playlist_Menu_Item_Id = item.id
                recently_added_contextmenu_of_emby = true
              }
            "
          >
            <div :key="item.id" class="home-album">
              <div
                class="home-album-cover-container"
                :style="{
                  width: `${item_album_image}px`,
                  height: `${item_album_image}px`,
                }"
              >
                <img
                  class="home-album-cover-image"
                  :src="item.medium_image_url"
                  @error="handleImageError(item)"
                  :style="{
                    width: `${item_album_image}px`,
                    height: `${item_album_image}px`,
                  }"
                  alt=""
                />
                <div
                  class="home-album-hover-overlay"
                  @dblclick="Open_this_album_MediaList_click(item, 'recently_added')"
                >
                  <div class="home-album-hover-content">
                    <button
                      class="play-this-home-album-button"
                      @click="Play_this_album_MediaList_click(item, 'recently_added')"
                    >
                      <icon :size="42" color="#FFFFFF"><PlayCircle24Regular /></icon>
                    </button>
                    <div
                      class="home-album-hover-buttons-top"
                      v-if="
                        (store_server_users.server_select_kind !== 'jellyfin' &&
                          store_server_users.server_select_kind !== 'emby') ||
                        store_server_user_model.model_server_type_of_local
                      "
                    >
                      <rate
                        class="viaSlot"
                        :length="5"
                        v-model="item.rating"
                        @before-rate="
                          () => {
                            before_rating = item.rating === 1
                          }
                        "
                        @after-rate="
                          (value) => {
                            after_rating = item.rating === 1 && before_rating
                            handleItemClick_Rating(`${item.id}-${value}`)
                            if (after_rating) {
                              item.rating = 0
                              after_rating = false
                            }
                          }
                        "
                      />
                    </div>
                    <div class="home-album-hover-buttons-bottom">
                      <button
                        v-if="
                          store_server_user_model.model_server_type_of_local ||
                          store_server_users.server_select_kind === 'navidrome' ||
                          (store_server_users.server_select_kind === 'ninesong' &&
                            home_Files_temporary_type_select === 'album')
                        "
                        class="open-this-home-artist-button"
                        @click="Open_this_album_MediaList_click(item, 'recently_added')"
                      >
                        <icon :size="20" color="#FFFFFF"><Open28Filled /></icon>
                      </button>
                      <button
                        class="love-this-home-album-button"
                        @click="
                          () => {
                            handleItemClick_Favorite(item.id, item.favorite)
                            item.favorite = !item.favorite
                          }
                        "
                      >
                        <icon v-if="item.favorite" :size="20" color="red"><Heart28Filled /></icon>
                        <icon v-else :size="20" color="#FFFFFF"><Heart24Regular /></icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="home-album-info" :style="{ width: `${item_album_image}px` }">
                <div class="home-album-text" :style="{ width: `${item_album_txt}px` }">
                  <div class="home-album-name" :style="{ maxWidth: `${item_album_txt}px` }">
                    {{
                      store_server_user_model.model_server_type_of_web &&
                      store_server_users.server_select_kind === 'ninesong'
                        ? home_Files_temporary_type_select === 'media'
                          ? item.title
                          : item.name
                        : item.name
                    }}
                  </div>
                  <div class="home-artist-name" :style="{ maxWidth: `${item_album_txt}px` }">
                    {{ item.artist }}
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>

    <n-space vertical class="category-section">
      <n-space
        justify="space-between"
        align="center"
        class="category-header"
        :style="{ width: `calc(100vw - ${collapsed_width - 18}px)` }"
      >
        <n-space align="center">
          <span class="category-title">
            {{
              $t('page.home.recentlyPlayed') +
              ' : ' +
              (store_server_users.server_select_kind === 'jellyfin' ||
              store_server_users.server_select_kind === 'emby'
                ? $t('entity.track_other')
                : store_server_users.server_select_kind === 'ninesong'
                  ? home_Files_temporary_type_select === 'media'
                    ? $t('entity.track_other')
                    : home_Files_temporary_type_select === 'album'
                      ? $t('entity.album_other')
                      : home_Files_temporary_type_select === 'artist'
                        ? $t('entity.artist_other')
                        : home_Files_temporary_type_select === 'media_cue'
                          ? 'CUE ' + $t('nsmusics.view_page.disk')
                          : $t('entity.album_other')
                  : $t('entity.album_other'))
            }}
          </span>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button
                quaternary
                @click="
                  () => {
                    store_general_fetch_home_list.fetchData_Home_of_recently_played()
                    dynamicScroller_recently_played.$el.scrollLeft = 0
                    offset_recently_played = 0
                  }
                "
              >
                <template #icon>
                  <n-icon :size="20"><ArrowReset24Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('common.refresh') }}
          </n-tooltip>
        </n-space>
        <n-space>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="scrollTo_recently_played(-1)">
                <n-icon size="20" :depth="2"><ChevronLeft16Filled /></n-icon>
              </n-button>
            </template>
            {{ $t('common.backward') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary @click="scrollTo_recently_played(1)">
                <n-icon size="20" :depth="2"><ChevronRight16Filled /></n-icon>
              </n-button>
            </template>
            {{ $t('common.forward') }}
          </n-tooltip>
        </n-space>
      </n-space>
      <DynamicScroller
        class="home-wall"
        ref="dynamicScroller_recently_played"
        :style="{
          width: `calc(100vw - ${collapsed_width - 18}px)`,
          height: `${item_album_image + 80}px`,
        }"
        :items="home_Files_temporary_recently_played"
        :item-size="itemSize"
        :min-item-size="itemSize"
        direction="horizontal"
      >
        <template #default="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
            v-contextmenu:contextmenu
            @contextmenu.prevent="
              () => {
                playlist_Menu_Item = item
                playlist_Menu_Item_Id = item.id
              }
            "
          >
            <div :key="item.id" class="home-album">
              <div
                class="home-album-cover-container"
                :style="{
                  width: `${item_album_image}px`,
                  height: `${item_album_image}px`,
                }"
              >
                <img
                  class="home-album-cover-image"
                  :src="item.medium_image_url"
                  @error="handleImageError(item)"
                  :style="{
                    width: `${item_album_image}px`,
                    height: `${item_album_image}px`,
                  }"
                  alt=""
                />
                <div
                  class="home-album-hover-overlay"
                  @dblclick="Open_this_album_MediaList_click(item, 'recently_played')"
                >
                  <div class="home-album-hover-content">
                    <button
                      class="play-this-home-album-button"
                      @click="Play_this_album_MediaList_click(item, 'recently_played')"
                    >
                      <icon :size="42" color="#FFFFFF"><PlayCircle24Regular /></icon>
                    </button>
                    <div
                      class="home-album-hover-buttons-top"
                      v-if="
                        (store_server_users.server_select_kind !== 'jellyfin' &&
                          store_server_users.server_select_kind !== 'emby') ||
                        store_server_user_model.model_server_type_of_local
                      "
                    >
                      <rate
                        class="viaSlot"
                        :length="5"
                        v-model="item.rating"
                        @before-rate="
                          () => {
                            before_rating = item.rating === 1
                          }
                        "
                        @after-rate="
                          (value) => {
                            after_rating = item.rating === 1 && before_rating
                            handleItemClick_Rating(`${item.id}-${value}`)
                            if (after_rating) {
                              item.rating = 0
                              after_rating = false
                            }
                          }
                        "
                      />
                    </div>
                    <div class="home-album-hover-buttons-bottom">
                      <button
                        v-if="
                          store_server_user_model.model_server_type_of_local ||
                          store_server_users.server_select_kind === 'navidrome' ||
                          (store_server_users.server_select_kind === 'ninesong' &&
                            home_Files_temporary_type_select === 'album')
                        "
                        class="open-this-home-artist-button"
                        @click="Open_this_album_MediaList_click(item, 'recently_played')"
                      >
                        <icon :size="20" color="#FFFFFF"><Open28Filled /></icon>
                      </button>
                      <button
                        class="love-this-home-album-button"
                        @click="
                          () => {
                            handleItemClick_Favorite(item.id, item.favorite)
                            item.favorite = !item.favorite
                          }
                        "
                      >
                        <icon v-if="item.favorite" :size="20" color="red"><Heart28Filled /></icon>
                        <icon v-else :size="20" color="#FFFFFF"><Heart24Regular /></icon>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="home-album-info" :style="{ width: `${item_album_image}px` }">
                <div class="home-album-text" :style="{ width: `${item_album_txt}px` }">
                  <div class="home-album-name" :style="{ maxWidth: `${item_album_txt}px` }">
                    {{
                      store_server_user_model.model_server_type_of_web &&
                      store_server_users.server_select_kind === 'ninesong'
                        ? home_Files_temporary_type_select === 'media'
                          ? item.title
                          : item.name
                        : item.name
                    }}
                  </div>
                  <div class="home-artist-name" :style="{ maxWidth: `${item_album_txt}px` }">
                    {{ item.artist }}
                  </div>
                </div>
              </div>
            </div>
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </n-space>

    <v-contextmenu
      v-if="
        !(
          store_server_user_model.model_server_type_of_web &&
          store_server_users.server_select_kind === 'ninesong' &&
          home_Files_temporary_type_select === 'media_cue'
        )
      "
      ref="contextmenu"
      class="context-menu"
    >
      <v-contextmenu-submenu :title="menu_item_add_to_songlist">
        <v-contextmenu-item
          v-for="n in playlist_names_ALLLists"
          :key="n.value"
          @click="update_playlist_addAlbum(playlist_Menu_Item_Id, n.value)"
        >
          {{ n.label }}
        </v-contextmenu-item>
      </v-contextmenu-submenu>
      <v-contextmenu-divider />
      <v-contextmenu-item @click="menu_item_add_to_playlist_end">
        {{ $t('player.addLast') }}
      </v-contextmenu-item>
      <v-contextmenu-item @click="menu_item_add_to_playlist_next">
        {{ $t('player.addNext') }}
      </v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>

<style>
.home-wall-container {
  width: 100%;
  height: 100%;
  padding-right: 20px;
  overflow-x: hidden;
  overflow-y: scroll;

  --card-color: v-bind('themeVars.cardColor');
  --border-color: v-bind('themeVars.borderColor');
  --primary-color-hover: v-bind('themeVars.primaryColorHover');
  --primary-color-suppl: v-bind('themeVars.primaryColorSuppl');
  --text-color-1: v-bind('themeVars.textColor1');
  --text-color-2: v-bind('themeVars.textColor2');
  --text-color-3: v-bind('themeVars.textColor3');
  --hover-color: v-bind('themeVars.hoverColor');
  --scrollbar-color: v-bind('themeVars.scrollbarColor');
  --scrollbar-color-hover: v-bind('themeVars.scrollbarColorHover');
}

.category-section {
  margin-bottom: -8px;
}

.category-header {
  width: calc(100vw - 200px);
  margin-left: 9px;
}

.category-title {
  font-size: 16px;
  font-weight: 700;
}

.no-data-placeholder {
  margin-top: 2px;
  color: #ffffff80;
}

.home-wall {
  display: flex;
  flex-direction: row;
  scroll-behavior: smooth;
  scrollbar-width: none;
  overflow-x: auto;
}

.home-album {
  float: left;
  flex-direction: column;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.home-album:hover {
  transform: translateY(-10px);
}
.home-album:hover .home-album-name {
  color: var(--primary-color-hover);
}
.home-album:nth-child(1) {
  margin-left: 7px;
}

.home-album-cover-container {
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.home-album-cover-image {
  object-fit: cover;
  object-position: center;
  border: 1.5px solid #ffffff20;
  border-radius: 10px;
}

.home-album-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.home-album:hover .home-album-hover-overlay {
  opacity: 1;
}

.home-album-hover-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.play-this-home-album-button,
.open-this-home-artist-button,
.love-this-home-album-button {
  border: 0;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-this-home-album-button:hover,
.open-this-home-artist-button:hover,
.love-this-home-album-button:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
}

.play-this-home-album-button {
  width: 50px;
  height: 50px;
}

.play-this-home-album-button .icon {
  margin-left: -2px;
  margin-top: 3px;
}

.home-album-hover-buttons-top {
  position: absolute;
  top: 4px;
  left: 4px;
  width: auto;
}

.home-album-hover-buttons-bottom {
  position: absolute;
  bottom: 8px;
  right: 14px;
  display: flex;
  gap: 8px;
}

.open-this-home-artist-button,
.love-this-home-album-button {
  width: 28px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.open-this-home-artist-button .icon,
.love-this-home-album-button .icon {
  margin: 0;
}

.home-album-info {
  float: left;
  text-align: left;
}

.home-album-text {
  margin-top: 2px;
}

.home-album-name,
.home-artist-name {
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-album-name {
  font-weight: 600;
}

.context-menu {
  z-index: 999;
}

.v-contextmenu-item {
  margin-top: 5px;
  margin-bottom: 5px;
}

.v-contextmenu-item--hover {
  color: var(--primary-color-hover);
  background-color: transparent;
}

.n-base-selection .n-base-selection-label .n-base-selection-input .n-base-selection-input__content {
  font-size: 15px;
  font-weight: 600;
}
.n-statistic .n-statistic__label {
  font-size: 15px;
  font-weight: 600;
}
.n-statistic .n-statistic-value .n-statistic-value__content {
  font-size: 24px;
  font-weight: 600;
}
</style>
