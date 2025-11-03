<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, computed } from 'vue'
import { NButton, NIcon, NImage, useMessage, useThemeVars } from 'naive-ui'
import { Icon } from '@vicons/utils'
import {
  PlayCircle24Regular,
  Heart24Regular,
  Heart28Filled,
  Open28Filled,
  PaddingTop20Filled,
  PaddingDown20Filled,
} from '@vicons/fluent'
import { RefreshSharp } from '@vicons/ionicons5'
import { BrowserNotSupportedTwotone } from '@vicons/material'

// @ts-ignore - 忽略模块导入类型检查
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
// @ts-ignore - 忽略模块导入类型检查
import { usePageHomeStore } from '@/data/data_status/app_status/page_status/home_store/usePageHomeStore'
import { storeToRefs } from 'pinia'
// @ts-ignore - 忽略模块导入类型检查
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_album_list } from '@/server/server_api_store/server_api_core/page/page_album/store_general_fetch_album_list'

// @ts-ignore - 忽略模块导入类型检查
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
// @ts-ignore - 忽略模块导入类型检查
import { store_server_users } from '@/server/server_management/store_server_users'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_home_list } from '@/server/server_api_store/server_api_core/page/page_home/store_general_fetch_home_list'
// @ts-ignore - 忽略模块导入类型检查
import { store_local_data_set_albumInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_albumInfo'
// @ts-ignore - 忽略模块导入类型检查
import { store_local_data_set_artistInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_artistInfo'
// @ts-ignore - 忽略模块导入类型检查
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'

// @ts-ignore - 忽略模块导入类型检查
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_media_list } from '@/server/server_api_store/server_api_core/page/page_media_file/store_general_fetch_media_list'
// @ts-ignore - 忽略模块导入类型检查
import { store_local_data_set_mediaInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_mediaInfo'
// @ts-ignore - 忽略模块导入类型检查
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
// @ts-ignore - 忽略模块导入类型检查
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
// @ts-ignore - 忽略模块导入类型检查
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_player_list } from '@/server/server_api_store/server_api_core/components/player_list/store_general_fetch_player_list'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_model_player_list } from '@/server/server_api_store/server_api_core/components/player_list/store_general_model_player_list'

// @ts-ignore - 忽略模块导入类型检查
import error_album from '@/assets/img/error_album.jpg'
// @ts-ignore - 忽略模块导入类型检查
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_artist_list } from '@/server/server_api_store/server_api_core/page/page_artist/store_general_fetch_artist_list'
// @ts-ignore - 忽略模块导入类型检查
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'

// @ts-ignore - 忽略模块导入类型检查
import { store_general_fetch_media_cue_list } from '@/server/server_api_store/server_api_core/page/page_media_cue_file/store_general_fetch_media_cue_list'

import { useI18n } from 'vue-i18n'
// @ts-ignore - 忽略模块导入类型检查
import { usePageRecommendStore } from '@/data/data_status/app_status/page_status/recommend_store/usePageRecommendStore'

const { t } = useI18n({ inheritLocale: true })
const message = useMessage()
const themeVars = useThemeVars()

const pageMediaStore = usePageMediaStore()
const pageHomeStore = usePageHomeStore()
const pageRecommendStore = usePageRecommendStore()
const { home_Files_temporary_recently_added, home_Files_temporary_type_select } =
  storeToRefs(pageHomeStore)
const { recommend_MediaFiles_temporary } = storeToRefs(pageRecommendStore)

const item_album = ref(160)
const item_album_image = ref(item_album.value - 20)
const item_album_txt = ref(item_album.value - 20)
const itemSize = ref(180)
const gridItems = ref(5)
const itemSecondarySize = ref(185)
const errorHandled = ref(new Map())
const timer = ref<NodeJS.Timeout | null>(null)
let bool_watch = false
let before_rating = false
let after_rating = false

// 添加dynamicScroller的定义
const dynamicScroller = ref<any>(null)
// 添加分组数据缓存和已处理数据长度记录
const _groupedRecentlyAddedCache = ref<any[]>([])
const _lastProcessedDataLength = ref<number>(0)
const onResize = () => {
  console.log('resize')
}
const updateParts = { viewStartIdx: 0, viewEndIdx: 0, visibleStartIdx: 0, visibleEndIdx: 0 } // 输出渲染范围updateParts
const onUpdate = (
  viewStartIndex: any,
  viewEndIndex: any,
  visibleStartIndex: any,
  visibleEndIndex: any
) => {
  updateParts.viewStartIdx = viewStartIndex
  updateParts.viewEndIdx = viewEndIndex
  updateParts.visibleStartIdx = visibleStartIndex
  updateParts.visibleEndIdx = visibleEndIndex
}

// 当前显示的时间分区文字
const currentGroupName = ref('')

// 检测当前可见的分组索引
const visibleGroupIndex = ref(0)

const contextmenu = ref<any>(null)
const recently_added_contextmenu_of_emby = ref(false)
const menu_item_add_to_songlist = computed(() => t('form.addToPlaylist.title'))

// 时间分组相关
const getTimeGroupName = (date: Date): string => {
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 7) return t('nsmusics.view_page.this_week')
  if (diffDays <= 30) return t('nsmusics.view_page.this_month')
  if (diffDays <= 90) return t('nsmusics.view_page.last_3_months')
  if (diffDays <= 180) return t('nsmusics.view_page.last_6_months')

  const year = date.getFullYear()
  if (year === now.getFullYear()) return t('nsmusics.view_page.this_year')

  // 返回年份作为分组名
  return year.toString()
}

// 定义时间分组名称的计算属性，确保语言切换时能实时更新
const timeGroupNames = computed(() => ({
  this_week: t('nsmusics.view_page.this_week'),
  this_month: t('nsmusics.view_page.this_month'),
  last_3_months: t('nsmusics.view_page.last_3_months'),
  last_6_months: t('nsmusics.view_page.last_6_months'),
  this_year: t('nsmusics.view_page.this_year'),
}))

// 按时间分组的数据
const groupedRecentlyAdded = computed(() => {
  // 确保使用最新的完整数据
  const currentData = home_Files_temporary_recently_added.value || []

  // 每次重新计算时都基于完整的数据集
  if (currentData.length === 0) return []

  // 检查是否需要完全刷新数据
  if (isDataRefreshing.value) {
    // 完全刷新场景：重新计算所有数据
    
    // 先对数据进行去重处理，确保id唯一，参考class_Get_NineSong_Temp_Data_To_LocalSqlite.ts 619-626的实现
    // 使用Map来提高查找性能
    const uniqueItemsMap = new Map()
    currentData.forEach((item: any) => {
      if (item && item.id && !uniqueItemsMap.has(item.id)) {
        uniqueItemsMap.set(item.id, item)
      }
    })
    const uniqueItems = Array.from(uniqueItemsMap.values())

    // 按创建时间排序
    const sortedItems = uniqueItems.sort((a: any, b: any) => {
      if (!a.created_at || !b.created_at) return 0
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    // 按时间分组
    const groups: { [key: string]: any[] } = {}
    const years: Set<number> = new Set()
    const now = new Date()

    sortedItems.forEach((item: any) => {
      if (!item.created_at) return
      const date = new Date(item.created_at)
      const groupName = getTimeGroupName(date)
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(item)

      // 收集年份
      const year = date.getFullYear()
      if (year < now.getFullYear() && year >= 2020) {
        // 只收集2020年及以后的年份
        years.add(year)
      }
    })

    // 动态生成分组顺序，使用计算属性确保语言切换时能实时更新
    const groupOrder = [
      timeGroupNames.value.this_week,
      timeGroupNames.value.this_month,
      timeGroupNames.value.last_3_months,
      timeGroupNames.value.last_6_months,
      timeGroupNames.value.this_year,
    ]

    // 按年份降序添加
    const sortedYears = Array.from(years).sort((a, b) => b - a)
    sortedYears.forEach((year) => {
      groupOrder.push(year.toString())
    })

    groupOrder.push('更早')

    // 按时间顺序排列分组
    const result: { name: string; items: any[] }[] = []
    groupOrder.forEach((groupName) => {
      if (groups[groupName] && groups[groupName].length > 0) {
        result.push({
          name: groupName,
          items: groups[groupName],
        })
      }
    })

    // 更新缓存
    _groupedRecentlyAddedCache.value = result
    // 重置已处理数据长度
    _lastProcessedDataLength.value = currentData.length
    
    return result
  } else {
    // 增量追加场景：只处理新增数据并追加到现有分组中
    // 获取当前已分组的数据
    const existingGroups = _groupedRecentlyAddedCache.value || []
    
    // 如果没有现有分组，回退到完全刷新模式
    if (existingGroups.length === 0) {
      // 先对数据进行去重处理，确保id唯一，参考class_Get_NineSong_Temp_Data_To_LocalSqlite.ts 619-626的实现
      // 使用Map来提高查找性能
      const uniqueItemsMap = new Map()
      currentData.forEach((item: any) => {
        if (item && item.id && !uniqueItemsMap.has(item.id)) {
          uniqueItemsMap.set(item.id, item)
        }
      })
      const uniqueItems = Array.from(uniqueItemsMap.values())

      // 按创建时间排序
      const sortedItems = uniqueItems.sort((a: any, b: any) => {
        if (!a.created_at || !b.created_at) return 0
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

      // 按时间分组
      const groups: { [key: string]: any[] } = {}
      const years: Set<number> = new Set()
      const now = new Date()

      sortedItems.forEach((item: any) => {
        if (!item.created_at) return
        const date = new Date(item.created_at)
        const groupName = getTimeGroupName(date)
        if (!groups[groupName]) {
          groups[groupName] = []
        }
        groups[groupName].push(item)

        // 收集年份
        const year = date.getFullYear()
        if (year < now.getFullYear() && year >= 2020) {
          // 只收集2020年及以后的年份
          years.add(year)
        }
      })

      // 动态生成分组顺序，使用计算属性确保语言切换时能实时更新
      const groupOrder = [
        timeGroupNames.value.this_week,
        timeGroupNames.value.this_month,
        timeGroupNames.value.last_3_months,
        timeGroupNames.value.last_6_months,
        timeGroupNames.value.this_year,
      ]

      // 按年份降序添加
      const sortedYears = Array.from(years).sort((a, b) => b - a)
      sortedYears.forEach((year) => {
        groupOrder.push(year.toString())
      })

      groupOrder.push('更早')

      // 按时间顺序排列分组
      const result: { name: string; items: any[] }[] = []
      groupOrder.forEach((groupName) => {
        if (groups[groupName] && groups[groupName].length > 0) {
          result.push({
            name: groupName,
            items: groups[groupName],
          })
        }
      })

      // 缓存结果
      _groupedRecentlyAddedCache.value = result
      // 更新已处理数据长度
      _lastProcessedDataLength.value = currentData.length
      
      return result
    }
    
    // 有现有分组的情况下，只处理新增数据
    // 获取新增的数据（假设新增数据在数组末尾）
    const existingDataLength = _lastProcessedDataLength.value || 0
    const newData = currentData.slice(existingDataLength)
    
    // 更新已处理数据长度
    _lastProcessedDataLength.value = currentData.length
    
    if (newData.length === 0) {
      // 没有新增数据，返回缓存的结果
      return existingGroups
    }
    
    // 对新增数据进行去重处理
    const uniqueNewItemsMap = new Map()
    newData.forEach((item: any) => {
      if (item && item.id && !uniqueNewItemsMap.has(item.id)) {
        uniqueNewItemsMap.set(item.id, item)
      }
    })
    const uniqueNewItems = Array.from(uniqueNewItemsMap.values())
    
    // 将新增数据合并到现有分组中
    const updatedGroups = [...existingGroups]
    
    // 按创建时间排序新增数据
    const sortedNewItems = uniqueNewItems.sort((a: any, b: any) => {
      if (!a.created_at || !b.created_at) return 0
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    
    // 将新增数据按时间分组并添加到对应分组中
    const now = new Date()
    sortedNewItems.forEach((item: any) => {
      if (!item.created_at) return
      const date = new Date(item.created_at)
      const groupName = getTimeGroupName(date)
      
      // 查找对应的分组
      const groupIndex = updatedGroups.findIndex(group => group.name === groupName)
      if (groupIndex >= 0) {
        // 如果分组已存在，添加到该分组
        updatedGroups[groupIndex].items.push(item)
      } else {
        // 如果分组不存在，创建新分组
        updatedGroups.push({
          name: groupName,
          items: [item]
        })
      }
    })
    
    // 缓存更新后的结果
    _groupedRecentlyAddedCache.value = updatedGroups
    return updatedGroups
  }
})

// 强制刷新ref，用于在home_Files_temporary_recently_added变化时触发重新渲染
const groupedRecentlyAddedKey = ref(0)

const stopWatch_home_Files_temporary_recently_added = watch(
  () => home_Files_temporary_recently_added.value,
  (newValue, oldValue) => {
    // 当home_Files_temporary_recently_added变化时，增加key值强制重新渲染
    groupedRecentlyAddedKey.value++
  }
)

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
      // @ts-ignore
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

// gridItems Re render
const collapsed_width = ref(1090)
const stopWatching_window_innerWidth = watch(
  () => store_system_configs_info.window_innerWidth,
  (newValue, oldValue) => {
    updateGridItems()
  }
)
const updateGridItems = () => {
  collapsed_width.value = 145
  if (window.innerWidth > 2460) {
    const num = window.innerWidth / 8.03
    itemSize.value = Math.floor(num) + 40
    item_album.value = Math.floor(num)
    item_album_image.value = item_album.value - 20
    item_album_txt.value = item_album.value - 20
    gridItems.value = 7
    itemSecondarySize.value =
      Math.floor(window.innerWidth - (collapsed_width.value - 40)) / gridItems.value - 2
  } else if (window.innerWidth > 1660) {
    const num = window.innerWidth / 7.03
    itemSize.value = Math.floor(num) + 40
    item_album.value = Math.floor(num)
    item_album_image.value = item_album.value - 20
    item_album_txt.value = item_album.value - 20
    gridItems.value = 6
    itemSecondarySize.value =
      Math.floor(window.innerWidth - (collapsed_width.value - 40)) / gridItems.value - 2
  } else {
    const num = window.innerWidth / 6.03
    itemSize.value = Math.floor(num) + 40
    item_album.value = Math.floor(num)
    item_album_image.value = item_album.value - 20
    item_album_txt.value = item_album.value - 20
    gridItems.value = 5
    itemSecondarySize.value =
      Math.floor(window.innerWidth - (collapsed_width.value - 40)) / gridItems.value - 2
  }
}
onMounted(() => {
  updateGridItems()
})

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

const handleItemClick_Favorite = (id: any, favorite: boolean) => {
  if (pageHomeStore.home_Files_temporary_type_select === 'media')
    store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id, favorite)
  else if (pageHomeStore.home_Files_temporary_type_select === 'album')
    store_local_data_set_albumInfo.Set_AlbumInfo_To_Favorite(id, favorite)
  else if (pageHomeStore.home_Files_temporary_type_select === 'artist')
    store_local_data_set_artistInfo.Set_ArtistInfo_To_Favorite(id, favorite)
  else if (pageHomeStore.home_Files_temporary_type_select === 'media_cue')
    store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id, favorite)
}

const handleItemClick_Rating = (id_rating: any) => {
  const [id, rating] = id_rating.split('-')
  const ratingValue = parseInt(rating)
  if (pageHomeStore.home_Files_temporary_type_select === 'media')
    store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, after_rating ? 0 : ratingValue)
  else if (pageHomeStore.home_Files_temporary_type_select === 'album')
    store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, after_rating ? 0 : ratingValue)
  else if (pageHomeStore.home_Files_temporary_type_select === 'artist')
    store_local_data_set_artistInfo.Set_ArtistInfo_To_Rating(id, after_rating ? 0 : ratingValue)
  else if (pageHomeStore.home_Files_temporary_type_select === 'media_cue')
    store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, after_rating ? 0 : ratingValue)
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
      matchingItems = recommend_MediaFiles_temporary.value.filter(
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
        ...newItems.map((i: any) => i.id)
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
  if (contextmenu.value && typeof contextmenu.value.hide === 'function') contextmenu.value.hide()
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
    } else {
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
  stopWatching_window_innerWidth()
  stopWatch_home_Files_temporary_recently_added()
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
})

const home_Files_temporary_type_options = ref([
  {
    label: computed(() => t('filter.recentlyAdded') + ' : ' + t('entity.track_other')),
    value: 'media',
  },
  {
    label: computed(() => t('filter.recentlyAdded') + ' : ' + t('entity.album_other')),
    value: 'album',
  },
  {
    label: computed(() => t('filter.recentlyAdded') + ' : ' + t('entity.artist_other')),
    value: 'artist',
  },
  {
    label: computed(
      () => t('filter.recentlyAdded') + ' : ' + 'CUE ' + t('nsmusics.view_page.disk')
    ),
    value: 'media_cue',
  },
])

// 添加一个标志来区分数据更新类型
const isDataRefreshing = ref(false)

// 修改 change_home_Files_temporary_type 方法以标记完全刷新数据
function change_home_Files_temporary_type() {
  currentGroupName.value = ''
  _start.value = 0
  _end.value = 30
  pageHomeStore.home_Files_temporary_recently_added_search = {
    start: String(_start.value),
    end: String(_end.value),
  }
  // 标记为完全刷新数据
  isDataRefreshing.value = true
  pageHomeStore.home_Files_temporary_recently_added = []
  store_general_fetch_home_list.fetchData_Home_of_recently_added()
}

// 修改 onScrollEnd 方法以优化数据追加
const onScrollEnd = async () => {
  if (isScrolling.value) return
  isScrolling.value = true
  if (store_server_user_model.model_server_type_of_web) {
    if (
      store_server_users.server_select_kind === 'navidrome' ||
      store_server_users.server_select_kind === 'ninesong'
    ) {
      _start.value += 30
      _end.value += 30
      pageHomeStore.home_Files_temporary_recently_added_search = {
        start: String(_start.value),
        end: String(_end.value),
      }
      // 清除刷新标志，表示这是追加数据
      isDataRefreshing.value = false
      await store_general_fetch_home_list.fetchData_Home_of_recently_added()

      // 数据加载完成后，重新计算可见分组索引
      // 获取外层滚动容器
      const scroller = dynamicScroller.value ? (dynamicScroller.value as any).$el : null
      if (scroller) {
        // 获取滚动位置和容器尺寸
        const scrollTop = scroller.scrollTop
        const clientHeight = scroller.clientHeight
        const scrollHeight = scroller.scrollHeight

        // 检查是否滚动到底部（距离底部小于150px）
        const distanceToBottom = scrollHeight - scrollTop - clientHeight
        if (distanceToBottom < 50) {
          // 接近底部时，锁定显示最后一个分组的名称
          const lastGroupIndex = groupedRecentlyAdded.value.length - 1
          if (lastGroupIndex >= 0) {
            visibleGroupIndex.value = lastGroupIndex
            currentGroupName.value = groupedRecentlyAdded.value[lastGroupIndex].name
          }
        }
      }
    }
  }
  isScrolling.value = false
}

const onRefreshSharp = async () => {
  change_home_Files_temporary_type()
}

// @ts-ignore - 忽略模块导入类型检查
import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
const pageAlbumStore = usePageAlbumStore()
const playlistStore = usePlaylistStore()
const playerAudioStore = usePlayerAudioStore()
const playerAppearanceStore = usePlayerAppearanceStore()
const playerSettingStore = usePlayerSettingStore()
const { playlist_names_ALLLists, playlist_Menu_Item_Id, playlist_Menu_Item } =
  storeToRefs(playlistStore)

//////
const _start = ref(0)
const _end = ref(30)
const isScrolling = ref(false)
const onScrollStart = () => {}

const onScroll = (event: any) => {
  // 如果正在滚动加载数据，则不更新currentGroupName
  if (isScrolling.value) return

  // 如果有分组数据且组件已挂载
  if (groupedRecentlyAdded.value && groupedRecentlyAdded.value.length > 0) {
    // 获取外层滚动容器
    const scroller = dynamicScroller.value ? (dynamicScroller.value as any).$el : null
    if (scroller) {
      // 获取滚动位置和容器尺寸
      const scrollTop = scroller.scrollTop
      const clientHeight = scroller.clientHeight
      const scrollHeight = scroller.scrollHeight

      // 检查是否滚动到底部（距离底部小于150px）
      const distanceToBottom = scrollHeight - scrollTop - clientHeight
      if (distanceToBottom < 50) {
        onScrollEnd()
        // 接近底部时，锁定显示最后一个分组的名称
        const lastGroupIndex = groupedRecentlyAdded.value.length - 1
        if (lastGroupIndex >= 0 && visibleGroupIndex.value !== lastGroupIndex) {
          visibleGroupIndex.value = lastGroupIndex
          currentGroupName.value = groupedRecentlyAdded.value[lastGroupIndex].name
        }
        return
      }

      // 如果滚动到顶部，恢复默认标题
      if (scrollTop <= 0) {
        currentGroupName.value = ''
        visibleGroupIndex.value = 0
        return
      } else if (scrollTop > 50 && scrollTop <= 100) {
        currentGroupName.value = groupedRecentlyAdded.value[0].name
        return
      }

      // 计算每个分组的大致高度（这里需要根据实际情况调整）
      // 假设每个分组标题高度为50px，内容区域高度根据items数量和itemSize计算
      let accumulatedHeight = 0
      let currentVisibleIndex = 0

      for (let i = 0; i < groupedRecentlyAdded.value.length; i++) {
        const group = groupedRecentlyAdded.value[i]
        // 分组标题高度
        const headerHeight = 50
        // 分组内容高度（简化计算）
        const contentHeight =
          group.items.length > 0
            ? Math.ceil(group.items.length / gridItems.value) * itemSecondarySize.value
            : 0

        // 累计高度
        const groupTotalHeight = headerHeight + contentHeight + 30 // 30px是marginBottom

        // 如果滚动位置在这个分组范围内，或者稍微超出一点
        if (
          scrollTop >= accumulatedHeight - 20 &&
          scrollTop < accumulatedHeight + groupTotalHeight
        ) {
          currentVisibleIndex = i
          break
        }

        accumulatedHeight += groupTotalHeight
      }

      // 只有当可见分组索引真正改变时才更新currentGroupName
      if (visibleGroupIndex.value !== currentVisibleIndex) {
        visibleGroupIndex.value = currentVisibleIndex
        // 更新当前显示的时间分区文字
        if (groupedRecentlyAdded.value[currentVisibleIndex]) {
          currentGroupName.value = groupedRecentlyAdded.value[currentVisibleIndex].name
        }
      }
    }
  }
}
</script>

<template>
  <div class="home-wall-container">
    <n-space align="center" style="margin-top: 6px; margin-left: -3px">
      <div class="recently-add-header">
        <span class="recently-add-title">
          {{ currentGroupName || t('filter.recentlyAdded') }}
        </span>
      </div>
      <n-select
        size="small"
        style="min-width: 172px"
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
      <n-tooltip trigger="hover" placement="top">
        <template #trigger>
          <n-button quaternary circle @click="onRefreshSharp">
            <template #icon>
              <n-icon :size="20" :depth="2"><RefreshSharp /></n-icon>
            </template>
          </n-button>
        </template>
        {{ $t('common.refresh') }}
      </n-tooltip>
      <n-tooltip trigger="hover" placement="top">
        <template #trigger>
          <n-button
            quaternary
            circle
            @click="
              () => {
                dynamicScroller.$el.scrollTop = 0
              }
            "
          >
            <template #icon>
              <n-icon :size="20" :depth="2"><PaddingTop20Filled /></n-icon>
            </template>
          </n-button>
        </template>
        {{ $t('action.moveToTop') }}
      </n-tooltip>
      <n-tooltip trigger="hover" placement="top">
        <template #trigger>
          <n-button
            quaternary
            circle
            @click="
              () => {
                dynamicScroller.$el.scrollTop = dynamicScroller.$el.scrollHeight
              }
            "
          >
            <template #icon>
              <n-icon :size="20" :depth="2"><PaddingDown20Filled /></n-icon>
            </template>
          </n-button>
        </template>
        {{ $t('action.moveToBottom') }}
      </n-tooltip>
    </n-space>

    <n-space vertical class="category-recently-add-section">
      <div 
        v-if="!groupedRecentlyAdded || groupedRecentlyAdded.length === 0" 
        class="empty-state"
        style="
        margin-left: 10px;margin-top: 10px;
        height: calc(100vh - 218px);
        "
        :style="{
          width: `calc(100vw - ${collapsed_width - 8}px)`,
        }"
      >
<!--        <n-icon :size="60" :depth="2">-->
<!--          <BrowserNotSupportedTwotone />-->
<!--        </n-icon>-->
<!--        <div class="empty-title">{{ $t('nsmusics.view_page.no_subtitle_search_results_found') }}</div>-->
<!--        <div class="empty-description">{{ $t('nsmusics.view_page.no_subtitle_search_results_found_description') }}</div>-->
      </div>
      <DynamicScroller
        v-else
        ref="dynamicScroller"
        style="scroll-behavior: smooth"
        :style="{
          height: 'calc(100vh - 208px)',
        }"
        :items="groupedRecentlyAdded"
        :minItemSize="50"
        :emit-update="true"
        :key="groupedRecentlyAddedKey"
        key-field="name"
        @resize="onResize"
        @update="onUpdate"
        @scroll-start="onScrollStart"
        @scroll="onScroll"
        @scroll-end="onScrollEnd"
      >
        <template #before> </template>
        <template #after> </template>
        <template #default="{ item: group, index: groupIndex, active }">
          <DynamicScrollerItem
            :item="group"
            :active="active"
            :data-index="groupIndex"
            :data-active="active"
          >
            <!-- 时间分组标签 -->
            <div class="category-recently-add-header">
              <span class="category-recently-add-title">
                {{ group.name }}
              </span>
            </div>

            <!-- 对应的时间分组DynamicScroller -->
            <DynamicScroller
              class="home-wall"
              :style="{
                width: `calc(100vw - ${collapsed_width - 18}px)`,
                marginBottom: '30px',
              }"
              :items="group.items"
              :itemSize="itemSize"
              :minItemSize="itemSize"
              :grid-items="gridItems"
              :item-secondary-size="itemSecondarySize"
              :emit-update="true"
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
                                  before_rating = item.rating === 1 ? true : (false as boolean)
                                }
                              "
                              @after-rate="
                                (value: number) => {
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
                              <icon v-if="item.favorite" :size="20" color="red"
                                ><Heart28Filled
                              /></icon>
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

            <!-- 占位 -->
            <div style="margin-top: -18px; width: 20px; height: 1px"></div>
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

<style scoped>
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

.category-recently-add-section {
  margin-top: 10px;
}

.recently-add-header {
  width: auto;
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  border: none;
  text-align: left;
}

.recently-add-title {
  display: inline-block;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-color-1);
  background-color: var(--card-color);
  border-left: 4px solid var(--primary-color-hover);
  border-radius: 4px 8px 8px 4px;
  padding: 8px 16px;
  margin: 0 0 0 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-recently-add-header {
  width: auto;
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  border: none;
  text-align: left;
  margin: 16px 0 -4px -3px;
}

.category-recently-add-title {
  display: inline-block;
  font-size: 16px;
  font-weight: 700;
  color: var(--text-color-1);
  background-color: var(--card-color);
  border-left: 4px solid var(--primary-color-hover);
  border-radius: 4px 8px 8px 4px;
  padding: 8px 16px;
  margin: 0 0 0 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.home-wall {
  display: flex;
  flex-direction: row;
  scroll-behavior: smooth;
  scrollbar-width: none;
  overflow-x: auto;
  margin-top: 10px;
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
.home-artist-name,
.home-created-time {
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

.home-created-time {
  color: var(--text-color-3);
  font-size: 12px;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--card-color);
  border-radius: 18px;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.02);
}
.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-color-1);
  margin-bottom: 8px;
}
.empty-description {
  font-size: 16px;
  color: var(--text-color-3);
  max-width: 300px;
  line-height: 1.4;
}

</style>