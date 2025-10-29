<script setup lang="ts">
////// this_view resource of vicons_svg
import {
  ArrowSort24Regular,
  PlayCircle24Regular,
  Heart24Regular,
  Heart28Filled,
  Open28Filled,
  PaddingDown20Filled,
  PaddingTop20Filled,
  Play24Filled,
  Play24Regular,
  Search20Filled,
  Star24Regular,
  Star28Filled,
  TextSortAscending20Regular,
  TextSortDescending20Regular,
  Grid24Regular,
  DataTreemap24Regular,
} from '@vicons/fluent'
import { RefreshSharp } from '@vicons/ionicons5'
import { Random } from '@vicons/fa'

////// this_view views_components of navie ui
import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { type InputInst, NButton, NIcon, useMessage, useThemeVars } from 'naive-ui'
import { Icon } from '@vicons/utils'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
import { usePageArtistStore } from '@/data/data_status/app_status/page_status/artist_store/usePageArtistStore'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_history_data_of_artist } from '@/router/router_store/store_router_history_data_of_artist'
import { store_general_fetch_artist_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_artist/store_general_fetch_artist_list'
import { store_general_fetch_artist_tree } from '@/data/data_stores/server_api_stores/server_api_core/page/page_artist/store_general_fetch_artist_tree'

////// i18n auto lang
import { useI18n } from 'vue-i18n'
import error_artist from '@/assets/img/error_artist.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
////// changed_data write to sqlite
import { store_local_data_set_artistInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_artistInfo'

import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { storeToRefs } from 'pinia'

import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
////// right menu
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { store_local_data_set_mediaInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_mediaInfo'
import { store_local_data_set_albumInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_albumInfo'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
import { usePagePlayerTagModifyStore } from '@/data/data_status/app_status/page_status/player_store/usePagePlayerTagModifyStore'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { store_general_model_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'
import { debounce } from 'lodash'
import { MultipleStopOutlined } from '@vicons/material'
import { store_general_fetch_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import { TracingChannel } from 'node:diagnostics_channel'
import { BorderBottom } from '@vicons/carbon'

const { t } = useI18n({
  inheritLocale: true,
})

const pageMediaStore = usePageMediaStore()
const pageArtistStore = usePageArtistStore()
const playerSettingStore = usePlayerSettingStore()
const playerTagModifyStore = usePagePlayerTagModifyStore()
const { page_artistlists_multi_sort, page_artistlists_selected, page_artistlists_options } =
  storeToRefs(pageArtistStore)

////// artistlist_view page_layout gridItems
const item_artist = ref(160)
const item_artist_image = ref(item_artist.value - 20)
const item_artist_txt = ref(item_artist.value - 20)
const itemSize = ref(220)
const gridItems = ref(5)
const itemSecondarySize = ref(185)
const errorHandled = ref(new Map())
const handleImageError = async (item: any) => {
  let result_src = error_artist
  if (errorHandled.value.has(item.id)) {
    item.medium_image_url = result_src
    return
  }
  errorHandled.value.set(item.id, true)
  ///
  if (isElectron) {
    const originalSrc = item.medium_image_url
    try {
      const newImagePath = await ipcRenderer.invoke('window-get-imagePath', originalSrc)
      if (newImagePath.length > 0) {
        item.medium_image_url = newImagePath
      } else {
        item.medium_image_url = result_src
      }
    } catch (error) {
      console.error('Error handling image error:', error)
      item.medium_image_url = result_src
    }
  } else {
    item.medium_image_url = error_artist
  }
}
function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href
}
// gridItems Re render
const collapsed_width = ref(145)
const stopWatching_window_innerWidth = watch(
  () => store_system_configs_info.window_innerWidth,
  () => {
    updateGridItems()
  }
)
const updateGridItems = () => {
  collapsed_width.value = 145
  if (window.innerWidth > 2460) {
    const num = window.innerWidth / 7.53
    itemSize.value = Math.floor(num) + 40
    item_artist.value = Math.floor(num)
    item_artist_image.value = item_artist.value - 20
    item_artist_txt.value = item_artist.value - 20
    gridItems.value = 7
    itemSecondarySize.value =
      Math.floor(window.innerWidth - (collapsed_width.value - 40)) / gridItems.value - 2
  } else if (window.innerWidth > 1660) {
    const num = window.innerWidth / 6.53
    itemSize.value = Math.floor(num) + 40
    item_artist.value = Math.floor(num)
    item_artist_image.value = item_artist.value - 20
    item_artist_txt.value = item_artist.value - 20
    gridItems.value = 6
    itemSecondarySize.value =
      Math.floor(window.innerWidth - (collapsed_width.value - 40)) / gridItems.value - 2
  } else {
    const num = window.innerWidth / 5.53
    itemSize.value = Math.floor(num) + 40
    item_artist.value = Math.floor(num)
    item_artist_image.value = item_artist.value - 20
    item_artist_txt.value = item_artist.value - 20
    gridItems.value = 5
    itemSecondarySize.value =
      Math.floor(window.innerWidth - (collapsed_width.value - 40)) / gridItems.value - 2
  }
  if (
    store_server_user_model.model_server_type_of_web &&
    store_server_users.server_select_kind === 'ninesong'
  ) {
    itemSize.value += 35
  }
}
onMounted(() => {
  updateGridItems()
  input_search_Value.value = pageArtistStore.page_artistlists_keyword
  if (input_search_Value.value.length > 0) {
    bool_show_search_area.value = true
    bool_input_search = true
  } else {
    bool_show_search_area.value = false
    bool_input_search = false
  }
})
// gridItems Sort
enum state_Sort {
  Ascend = 'ascend',
  Descend = 'descend',
  Default = 'default',
}
type SortItem = {
  label: string
  key: string
  state_Sort: state_Sort
}
const options_Sort_key = ref<SortItem[]>()
if (
  store_server_user_model.model_server_type_of_local ||
  (store_server_users.server_select_kind === 'navidrome' &&
    store_server_user_model.model_server_type_of_web)
) {
  options_Sort_key.value = [
    {
      label: computed(() => t('entity.artist_other')),
      key: 'name',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('entity.album_other')),
      key: 'album_count',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('filter.songCount')),
      key: 'song_count',
      state_Sort: state_Sort.Default,
    },
  ]
} else if (
  store_server_user_model.model_server_type_of_web &&
  (store_server_users.server_select_kind === 'jellyfin' ||
    store_server_users.server_select_kind === 'emby')
) {
  options_Sort_key.value = []
} else if (
  store_server_user_model.model_server_type_of_web &&
  store_server_users.server_select_kind === 'ninesong'
) {
  options_Sort_key.value = [
    {
      label: computed(() => t('entity.artist_other')),
      key: 'name',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('entity.album_other')),
      key: 'album_count',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('filter.songCount')),
      key: 'song_count',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('filter.playCount')),
      key: 'play_count',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('common.favorite') + t('LabelLevel')),
      key: 'rating',
      state_Sort: state_Sort.Default,
    },
    { label: computed(() => t('LabelSize')), key: 'size', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('common.favorite') + t('LabelDate')),
      key: 'starred_at',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('filter.dateAdded')),
      key: 'created_at',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('filter.recentlyUpdated')),
      key: 'updated_at',
      state_Sort: state_Sort.Default,
    },
  ]
}
let Select_Sort_Model = false
const options_Sort = computed(() => {
  if (
    pageArtistStore.page_artistlists_options_Sort_key != null &&
    pageArtistStore.page_artistlists_options_Sort_key.length > 0
  ) {
    options_Sort_key.value.forEach((element) => {
      if (element.key === pageArtistStore.page_artistlists_options_Sort_key[0].columnKey)
        if (pageArtistStore.page_artistlists_options_Sort_key[0].order === state_Sort.Ascend)
          element.state_Sort = state_Sort.Ascend
        else if (pageArtistStore.page_artistlists_options_Sort_key[0].order === state_Sort.Descend)
          element.state_Sort = state_Sort.Descend
    })
  }
  return options_Sort_key.value.map((item) => {
    let icon: any
    switch (item.state_Sort) {
      case state_Sort.Ascend:
        icon = TextSortAscending20Regular
        break
      case state_Sort.Descend:
        icon = TextSortDescending20Regular
        break
      case state_Sort.Default:
        icon = ArrowSort24Regular
        break
    }
    return {
      label: item.label,
      key: item.key,
      icon() {
        return h(NIcon, null, {
          default: () => h(icon),
        })
      },
    }
  })
})
const handleSelect_Sort = (key: string | number) => {
  pageArtistStore.page_artistlists_multi_sort = ''
  updateSortConditions()
  //
  let _state_Sort_: state_Sort = state_Sort.Default
  let idx: number = -1
  for (let i = 0; i < options_Sort_key.value.length; i++) {
    if (options_Sort_key.value[i].key === key) {
      _state_Sort_ = options_Sort_key.value[i].state_Sort
      idx = i
    } else {
      options_Sort_key.value[i].state_Sort = state_Sort.Default
    }
  }
  switch (_state_Sort_) {
    case state_Sort.Ascend:
      options_Sort_key.value[idx].state_Sort = state_Sort.Default
      _state_Sort_ = state_Sort.Default
      break
    case state_Sort.Descend:
      options_Sort_key.value[idx].state_Sort = state_Sort.Ascend
      _state_Sort_ = state_Sort.Ascend
      break
    case state_Sort.Default:
      options_Sort_key.value[idx].state_Sort = state_Sort.Descend
      _state_Sort_ = state_Sort.Descend
      break
  }
  pageArtistStore.page_artistlists_options_Sort_key = [
    {
      columnKey: String(key),
      order: _state_Sort_,
    },
  ]

  const sortKey =
    pageArtistStore.page_artistlists_options_Sort_key.length > 0 &&
    pageArtistStore.page_artistlists_options_Sort_key[0].order !== 'default'
      ? pageArtistStore.page_artistlists_options_Sort_key[0].columnKey
      : 'id'
  const sortOrder =
    pageArtistStore.page_artistlists_options_Sort_key.length > 0 &&
    pageArtistStore.page_artistlists_options_Sort_key[0].order !== 'default'
      ? pageArtistStore.page_artistlists_options_Sort_key[0].order.replace('end', '')
      : ''
  Select_Sort_Model = !(
    (sortKey === '_id' || sortKey === 'id') &&
    (sortOrder === '' || sortOrder === 'ascend')
  )

  scrollTo(0)
}
const options_Sort_key_Default_key = ref()
const options_Sort_key_Default = ref<SortItem[]>()
// gridItems Search(filter)
const bool_show_search_area = ref(false)
const show_search_area = () => {
  if (bool_show_search_area.value) {
    bool_show_search_area.value = false
    input_search_InstRef.value?.clear()
    if (bool_input_search) {
      // pageArtistStore.list_data_StartUpdate = true
      back_search_default()
      bool_input_search = false
      scrollTo(0)
    }
    input_search_InstRef.value?.clear()
    pageArtistStore.page_artistlists_keyword = ''
    click_search()
  } else {
    bool_show_search_area.value = true
    options_Sort_key_Default.value = options_Sort_key.value.slice()
    options_Sort_key.value.forEach((element) => {
      //保存 sort key
      if (element.state_Sort != state_Sort.Default) options_Sort_key_Default_key.value = element.key
    })
  }
  // input_search_InstRef.value?.clear()
}
const input_search_InstRef = ref<InputInst>()
const input_search_Value = ref()
let bool_input_search = false
const click_search = () => {
  if (input_search_Value.value) {
    pageArtistStore.page_artistlists_keyword = input_search_Value.value.toLowerCase()
    bool_input_search = true
    options_Sort_key.value.forEach((element) => {
      element.state_Sort = state_Sort.Default
    })
  } else {
    pageArtistStore.list_data_StartUpdate = true
    bool_input_search = false
    back_search_default()
  }
}
const back_search_default = () => {
  if (options_Sort_key_Default.value != null) {
    options_Sort_key.value = options_Sort_key_Default.value.slice()
    for (let i = 0; i < options_Sort_key.value.length; i++) {
      if (options_Sort_key.value[i].key === options_Sort_key_Default_key.value) {
        const sortersArray: { columnKey: string; order: string }[] = []
        if (options_Sort_key.value[i].state_Sort === 'default') {
          pageArtistStore.page_artistlists_options_Sort_key = null
        } else {
          const sorter = {
            columnKey: options_Sort_key.value[i].key,
            order: options_Sort_key.value[i].state_Sort,
          }
          sortersArray.push(sorter)
          pageArtistStore.page_artistlists_options_Sort_key = sortersArray
        }
        break
      }
    }
  }
}
// lineItems Filter To Favorite
const options_Filter = ref([
  {
    label: t('nsmusics.view_page.loveArtist'),
    key: 'filter_favorite',
    icon() {
      return h(NIcon, null, {
        default: () => h(Heart28Filled),
      })
    },
  },
])

////// dynamicScroller of artistlist_view
const dynamicScroller = ref(null)
const dynamicScrollerAlbum = ref(null)
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

  store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value = viewEndIndex
}

const stopWatching_router_history_model_of_Artist_scroll = watch(
  () => store_router_history_data_of_artist.router_history_model_of_Artist_scroll,
  (newValue) => {
    if (newValue) {
      scrollTo(store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value)
      store_router_history_data_of_artist.router_history_model_of_Artist_scroll = false
    }
  }
)
const scrollTo = (value: number) => {
  try {
    // 1. 增加空值检查（null和undefined）
    if (!dynamicScroller.value) {
      console.warn('dynamicScroller未初始化')
      return
    }

    setTimeout(() => {
      // 2. 再次检查防止异步期间组件卸载[3](@ref)
      if (!dynamicScroller.value) return

      // 3. 安全计算滚动位置（添加边界保护）
      const windowHeight = window.innerHeight
      const baseOffset = 20
      const referenceHeight = 765
      const itemHeight = 220

      const skipItems = Math.max(0, Math.floor((windowHeight - referenceHeight) / itemHeight))

      const index = Math.max(0, value - (baseOffset + skipItems))

      // 4. 添加方法存在性检查[1](@ref)
      if (dynamicScroller.value.scrollToItem) {
        dynamicScroller.value.scrollToItem(index)
      }
    }, 100)
  } catch {}
}
onMounted(() => {
  if (store_server_user_model.model_server_type_of_local) {
    scrollTo(store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value)
  }
})

////// select Dtatsource of artistlists
const breadcrumbItems = ref('所有歌手')
const page_artistlists_handleselected_updatevalue = (value: any) => {
  pageArtistStore.page_artistlists_selected = value
  console.log('selected_value_for_artistlistall：' + value)
  breadcrumbItems.value =
    pageArtistStore.page_artistlists_options.find((option) => option.value === value)?.label || ''
}

////// go to media_view
const Open_this_artist_all_artist_list_click = (artist_id: string) => {
  if (store_server_user_model.model_server_type_of_web) {
    store_general_fetch_media_list.set_artist_id(artist_id)
    pageMediaStore.page_songlists_selected = 'song_list_all'
    store_general_fetch_album_list.set_artist_id(artist_id)
    pageAlbumStore.page_albumlists_selected = 'album_list_all'
  }
  if (
    (store_server_users.server_select_kind != 'jellyfin' &&
      store_server_users.server_select_kind != 'emby') ||
    store_server_user_model.model_server_type_of_local
  ) {
    console.log('artist_list_of_artist_id_artist_click：' + artist_id)
    store_router_data_logic.get_album_list_of_artist_id_by_artist_info(artist_id)
  } else {
    playerAppearanceStore.player_mode_of_medialist_from_external_import = false
    pageMediaStore.page_songlists_keyword = artist_id
    store_router_data_info.router.push('media')
  }
}
const Play_this_artist_all_media_list_click = async (artist_id: string) => {
  if (store_server_user_model.model_server_type_of_web) {
    store_general_fetch_media_list.set_artist_id(artist_id)
    pageMediaStore.page_songlists_selected = 'song_list_all'
    store_general_fetch_album_list.set_artist_id(artist_id)
    pageAlbumStore.page_albumlists_selected = 'album_list_all'
    store_server_user_model.random_play_model = false
  }
  console.log('play_this_artist_song_list：' + artist_id)
  await store_general_fetch_artist_list.fetchData_This_Artist_MediaList(artist_id)
  playlistStore.reset_carousel()
}

const handleItemClick_Favorite = (id: any, favorite: boolean) => {
  store_local_data_set_artistInfo.Set_ArtistInfo_To_Favorite(id, favorite)
  page_artistlists_statistic.value.forEach((item: any) => {
    if (item.id === 'artist_list_love') {
      artist_starred_count.value += !favorite ? 1 : -1
      item.artist_count = artist_starred_count.value + ' *'
    }
  })
}
const handleItemClick_Favorite_Tree = (id: any, favorite: boolean, type: string) => {
  if (type === 'media') store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id, favorite)
  else if (type === 'album') store_local_data_set_albumInfo.Set_AlbumInfo_To_Favorite(id, favorite)
  else if (type === 'artist')
    store_local_data_set_artistInfo.Set_ArtistInfo_To_Favorite(id, favorite)
}
let before_rating = false
let after_rating = false
const handleItemClick_Rating = (id_rating: any) => {
  const [id, rating] = id_rating.split('-')
  if (after_rating) {
    store_local_data_set_artistInfo.Set_ArtistInfo_To_Rating(id, 0)
  } else {
    store_local_data_set_artistInfo.Set_ArtistInfo_To_Rating(id, rating)
  }
}
const handleItemClick_Rating_Tree = (id_rating: any, type: string) => {
  const [id, rating] = id_rating.split('-')
  if (after_rating) {
    if (type === 'media') store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, 0)
    else if (type === 'album') store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, 0)
    else if (type === 'artist') store_local_data_set_artistInfo.Set_ArtistInfo_To_Rating(id, 0)
  } else {
    if (type === 'media') store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, rating)
    else if (type === 'album') store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, rating)
    else if (type === 'artist') store_local_data_set_artistInfo.Set_ArtistInfo_To_Rating(id, rating)
  }

  if (type === 'media') {
    artist_Tree_Album_Tree_temporary.value.map((item: any) => {
      item.mediaFiles.map((media: any) => {
        if (media.id === id) {
          media.rating = rating
          return
        }
      })
    })
  }
}

/// multi_level_sort
interface SortCondition {
  key: string
  order: string
}
const allSortKeys = computed(() => [
  { label: t('entity.artist_other'), value: 'name' },
  { label: t('entity.album_other'), value: 'album_count' },
  { label: t('filter.songCount'), value: 'song_count' },
  { label: t('filter.playCount'), value: 'play_count' },
  { label: t('common.favorite') + t('LabelLevel'), value: 'rating' },
  { label: t('LabelSize'), value: 'size' },
  { label: t('common.favorite') + t('LabelDate'), value: 'starred_at' },
  { label: t('filter.dateAdded'), value: 'created_at' },
  { label: t('filter.recentlyUpdated'), value: 'updated_at' },
])
const allSortOrders = computed(() => [
  { label: t('Ascending'), value: 'asc' },
  { label: t('Descending'), value: 'desc' },
])
const Type_Multi_Sort = ref(false)
const conditionCount = ref(3)
const sortConditions = ref<SortCondition[]>([])
const initializeConditions = () => {
  const currentLength = sortConditions.value.length
  const targetLength = conditionCount.value

  // 减少条件数量：截断数组
  if (targetLength < currentLength) {
    sortConditions.value = sortConditions.value.slice(0, targetLength)
  }
  // 增加条件数量：添加新条件
  else if (targetLength > currentLength) {
    const newConditions = Array(targetLength - currentLength)
      .fill(null)
      .map(() => ({ key: '', order: '' }))
    sortConditions.value = [...sortConditions.value, ...newConditions]
  } else {
    sortConditions.value.forEach((condition) => {
      condition.key = ''
      condition.order = ''
    })
  }
}
const stopWatching_conditionCount = watch(conditionCount, (newCount) => {
  if (newCount > allSortKeys.value.length) {
    conditionCount.value = allSortKeys.value.length
    return
  }
  initializeConditions()
  updateStoreSortParam()
})
const usedKeys = computed(() =>
  sortConditions.value.map((condition) => condition.key).filter((key) => key)
)
const getAvailableKeysForIndex = (index: number) => {
  const currentKey = sortConditions.value[index].key
  return allSortKeys.value.map((option) => {
    const isUsed = usedKeys.value.includes(option.value) && option.value !== currentKey
    return {
      ...option,
      disabled: isUsed,
    }
  })
}
const generateSortQuery = () => {
  const validConditions = sortConditions.value.filter(
    (condition) => condition.key && condition.order
  )
  return validConditions.map((condition) => `sort=${condition.key}:${condition.order}`).join('&')
}
const updateStoreSortParam = () => {
  pageArtistStore.page_artistlists_multi_sort = generateSortQuery()
}
const handleKeyChange = (value: string, index: number) => {
  sortConditions.value[index].key = value
  if (value) {
    sortConditions.value[index].order = 'asc' // 默认升序
  } else {
    sortConditions.value[index].order = ''
  }
  updateStoreSortParam()
}
const handleOrderChange = (value: string, index: number) => {
  sortConditions.value[index].order = value
  updateStoreSortParam()
}
const parseSortQuery = (query: string): SortCondition[] => {
  if (!query) return []

  const conditions: SortCondition[] = []
  const params = new URLSearchParams(query)

  const sortValues = params.getAll('sort')
  for (const value of sortValues) {
    const [key, order] = value.split(':')
    if (key && (order === 'asc' || order === 'desc')) {
      conditions.push({ key, order })
    }
  }
  return conditions
}
const updateSortConditions = () => {
  const storedQuery = pageArtistStore.page_artistlists_multi_sort

  if (storedQuery) {
    // 解析存储的排序条件
    const parsedConditions = parseSortQuery(storedQuery)

    if (parsedConditions.length > 0) {
      // 更新条件数量和排序条件
      conditionCount.value = parsedConditions.length
      sortConditions.value = parsedConditions
    } else {
      // 存储值无效时回退默认初始化
      initializeConditions()
    }
  } else {
    // 无存储值时使用默认初始化
    initializeConditions()
  }
}
onMounted(() => {
  updateSortConditions()
})

const contextmenu_artist = ref(null)
const contextmenu_album = ref(null)
const contextmenu_media = ref(null)
const menu_item_add_to_songlist = computed(() => t('form.addToPlaylist.title'))
const message = useMessage()
const themeVars = useThemeVars()

async function update_playlist_addArtist(id: any, playlist_id: any, type: string) {
  try {
    if (store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong') {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_all_parms()
      if (type === 'artist') {
        await store_general_fetch_media_list.fetchData_Media_Find_This_Artist(id)
      } else if (type === 'album') {
        await store_general_fetch_media_list.fetchData_Media_Find_This_Album(id)
      } else if (type === 'media') {
        await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(id, playlist_id)
        ////
        message.success(t('common.add'))
        store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()
        return
      }
    } else {
      await store_general_fetch_media_list.fetchData_Media_Find_This_Artist(id)
    }

    const matchingIds: string[] = []
    pageMediaStore.media_Files_temporary.forEach((item: Media_File) => {
      if (type === 'artist') {
        if (item.artist_id === id) {
          matchingIds.push(item.id)
        }
      } else if (type === 'album') {
        if (item.album_id === id) {
          matchingIds.push(item.id)
        }
      }
    })
    pageMediaStore.media_Files_temporary = []
    for (let item_id of matchingIds) {
      await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(item_id, playlist_id)
    }
    ////
    message.success(t('common.add'))
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()
  } catch (e) {
    console.error(e)
  }
}
async function menu_artist_item_add_to_playlist_end() {
  await store_general_fetch_media_list.fetchData_Media_Find_This_Artist(playlist_Menu_Item_Id.value)
  const matchingItems = pageMediaStore.media_Files_temporary.filter(
    (item: Media_File) => item.artist_id === playlist_Menu_Item_Id.value
  )

  pageMediaStore.media_Files_temporary = []

  for (let item of matchingItems) {
    const newItem: any = JSON.parse(JSON.stringify(item))
    newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
    playlistStore.playlist_MediaFiles_temporary.push(newItem)
    playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.push(newItem.id)
  }

  playlistStore.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
    item.absoluteIndex = index
  })
  store_system_configs_save.save_system_playlist_item_id_config()
  contextmenu_artist.value.hide()
}
async function menu_artist_item_add_to_playlist_next() {
  await store_general_fetch_media_list.fetchData_Media_Find_This_Artist(playlist_Menu_Item_Id.value)
  const matchingItems = pageMediaStore.media_Files_temporary.filter(
    (item: Media_File) => item.artist_id === playlist_Menu_Item_Id.value
  )

  pageMediaStore.media_Files_temporary = []

  const index = playlistStore.playlist_MediaFiles_temporary.findIndex(
    (item: any) => item.id === playerAudioStore.this_audio_song_id
  )

  if (index !== -1) {
    matchingItems.forEach((item: Media_File, i: number) => {
      const newItem = JSON.parse(JSON.stringify(item))
      newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
      playlistStore.playlist_MediaFiles_temporary.splice(index + 1 + i, 0, newItem)
      playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.splice(index + 1 + i, 0, newItem.id)
    })

    playlistStore.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
      item.absoluteIndex = index
    })
    store_system_configs_save.save_system_playlist_item_id_config()
    contextmenu_artist.value.hide()
  } else {
    console.error('Current audio song not found in playlist')
  }
}
async function menu_album_item_add_to_playlist_end() {
  await store_general_fetch_media_list.fetchData_Media_Find_This_Album(playlist_Menu_Item_Id.value)
  const matchingItems = pageMediaStore.media_Files_temporary.filter(
    (item: Media_File) => item.album_id === playlist_Menu_Item_Id.value
  )

  pageMediaStore.media_Files_temporary = []

  for (let item of matchingItems) {
    const newItem: any = JSON.parse(JSON.stringify(item))
    newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
    playlistStore.playlist_MediaFiles_temporary.push(newItem)
    playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.push(newItem.id)
  }

  playlistStore.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
    item.absoluteIndex = index
  })
  store_system_configs_save.save_system_playlist_item_id_config()
  contextmenu_album.value.hide()
}
async function menu_album_item_add_to_playlist_next() {
  await store_general_fetch_media_list.fetchData_Media_Find_This_Album(playlist_Menu_Item_Id.value)
  const matchingItems = pageMediaStore.media_Files_temporary.filter(
    (item: Media_File) => item.album_id === playlist_Menu_Item_Id.value
  )

  pageMediaStore.media_Files_temporary = []

  const index = playlistStore.playlist_MediaFiles_temporary.findIndex(
    (item: any) => item.id === playerAudioStore.this_audio_song_id
  )

  if (index !== -1) {
    matchingItems.forEach((item: Media_File, i: number) => {
      const newItem = JSON.parse(JSON.stringify(item))
      newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
      playlistStore.playlist_MediaFiles_temporary.splice(index + 1 + i, 0, newItem)
      playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.splice(index + 1 + i, 0, newItem.id)
    })

    playlistStore.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
      item.absoluteIndex = index
    })
    store_system_configs_save.save_system_playlist_item_id_config()
    contextmenu_album.value.hide()
  } else {
    console.error('Current audio song not found in playlist')
  }
}
async function menu_media_item_add_to_playlist_end() {
  const item: Media_File | undefined = pageMediaStore.media_Files_temporary.find(
    (mediaFile: Media_File) => mediaFile.id === playlist_Menu_Item_Id.value
  )
  if (item != undefined && item != 'undefined') {
    const newItem: any = JSON.parse(JSON.stringify(item))
    newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
    playlistStore.playlist_MediaFiles_temporary.push(newItem)
    playlistStore.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
      item.absoluteIndex = index
    })

    playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.push(newItem.id)

    store_system_configs_save.save_system_playlist_item_id_config()

    contextmenu_media.value.hide()
  }
}
async function menu_media_item_add_to_playlist_next() {
  const item: Media_File | undefined = pageMediaStore.media_Files_temporary.find(
    (mediaFile: Media_File) => mediaFile.id === playlist_Menu_Item_Id.value
  )
  if (item != undefined && item != 'undefined') {
    let index = playlistStore.playlist_MediaFiles_temporary.findIndex(
      (item: any) => item.id === playerAudioStore.this_audio_song_id
    )

    const newItem: any = JSON.parse(JSON.stringify(item))
    newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
    playlistStore.playlist_MediaFiles_temporary.splice(index + 1, 0, newItem)

    playlistStore.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
      item.absoluteIndex = index
    })

    playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.splice(index + 1, 0, newItem.id)

    store_system_configs_save.save_system_playlist_item_id_config()

    contextmenu_media.value.hide()
  }
}

function menu_item_edit_selected_media_tags() {
  playerTagModifyStore.player_show_tag_kind = 'artist'
  const item: Album | undefined = artist_Files_temporary.value.find(
    (artist: Album) => artist.id === playlist_Menu_Item_Id.value
  )
  if (item != undefined && item != 'undefined') {
    playerTagModifyStore.player_current_artist_id = item.id
    playerTagModifyStore.player_show_tag_modify = true
    contextmenu_artist.value.hide()
  }
}

//////
const isScrolling = ref(false)
const onScrollStart = () => {}
const onScrollEnd = async () => {
  if (isScrolling.value) return
  isScrolling.value = true
  if (store_server_user_model.model_server_type_of_web) {
    await store_general_fetch_artist_list.fetchData_Artist_of_server_web_end()
  }
  isScrolling.value = false
}
const onScroll = async () => {}

const page_artistlists_statistic = ref<
  {
    label: ''
    artist_count: ''
    id: ''
  }[]
>([])
function Refresh_page_artistlists_statistic() {
  page_artistlists_statistic.value = []
  pageArtistStore.page_artistlists_statistic.forEach((item: any, index: number) => {
    page_artistlists_statistic.value.push({
      label: pageArtistStore.page_artistlists_statistic[index].label,
      artist_count: pageArtistStore.page_artistlists_statistic[index].artist_count,
      id: pageArtistStore.page_artistlists_statistic[index].id,
    })
  })
}
onMounted(() => {
  Refresh_page_artistlists_statistic()
})
const stopWatching_boolHandleItemClick_Played = watch(
  () => playerSettingStore.boolHandleItemClick_Played,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      Refresh_page_artistlists_statistic()
      playerSettingStore.boolHandleItemClick_Played = false
    }
  },
  { immediate: true }
)

const onRefreshSharp = debounce(async (event, args) => {
  await store_general_fetch_artist_list.fetchData_Artist()
  if (
    store_server_user_model.model_server_type_of_web &&
    store_server_users.server_select_kind === 'ninesong'
  ) {
    if (
      pageArtistStore.artist_Files_temporary != undefined &&
      pageArtistStore.artist_Files_temporary.length > 0
    ) {
      store_general_fetch_artist_tree._artist_id = pageArtistStore.artist_Files_temporary[0].id
      await store_general_fetch_artist_tree.fetchData_ArtistTree()
    }
  }
}, 500)

//
async function findThisArtistTree(artist_id: string) {
  store_general_fetch_artist_tree._artist_id = artist_id
  await store_general_fetch_artist_tree.fetchData_ArtistTree()
}
const onScrollEndArtistTree = async () => {
  if (isScrolling.value) return
  isScrolling.value = true
  if (store_server_user_model.model_server_type_of_web) {
    if (
      pageArtistStore.artist_Files_temporary != undefined &&
      pageArtistStore.artist_Files_temporary.length > 0
    ) {
      await store_general_fetch_artist_tree.fetchData_ArtistTree_of_server_web_end()
    }
  }
  isScrolling.value = false
}

////// view artistlist_view Remove data
onBeforeUnmount(() => {
  stopWatching_boolHandleItemClick_Played()
  stopWatching_router_history_model_of_Artist_scroll()
  stopWatching_window_innerWidth()
  stopWatching_conditionCount()
  dynamicScroller.value = null
})

//////
const playAlbumSongs = async (album_id: string) => {
  if (!album_id) return
}
let click_count = 0;
let click_timer: any = null;

const handleItemClick = () => {
  click_count++;
  if (click_timer) {
    clearTimeout(click_timer);
  }
  click_timer = setTimeout(() => {
    click_count = 0;
  }, 300);
}
const handleItemDbClick = async (media_file: any, index: number) => {
  if (click_timer) {
    clearTimeout(click_timer);
  }
  click_count = 0;
  //
  if (store_server_user_model.model_server_type_of_web) {
    store_general_fetch_media_list.fetchData_Media_of_data_synchronization_to_playlist()
    store_server_user_model.random_play_model = false
  }
  await playerSettingStore.update_current_media_info(media_file, index)
  playerAppearanceStore.player_mode_of_lock_playlist = false
  playerAudioStore.this_audio_restart_play = true
  //
  playlistStore.media_page_handleItemDbClick = true
  store_general_fetch_player_list.fetchData_PlayList(false)
  playlistStore.reset_carousel()
}

// 在setup上下文中获取Store实例
const playlistStore = usePlaylistStore()
const playerAudioStore = usePlayerAudioStore()
const playerAppearanceStore = usePlayerAppearanceStore()
const pageAlbumStore = usePageAlbumStore()
// 使用 storeToRefs 解构出所需的响应式属性
const { playlist_names_ALLLists, playlist_Menu_Item_Id, playlist_Menu_Item, playlist_Menu_Item_Rating } =
  storeToRefs(playlistStore)
const { page_top_album_image_url, this_audio_artist_name, this_audio_song_id } =
  storeToRefs(playerAudioStore)
const {
  artist_Files_temporary,
  artist_starred_count,
  artist_Tree_Album_Tree_temporary,
  artist_Tree_Artist_info,
} = storeToRefs(pageArtistStore)

// 处理专辑树数据，确保每个item都有唯一的id
const processedAlbumTreeData = computed(() => {
  if (!artist_Tree_Album_Tree_temporary.value) return []

  return artist_Tree_Album_Tree_temporary.value.map((item, index) => {
    // 确保每个item都有一个唯一的id属性
    return {
      ...item,
      id: item.album?.id || `album-${index}`, // 使用album的id，如果没有则使用索引
    }
  })
})

function scrollerAlbumStart() {
  if (dynamicScrollerAlbum.value && dynamicScrollerAlbum.value.$el) {
    dynamicScrollerAlbum.value.$el.style.scrollBehavior = 'auto'
    dynamicScrollerAlbum.value.$el.scrollTop = 0
    setTimeout(() => {
      if (dynamicScrollerAlbum.value && dynamicScrollerAlbum.value.$el) {
        dynamicScrollerAlbum.value.$el.style.scrollBehavior = 'smooth'
      }
    }, 100)
  }
}
function scrollerAlbumEnd() {
  if (dynamicScrollerAlbum.value && dynamicScrollerAlbum.value.$el) {
    dynamicScrollerAlbum.value.$el.style.scrollBehavior = 'auto'
    dynamicScrollerAlbum.value.$el.scrollTop = dynamicScrollerAlbum.value.$el.scrollHeight
    setTimeout(() => {
      if (dynamicScrollerAlbum.value && dynamicScrollerAlbum.value.$el) {
        dynamicScrollerAlbum.value.$el.style.scrollBehavior = 'smooth'
      }
    }, 100)
  }
}

/// 
onMounted(() => {
  if (store_server_user_model.model_server_type_of_local || 
  (store_server_user_model.model_server_type_of_web && 
  store_server_users.server_select_kind != 'ninesong' && 
  pageArtistStore.page_view_model === 'tree')) {
    pageArtistStore.page_view_model = 'grid'
  }
})
</script>
<template>
  <n-space vertical :size="12">
    <div class="artist-wall-container">
      <n-space
        justify="space-between"
        @wheel.prevent
        :style="{
          width: 'calc(100vw - ' + (collapsed_width - 25) + 'px)',
        }"
        style="position: absolute; top: 0; margin-top: 3px"
      >
        <n-space align="center">
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-select
                size="small"
                :value="page_artistlists_selected"
                :options="page_artistlists_options"
                style="width: 181px; margin-left: 10px"
                @update:value="page_artistlists_handleselected_updatevalue"
              />
            </template>
            {{ $t('Select') + $t('LabelPlaylist') }}
          </n-tooltip>

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
          <n-divider
            vertical
            style="
              width: 2px;
              height: 20px;
              margin-top: -4px;
              margin-left: 10px;
              margin-right: 10px;
            "
          />
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary circle @click="show_search_area">
                <template #icon>
                  <n-icon :size="20"><Search20Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('Search') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top" v-if="bool_show_search_area">
            <template #trigger>
              <n-input-group style="width: 144px;">
                <n-input
                  style="width: 144px;"
                  ref="input_search_InstRef"
                  v-model:value="input_search_Value"
                  @keydown.enter="click_search"
                />
              </n-input-group>
            </template>
            {{ $t('setting.hotkey_localSearch') }}
          </n-tooltip>

          <n-dropdown
            v-if="
              store_server_users.server_select_kind != 'jellyfin' &&
              store_server_users.server_select_kind != 'emby' &&
              !(
                store_server_user_model.model_server_type_of_web &&
                pageArtistStore.page_artistlists_selected === 'artist_list_recently'
              )
            "
            trigger="click"
            :show-arrow="true"
            :options="options_Sort"
            @select="handleSelect_Sort"
          >
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-badge v-if="Select_Sort_Model" dot value="1" :offset="[-18, 5]">
                  <n-button quaternary circle>
                    <template #icon>
                      <n-icon :size="20" :depth="2"><ArrowSort24Regular /></n-icon>
                    </template>
                  </n-button>
                </n-badge>
                <n-button v-else quaternary circle>
                  <template #icon>
                    <n-icon :size="20" :depth="2"><ArrowSort24Regular /></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('LabelSortOrder') }}
            </n-tooltip>
          </n-dropdown>

          <n-tooltip
            trigger="hover"
            placement="top"
            v-if="
              store_server_user_model.model_server_type_of_web &&
              store_server_users.server_select_kind === 'ninesong'
            "
          >
            <template #trigger>
              <n-badge
                v-if="page_artistlists_multi_sort.length > 0"
                dot
                value="1"
                :offset="[-18, 5]"
              >
                <n-button quaternary circle style="rotate: 90deg" @click="Type_Multi_Sort = true">
                  <template #icon>
                    <n-icon :size="20" :depth="2"><MultipleStopOutlined /></n-icon>
                  </template>
                </n-button>
              </n-badge>
              <n-button
                v-else
                quaternary
                circle
                style="rotate: 90deg"
                @click="Type_Multi_Sort = true"
              >
                <template #icon>
                  <n-icon :size="20" :depth="2"><MultipleStopOutlined /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('OptionCustomUsers') + $t('nsmusics.view_page.multi_level_sort') }}
          </n-tooltip>

          <n-divider
            vertical
            style="
              width: 2px;
              height: 20px;
              margin-top: -4px;
              margin-left: 10px;
              margin-right: 10px;
            "
          />
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary circle 
              @click="dynamicScroller.$el.scrollTop = 0">
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
                @click="dynamicScroller.$el.scrollTop = dynamicScroller.$el.scrollHeight"
              >
                <template #icon>
                  <n-icon :size="20" :depth="2"><PaddingDown20Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('action.moveToBottom') }}
          </n-tooltip>
        </n-space>
        <n-space align="center">
          <div v-if="!bool_show_search_area">
            NineSong:
          </div>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary circle
                :style="{
                  borderBottom: pageArtistStore.page_view_model === 'grid' ? '4px solid var(--primary-color-hover)' : 'none'
                }"
                :disabled="!(store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong')"
                @click="pageArtistStore.page_view_model = 'grid'">
                <template #icon>
                  <n-icon :size="20" :depth="2"><Grid24Regular /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('GridView') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary circle
                :style="{
                  borderBottom: pageArtistStore.page_view_model === 'tree' ? '4px solid var(--primary-color-hover)' : 'none'
                }"
                :disabled="!(store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong')"
                @click="pageArtistStore.page_view_model = 'tree'">
                <template #icon>
                  <n-icon :size="20" :depth="2"><DataTreemap24Regular /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('nsmusics.view_page.tree_level_view') }}
          </n-tooltip>
          <n-divider
            vertical
            style="
              width: 2px;
              height: 20px;
              margin-top: -4px;
              margin-left: 10px;
              margin-right: -6px;
            "
          />
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary circle 
              style="position: relative; left: 17px"
              :disabled="!(store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong')"
              @click="store_general_fetch_artist_tree.fetchData_ArtistTree()">
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
                style="position: relative; left: 9px"
                :disabled="!(store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong')"
                @click="scrollerAlbumStart"
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
                style="position: relative; left: 0px"
                :disabled="!(store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong')"
                @click="scrollerAlbumEnd"
              >
                <template #icon>
                  <n-icon :size="20" :depth="2"><PaddingDown20Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('action.moveToBottom') }}
          </n-tooltip>
        </n-space>
      </n-space>
      <n-space style="display: flex; flex-direction: row">
        <DynamicScroller
          v-if="pageArtistStore.page_view_model === 'tree'"
          class="artist-wall"
          ref="dynamicScroller"
          :style="{
            width: '250px',
            height: 'calc(100vh - 188px)',
            marginTop: '40px',
          }"
          :items="artist_Files_temporary"
          :minItemSize="50"
          :emit-update="true"
          key-field="absoluteIndex"
          @resize="onResize"
          @update="onUpdate"
          @scroll-start="onScrollStart"
          @scroll-end="onScrollEnd"
          @scroll="onScroll"
        >
          <template #before> </template>
          <template #after> </template>
          <template #default="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
              v-contextmenu:contextmenu_artist
              @contextmenu.prevent="
                () => {
                  playlist_Menu_Item = item.album || item
                  playlist_Menu_Item_Id = item.album?.id || item.id
                }
              "
              @click="
                () => {
                  playlist_Menu_Item = item
                  playlist_Menu_Item_Id = item.id
                  findThisArtistTree(item.id)
                }
              "
            >
              <div
                :key="item.id"
                class="artist_info"
                style="margin-top: 20px; margin-left: 10px; display: flex; align-items: center"
                :style="{ width: '225px' }"
              >
                <img
                  :src="item.medium_image_url"
                  @error="handleImageError(item)"
                  style="width: 46px; height: 46px; margin-left: 6px; border-radius: 50%"
                  alt=""
                />
                <span class="artist-name" style="margin-left: 8px; width: 150px">
                  {{ item.name }}
                </span>
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
        <DynamicScroller
          v-if="pageArtistStore.page_view_model === 'tree'"
          ref="dynamicScrollerAlbum"
          style="position: relative; left: 14px"
          :style="{
            width: 'calc(100vw - ' + (collapsed_width - 35 + 270) + 'px)',
            height: 'calc(100vh - 188px)',
            marginTop: '40px',
            marginLeft: '-10px',
            scrollBehavior: 'smooth',
          }"
          :items="processedAlbumTreeData"
          :minItemSize="50"
          :emit-update="true"
          :key="artist_Tree_Artist_info?.id"
          key-field="id"
          @scroll-end="onScrollEndArtistTree"
        >
          <template #before>
            <!-- 艺术家信息头部 -->
            <div
              class="artist-header-info"
              v-contextmenu:contextmenu_artist
              @contextmenu.prevent="
                () => {
                  playlist_Menu_Item = artist_Tree_Artist_info
                  playlist_Menu_Item_Id = artist_Tree_Artist_info?.id
                }
              "
              :style="{
                width: 'calc(100vw - ' + (collapsed_width - 35 + 295) + 'px)',
                marginLeft: '10px',
              }"
            >
              <!-- 第一行：艺术家名和操作按钮 -->
              <div class="artist-header-row">
                <div class="artist-name-section">
                  <span class="artist-main-name">{{ artist_Tree_Artist_info?.name }}</span>
                </div>
                <div class="artist-action-buttons">
                  <!-- 播放按钮 -->
                  <button
                    class="album-play-button"
                    style="position: relative; left: 6px"
                    @click="Play_this_artist_all_media_list_click(artist_Tree_Artist_info?.id)"
                  >
                    <icon :size="20"><Play24Filled /></icon>
                  </button>
                  <button
                    class="album-play-button"
                    style="position: relative; left: 13px"
                    @click="playAlbumSongs(artist_Tree_Artist_info?.id)"
                  >
                    <icon :size="16"><Random /></icon>
                  </button>
                  <button
                    class="love-button"
                    style="position: relative; left: 13px"
                    @click="
                      () => {
                        handleItemClick_Favorite_Tree(
                          artist_Tree_Artist_info?.id,
                          artist_Tree_Artist_info?.favorite,
                          'artist'
                        )
                        if (artist_Tree_Artist_info){
                          artist_Tree_Artist_info.favorite = !artist_Tree_Artist_info.favorite
                        }
                      }
                    "
                  >
                    <template v-if="artist_Tree_Artist_info?.favorite">
                      <icon :size="20" color="red"><Heart28Filled /></icon>
                    </template>
                    <template v-else-if="!store_system_configs_info.update_theme">
                      <icon color="#101014" :size="20"><Heart24Regular /></icon>
                    </template>
                    <template v-else-if="store_system_configs_info.update_theme">
                      <icon color="#FAFAFC" :size="20"><Heart24Regular /></icon>
                    </template>
                  </button>
                  <!-- 评分星级按钮 -->
                  <div style="margin-top: -9px">
                    <rate
                      class="viaSlot"
                      style="position: relative; left: 0"
                      :length="5"
                      :model-value="artist_Tree_Artist_info?.rating || 0"
                      @before-rate="
                        () => {
                          before_rating = (artist_Tree_Artist_info?.rating || 0) === 1
                        }
                      "
                      @after-rate="
                        (value) => {
                          if (artist_Tree_Artist_info) {
                            after_rating =
                              (artist_Tree_Artist_info.rating || 0) === 1 && before_rating
                            handleItemClick_Rating_Tree(
                              `${artist_Tree_Artist_info.id || ''}-${value}`,
                              'artist'
                            )
                            if (after_rating) {
                              artist_Tree_Artist_info.rating = 0
                              after_rating = false
                            }
                          }
                        }
                      "
                    />
                  </div>
                </div>
              </div>

              <!-- 第二行：专辑和歌曲统计信息 -->
              <div class="artist-stats-row">
                <div class="artist-stats-container">
                  <div class="artist-stat-item">
                    <span class="stat-label">{{ $t('entity.track_other') }}</span>
                    <span class="stat-value">{{ artist_Tree_Artist_info?.song_count || 0 }}</span>
                  </div>
                  <div class="artist-stat-item">
                    <span class="stat-label">{{
                      $t('nsmusics.view_page.guest') + $t('entity.track_other')
                    }}</span>
                    <span class="stat-value">{{
                      artist_Tree_Artist_info?.guest_song_count || 0
                    }}</span>
                  </div>
                  <div class="artist-stat-item">
                    <span class="stat-label">{{ $t('entity.album_other') }}</span>
                    <span class="stat-value">{{ artist_Tree_Artist_info?.album_count || 0 }}</span>
                  </div>
                  <div class="artist-stat-item">
                    <span class="stat-label">{{
                      $t('nsmusics.view_page.guest') + $t('entity.album_other')
                    }}</span>
                    <span class="stat-value">{{
                      artist_Tree_Artist_info?.guest_album_count || 0
                    }}</span>
                  </div>
                  <div class="artist-stat-item">
                    <span class="stat-label">{{ $t('nsmusics.view_page.disk') }}</span>
                    <span class="stat-value">{{ artist_Tree_Artist_info?.cue_count || 0 }}</span>
                  </div>
                  <div class="artist-stat-item">
                    <span class="stat-label">{{
                      $t('nsmusics.view_page.guest') + $t('nsmusics.view_page.disk')
                    }}</span>
                    <span class="stat-value">{{
                      artist_Tree_Artist_info?.guest_cue_count || 0
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #after> </template>
          <template #default="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
              :style="{
                width: 'calc(100vw - ' + (collapsed_width - 35 + 295) + 'px)',
                marginLeft: '10px',
              }"
            >
              <!-- 重构后的专辑列表项 -->
              <div class="artist-album-item-container" :key="item.album?.id">
                <!-- 左侧专辑封面 -->
                <div class="artist-album-cover-section">
                  <img
                    :src="item.album?.medium_image_url"
                    @error="handleImageError(item.album)"
                    class="artist-album-cover-image"
                    v-contextmenu:contextmenu_album
                @contextmenu.prevent="
                  () => {
                    playlist_Menu_Item = item.album
                    playlist_Menu_Item_Id = item.album.id
                  }
                "
                    alt=""
                  />
                  <div style="margin-left: 1px; margin-top: 8px">
                    {{ item.album.song_count - 1 + '首歌曲，' + item.album.duration_txt + '分钟' }}
                  </div>
                </div>

                <!-- 右侧专辑信息 -->
                <div class="artist-album-info-section">
                  <!-- 专辑名称和操作按钮 -->
                  <div class="artist-album-header">
                    <span class="artist-album-name">{{ item.album?.name }}</span>
                    <div class="artist-album-actions">
                      <!-- 播放按钮 -->
                      <button
                        class="album-play-button"
                        style="position: relative; left: 11px"
                        @click="()=>{
                          pageMediaStore.media_Files_temporary = item.mediaFiles
                          handleItemDbClick(item.mediaFiles[0], 0)
                        }"
                      >
                        <icon :size="18"><Play24Filled /></icon>
                      </button>

                      <button
                        class="love-button"
                        style="position: relative; left: 10px"
                        @click="
                          () => {
                            handleItemClick_Favorite_Tree(
                              item.album?.id,
                              item.album?.favorite,
                              'album'
                            )
                            if (item.album) item.album.favorite = !item.album.favorite
                          }
                        "
                      >
                        <template v-if="item.album?.favorite">
                          <icon :size="20" color="red"><Heart28Filled /></icon>
                        </template>
                        <template v-else-if="!store_system_configs_info.update_theme">
                          <icon color="#101014" :size="20"><Heart24Regular /></icon>
                        </template>
                        <template v-else-if="store_system_configs_info.update_theme">
                          <icon color="#FAFAFC" :size="20"><Heart24Regular /></icon>
                        </template>
                      </button>

                      <!-- 评分星级按钮 -->
                      <div style="margin-top: -9px">
                        <rate
                          class="viaSlot"
                          style="position: relative; left: -2px"
                          :length="5"
                          :model-value="item.album?.rating || 0"
                          @before-rate="
                            () => {
                              before_rating = (item.album?.rating || 0) === 1
                            }
                          "
                          @after-rate="
                            (value) => {
                              after_rating = (item.album?.rating || 0) === 1 && before_rating
                              handleItemClick_Rating_Tree(
                                `${item.album?.id || ''}-${value}`,
                                'album'
                              )
                              if (after_rating) {
                                if (item.album) item.album.rating = 0
                                after_rating = false
                              }
                            }
                          "
                        />
                      </div>
                    </div>
                  </div>

                  <!-- 专辑年份 -->
                  <div class="artist-album-year">
                    {{ item.album?.min_year || item.album?.max_year || 'Unknown Year' }}
                  </div>

                  <!-- 专辑歌曲列表 -->
                  <div class="artist-album-songs-list">
                    <!-- 这里将加载该专辑的所有歌曲 -->
                    <div
                      v-for="(song, songIndex) in item.mediaFiles || []"
                      :key="song.id"
                      class="song-item"
                      v-contextmenu:contextmenu_media
                      @contextmenu.prevent="
                        () => {
                          pageMediaStore.media_Files_temporary = item.mediaFiles
                          playlist_Menu_Item = song
                          playlist_Menu_Item_Id = song.id
                          playlist_Menu_Item_Rating = song.rating
                        }
                      "
                      @click="handleItemClick"
                      @dblclick="()=>{
                        pageMediaStore.media_Files_temporary = item.mediaFiles
                        handleItemDbClick(song, songIndex)
                      }"
                    >
                      <span class="song-track-number">{{ songIndex + 1 }}.</span>
                      <span class="song-title">{{ song.title }}</span>
                      <div class="song-item-actions">
                        <button 
                        class="song-play-button"
                        @click="()=>{
                          pageMediaStore.media_Files_temporary = item.mediaFiles
                          handleItemDbClick(song, songIndex)
                        }"
                        >
                          <icon :size="18"><Play24Regular /></icon>
                        </button>
                        <button
                          class="song-love-button"
                          @click="
                            () => {
                              handleItemClick_Favorite_Tree(song.id, song.favorite, 'media')
                              song.favorite = !song.favorite
                            }
                          "
                        >
                          <template v-if="song.favorite">
                            <icon :size="18" color="red"><Heart28Filled /></icon>
                          </template>
                          <template v-else-if="!store_system_configs_info.update_theme">
                            <icon color="#101014" :size="18"><Heart24Regular /></icon>
                          </template>
                          <template v-else-if="store_system_configs_info.update_theme">
                            <icon color="#FAFAFC" :size="18"><Heart24Regular /></icon>
                          </template>
                        </button>
                      </div>
                      <span class="song-duration">{{ song.duration_txt }}</span>
                    </div>

                    <!-- 如果歌曲列表为空，显示加载提示 -->
                    <div v-if="!(item.mediaFiles || []).length" class="songs-loading">
                      Loading songs...
                    </div>
                  </div>
                </div>
              </div>
              <!-- 占位 -->
              <div style="margin-top: 10px; width: 20px; height: 1px"></div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
        <DynamicScroller
          v-if="pageArtistStore.page_view_model === 'grid'"
          class="artist-wall"
          ref="dynamicScroller"
          :style="{
            width: 'calc(100vw - ' + (collapsed_width - 35) + 'px)',
            height: 'calc(100vh - 188px)',
            marginTop: '37px',
          }"
          :items="artist_Files_temporary"
          :itemSize="itemSize"
          :minItemSize="itemSize"
          :grid-items="gridItems"
          :item-secondary-size="itemSecondarySize"
          :emit-update="true"
          @resize="onResize"
          @update="onUpdate"
          @scroll-start="onScrollStart"
          @scroll-end="onScrollEnd"
          @scroll="onScroll"
        >
          <template #before>
            <div class="notice">
              <div
                :style="{ width: 'calc(100vw - ' + (collapsed_width - 19) + 'px)' }"
                style="
                  position: absolute;
                  top: 10px;
                  z-index: 0;
                  height: 100vh;
                  border-radius: 10px;
                  overflow: hidden;
                  background-size: cover;
                  background-position: center;
                  filter: blur(0px);
                  background-color: transparent;
                "
              >
                <img
                  :style="{
                    width: 'calc(100vw - ' + (collapsed_width + 180) + 'px)',
                    height: 'calc(100vw - ' + (collapsed_width + 180) + 'px)',
                    minHeight: '280px',
                    WebkitMaskImage:
                      'linear-gradient(to top, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 1) 100%)',
                  }"
                  style="
                    margin-left: 200px;
                    transform: translateY(-25%);
                    object-fit: cover;
                    object-position: center;
                  "
                  :src="getAssetImage(playerAudioStore.page_top_album_image_url)"
                  alt=""
                />
              </div>
              <n-page-header
                style="
                  position: relative;
                  z-index: 1;
                  width: calc(100vw);
                  height: 300px;
                  border-radius: 10px;
                  margin-left: 12px;
                  margin-bottom: -20px;
                "
              >
                <template #title>
                  <n-space
                    vertical
                    justify="end"
                    align="start"
                    style="height: 280px; margin-left: 10px; margin-top: -6px"
                  >
                    <n-space vertical>
                      <n-space>
                        <div style="font-size: 26px; font-weight: 600">
                          {{ $t('entity.artist_other') + ':' }}
                        </div>
                      </n-space>
                      <n-space style="margin-top: -8px">
                        <div
                          :style="{
                            maxWidth: 'calc(100vw - ' + (collapsed_width + 540) + 'px)',
                          }"
                          style="
                            text-align: left;
                            cursor: pointer;
                            font-size: 26px;
                            font-weight: 600;
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 1;
                            overflow: hidden;
                            text-overflow: ellipsis;
                          "
                        >
                          {{ this_audio_artist_name }}
                        </div>
                      </n-space>
                    </n-space>
                    <n-space vertical style="margin-top: 4px">
                      <n-space
                        align="center"
                        style="
                          border-left: 4px solid var(--primary-color-hover);
                          border-radius: 3px;
                        "
                      >
                        <div style="font-size: 15px; font-weight: 600; margin-left: 13px">
                          {{ $t('GuideProviderSelectListings') + ':' }}
                        </div>
                        <n-tooltip trigger="hover" placement="top">
                          <template #trigger>
                            <n-select
                              size="small"
                              :value="page_artistlists_selected"
                              :options="page_artistlists_options"
                              style="width: 166px"
                              @update:value="page_artistlists_handleselected_updatevalue"
                            />
                          </template>
                          {{ $t('Select') + $t('LabelPlaylist') }}
                        </n-tooltip>
                      </n-space>
                      <n-space
                        vertical
                        justify="center"
                        style="
                          margin-top: 14px;
                          padding-left: 14px;
                          border-left: 4px solid var(--primary-color-hover);
                          border-radius: 3px;
                        "
                      >
                        <n-grid
                          :cols="4"
                          :x-gap="40"
                          :y-gap="10"
                          layout-shift-disabled
                          style="width: 478px; margin-top: 4px"
                        >
                          <n-gi
                            v-for="artistlist in page_artistlists_statistic"
                            :key="artistlist.id"
                          >
                            <n-statistic
                              :label="artistlist.label"
                              :value="artistlist.artist_count"
                            />
                          </n-gi>
                        </n-grid>
                      </n-space>
                    </n-space>
                  </n-space>
                </template>
                <template #header> </template>
                <template #avatar>
                  <img
                    style="
                      width: 280px;
                      height: 280px;
                      border-radius: 12px;
                      object-fit: cover;
                      margin-left: -3px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                    "
                    :src="getAssetImage(page_top_album_image_url)"
                    alt=""
                  />
                </template>
                <template #extra> </template>
                <template #footer> </template>
              </n-page-header>
            </div>
          </template>
          <template #after> </template>
          <template #default="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-index="index"
              v-contextmenu:contextmenu_artist
              @contextmenu.prevent="
                () => {
                  playlist_Menu_Item = item
                  playlist_Menu_Item_Id = item.id
                }
              "
            >
              <div :key="item.id" class="artist" style="margin-top: 20px">
                <div
                  class="artist-cover-container"
                  :style="{
                    width: `${item_artist_image}px`,
                    height: `${item_artist_image}px`,
                  }"
                >
                  <img
                    class="artist-cover-image"
                    :src="item.medium_image_url"
                    @error="handleImageError(item)"
                    :style="{
                      width: `${item_artist_image}px`,
                      height: `${item_artist_image}px`,
                    }"
                    alt=""
                  />
                  <div
                    class="hover-overlay-artist"
                    @dblclick="Open_this_artist_all_artist_list_click(item.id)"
                  >
                    <div class="hover-content-artist">
                      <button
                        class="play-this-artist-button"
                        @click="Play_this_artist_all_media_list_click(item.id)"
                      >
                        <icon :size="42" color="#FFFFFF"><PlayCircle24Regular /></icon>
                      </button>
                      <div
                        class="hover-buttons-top-artist"
                        v-if="
                          (store_server_users.server_select_kind != 'jellyfin' &&
                            store_server_users.server_select_kind != 'emby') ||
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
                      <div class="hover-buttons-bottom-artist">
                        <button
                          v-if="
                            store_server_user_model.model_server_type_of_local ||
                            (store_server_users.server_select_kind !== 'jellyfin' &&
                              store_server_users.server_select_kind !== 'emby')
                          "
                          class="open-this-artist-button"
                          @click="Open_this_artist_all_artist_list_click(item.id)"
                        >
                          <icon :size="20" color="#FFFFFF"><Open28Filled /></icon>
                        </button>
                        <button
                          class="love-this-artist-button"
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
                <div :style="{ width: item_artist_image + 'px' }">
                  <div :style="{ width: item_artist_txt + 'px' }">
                    <div>
                      <span
                        class="artist-name"
                        :style="{
                          maxWidth: item_artist_txt + 'px',
                          textAlign:
                            store_server_users.server_select_kind != 'navidrome'
                              ? 'center'
                              : 'left',
                        }"
                      >
                        {{ item.name }}
                      </span>
                    </div>
                    <n-space
                      justify="space-between"
                      :style="{ width: item_artist_image + 'px' }"
                      v-if="
                        (store_server_users.server_select_kind != 'jellyfin' &&
                          store_server_users.server_select_kind != 'emby') ||
                        store_server_user_model.model_server_type_of_local
                      "
                    >
                      <span>
                        {{ $t('entity.track_other') + ': ' + item.song_count }}
                      </span>
                      <span
                        v-if="
                          store_server_user_model.model_server_type_of_web &&
                          store_server_users.server_select_kind === 'ninesong'
                        "
                      >
                        {{
                          $t('nsmusics.view_page.guest') +
                          $t('entity.track_other') +
                          ': ' +
                          item.guest_song_count
                        }}
                      </span>
                      <span v-else>
                        {{ $t('entity.album_other') + ': ' + item.album_count }}
                      </span>
                    </n-space>
                    <n-space
                      justify="space-between"
                      :style="{ width: item_artist_image + 'px' }"
                      v-if="
                        store_server_user_model.model_server_type_of_web &&
                        store_server_users.server_select_kind === 'ninesong'
                      "
                    >
                      <span>
                        {{ $t('entity.album_other') + ': ' + item.album_count }}
                      </span>
                      <span>
                        {{
                          $t('nsmusics.view_page.guest') +
                          $t('entity.album_other') +
                          ': ' +
                          item.guest_album_count
                        }}
                      </span>
                    </n-space>
                    <n-space
                      justify="space-between"
                      :style="{ width: item_artist_image + 'px' }"
                      v-if="
                        store_server_user_model.model_server_type_of_web &&
                        store_server_users.server_select_kind === 'ninesong'
                      "
                    >
                      <span>
                        {{ $t('nsmusics.view_page.disk') + ': ' + item.cue_count }}
                      </span>
                      <span>
                        {{
                          $t('nsmusics.view_page.guest') +
                          $t('nsmusics.view_page.disk') +
                          ': ' +
                          item.guest_cue_count
                        }}
                      </span>
                    </n-space>
                  </div>
                </div>
              </div>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller>
      </n-space>
      <v-contextmenu
        ref="contextmenu_artist"
        class="v-contextmenu-item v-contextmenu-item--hover"
        style="z-index: 999"
      >
        <v-contextmenu-submenu :title="menu_item_add_to_songlist">
          <v-contextmenu-item
            v-for="n in playlist_names_ALLLists"
            :key="n.value"
            @click="update_playlist_addArtist(playlist_Menu_Item_Id, n.value, 'artist')"
          >
            {{ n.label }}
          </v-contextmenu-item>
        </v-contextmenu-submenu>
        <v-contextmenu-divider />
        <v-contextmenu-item @click="menu_artist_item_add_to_playlist_end">
          {{ $t('player.addLast') }}
        </v-contextmenu-item>
        <v-contextmenu-item @click="menu_artist_item_add_to_playlist_next">
          {{ $t('player.addNext') }}
        </v-contextmenu-item>
        <v-contextmenu-item
          v-if="
            store_server_users.server_select_kind === 'navidrome' ||
            store_server_user_model.model_server_type_of_local
          "
          @click="menu_item_edit_selected_media_tags"
        >
          {{ $t('page.contextMenu.showDetails') }}
        </v-contextmenu-item>
      </v-contextmenu>
      <v-contextmenu
        ref="contextmenu_album"
        class="v-contextmenu-item v-contextmenu-item--hover"
        style="z-index: 999"
      >
        <v-contextmenu-submenu :title="menu_item_add_to_songlist">
          <v-contextmenu-item
            v-for="n in playlist_names_ALLLists"
            :key="n.value"
            @click="update_playlist_addArtist(playlist_Menu_Item_Id, n.value, 'album')"
          >
            {{ n.label }}
          </v-contextmenu-item>
        </v-contextmenu-submenu>
        <v-contextmenu-divider />
        <v-contextmenu-item @click="menu_album_item_add_to_playlist_end">
          {{ $t('player.addLast') }}
        </v-contextmenu-item>
        <v-contextmenu-item @click="menu_album_item_add_to_playlist_next">
          {{ $t('player.addNext') }}
        </v-contextmenu-item>
      </v-contextmenu>
      <v-contextmenu
        ref="contextmenu_media"
        class="v-contextmenu-item v-contextmenu-item--hover"
        style="z-index: 999"
      >
        <v-contextmenu-submenu :title="menu_item_add_to_songlist">
          <v-contextmenu-item
            v-for="n in playlist_names_ALLLists"
            :key="n.value"
            @click="update_playlist_addArtist(playlist_Menu_Item_Id, n.value, 'media')"
          >
            {{ n.label }}
          </v-contextmenu-item>
        </v-contextmenu-submenu>
        <v-contextmenu-divider />
        <v-contextmenu-item @click="menu_media_item_add_to_playlist_end">
          {{ $t('player.addLast') }}
        </v-contextmenu-item>
        <v-contextmenu-item @click="menu_media_item_add_to_playlist_next">
          {{ $t('player.addNext') }}
        </v-contextmenu-item>
        <v-contextmenu-divider/>
        <v-contextmenu-item>
          <rate
            class="viaSlot"
            style="margin-left: -12px; margin-top: -12px; height: 16px"
            :length="5"
            v-model="playlist_Menu_Item_Rating"
            @before-rate="
              (value) => {
                if (playlist_Menu_Item_Rating == 1) {
                  before_rating = true
                }
              }
            "
            @after-rate="
              (value) => {
                if (playlist_Menu_Item_Rating == 1 && before_rating == true) {
                  after_rating = true
                  before_rating = false
                }
                handleItemClick_Rating_Tree(playlist_Menu_Item_Id + '-' + value, 'media')
                if (after_rating) {
                  if (playlist_Menu_Item_Rating === playerAudioStore.this_audio_song_id) {
                    playerAudioStore.this_audio_song_rating = 0
                  }
                  playlist_Menu_Item_Rating = 0
                  after_rating = false
                }
              }
            "
          />
        </v-contextmenu-item>
      </v-contextmenu>

      <n-modal transform-origin="mouse" v-model:show="Type_Multi_Sort">
            <n-card style="width: 450px; border-radius: 4px">
              <n-space justify="space-between" align="center" style="margin-bottom: 10px">
                <span style="font-size: 20px; font-weight: 600">
                  {{ $t('OptionCustomUsers') + $t('nsmusics.view_page.multi_level_sort') }}
                </span>
              </n-space>
              <n-space justify="space-between" align="center" style="margin-bottom: 10px">
                {{ pageArtistStore.page_artistlists_multi_sort }}
              </n-space>
              <n-space vertical size="large" style="width: 400px; margin-bottom: 12px">
                <n-space justify="space-between" v-for="(_, index) in sortConditions" :key="index">
                  <n-select
                    style="width: 300px"
                    :options="getAvailableKeysForIndex(index)"
                    v-model:value="sortConditions[index].key"
                    @update:value="(value) => handleKeyChange(value, index)"
                    :placeholder="$t('SelectSortField')"
                  />
                  <n-select
                    style="width: 80px"
                    :options="allSortOrders"
                    v-model:value="sortConditions[index].order"
                    :disabled="!sortConditions[index].key"
                    @update:value="(value) => handleOrderChange(value, index)"
                  />
                </n-space>
              </n-space>
              <n-space
                size="large"
                align="center"
                justify="space-between"
                style="width: 400px; margin-bottom: 6px"
              >
                <n-space>
                  <n-button
                    secondary
                    strong
                    @click="
                      () => {
                        pageArtistStore.page_artistlists_multi_sort = ''
                        updateSortConditions()
                      }
                    "
                  >
                    {{ $t('common.clear') + $t('Sort') }}
                  </n-button>
                </n-space>
                <n-space align="center">
                  <span style="font-size: 14px; font-weight: 500; margin-right: 8px">
                    {{ $t('Sort') + $t('nsmusics.view_page.count') }}
                  </span>
                  <n-input-number
                    v-model:value="conditionCount"
                    :min="0"
                    :max="allSortKeys.length"
                    style="width: 80px"
                  />
                </n-space>
              </n-space>
            </n-card>
      </n-modal>
    </div>
  </n-space>
</template>
<style scoped>
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

.artist-wall-container {
  width: 100%;
  height: 100%;
  padding-right: 20px;
  overflow: hidden;

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

.artist-wall {
  overflow-y: auto;
  width: calc(100vw - 200px);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.artist {
  float: left;
  flex-direction: column;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.artist:hover {
  transform: translateY(-10px);
}
.artist:hover .artist-name {
  color: var(--primary-color-hover);
}
.artist:nth-child(1) {
  margin-left: 8px;
}

.artist-cover-container {
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.artist-cover-image {
  object-fit: cover;
  object-position: center;
  border: 1.5px solid #ffffff20;
  border-radius: 10px;
}

.hover-overlay-artist {
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

.artist:hover .hover-overlay-artist {
  opacity: 1;
}

.hover-content-artist {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.play-this-artist-button,
.open-this-artist-button,
.love-this-artist-button {
  border: 0;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-this-artist-button:hover,
.open-this-artist-button:hover,
.love-this-artist-button:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
}

.play-this-artist-button {
  width: 50px;
  height: 50px;
}

.play-this-artist-button .icon {
  margin-left: -2px;
  margin-top: 3px;
}

.hover-buttons-top-artist {
  position: absolute;
  top: 4px;
  left: 4px;
  width: auto;
}

.hover-buttons-bottom-artist {
  position: absolute;
  bottom: 8px;
  right: 14px;
  display: flex;
  gap: 8px;
}

.open-this-artist-button,
.love-this-artist-button {
  width: 28px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.open-this-artist-button .icon,
.love-this-artist-button .icon {
  margin: 0;
}

.artist-name {
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist_info {
  height: 60px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border-radius: 8px; /* iOS-style rounded corners */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); /* Subtle initial shadow */
}
.artist_info:hover {
  transform: scale(1.01); /* Slight zoom on hover */
  box-shadow: 0 0 10px 0 var(--scrollbar-color);
  z-index: 10;
  position: relative;
  background-color: var(--card-color); /* Use a variable for background */
}
.artist_info:hover .artist-name {
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--primary-color-hover);
}
.artist_info:nth-child(1) {
  margin-top: 8px;
}

/* 艺术家信息头部样式 */
.artist-header-info {
  border-radius: 8px;
  padding: 15px 25px 25px 25px;
  background-color: var(--card-color);
  position: relative;
  top: 20px;
  margin-bottom: 26px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.artist-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.artist-name-section {
  flex: 1;
}

.artist-main-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-color-1);
  cursor: pointer;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;
  left: -2px;
}

.album-play-button {
  border: 0;
  background-color: var(--primary-color-hover);
  color: white;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
}

.album-play-button:hover {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.love-button {
  border: 0;
  background-color: transparent;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.artist-stats-row {
  border-top: 1px solid var(--border-color);
  padding-top: 15px;
  margin-top: 10px;
}

.artist-stats-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: left;
  padding: 8px 0;
}

.artist-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  padding: 10px 12px;
  background-color: var(--card-color);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}
.artist-stat-item:nth-child(1) {
  border-left: 4px solid var(--primary-color-hover);
  border-radius: 3px;
}

.artist-stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.stat-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-color-2);
  margin-bottom: 4px;
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color-hover);
  text-align: center;
}

/* 重构后的专辑列表项样式 */
.artist-album-item-container {
  display: flex;
  flex-direction: row;
  padding: 25px;
  border-radius: 16px;
  background-color: var(--card-color);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  margin-bottom: 25px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.artist-album-item-container:hover {
  border-color: var(--primary-color-hover);
  box-shadow: 0 0 7px 0 var(--primary-color-suppl);
}

.artist-album-item-container:nth-child(1) {
  margin-top: 25px;
}

.artist-album-item-container:last-child {
  margin-bottom: 25px;
}

.artist-album-cover-section {
  flex-shrink: 0;
  margin-right: 25px;
}

.artist-album-cover-image {
  width: 170px;
  height: 170px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}
.artist-album-cover-image:hover {
  transform: scale(1.05);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.artist-album-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.artist-album-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-shrink: 0;
}

.artist-album-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-color-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.artist-album-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.artist-album-year {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color-2);
  margin-bottom: 18px;
  flex-shrink: 0;
}

.artist-album-songs-list {
  flex: 1;
  overflow: hidden;
}

.song-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
  transition: all 0.3s ease;
}
.song-item:hover {
  /* transform: scale(1.1); */
  background-color: var(--card-color-hover);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}
.song-item:last-child {
  border-bottom: none;
}

.song-track-number {
  font-size: 15px;
  color: var(--text-color-3);
  width: 25px;
  flex-shrink: 0;
}

.song-title {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color-1);
  margin: 0 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-duration {
  font-size: 15px;
  color: var(--text-color-3);
  width: 45px;
  text-align: right;
  flex-shrink: 0;
}

.song-item-actions {
  display: flex;
  gap: 8px;
  margin-left: 12px;
  flex-shrink: 0;
}

.song-play-button {
  border: 0;
  background-color: transparent;
  cursor: pointer;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}
.song-love-button {
  border: 0;
  background-color: transparent;
  cursor: pointer;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}
.song-play-button:hover {
  transform: scale(1.1);
}
.song-love-button:hover {
  transform: scale(1.1);
}

.songs-loading {
  font-size: 15px;
  color: var(--text-color-3);
  text-align: center;
  padding: 12px 0;
}
</style>
