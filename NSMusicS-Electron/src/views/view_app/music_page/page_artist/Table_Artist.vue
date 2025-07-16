<script setup lang="ts">
////// this_view resource of vicons_svg
import {
  ArrowSort24Regular,
  Filter20Filled,
  Heart24Regular,
  Heart28Filled,
  Open28Filled,
  PaddingDown20Filled,
  PaddingTop20Filled,
  PlayCircle24Regular,
  Search20Filled,
  TextSortAscending20Regular,
  TextSortDescending20Regular,
} from '@vicons/fluent'
import { RefreshSharp } from '@vicons/ionicons5'

////// this_view views_components of navie ui
import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { type InputInst, NButton, NIcon, useMessage, useThemeVars } from 'naive-ui'
import { Icon } from '@vicons/utils'
import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info'
import { store_player_audio_info } from '@/views/view_app/music_page/page_player/store/store_player_audio_info'
import { store_view_artist_page_info } from '@/views/view_app/music_page/page_artist/store/store_view_artist_page_info'
import { store_view_artist_page_logic } from '@/views/view_app/music_page/page_artist/store/store_view_artist_page_logic'
import { store_view_album_page_logic } from '@/views/view_app/music_page/page_album/store/store_view_album_page_logic'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_history_data_of_artist } from '@/router/router_store/store_router_history_data_of_artist'
import { store_general_fetch_artist_list } from '@/data/data_stores/server/server_api_abstract/music_scene/page/page_artist/store_general_fetch_artist_list'

////// i18n auto lang
import { useI18n } from 'vue-i18n'
import error_artist from '@/assets/img/error_artist.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
////// changed_data write to sqlite
import { store_local_data_set_artistInfo } from '@/data/data_stores/local/local_data_synchronization/store_local_data_set_artistInfo'
import { store_playlist_list_info } from '@/views/view_app/music_components/player_list/store/store_playlist_list_info'
import { store_view_media_page_logic } from '@/views/view_app/music_page/page_media/store/store_view_media_page_logic'
import { store_view_media_page_info } from '@/views/view_app/music_page/page_media/store/store_view_media_page_info'
////// right menu
import { store_app_configs_logic_save } from '@/data/data_stores/app/store_app_configs_logic_save'
import { store_general_fetch_media_list } from '@/data/data_stores/server/server_api_abstract/music_scene/page/page_media_file/store_general_fetch_media_list'
import { store_local_data_set_mediaInfo } from '@/data/data_stores/local/local_data_synchronization/store_local_data_set_mediaInfo'
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model'
import { store_general_fetch_album_list } from '@/data/data_stores/server/server_api_abstract/music_scene/page/page_album/store_general_fetch_album_list'
import { store_player_tag_modify } from '@/views/view_app/music_page/page_player/store/store_player_tag_modify'
import { store_player_audio_logic } from '@/views/view_app/music_page/page_player/store/store_player_audio_logic'
import { store_server_users } from '@/data/data_stores/server/store_server_users'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_player_appearance } from '@/views/view_app/music_page/page_player/store/store_player_appearance'
import { store_general_model_player_list } from '@/data/data_stores/server/server_api_abstract/music_scene/components/player_list/store_general_model_player_list'
import { debounce } from 'lodash'
import { MultipleStopOutlined } from '@vicons/material'

const { t } = useI18n({
  inheritLocale: true,
})

////// artistlist_view page_layout gridItems
const item_artist = ref(170)
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
const collapsed_width = ref(1090)
const stopWatching_window_innerWidth = watch(
  () => store_app_configs_info.window_innerWidth,
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
  input_search_Value.value = store_view_artist_page_logic.page_artistlists_keyword
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
    store_view_artist_page_logic.page_artistlists_options_Sort_key != null &&
    store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0
  ) {
    options_Sort_key.value.forEach((element) => {
      if (
        element.key === store_view_artist_page_logic.page_artistlists_options_Sort_key[0].columnKey
      )
        if (
          store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order ===
          state_Sort.Ascend
        )
          element.state_Sort = state_Sort.Ascend
        else if (
          store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order ===
          state_Sort.Descend
        )
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
  store_view_artist_page_logic.page_artistlists_multi_sort = ''
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
  store_view_artist_page_logic.page_artistlists_options_Sort_key = [
    {
      columnKey: String(key),
      order: _state_Sort_,
    },
  ]

  const sortKey =
    store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 &&
    store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default'
      ? store_view_artist_page_logic.page_artistlists_options_Sort_key[0].columnKey
      : 'id'
  const sortOrder =
    store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 &&
    store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default'
      ? store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order.replace('end', '')
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
      // store_view_artist_page_logic.list_data_StartUpdate = true
      back_search_default()
      bool_input_search = false
      scrollTo(0)
    }
    input_search_InstRef.value?.clear()
    store_view_artist_page_logic.page_artistlists_keyword = ''
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
    store_view_artist_page_logic.page_artistlists_keyword = input_search_Value.value.toLowerCase()
    bool_input_search = true
    options_Sort_key.value.forEach((element) => {
      element.state_Sort = state_Sort.Default
    })
  } else {
    store_view_artist_page_logic.list_data_StartUpdate = true
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
          store_view_artist_page_logic.page_artistlists_options_Sort_key = null
        } else {
          const sorter = {
            columnKey: options_Sort_key.value[i].key,
            order: options_Sort_key.value[i].state_Sort,
          }
          sortersArray.push(sorter)
          store_view_artist_page_logic.page_artistlists_options_Sort_key = sortersArray
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
const onResize = () => {
  show_top_selectedlist.value = dynamicScroller.value.$el.scrollTop > 150
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

  show_top_selectedlist.value = dynamicScroller.value.$el.scrollTop > 150
}
const show_top_selectedlist = ref(false)
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
  if (dynamicScroller !== null) {
    setTimeout(() => {
      const index = value - (20 + Math.floor((window.innerHeight - 765) / 220))
      dynamicScroller.value.scrollToItem(index) // 220
    }, 100)
  }
}
onMounted(() => {
  if (store_server_user_model.model_server_type_of_local) {
    scrollTo(store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value)
  } else if (store_server_user_model.model_server_type_of_web) {
  }
})

////// select Dtatsource of artistlists
const breadcrumbItems = ref('所有歌手')
const page_artistlists_handleselected_updatevalue = (value: any) => {
  store_view_artist_page_logic.page_artistlists_selected = value
  console.log('selected_value_for_artistlistall：' + value)
  breadcrumbItems.value =
    store_view_artist_page_logic.page_artistlists_options.find((option) => option.value === value)
      ?.label || ''
}

////// router_music history
const get_router_history_model_pervious = () => {
  store_router_history_data_of_artist.get_router_history_model_of_Artist(-1)
}
const get_router_history_model_next = () => {
  store_router_history_data_of_artist.get_router_history_model_of_Artist(1)
}

////// go to media_view
const Open_this_artist_all_artist_list_click = (artist_id: string) => {
  if (store_server_user_model.model_server_type_of_web) {
    store_general_fetch_media_list.set_artist_id(artist_id)
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    store_general_fetch_album_list.set_artist_id(artist_id)
    store_view_album_page_logic.page_albumlists_selected = 'album_list_all'
  }
  if (
    (store_server_users.server_select_kind != 'jellyfin' &&
      store_server_users.server_select_kind != 'emby') ||
    store_server_user_model.model_server_type_of_local
  ) {
    console.log('artist_list_of_artist_id_artist_click：' + artist_id)
    store_router_data_logic.get_album_list_of_artist_id_by_artist_info(artist_id)
  } else {
    // Jellyfin 有相当一部分flac媒体无法识别为专辑
    store_player_appearance.player_mode_of_medialist_from_external_import = false
    store_view_media_page_logic.page_songlists_keyword = artist_id
    store_router_data_info.router.push('song')
  }
}
const Play_this_artist_all_media_list_click = async (artist_id: string) => {
  if (store_server_user_model.model_server_type_of_web) {
    store_general_fetch_media_list.set_artist_id(artist_id)
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    store_general_fetch_album_list.set_artist_id(artist_id)
    store_view_album_page_logic.page_albumlists_selected = 'album_list_all'
    store_server_user_model.random_play_model = false
  }
  console.log('play_this_artist_song_list：' + artist_id)
  await store_general_fetch_artist_list.fetchData_This_Artist_MediaList(artist_id)
  store_playlist_list_info.reset_carousel()
}

const handleItemClick_Favorite = (id: any, favorite: Boolean) => {
  store_local_data_set_artistInfo.Set_ArtistInfo_To_Favorite(id, favorite)
  page_artistlists_statistic.value.forEach((item: any) => {
    if (item.id === 'artist_list_love') {
      store_view_artist_page_info.artist_starred_count += !favorite ? 1 : -1
      item.artist_count = store_view_artist_page_info.artist_starred_count + ' *'
    }
  })
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
const availableSortKeys = computed(() => {
  const usedKeys = sortConditions.value.map((condition) => condition.key).filter((key) => key)
  return allSortKeys.value.map((group) => ({
    ...group,
    disabled: usedKeys.includes(group.value),
  }))
})
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
  store_view_artist_page_logic.page_artistlists_multi_sort = generateSortQuery()
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
  const storedQuery = store_view_artist_page_logic.page_artistlists_multi_sort

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

const contextmenu = ref(null)
const menu_item_add_to_songlist = computed(() => t('form.addToPlaylist.title'))
const message = useMessage()
const themeVars = useThemeVars()

async function update_playlist_addArtist(id: any, playlist_id: any) {
  try {
    await store_general_fetch_media_list.fetchData_Media_Find_This_Artist(id)
    const matchingIds: string[] = []
    store_view_media_page_info.media_Files_temporary.forEach((item: Media_File) => {
      if (item.artist_id === id) {
        matchingIds.push(item.id)
      }
    })
    store_view_media_page_info.media_Files_temporary = []
    for (let item_id of matchingIds) {
      ////
      await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(item_id, playlist_id)
    }
    ////
    message.success(t('common.add'))
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()
  } catch (e) {
    console.error(e)
  }
}
async function menu_item_add_to_playlist_end() {
  await store_general_fetch_media_list.fetchData_Media_Find_This_Artist(
    store_playlist_list_info.playlist_Menu_Item_Id
  )
  const matchingItems = store_view_media_page_info.media_Files_temporary.filter(
    (item: Media_File) => item.artist_id === store_playlist_list_info.playlist_Menu_Item_Id
  )

  store_view_media_page_info.media_Files_temporary = []

  for (let item of matchingItems) {
    const newItem: any = JSON.parse(JSON.stringify(item))
    newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
    store_playlist_list_info.playlist_MediaFiles_temporary.push(newItem)
    store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.push(newItem.id)
  }

  store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
    item.absoluteIndex = index
  })
  store_app_configs_logic_save.save_system_playlist_item_id_config()
  contextmenu.value.hide()
}
async function menu_item_add_to_playlist_next() {
  await store_general_fetch_media_list.fetchData_Media_Find_This_Artist(
    store_playlist_list_info.playlist_Menu_Item_Id
  )
  const matchingItems = store_view_media_page_info.media_Files_temporary.filter(
    (item: Media_File) => item.artist_id === store_playlist_list_info.playlist_Menu_Item_Id
  )

  store_view_media_page_info.media_Files_temporary = []

  const index = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex(
    (item: any) => item.id === store_player_audio_info.this_audio_song_id
  )

  if (index !== -1) {
    matchingItems.forEach((item: Media_File, i: number) => {
      const newItem = JSON.parse(JSON.stringify(item))
      newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
      store_playlist_list_info.playlist_MediaFiles_temporary.splice(index + 1 + i, 0, newItem)
      store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds.splice(
        index + 1 + i,
        0,
        newItem.id
      )
    })

    store_playlist_list_info.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
      item.absoluteIndex = index
    })
    store_app_configs_logic_save.save_system_playlist_item_id_config()
    contextmenu.value.hide()
  } else {
    console.error('Current audio song not found in playlist')
  }
}
function menu_item_edit_selected_media_tags() {
  store_player_tag_modify.player_show_tag_kind = 'artist'
  const item: Album | undefined = store_view_artist_page_info.artist_Files_temporary.find(
    (artist: Album) => artist.id === store_playlist_list_info.playlist_Menu_Item_Id
  )
  if (item != undefined && item != 'undefined') {
    store_player_tag_modify.player_current_artist_id = item.id
    store_player_tag_modify.player_show_tag_modify = true
    contextmenu.value.hide()
  }
}

//////
const isScrolling = ref(false)
const onScrollStart = () => {
  show_top_selectedlist.value = false
}
const onScrollEnd = async () => {
  if (isScrolling.value) return
  isScrolling.value = true
  if (store_server_user_model.model_server_type_of_web) {
    await store_general_fetch_artist_list.fetchData_Artist_of_server_web_end()
  }
  isScrolling.value = false
}
const onScroll = async () => {
  show_top_selectedlist.value = dynamicScroller.value.$el.scrollTop > 150
}

const page_artistlists_statistic = ref<
  {
    label: ''
    artist_count: ''
    id: ''
  }[]
>([])
function Refresh_page_artistlists_statistic() {
  page_artistlists_statistic.value = []
  store_view_artist_page_logic.page_artistlists_statistic.forEach((item: any, index: number) => {
    page_artistlists_statistic.value.push({
      label: store_view_artist_page_logic.page_artistlists_statistic[index].label,
      artist_count: store_view_artist_page_logic.page_artistlists_statistic[index].artist_count,
      id: store_view_artist_page_logic.page_artistlists_statistic[index].id,
    })
  })
}
onMounted(() => {
  Refresh_page_artistlists_statistic()
})
const stopWatching_boolHandleItemClick_Played = watch(
  () => store_player_audio_logic.boolHandleItemClick_Played,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      Refresh_page_artistlists_statistic()
      store_player_audio_logic.boolHandleItemClick_Played = false
    }
  },
  { immediate: true }
)

const onRefreshSharp = debounce(async (event, args) => {
  await store_general_fetch_artist_list.fetchData_Artist()
}, 500)

////// view artistlist_view Remove data
onBeforeUnmount(() => {
  stopWatching_boolHandleItemClick_Played()
  stopWatching_window_innerWidth()
  stopWatching_router_history_model_of_Artist_scroll()
  stopWatching_conditionCount()
  dynamicScroller.value = null
})
</script>
<template>
  <n-space vertical :size="12">
    <div class="artist-wall-container">
      <n-space vertical @wheel.prevent style="overflow: hidden; margin-left: 4px">
        <n-space align="center">
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
          <n-divider vertical style="width: 2px; height: 20px; margin-top: -4px" />
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
              <n-input-group style="width: 144px">
                <n-input
                  style="width: 144px"
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
                store_view_artist_page_logic.page_artistlists_selected === 'artist_list_recently'
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
                v-if="store_view_artist_page_logic.page_artistlists_multi_sort.length > 0"
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
          <n-modal transform-origin="mouse" v-model:show="Type_Multi_Sort">
            <n-card style="width: 450px; border-radius: 4px">
              <n-space justify="space-between" align="center" style="margin-bottom: 10px">
                <span style="font-size: 20px; font-weight: 600">
                  {{ $t('OptionCustomUsers') + $t('nsmusics.view_page.multi_level_sort') }}
                </span>
              </n-space>
              <n-space justify="space-between" align="center" style="margin-bottom: 10px">
                {{ store_view_artist_page_logic.page_artistlists_multi_sort }}
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
                        store_view_artist_page_logic.page_artistlists_multi_sort = ''
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

          <n-divider vertical style="width: 2px; height: 20px; margin-top: -2px" />
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary circle @click="dynamicScroller.$el.scrollTop = 0">
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
          <n-space v-if="show_top_selectedlist" style="margin-left: 7px; margin-bottom: 14px">
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-select
                  size="small"
                  :value="store_view_artist_page_logic.page_artistlists_selected"
                  :options="store_view_artist_page_logic.page_artistlists_options"
                  style="width: 181px"
                  @update:value="page_artistlists_handleselected_updatevalue"
                />
              </template>
              {{ $t('Select') + $t('LabelPlaylist') }}
            </n-tooltip>
          </n-space>
        </n-space>
      </n-space>
      <DynamicScroller
        class="artist-wall"
        ref="dynamicScroller"
        :style="{
          width: 'calc(100vw - ' + (collapsed_width - 40) + 'px)',
          height: show_top_selectedlist ? 'calc(100vh - 236px)' : 'calc(100vh - 194px)',
        }"
        :items="store_view_artist_page_info.artist_Files_temporary"
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
              :style="{ width: 'calc(100vw - ' + (collapsed_width - 17) + 'px)' }"
              style="
                position: absolute;
                z-index: 0;
                height: 298px;
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
                    'linear-gradient(to right, rgba(0, 0, 0, 0) 20%, rgba(0, 0, 0, 1) 100%)',
                }"
                style="
                  margin-left: 200px;
                  transform: translateY(-25%);
                  object-fit: cover;
                  object-position: center;
                "
                :src="getAssetImage(store_player_audio_info.page_top_album_image_url)"
                alt=""
              />
            </div>
            <n-page-header
              style="
                position: relative;
                z-index: 1;
                width: calc(100vw - 220px);
                height: 300px;
                border-radius: 10px;
                margin-left: 5px;
                margin-bottom: 20px;
              "
            >
              <template #title>
                <n-space vertical align="start" style="height: 280px; margin-left: 12px">
                  <n-space style="margin-top: 26px; margin-left: 11px">
                    <div style="font-size: 32px; font-weight: 600">
                      {{ $t('entity.artist_other') }}
                    </div>
                    <div
                      v-if="store_player_audio_info.this_audio_artist_name.length > 0"
                      style="font-size: 32px; font-weight: 600; margin-top: -2px"
                    >
                      {{ ' : ' }}
                    </div>
                    <div
                      :style="{
                        maxWidth: 'calc(100vw - ' + (collapsed_width + 570) + 'px)',
                      }"
                      style="
                        text-align: left;
                        cursor: pointer;
                        font-size: 32px;
                        font-weight: 600;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 1;
                        overflow: hidden;
                        text-overflow: ellipsis;
                      "
                    >
                      {{ store_player_audio_info.this_audio_artist_name }}
                    </div>
                  </n-space>
                  <n-space align="center" style="margin-top: 2px; margin-left: 11px">
                    <div style="color: #767c82; font-size: 15px; font-weight: 600">
                      {{ $t('GuideProviderSelectListings') + ' >' }}
                    </div>
                    <n-tooltip trigger="hover" placement="top">
                      <template #trigger>
                        <n-select
                          :value="store_view_artist_page_logic.page_artistlists_selected"
                          :options="store_view_artist_page_logic.page_artistlists_options"
                          style="width: 166px"
                          @update:value="page_artistlists_handleselected_updatevalue"
                        />
                      </template>
                      {{ $t('Select') + $t('LabelPlaylist') }}
                    </n-tooltip>
                  </n-space>
                  <n-space vertical style="margin-top: 10px; margin-left: 7px">
                    <n-grid
                      :cols="2"
                      :x-gap="0"
                      :y-gap="10"
                      layout-shift-disabled
                      style="margin-left: 4px; width: 386px"
                    >
                      <n-gi v-for="artistlist in page_artistlists_statistic" :key="artistlist.id">
                        <n-statistic :label="artistlist.label" :value="artistlist.artist_count" />
                      </n-gi>
                    </n-grid>
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
                  "
                  :src="getAssetImage(store_player_audio_info.page_top_album_image_url)"
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
            v-contextmenu:contextmenu
            @contextmenu.prevent="
              () => {
                store_playlist_list_info.playlist_Menu_Item = item
                store_playlist_list_info.playlist_Menu_Item_Id = item.id
              }
            "
          >
            <div :key="item.id" class="artist">
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
                  class="hover-overlay"
                  @dblclick="Open_this_artist_all_artist_list_click(item.id)"
                >
                  <div class="hover-content">
                    <button
                      class="play-this-artist-button"
                      @click="Play_this_artist_all_media_list_click(item.id)"
                    >
                      <icon :size="42" color="#FFFFFF"><PlayCircle24Regular /></icon>
                    </button>
                    <div
                      class="hover-buttons-top"
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
                    <div class="hover-buttons-bottom">
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
                          store_server_users.server_select_kind != 'navidrome' ? 'center' : 'left',
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
      <v-contextmenu
        ref="contextmenu"
        class="v-contextmenu-item v-contextmenu-item--hover"
        style="z-index: 999"
      >
        <v-contextmenu-submenu :title="menu_item_add_to_songlist">
          <v-contextmenu-item
            v-for="n in store_playlist_list_info.playlist_names_ALLLists"
            :key="n.value"
            @click="
              update_playlist_addArtist(store_playlist_list_info.playlist_Menu_Item_Id, n.value)
            "
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
    </div>
  </n-space>
</template>
<style>
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

.artist-wall {
  overflow-y: auto;
  width: calc(100vw - 200px);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  scroll-behavior: smooth;
  margin-left: 8px;
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
.artist:hover .artist-name{
  color: var(--primary-color-hover);
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

.hover-overlay {
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

.artist:hover .hover-overlay {
  opacity: 1;
}

.hover-content {
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

.hover-buttons-top {
  position: absolute;
  top: 4px;
  left: 4px;
  width: auto;
}

.hover-buttons-bottom {
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
</style>
