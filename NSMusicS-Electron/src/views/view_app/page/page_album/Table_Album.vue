<script setup lang="ts">
////// this_view resource of vicons_svg
import {
  ArrowSort24Regular,
  ChevronLeft16Filled,
  ChevronRight16Filled,
  Filter20Filled,
  Heart24Regular,
  Heart28Filled,
  Open28Filled,
  PlayCircle24Regular,
  Search20Filled,
  TextSortAscending20Regular,
  TextSortDescending20Regular,
  PaddingTop20Filled,
  PaddingDown20Filled,
} from '@vicons/fluent'
import { RefreshSharp } from '@vicons/ionicons5'
import { BrowserNotSupportedTwotone } from '@vicons/material'
import { Icon } from '@vicons/utils'

////// this_view views_components of navie ui
import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { type InputInst, NButton, NIcon, useMessage, useThemeVars } from 'naive-ui'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { usePageAlbumStore } from '@/data/data_status/app_status/page_status/album_store/usePageAlbumStore'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_history_data_of_album } from '@/router/router_store/store_router_history_data_of_album'
import { store_general_fetch_album_list } from '@/server/server_api_store/server_api_core/page/page_album/store_general_fetch_album_list'

////// i18n auto lang
import { useI18n } from 'vue-i18n'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
////// changed_data write to sqlite
import { store_local_data_set_albumInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_albumInfo'
import { store_local_data_set_mediaInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_mediaInfo'
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'

import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { storeToRefs } from 'pinia'
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'

import { store_general_fetch_media_list } from '@/server/server_api_store/server_api_core/page/page_media_file/store_general_fetch_media_list'
////// right menu
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { usePagePlayerTagModifyStore } from '@/data/data_status/app_status/page_status/player_store/usePagePlayerTagModifyStore'

// 在顶层获取 Store 实例
const playlistStore = usePlaylistStore()
const playerAudioStore = usePlayerAudioStore()
const playerAppearanceStore = usePlayerAppearanceStore()
const playerSettingStore = usePlayerSettingStore()
const pageAlbumStore = usePageAlbumStore()
const pageMediaStore = usePageMediaStore()
const playerTagModifyStore = usePagePlayerTagModifyStore()
const {
  album_item_count,
  album_starred_count,
  album_recently_count,
  page_albumlists_input_search_Value,
  page_albumlists_multi_sort,
  page_albumlists_filter_year,
  page_albumlists_selected,
  page_albumlists_options,
  album_Files_temporary,
} = storeToRefs(pageAlbumStore)

const { t } = useI18n({
  inheritLocale: true,
})

////// albumlist_view page_layout gridItems
const item_album = ref(160)
const item_album_image = ref(item_album.value - 20)
const item_album_txt = ref(item_album.value - 20)
const itemSize = ref(220)
const gridItems = ref(5)
const itemSecondarySize = ref(185)
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_server_users } from '@/server/server_management/store_server_users'
import { store_general_model_player_list } from '@/server/server_api_store/server_api_core/components/player_list/store_general_model_player_list'
import { debounce } from 'lodash'
import { MultipleStopOutlined } from '@vicons/material'
const errorHandled = ref(new Map())
const handleImageError = async (item: any) => {
  let result_src = error_album
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
    item.medium_image_url = error_album
  }
}
function getAssetImage(firstImage: string) {
  return new URL(firstImage, import.meta.url).href
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
    const num = window.innerWidth / 7.53
    itemSize.value = Math.floor(num) + 40
    item_album.value = Math.floor(num)
    item_album_image.value = item_album.value - 20
    item_album_txt.value = item_album.value - 20
    gridItems.value = 7
    itemSecondarySize.value =
      Math.floor(window.innerWidth - (collapsed_width.value - 40)) / gridItems.value - 2
  } else if (window.innerWidth > 1660) {
    const num = window.innerWidth / 6.53
    itemSize.value = Math.floor(num) + 40
    item_album.value = Math.floor(num)
    item_album_image.value = item_album.value - 20
    item_album_txt.value = item_album.value - 20
    gridItems.value = 6
    itemSecondarySize.value =
      Math.floor(window.innerWidth - (collapsed_width.value - 40)) / gridItems.value - 2
  } else {
    const num = window.innerWidth / 5.53
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
  if (pageAlbumStore.page_albumlists_input_search_Value.length > 0) {
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
    { label: computed(() => t('entity.album_other')), key: 'name', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('entity.artist_other')),
      key: 'artist',
      state_Sort: state_Sort.Default,
    },
    { label: computed(() => t('filter.toYear')), key: 'min_year', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('common.duration')),
      key: 'duration',
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
} else if (
  store_server_user_model.model_server_type_of_web &&
  store_server_users.server_select_kind === 'ninesong'
) {
  options_Sort_key.value = [
    { label: computed(() => t('entity.album_other')), key: 'name', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('entity.artist_other')),
      key: 'artist',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('table.column.albumArtist')),
      key: 'album_artist',
      state_Sort: state_Sort.Default,
    },
    { label: computed(() => t('filter.toYear')), key: 'min_year', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('common.duration')),
      key: 'duration',
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
} else if (
  store_server_user_model.model_server_type_of_web &&
  store_server_users.server_select_kind === 'jellyfin'
) {
  options_Sort_key.value = [
    {
      label: computed(() => t('OptionTrackName')),
      key: 'SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('AlbumArtist')),
      key: 'AlbumArtist,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('CommunityRating')),
      key: 'CommunityRating,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('OptionCriticRating')),
      key: 'CriticRating,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('OptionDateAdded')),
      key: 'DateCreated,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('OptionReleaseDate')),
      key: 'ProductionYear,PremiereDate,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('OptionRandom')),
      key: 'Random,SortName',
      state_Sort: state_Sort.Default,
    },
  ]
} else if (store_server_users.server_select_kind === 'emby') {
  options_Sort_key.value = [
    {
      label: computed(() => t('AlbumArtist')),
      key: 'AlbumArtist,Album,ParentIndexNumber,IndexNumber,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('Composer')),
      key: 'Composer,Album,ParentIndexNumber,IndexNumber,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('LabelCommunityRating')),
      key: 'CommunityRating,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('LabelDateAdded')),
      key: 'DateCreated,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('LabelReleaseDate')),
      key: 'ProductionYear,PremiereDate,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('LabelParentalRating')),
      key: 'OfficialRating,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('LabelYear')),
      key: 'ProductionYear,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('Runtime')),
      key: 'Runtime,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('LabelCriticRating')),
      key: 'CriticRating,SortName',
      state_Sort: state_Sort.Default,
    },
    { label: computed(() => t('LabelTitle')), key: 'SortName', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('Artist')),
      key: 'Artist,Album,ParentIndexNumber,IndexNumber,SortName',
      state_Sort: state_Sort.Default,
    },
    { label: computed(() => t('OptionRandom')), key: 'Random', state_Sort: state_Sort.Default },
  ]
}
const Select_Sort_Model = ref(false)
let options_Sort = computed(() => {
  if (
    pageAlbumStore.page_albumlists_options_Sort_key != null &&
    pageAlbumStore.page_albumlists_options_Sort_key.length > 0
  ) {
    options_Sort_key.value.forEach((element) => {
      if (element.key === pageAlbumStore.page_albumlists_options_Sort_key[0].columnKey)
        if (pageAlbumStore.page_albumlists_options_Sort_key[0].order === state_Sort.Ascend)
          element.state_Sort = state_Sort.Ascend
        else if (pageAlbumStore.page_albumlists_options_Sort_key[0].order === state_Sort.Descend)
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
  pageAlbumStore.page_albumlists_multi_sort = ''
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
  pageAlbumStore.page_albumlists_options_Sort_key = [
    {
      columnKey: String(key),
      order: _state_Sort_,
    },
  ]
  check_sort_state()
  scrollTo(0)
}
function check_sort_state() {
  const sortKey =
    pageAlbumStore.page_albumlists_options_Sort_key.length > 0 &&
    pageAlbumStore.page_albumlists_options_Sort_key[0].order !== 'default'
      ? pageAlbumStore.page_albumlists_options_Sort_key[0].columnKey
      : 'id'
  const sortOrder =
    pageAlbumStore.page_albumlists_options_Sort_key.length > 0 &&
    pageAlbumStore.page_albumlists_options_Sort_key[0].order !== 'default'
      ? pageAlbumStore.page_albumlists_options_Sort_key[0].order.replace('end', '')
      : ''
  Select_Sort_Model.value = !(
    (sortKey === '_id' || sortKey === 'id') &&
    (sortOrder === '' || sortOrder === 'asc' || sortOrder === 'ascend')
  )
}
onMounted(() => {
  check_sort_state()
})
const options_Sort_key_Default_key = ref()
const options_Sort_key_Default = ref<SortItem[]>()
// gridItems Search(filter)
const bool_show_search_area = ref(false)
const show_search_area = () => {
  if (bool_show_search_area.value) {
    bool_show_search_area.value = false
    input_search_InstRef.value?.clear()
    if (bool_input_search) {
      // pageAlbumStore.list_data_StartUpdate = true
      back_search_default()
      bool_input_search = false
      scrollTo(0)
    }
    if (store_server_user_model.model_server_type_of_web) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    }
    input_search_InstRef.value?.clear()
    pageAlbumStore.page_albumlists_keyword = ''
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
let bool_input_search = false
const click_search = () => {
  pageAlbumStore.page_albumlists_keyword =
    pageAlbumStore.page_albumlists_input_search_Value.toLowerCase()
  if (pageAlbumStore.page_albumlists_keyword) {
    bool_input_search = true
    options_Sort_key.value.forEach((element) => {
      element.state_Sort = state_Sort.Default
    })
  } else {
    pageAlbumStore.list_data_StartUpdate = true
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
          pageAlbumStore.page_albumlists_options_Sort_key = null
        } else {
          const sorter = {
            columnKey: options_Sort_key.value[i].key,
            order: options_Sort_key.value[i].state_Sort,
          }
          sortersArray.push(sorter)
          pageAlbumStore.page_albumlists_options_Sort_key = sortersArray
        }
        break
      }
    }
  }
}
// lineItems Filter
const Type_Filter_Show = ref(false)

////// dynamicScroller of albumlist_view
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
  store_router_history_data_of_album.router_history_model_of_Album_scroller_value = viewEndIndex

  show_top_selectedlist.value = dynamicScroller.value.$el.scrollTop > 150
}
const show_top_selectedlist = ref(false)

const stopWatching_router_history_model_of_Album_scroll = watch(
  () => store_router_history_data_of_album.router_history_model_of_Album_scroll,
  (newValue) => {
    if (newValue) {
      scrollTo(store_router_history_data_of_album.router_history_model_of_Album_scroller_value)
      store_router_history_data_of_album.router_history_model_of_Album_scroll = false
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
    scrollTo(store_router_history_data_of_album.router_history_model_of_Album_scroller_value)
  } else if (store_server_user_model.model_server_type_of_web) {
    if (
      store_server_user_model.model_server_type_of_web &&
      (store_server_users.server_select_kind === 'jellyfin' ||
        store_server_users.server_select_kind === 'emby')
    ) {
      /// 兼容行为：打开指定艺术家，直接跳转乐曲页面，路由刷新到专辑页面需要清空数据
      playerAppearanceStore.player_mode_of_medialist_from_external_import = true
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    }
  }
})

////// select Dtatsource of albumlists
const breadcrumbItems = ref('所有专辑')
const page_albumlists_handleSelected_updateValue = (value: any) => {
  // clear search，防止出现Jellyfin模式下列表切换未清除搜素数据
  if (
    store_server_user_model.model_server_type_of_web &&
    (store_server_users.server_select_kind === 'jellyfin' ||
      store_server_users.server_select_kind === 'emby')
  ) {
    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    input_search_InstRef.value?.clear()
    pageAlbumStore.page_albumlists_keyword = ''
  }
  //
  pageAlbumStore.page_albumlists_selected = value
  console.log('selected_value_for_albumlistall：' + value)
  breadcrumbItems.value =
    pageAlbumStore.page_albumlists_options.find((option) => option.value === value)?.label || ''
}

////// router_app history
const get_router_history_model_pervious = () => {
  pageAlbumStore.page_albumlists_keyword = ''
  input_search_InstRef.value?.clear()
  store_router_history_data_of_album.get_router_history_model_of_Album(-1)
}
const get_router_history_model_next = () => {
  pageAlbumStore.page_albumlists_keyword = ''
  input_search_InstRef.value?.clear()
  store_router_history_data_of_album.get_router_history_model_of_Album(1)
}

////// go to media_view
const handleItemClick_album = (album: string) => {
  if (store_server_user_model.model_server_type_of_local) {
    bool_show_search_area.value = true
  } else if (store_server_user_model.model_server_type_of_web) {
    store_general_fetch_album_list._artist_id = ''
    bool_show_search_area.value = true
  }
  pageAlbumStore.page_albumlists_keyword = album
  pageAlbumStore.page_albumlists_input_search_Value = album
  pageMediaStore.page_songlists_input_search_Value = album
}
const handleItemClick_artist = (artist_id: string) => {
  if (store_server_user_model.model_server_type_of_local) {
    pageAlbumStore.page_albumlists_keyword = artist_id
    pageAlbumStore.page_albumlists_input_search_Value = artist_id
    pageMediaStore.page_songlists_input_search_Value = artist_id
  } else if (store_server_user_model.model_server_type_of_web) {
    if (store_server_users.server_select_kind === 'ninesong') {
      store_general_fetch_album_list.set_artist_id(artist_id)
      store_general_fetch_album_list.fetchData_Album()
    } else if (
      store_server_users.server_select_kind === 'jellyfin' ||
      store_server_users.server_select_kind === 'emby'
    ) {
      store_general_fetch_album_list.set_artist_id(artist_id)
      pageAlbumStore.page_albumlists_input_search_Value = artist_id
      store_general_fetch_album_list.fetchData_Album()
    } else {
      pageAlbumStore.page_albumlists_keyword = artist_id
      pageAlbumStore.page_albumlists_input_search_Value = artist_id
      pageMediaStore.page_songlists_input_search_Value = artist_id
    }
  }
  bool_show_search_area.value = true
}
const Open_this_album_MediaList_click = (album_id: string) => {
  if (store_server_user_model.model_server_type_of_web) {
    playerAppearanceStore.player_mode_of_medialist_from_external_import = false
    store_general_fetch_media_list.set_album_id(album_id)
    pageMediaStore.page_songlists_selected = 'song_list_all'
  }
  console.log('media_list_of_album_id：' + album_id)
  store_router_data_logic.get_media_list_of_album_id_by_album_info(album_id)
}
const Play_this_album_MediaList_click = async (album_id: string) => {
  if (store_server_user_model.model_server_type_of_web) {
    store_general_fetch_media_list.set_album_id(album_id)
    pageMediaStore.page_songlists_selected = 'song_list_all'
    store_server_user_model.random_play_model = false
  }
  console.log('play_this_album_click：' + album_id)
  await store_general_fetch_album_list.fetchData_This_Album_MediaList(album_id)

  playlistStore.reset_carousel()
}

const handleItemClick_Favorite = (id: any, favorite: boolean) => {
  store_local_data_set_albumInfo.Set_AlbumInfo_To_Favorite(id, favorite)
  page_albumlists_statistic.value.forEach((item: any) => {
    if (item.id === 'album_list_love') {
      pageAlbumStore.album_starred_count += !favorite ? 1 : -1
      item.album_count = pageAlbumStore.album_starred_count + ' *'
    }
  })
}
let before_rating = false
let after_rating = false
const handleItemClick_Rating = (id_rating: any) => {
  const [id, rating] = id_rating.split('-')
  if (after_rating) {
    store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, 0)
  } else {
    store_local_data_set_albumInfo.Set_AlbumInfo_To_Rating(id, rating)
  }
}

/// multi_level_sort
interface SortCondition {
  key: string
  order: string
}
const allSortKeys = computed(() => [
  { label: t('entity.album_other'), value: 'name' },
  { label: t('entity.artist_other'), value: 'artist' },
  { label: t('table.column.albumArtist'), value: 'album_artist' },
  { label: t('filter.toYear'), value: 'min_year' },
  { label: t('common.duration'), value: 'duration' },
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
  pageAlbumStore.page_albumlists_multi_sort = generateSortQuery()
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
  const storedQuery = pageAlbumStore.page_albumlists_multi_sort

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

async function update_playlist_addAlbum(id: any, playlist_id: any) {
  try {
    await store_general_fetch_media_list.fetchData_Media_Find_This_Album(id)
    const matchingIds: string[] = []
    pageMediaStore.media_Files_temporary.forEach((item: Media_File) => {
      if (item.album_id === id) {
        matchingIds.push(item.id)
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
async function menu_item_add_to_playlist_end() {
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
  contextmenu.value.hide()
}
async function menu_item_add_to_playlist_next() {
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
    contextmenu.value.hide()
  } else {
    console.error('Current audio song not found in playlist')
  }
}
function menu_item_edit_selected_media_tags() {
  playerTagModifyStore.player_show_tag_kind = 'album'
  const item: Album | undefined = pageAlbumStore.album_Files_temporary.find(
    (album: Album) => album.id === playlist_Menu_Item_Id.value
  )
  if (item != undefined && item != 'undefined') {
    playerTagModifyStore.player_current_album_id = item.id
    playerTagModifyStore.player_show_tag_modify = true
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
    await store_general_fetch_album_list.fetchData_Album_of_server_web_end()
  }
  isScrolling.value = false
}
const onScroll = async () => {
  show_top_selectedlist.value = dynamicScroller.value.$el.scrollTop > 150
}

//////
const onRefreshSharp = debounce(async (event, args) => {
  if (store_server_user_model.model_server_type_of_web) {
    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    input_search_InstRef.value?.clear()
    bool_show_search_area.value = false
    pageAlbumStore.page_albumlists_keyword = ''
    store_general_fetch_album_list.fetchData_Album_of_server_web_start()
  } else if (store_server_user_model.model_server_type_of_local) {
    input_search_InstRef.value?.clear()
    bool_show_search_area.value = false
    pageAlbumStore.page_albumlists_keyword = ''
    store_general_fetch_album_list.fetchData_Album()
  }
}, 500)

const page_albumlists_statistic = ref<
  {
    label: ''
    album_count: ''
    id: ''
  }[]
>([])
function Refresh_page_albumlists_statistic() {
  pageAlbumStore.page_albumlists_statistic.forEach((item: any) => {
    if (item.id === 'album_list_recently') {
      item.album_count = album_recently_count.value + ' *'
    }
  })
  page_albumlists_statistic.value = []
  pageAlbumStore.page_albumlists_statistic.forEach((item: any, index: number) => {
    page_albumlists_statistic.value.push({
      label: pageAlbumStore.page_albumlists_statistic[index].label,
      album_count: pageAlbumStore.page_albumlists_statistic[index].album_count,
      id: pageAlbumStore.page_albumlists_statistic[index].id,
    })
  })
}
onMounted(() => {
  Refresh_page_albumlists_statistic()
  const { _artist_id } = store_general_fetch_album_list
  const hasMediaId = _artist_id.length > 0
  if (hasMediaId) {
    bool_show_search_area.value = true
  }
})
const stopWatching_boolHandleItemClick_Played = watch(
  () => playerSettingStore.boolHandleItemClick_Played,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      Refresh_page_albumlists_statistic()
      playerSettingStore.boolHandleItemClick_Played = false
    }
  },
  { immediate: true }
)

////// view albumlist_view Remove data
onBeforeUnmount(() => {
  stopWatching_boolHandleItemClick_Played()
  stopWatching_window_innerWidth()
  stopWatching_router_history_model_of_Album_scroll()
  stopWatching_conditionCount()
  dynamicScroller.value = null
  store_general_fetch_album_list.set_artist_id('')
})
// 使用 storeToRefs 解构出所需的响应式属性
const { playlist_names_ALLLists, playlist_Menu_Item_Id, playlist_Menu_Item } =
  storeToRefs(playlistStore)

const { page_top_album_name, page_top_album_image_url, this_audio_artist_id, page_top_album_id } =
  storeToRefs(playerAudioStore)
</script>
<template>
  <n-space vertical :size="12">
    <div class="album-wall-container">
      <n-space vertical @wheel.prevent style="overflow: hidden">
        <n-space align="center" style="margin-top: 3px">
          <n-space>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button quaternary circle @click="show_search_area">
                  <template #icon>
                    <n-icon size="20" :depth="2"><ChevronLeft16Filled /></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('common.backward') }}
            </n-tooltip>
          </n-space>

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
              <n-input-group style="width: 144px">
                <n-input
                  style="width: 144px"
                  ref="input_search_InstRef"
                  v-model:value="page_albumlists_input_search_Value"
                  @keydown.enter="click_search"
                />
              </n-input-group>
            </template>
            {{ $t('setting.hotkey_localSearch') }}
          </n-tooltip>

          <n-dropdown
            v-if="
              !(
                store_server_user_model.model_server_type_of_web &&
                pageAlbumStore.page_albumlists_selected === 'album_list_recently'
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
                v-if="pageAlbumStore.page_albumlists_multi_sort.length > 0"
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

          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-badge :value="page_albumlists_filter_year" :offset="[22, 17]">
                <n-button quaternary circle @click="Type_Filter_Show = true">
                  <template #icon>
                    <n-icon :size="20"><Filter20Filled /></n-icon>
                  </template>
                </n-button>
              </n-badge>
            </template>
            {{ $t('Filters') }}
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
        <n-space v-if="show_top_selectedlist" style="margin-left: 10px; margin-bottom: 7px">
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-select
                size="small"
                :value="page_albumlists_selected"
                :options="page_albumlists_options"
                style="width: 181px"
                @update:value="page_albumlists_handleSelected_updateValue"
              />
            </template>
            {{ $t('Select') + $t('LabelPlaylist') }}
          </n-tooltip>
        </n-space>
      </n-space>

      <div 
        v-if="!album_Files_temporary || album_Files_temporary.length === 0" 
        class="empty-state"
        style="
        margin-left: 10px;
        height: calc(100vh - 241px);
        position: absolute;top: 90px;
        padding-top: 150px;
        "
        :style="{
          width: `calc(100vw - ${collapsed_width - 8}px)`,
        }"
      >
        <n-icon :size="60" :depth="2">
          <BrowserNotSupportedTwotone />
        </n-icon>
        <div class="empty-title">{{ $t('nsmusics.view_page.no_subtitle_search_results_found') }}</div>
      </div>
      <DynamicScroller
        class="album-wall"
        ref="dynamicScroller"
        :style="{
          width: 'calc(100vw - ' + (collapsed_width - 35) + 'px)',
          height: show_top_selectedlist ? 'calc(100vh - 230px)' : 'calc(100vh - 184px)',
        }"
        :items="album_Files_temporary"
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
                margin-bottom: -10px;
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
                        {{ $t('entity.album_other') + ':' }}
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
                        @click="
                          () => {
                            if (store_server_user_model.model_server_type_of_local) {
                              handleItemClick_album(playerAudioStore.page_top_album_id)
                            } else if (store_server_user_model.model_server_type_of_web) {
                              handleItemClick_album(playerAudioStore.page_top_album_name)
                            }
                          }
                        "
                      >
                        {{ page_top_album_name }}
                      </div>
                    </n-space>
                  </n-space>
                  <n-space vertical style="margin-top: 4px">
                    <n-space
                      align="center"
                      style="border-left: 4px solid var(--primary-color-hover); border-radius: 3px"
                    >
                      <div style="font-size: 15px; font-weight: 600; margin-left: 13px">
                        {{ $t('GuideProviderSelectListings') + ':' }}
                      </div>
                      <n-tooltip trigger="hover" placement="top">
                        <template #trigger>
                          <n-select
                            size="small"
                            :value="page_albumlists_selected"
                            :options="page_albumlists_options"
                            style="width: 166px"
                            @update:value="page_albumlists_handleSelected_updateValue"
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
                        <n-gi v-for="albumlist in page_albumlists_statistic" :key="albumlist.id">
                          <n-statistic :label="albumlist.label" :value="albumlist.album_count" />
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
            :data-active="active"
            v-contextmenu:contextmenu
            @contextmenu.prevent="
              () => {
                playlist_Menu_Item_Id = item.id
                playlist_Menu_Item = item
              }
            "
          >
            <div :key="item.id" class="album">
              <div
                class="album-cover-container"
                :style="{
                  width: `${item_album_image}px`,
                  height: `${item_album_image}px`,
                  position: 'relative',
                }"
              >
                <img
                  class="album-cover-image"
                  :src="item.medium_image_url"
                  @error="handleImageError(item)"
                  :style="{
                    width: `${item_album_image}px`,
                    height: `${item_album_image}px`,
                  }"
                  alt=""
                />
                <div
                  class="hover-overlay-album"
                  @dblclick="Open_this_album_MediaList_click(item.id)"
                >
                  <div class="hover-content-album">
                    <button
                      class="play-this-album-button"
                      @click="
                        () => {
                          Play_this_album_MediaList_click(item.id)
                          playerAudioStore.this_audio_artist_id = item.artist_id
                        }
                      "
                    >
                      <icon :size="42" color="#FFFFFF"><PlayCircle24Regular /></icon>
                    </button>
                    <div
                      class="hover-buttons-top-album"
                      v-if="
                        (store_server_users.server_select_kind != 'jellyfin' &&
                          store_server_users.server_select_kind != 'emby') ||
                        store_server_user_model.model_server_type_of_local
                      "
                    >
                      <rate
                        class="viaSlot"
                        v-model="item.rating"
                        :length="5"
                        @before-rate="
                          (value) => {
                            if (item.rating == 1) {
                              before_rating = true
                            }
                          }
                        "
                        @after-rate="
                          (value) => {
                            if (item.rating == 1 && before_rating == true) {
                              after_rating = true
                              before_rating = false
                            }
                            handleItemClick_Rating(item.id + '-' + value)
                            if (after_rating) {
                              item.rating = 0
                              after_rating = false
                            }
                          }
                        "
                      />
                    </div>
                    <div class="hover-buttons-bottom-album">
                      <button
                        class="open-this-artist-button"
                        v-if="
                          (store_server_users.server_select_kind != 'jellyfin' &&
                            store_server_users.server_select_kind != 'emby') ||
                          store_server_user_model.model_server_type_of_local
                        "
                        @click="Open_this_album_MediaList_click(item.id)"
                      >
                        <icon :size="20" color="#FFFFFF"><Open28Filled /></icon>
                      </button>
                      <button
                        class="love-this-album-button"
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
              <div class="album-info" :style="{ width: `${item_album_image}px` }">
                <div class="album-text" :style="{ width: `${item_album_txt}px` }">
                  <div
                    class="album-name"
                    :style="{ maxWidth: `${item_album_txt}px` }"
                    @click="handleItemClick_album(item.name)"
                  >
                    {{ item.name }}
                  </div>
                  <div class="artist-name" :style="{ maxWidth: `${item_album_txt}px` }">
                    <template
                      v-if="
                        store_server_users.server_select_kind === 'ninesong' &&
                        store_server_user_model.model_server_type_of_web
                      "
                      v-for="artist in item.all_artist_ids"
                    >
                      <span
                        @click="
                          () => {
                            handleItemClick_artist(artist.ArtistID)
                            pageAlbumStore.page_albumlists_input_search_Value = artist.ArtistName
                          }
                        "
                      >
                        {{ artist.ArtistName + '&nbsp' }}
                      </span>
                    </template>
                    <template
                      v-else
                      v-for="artist in item.artist?.split(/[\/|｜、]/) ?? item.artist"
                    >
                      <span
                        @click="
                          () => {
                            if (store_server_user_model.model_server_type_of_local) {
                              handleItemClick_artist(item.artist_id)
                            } else if (store_server_user_model.model_server_type_of_web) {
                              if (
                                store_server_users.server_select_kind === 'jellyfin' ||
                                store_server_users.server_select_kind === 'emby'
                              ) {
                                handleItemClick_artist(item.artist_id)
                              } else {
                                handleItemClick_artist(item.artist)
                              }
                            }
                          }
                        "
                      >
                        {{ artist + '&nbsp' }}
                      </span>
                    </template>
                  </div>
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
            v-for="n in playlist_names_ALLLists"
            :key="n.value"
            @click="update_playlist_addAlbum(playlist_Menu_Item_Id, n.value)"
          >
            {{ n.label }}
          </v-contextmenu-item>
        </v-contextmenu-submenu>
        <v-contextmenu-divider />
        <v-contextmenu-item
          v-if="
            (store_server_users.server_select_kind != 'jellyfin' &&
              store_server_users.server_select_kind != 'emby') ||
            store_server_user_model.model_server_type_of_local
          "
          @click="
            () => {
              if (store_server_user_model.model_server_type_of_local) {
                handleItemClick_album(playlist_Menu_Item.name)
              } else if (store_server_user_model.model_server_type_of_web) {
                if (
                  store_server_users.server_select_kind === 'jellyfin' ||
                  store_server_users.server_select_kind === 'emby'
                ) {
                  handleItemClick_album(playlist_Menu_Item.name)
                } else if (store_server_users.server_select_kind === 'ninesong') {
                  handleItemClick_album(playlist_Menu_Item.name)
                } else {
                  handleItemClick_album(playlist_Menu_Item.album)
                }
              }
            }
          "
        >
          {{ $t('Search') + $t('LabelTitle') }}
        </v-contextmenu-item>
        <v-contextmenu-item
          @click="
            () => {
              if (store_server_user_model.model_server_type_of_local) {
                handleItemClick_artist(playlist_Menu_Item.artist_id)
              } else if (store_server_user_model.model_server_type_of_web) {
                if (
                  store_server_users.server_select_kind === 'jellyfin' ||
                  store_server_users.server_select_kind === 'emby'
                ) {
                  handleItemClick_artist(playlist_Menu_Item.artist_id)
                } else if (store_server_users.server_select_kind === 'ninesong') {
                  handleItemClick_artist(playlist_Menu_Item.artist_id)
                } else {
                  handleItemClick_artist(playlist_Menu_Item.artist)
                }
              }
            }
          "
        >
          {{ $t('ViewAlbumArtist') + ' | ' + $t('nsmusics.view_page.allAlbum') }}
        </v-contextmenu-item>
        <v-contextmenu-divider
          v-if="
            (store_server_users.server_select_kind != 'jellyfin' &&
              store_server_users.server_select_kind != 'emby') ||
            store_server_user_model.model_server_type_of_local
          "
        />
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

      <n-modal transform-origin="mouse" v-model:show="Type_Multi_Sort">
        <n-card style="width: 450px; border-radius: 4px">
          <n-space justify="space-between" align="center" style="margin-bottom: 10px">
            <span style="font-size: 20px; font-weight: 600">
              {{ $t('OptionCustomUsers') + $t('nsmusics.view_page.multi_level_sort') }}
            </span>
          </n-space>
          <n-space justify="space-between" align="center" style="margin-bottom: 10px">
            {{ page_albumlists_multi_sort }}
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
                    pageAlbumStore.page_albumlists_multi_sort = ''
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
      <n-modal v-model:show="Type_Filter_Show">
        <n-card style="width: 480px; border-radius: 4px">
          <n-space vertical size="large">
            <n-space>
              <span style="font-size: 20px; font-weight: 600">{{ $t('common.filter_other') }}</span>
            </n-space>
            <n-space justify="space-between">
              <n-space vertical>
                <span style="font-size: 14px; font-weight: 600">{{ $t('common.year') }}</span>
                <n-space vertical>
                  <n-input
                    clearable
                    placeholder=""
                    style="width: 200px"
                    v-model:value="page_albumlists_filter_year"
                  />
                  <n-button
                    strong
                    secondary
                    @click="pageAlbumStore.page_albumlists_filter_year = 0"
                  >
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
              </n-space>
              <n-space vertical>
                <span style="font-size: 14px; font-weight: 600">{{
                  $t('entity.genre_other')
                }}</span>
                <n-input disabled clearable placeholder="Not open || 未开放" style="width: 200px" />
              </n-space>
            </n-space>
          </n-space>
        </n-card>
      </n-modal>
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

.album-wall-container {
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

.album-wall {
  overflow-y: auto;
  width: calc(100vw - 200px);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  scroll-behavior: smooth;
}

.album {
  float: left;
  flex-direction: column;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.album:hover {
  transform: translateY(-10px);
}
.album:hover .album-name {
  color: var(--primary-color-hover);
}
.album:nth-child(1) {
  margin-left: 8px;
}

.album-cover-container {
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.album-cover-image {
  object-fit: cover;
  object-position: center;
  border: 1.5px solid #ffffff20;
  border-radius: 10px;
}

.hover-overlay-album {
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

.album:hover .hover-overlay-album {
  opacity: 1;
}

.hover-content-album {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.play-this-album-button,
.open-this-artist-button,
.love-this-album-button {
  border: 0;
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.play-this-album-button:hover,
.open-this-artist-button:hover,
.love-this-album-button:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
}

.play-this-album-button {
  width: 50px;
  height: 50px;
}

.play-this-album-button .icon {
  margin-left: -2px;
  margin-top: 3px;
}

.hover-buttons-top-album {
  position: absolute;
  top: 4px;
  left: 4px;
  width: auto;
}

.hover-buttons-bottom-album {
  position: absolute;
  bottom: 8px;
  right: 14px;
  display: flex;
  gap: 8px;
}

.open-this-artist-button,
.love-this-album-button {
  width: 28px;
  height: 28px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.open-this-artist-button .icon,
.love-this-album-button .icon {
  margin: 0;
}

.album-info {
  float: left;
  text-align: left;
}

.album-text {
  margin-top: 2px;
}

.album-name,
.artist-name {
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.album-name {
  font-weight: 600;
}

.album-name:hover {
  text-decoration: underline;
  color: var(--primary-color-hover);
}
.artist-name:hover {
  text-decoration: underline;
  color: var(--primary-color-hover);
}

.v-contextmenu-item {
  margin-top: 5px;
  margin-bottom: 5px;
}

.v-contextmenu-item--hover {
  color: var(--primary-color-hover);
  background-color: transparent;
}

::-webkit-scrollbar {
  width: 6px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 4px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #88888880;
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
