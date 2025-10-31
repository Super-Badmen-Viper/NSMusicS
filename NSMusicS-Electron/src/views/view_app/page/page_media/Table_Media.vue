<script setup lang="ts">
////// this_view resource of vicons_svg
import {
  AddCircle32Regular,
  MultiselectLtr20Filled,
  Delete20Regular,
  SelectAllOn24Regular,
  ArrowSort24Regular,
  TextSortAscending20Regular,
  TextSortDescending20Regular,
  Search20Filled,
  Heart24Regular,
  Heart28Filled,
  ChevronLeft16Filled,
  Play24Filled,
  Filter20Filled,
  PaddingTop20Filled,
  PaddingDown20Filled,
  ArrowRepeatAll16Regular,
  ArrowAutofitDown24Regular,
  AddCircle20Filled,
} from '@vicons/fluent'
import { Random } from '@vicons/fa'
import { Play, RefreshSharp } from '@vicons/ionicons5'
import { Icon } from '@vicons/utils'
import { Add, Close, Menu } from '@vicons/carbon'
import { MultipleStopOutlined, BrowserNotSupportedTwotone } from '@vicons/material'

////// this_view views_components of navie ui
import { ref, onMounted, h, computed, watch, onBeforeUnmount } from 'vue'
import { NIcon, type InputInst, NButton, useThemeVars } from 'naive-ui'

////// i18n auto lang
import { useI18n } from 'vue-i18n'
const { t } = useI18n({
  inheritLocale: true,
})

////// songlist_view page_layout lineItems
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
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
// lineItems Re render
const collapsed_width = ref(145)

// lineItems Sort
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
    { label: computed(() => t('filter.title')), key: 'title', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('entity.artist_other')),
      key: 'artist',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('entity.album_other')),
      key: 'album',
      state_Sort: state_Sort.Default,
    },
    { label: computed(() => t('filter.releaseYear')), key: 'year', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('filter.duration')),
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
    { label: computed(() => t('filter.title')), key: 'title', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('entity.album_other')),
      key: 'album',
      state_Sort: state_Sort.Default,
    },
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
    { label: computed(() => t('filter.releaseYear')), key: 'year', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('filter.duration')),
      key: 'duration',
      state_Sort: state_Sort.Default,
    },
    { label: computed(() => t('common.bitrate')), key: 'bit_rate', state_Sort: state_Sort.Default },
    { label: computed(() => t('LabelSize')), key: 'size', state_Sort: state_Sort.Default },
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
      key: 'Album,SortName',
      state_Sort: state_Sort.Default,
    },
    { label: computed(() => t('Album')), key: 'Album,SortName', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('AlbumArtist')),
      key: 'AlbumArtist,Album,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('Artist')),
      key: 'Artist,Album,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('DateAdded')),
      key: 'DateCreated,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('DatePlayed')),
      key: 'DatePlayed,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('PlayCount')),
      key: 'PlayCount,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('ReleaseDate')),
      key: 'PremiereDate,AlbumArtist,Album,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('Runtime')),
      key: 'Runtime,AlbumArtist,Album,SortName',
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
      label: computed(() => t('Album')),
      key: 'Album,ParentIndexNumber,IndexNumber',
      state_Sort: state_Sort.Default,
    },
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
    { label: computed(() => t('LabelSize')), key: 'Size,SortName', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('HeaderMedia') + t('MediaInfoContainer')),
      key: 'Container,SortName',
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
    { label: computed(() => t('Play')), key: 'PlayCount,SortName', state_Sort: state_Sort.Default },
    // {label:computed(() => t('DatePlayed')), key: 'DatePlayed,SortName', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('Runtime')),
      key: 'Runtime,SortName',
      state_Sort: state_Sort.Default,
    },
    { label: computed(() => t('File')), key: 'IsFolder,Filename', state_Sort: state_Sort.Default },
    // {label:computed(() => t('LabelTitle')), key: 'SortName', state_Sort: state_Sort.Default },
    {
      label: computed(() => t('LabelAudioBitrate')),
      key: 'TotalBitrate,SortName',
      state_Sort: state_Sort.Default,
    },
    {
      label: computed(() => t('LabelNumber')),
      key: 'ParentIndexNumber,IndexNumber,SortName',
      state_Sort: state_Sort.Default,
    },
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
    pageMediaStore.page_songlists_options_Sort_key != null &&
    pageMediaStore.page_songlists_options_Sort_key.length > 0
  ) {
    options_Sort_key.value.forEach((element) => {
      if (element.key === pageMediaStore.page_songlists_options_Sort_key[0].columnKey)
        if (pageMediaStore.page_songlists_options_Sort_key[0].order === state_Sort.Ascend)
          element.state_Sort = state_Sort.Ascend
        else if (pageMediaStore.page_songlists_options_Sort_key[0].order === state_Sort.Descend)
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
  pageMediaStore.page_songlists_multi_sort = ''
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
  pageMediaStore.list_options_Hand_Sort = true
  pageMediaStore.page_songlists_options_Sort_key = [
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
    pageMediaStore.page_songlists_options_Sort_key.length > 0 &&
    pageMediaStore.page_songlists_options_Sort_key[0].columnKey !== '_id' &&
    pageMediaStore.page_songlists_options_Sort_key[0].order !== 'default'
      ? pageMediaStore.page_songlists_options_Sort_key[0].columnKey
      : 'id'
  const sortOrder =
    pageMediaStore.page_songlists_options_Sort_key.length > 0 &&
    pageMediaStore.page_songlists_options_Sort_key[0].order !== 'default'
      ? pageMediaStore.page_songlists_options_Sort_key[0].order.replace('end', '')
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
// lineItems Search(filter)
const show_search_area = () => {
  if (pageMediaStore.page_songlists_bool_show_search_area) {
    pageMediaStore.page_songlists_bool_show_search_area = false
    input_search_InstRef.value?.clear()
    if (bool_input_search) {
      back_search_default()
      bool_input_search = false
      scrollTo(0)
    }
    if (store_server_user_model.model_server_type_of_web) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    }
    input_search_InstRef.value?.clear()
    pageMediaStore.page_songlists_keywordFilter = ''
    click_search()
  } else {
    pageMediaStore.page_songlists_bool_show_search_area = true
    options_Sort_key_Default.value = options_Sort_key.value.slice()
    options_Sort_key.value.forEach((element) => {
      //保存 sort key
      if (element.state_Sort != state_Sort.Default) options_Sort_key_Default_key.value = element.key
    })
  }
}
const input_search_InstRef = ref()
let bool_input_search = false
const click_search = () => {
  if (pageMediaStore.page_songlists_input_search_Value) {
    const page_songlists_keyword = pageMediaStore.page_songlists_input_search_Value.toLowerCase()
    pageMediaStore.get_page_songlists_keyword(page_songlists_keyword)
    bool_input_search = true
    options_Sort_key.value.forEach((element) => {
      element.state_Sort = state_Sort.Default
    })
  } else {
    pageMediaStore.page_songlists_keywordFilter = ''
    pageMediaStore.list_data_StartUpdate = true
    bool_input_search = false
    back_search_default()
    ///
    if (store_server_user_model.model_server_type_of_web) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_start()
    }
  }
}
const back_search_default = () => {
  if (options_Sort_key_Default.value != null) {
    options_Sort_key.value = options_Sort_key_Default.value.slice()
    for (let i = 0; i < options_Sort_key.value.length; i++) {
      if (options_Sort_key.value[i].key === options_Sort_key_Default_key.value) {
        const sortersArray: { columnKey: string; order: string }[] = []
        if (options_Sort_key.value[i].state_Sort === 'default') {
          pageMediaStore.list_options_Hand_Sort = true
          pageMediaStore.page_songlists_options_Sort_key = null
        } else {
          const sorter = {
            columnKey: options_Sort_key.value[i].key,
            order: options_Sort_key.value[i].state_Sort,
          }
          sortersArray.push(sorter)
          pageMediaStore.list_options_Hand_Sort = true
          pageMediaStore.page_songlists_options_Sort_key = sortersArray
        }
        break
      }
    }
  }
}
onMounted(() => {
  // local
  if (store_server_user_model.model_server_type_of_local) {
    if (pageMediaStore.page_songlists_keywordFilter.length > 0) {
      pageMediaStore.page_songlists_bool_show_search_area = true
      bool_input_search = true
      return
    }
  }
  // server
  const { _artist_id, _album_id, _album_artist_id } = store_general_fetch_media_list
  const hasMediaId = _artist_id.length > 0 || _album_id.length > 0 || _album_artist_id.length > 0
  if (hasMediaId) {
    pageMediaStore.page_songlists_input_search_Value =
      _album_id.length > 0 ? _album_id : _artist_id.length > 0 ? _artist_id : _album_artist_id

    pageMediaStore.page_songlists_bool_show_search_area = true
    bool_input_search = true
  } else {
    pageMediaStore.page_songlists_input_search_Value = pageMediaStore.page_songlists_keyword

    const shouldShowSearch = pageMediaStore.page_songlists_input_search_Value.length > 0
    pageMediaStore.page_songlists_bool_show_search_area = shouldShowSearch
    bool_input_search = shouldShowSearch
  }
})
// lineItems Filter To Favorite
const Type_Filter_Show = ref(false)

////// dynamicScroller of artistlist_view
const dynamicScroller = ref(null as any)
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

  store_router_history_data_of_media.router_history_model_of_Media_scroller_value = viewEndIndex
}
const stopWatching_router_history_model_of_Media_scroll = watch(
  () => store_router_history_data_of_media.router_history_model_of_Media_scroll,
  (newValue) => {
    if (newValue) {
      scrollTo(store_router_history_data_of_media.router_history_model_of_Media_scroller_value)
      store_router_history_data_of_media.router_history_model_of_Media_scroll = false
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
    scrollTo(store_router_history_data_of_media.router_history_model_of_Media_scroller_value)
  }
  playerAppearanceStore.player_mode_of_medialist_from_external_import = false
})

////// select Dtatsource of artistlists
const breadcrumbItems = ref('所有歌曲')
const page_songlists_handleselected_updatevalue = async (value: any) => {
  /// jellyfin/emby not search_model
  if (
    store_server_user_model.model_server_type_of_web &&
    (store_server_users.server_select_kind === 'jellyfin' ||
      store_server_users.server_select_kind === 'emby')
  ) {
    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    pageMediaStore.page_songlists_keyword = ''
    input_search_InstRef.value?.clear()
    pageMediaStore.page_songlists_bool_show_search_area = false
  }
  /// navidrome/app
  pageMediaStore.set_media_Files_selected_all(false)
  pageMediaStore.list_selected_Hand_click = true
  await pageMediaStore.get_page_songlists_selected(value)
  console.log('selected_value_for_songlistall：' + value)
  breadcrumbItems.value =
    pageMediaStore.page_songlists_options.find((option) => option.value === value)?.label || ''
  bool_start_play.value = true
  pageMediaStore.set_media_Files_selected_all(false)
}

/////// emits audio_info of songlist_view_list
const handleItemClick = () => {
  click_count++
}
const handleItemDbClick = async (media_file: any, index: number) => {
  if (bool_start_play.value == true) {
    if (click_count >= 2) {
      click_count = 0
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
  }
}
const handleItemClick_title = (title: string) => {
  if (store_server_user_model.model_server_type_of_local) {
    click_count = 0
    pageMediaStore.page_songlists_input_search_Value = title
    pageMediaStore.get_page_songlists_keyword(title)
    pageMediaStore.page_songlists_bool_show_search_area = false
    show_search_area()
    click_search()
    scrollTo(0)
  } else if (store_server_user_model.model_server_type_of_web) {
    pageMediaStore.page_songlists_bool_show_search_area = true
    pageMediaStore.page_songlists_input_search_Value = title
    pageMediaStore.get_page_songlists_keyword(title)
  }
}
const handleItemClick_artist = async (artist: string) => {
  if (
    store_server_user_model.model_server_type_of_local ||
    (store_server_users.server_select_kind === 'navidrome' &&
      store_server_user_model.model_server_type_of_web)
  ) {
    click_count = 0
    if (store_server_user_model.model_server_type_of_local) {
      pageMediaStore.page_songlists_input_search_Value = artist
      pageMediaStore.get_page_songlists_keyword(artist)
      pageMediaStore.page_songlists_bool_show_search_area = false
      show_search_area()
      click_search()
      scrollTo(0)
    } else if (store_server_user_model.model_server_type_of_web) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
      pageMediaStore.page_songlists_bool_show_search_area = true
      pageMediaStore.page_songlists_input_search_Value = artist
      pageMediaStore.get_page_songlists_keyword(artist)
    }
  } else if (
    store_server_users.server_select_kind === 'ninesong' &&
    store_server_user_model.model_server_type_of_web
  ) {
    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    pageMediaStore.page_songlists_bool_show_search_area = true
    pageMediaStore.page_songlists_input_search_Value = artist
    // pageMediaStore.get_page_songlists_keyword(artist)
    store_general_fetch_media_list.set_artist_id(artist)
    await store_general_fetch_media_list.fetchData_Media()
  } else {
    message.warning(
      'Jellyfin / Emby ' + t('ContainerNotSupported') + ' ' + t('setting.hotkey_localSearch')
    )
  }
}
const handleItemClick_album = async (album_id: string) => {
  if (
    store_server_user_model.model_server_type_of_local ||
    (store_server_users.server_select_kind === 'navidrome' &&
      store_server_user_model.model_server_type_of_web)
  ) {
    click_count = 0
    if (store_server_user_model.model_server_type_of_local) {
      pageMediaStore.page_songlists_input_search_Value = album_id + 'accurate_search' + '__album__'
      pageMediaStore.get_page_songlists_keyword(album_id + 'accurate_search' + '__album__')
      pageMediaStore.page_songlists_bool_show_search_area = false
      show_search_area()
      click_search()
      scrollTo(0)
    } else if (store_server_user_model.model_server_type_of_web) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
      pageMediaStore.page_songlists_bool_show_search_area = true
      pageMediaStore.page_songlists_input_search_Value = album_id
      pageMediaStore.get_page_songlists_keyword(album_id)
    }
  } else if (
    store_server_users.server_select_kind === 'ninesong' &&
    store_server_user_model.model_server_type_of_web
  ) {
    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    pageMediaStore.page_songlists_bool_show_search_area = true
    pageMediaStore.page_songlists_input_search_Value = album_id
    store_general_fetch_media_list.set_album_id(album_id)
    await store_general_fetch_media_list.fetchData_Media()
  } else {
    message.warning(
      'Jellyfin / Emby ' + t('ContainerNotSupported') + ' ' + t('setting.hotkey_localSearch')
    )
  }
}
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

////// changed_data write to sqlite
const handleItemClick_Favorite = (id: any, favorite: boolean) => {
  click_count = 0
  store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id, favorite)
  page_songlists_statistic.value.forEach((item: any) => {
    if (item.id === 'song_list_love') {
      pageMediaStore.media_starred_count += !favorite ? 1 : -1
      item.song_count = pageMediaStore.media_starred_count + ' *'
    }
  })
  if (id === playerAudioStore.this_audio_song_id) {
    playerAudioStore.this_audio_song_favorite = !favorite
    //
    const item_playlist: Media_File | undefined = playlistStore.playlist_MediaFiles_temporary.find(
      (mediaFile: Media_File) => mediaFile.id === playerAudioStore.this_audio_song_id
    )
    if (item_playlist !== undefined) {
      item_playlist.favorite = !favorite
    }
  }
}
let before_rating = false
let after_rating = false
const handleItemClick_Rating = (id_rating: any) => {
  click_count = 0
  const rating_item: Media_File | undefined = pageMediaStore.media_Files_temporary.find(
    (mediaFile: Media_File) => mediaFile.id === playlist_Menu_Item_Id.value
  )
  if (rating_item != undefined) {
    const [id, rating] = id_rating.split('-')
    if (after_rating) {
      store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, 0)
      if (id === playerAudioStore.this_audio_song_id) {
        playerAudioStore.this_audio_song_rating = 0
        //
        const item_playlist: Media_File | undefined =
          playlistStore.playlist_MediaFiles_temporary.find(
            (mediaFile: Media_File) => mediaFile.id === playerAudioStore.this_audio_song_id
          )
        if (item_playlist !== undefined) item_playlist.rating = rating
      }
      rating_item.rating = 0
      playlist_Menu_Item_Rating.value = 0
    } else {
      store_local_data_set_mediaInfo.Set_MediaInfo_To_Rating(id, rating)
      if (id === playerAudioStore.this_audio_song_id) {
        playerAudioStore.this_audio_song_rating = rating
        //
        const item_playlist: Media_File | undefined =
          playlistStore.playlist_MediaFiles_temporary.find(
            (mediaFile: Media_File) => mediaFile.id === playerAudioStore.this_audio_song_id
          )
        if (item_playlist !== undefined) item_playlist.rating = rating
      }
      rating_item.rating = rating
      playlist_Menu_Item_Rating.value = rating
    }
  }
}

////// playlist
import { useMessage } from 'naive-ui'
const message = useMessage()
const themeVars = useThemeVars()
/// add playlist
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'

import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { store_router_history_data_of_media } from '@/router/router_store/store_router_history_data_of_media'
import { store_local_data_set_mediaInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_mediaInfo'
import type { SelectBaseOption } from 'naive-ui/es/select/src/interface'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_server_data_set_playlistInfo } from '@/data/data_stores/server_api_stores/server_api_core/annotation/store_server_data_set_playlistInfo'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'

// 在顶层获取 Store 实例
const playerAppearanceStore = usePlayerAppearanceStore()
const playerSettingStore = usePlayerSettingStore()
const pageMediaStore = usePageMediaStore()
const playerTagModifyStore = usePagePlayerTagModifyStore()

import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { store_general_fetch_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/data/data_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_general_model_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { debounce } from 'lodash'
import { Folder_Entity_ApiService_of_NineSong } from '@/data/data_configs/ninesong_api/services_web/Folder_Entity/index_service'

import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { storeToRefs } from 'pinia'
const playlistStore = usePlaylistStore()
import { usePagePlayerTagModifyStore } from '@/data/data_status/app_status/page_status/player_store/usePagePlayerTagModifyStore'
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'
const playerAudioStore = usePlayerAudioStore()
const {
  playlist_names_ALLLists,
  playlist_Menu_Item_Rating,
  playlist_Menu_Item_Id,
  playlist_Menu_Item_IndexId,
  playlist_Menu_Item,
} = storeToRefs(playlistStore)

const { this_audio_song_name, page_top_album_image_url } = storeToRefs(playerAudioStore)

const {
  page_songlists_bool_show_search_area,
  page_songlists_input_search_Value,
  page_songlists_multi_sort,
  page_songlists_filter_model,
  page_songlists_filter_year,
  page_songlists_suffix,
  page_songlists_library_path,
  page_songlists_library_folder_path,
  page_songlists_bitrate_range,
  page_songlists_selected,
  page_songlists_options,
  media_Files_selected,
  media_Files_temporary,
} = storeToRefs(pageMediaStore)

const Type_Add_Playlist = ref(false)
const playlist_set_of_addPlaylist_of_playlistname = ref('')
const playlist_set_of_addPlaylist_of_comment = ref('')
const playlist_set_of_addPlaylist_of_public = ref(false)
async function update_playlist_addPlaylist() {
  try {
    Type_Add_Playlist.value = false
    if (store_server_user_model.model_select === 'server') {
      // send json to server_configs_stores
      let getCreatePlaylist_set_id =
        await store_server_data_set_playlistInfo.Set_PlaylistInfo_To_Update_CreatePlaylist_Server(
          playlist_set_of_addPlaylist_of_playlistname.value,
          playlist_set_of_addPlaylist_of_public.value
        )
      if (getCreatePlaylist_set_id !== undefined && getCreatePlaylist_set_id !== '') {
        console.log(
          'CreatePlaylist_of_ND: ' +
            store_server_user_model.username +
            ': ' +
            getCreatePlaylist_set_id
        )
        await store_server_data_set_playlistInfo.Set_PlaylistInfo_To_Update_SetPlaylist(
          getCreatePlaylist_set_id,
          playlist_set_of_addPlaylist_of_playlistname.value,
          playlist_set_of_addPlaylist_of_comment.value,
          playlist_set_of_addPlaylist_of_public.value
        )
        console.log(
          'SetPlaylist_of_ND: ' + store_server_user_model.username + ': ' + getCreatePlaylist_set_id
        )
        // get server_configs_stores all playlist
        await store_general_model_player_list.get_playlists_info()
        //
        console.log(
          'SetPlaylist_of_Local: ' +
            getCreatePlaylist_set_id +
            ': ' +
            playlist_set_of_addPlaylist_of_playlistname.value +
            ': ' +
            playlist_set_of_addPlaylist_of_comment.value +
            ': ' +
            playlist_set_of_addPlaylist_of_public.value
        )
        //
        pageMediaStore.media_playlist_count++
      }
    } else {
      store_general_model_player_list.get_playlist_tracks_temporary_add(
        playlist_set_of_addPlaylist_of_playlistname.value
      )
    }

    page_songlists_statistic.value.forEach((item: any) => {
      if (item.id === 'song_list_all_PlayList') {
        item.song_count = pageMediaStore.media_playlist_count + ' *'
      }
    })
  } catch (e) {
    console.error(e)
  }
}
/// update playlist
const Type_Update_Playlist = ref(false)
const playlist_update_emit_id = ref<string>('')
const playlist_set_of_updatePlaylist_of_playlistcomment = ref('')
const playlist_set_of_updatePlaylist_of_comment = ref('')
const playlist_set_of_updatePlaylist_of_public = ref(false)
function update_playlist_set_of_updatePlaylist_of_playlistname(
  value: Array | string | number | null,
  option: SelectBaseOption | null | SelectBaseOption[]
) {
  playlist_update_emit_id.value = value
  playlist_set_of_updatePlaylist_of_playlistcomment.value = option.label
  // if(store_server_user_model.model_select === 'server_configs_stores'){
  //   playlist_set_of_updatePlaylist_of_comment.value =
  //   playlist_set_of_updatePlaylist_of_public.value =
  // }
}
async function update_playlist_updatePlaylist() {
  try {
    Type_Update_Playlist.value = false
    playlist_set_of_updatePlaylist_of_playlistcomment.value = ''

    const playlist = {
      id: playlist_update_emit_id.value,
      name: playlist_set_of_updatePlaylist_of_playlistcomment.value,
    }

    if (store_server_user_model.model_select === 'server') {
      await store_server_data_set_playlistInfo.Set_PlaylistInfo_To_Update_SetPlaylist(
        playlist_update_emit_id.value,
        playlist_set_of_updatePlaylist_of_playlistcomment.value,
        playlist_set_of_updatePlaylist_of_comment.value,
        playlist_set_of_updatePlaylist_of_public.value
      )
    } else {
      store_general_model_player_list.get_playlist_tracks_temporary_update(playlist)
    }
  } catch (e) {
    console.error(e)
  }
}
async function update_playlist_deletePlaylist() {
  try {
    Type_Update_Playlist.value = false
    playlist_set_of_updatePlaylist_of_playlistcomment.value = ''
    if (playlist_update_emit_id.value.length > 0) {
      store_general_model_player_list.get_playlist_tracks_temporary_delete(
        playlist_update_emit_id.value
      )
      if (store_server_user_model.model_select === 'server') {
        const result =
          await store_server_data_set_playlistInfo.Set_PlaylistInfo_To_Update_DeletePlaylist(
            playlist_update_emit_id.value
          )
        if (result !== undefined) {
          pageMediaStore.media_playlist_count--
        }
      }
      page_songlists_statistic.value.forEach((item: any) => {
        if (item.id === 'song_list_all_PlayList') {
          item.song_count = pageMediaStore.media_playlist_count + ' *'
        }
      })
    }
  } catch (e) {
    console.error(e)
  }
}
/// update media_file
async function update_playlist_addMediaFile(id: any, playlist_id: any) {
  try {
    await store_local_data_set_mediaInfo.Set_MediaInfo_Add_Selected_Playlist(id, playlist_id)
    message.success(t('common.add'))
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()
  } catch (e) {
    console.error(e)
  }
}
async function update_playlist_deleteMediaFile(id: any) {
  try {
    if (pageMediaStore.page_songlists_selected === 'song_list_all') {
    } else if (pageMediaStore.page_songlists_selected === 'song_list_love') {
      await store_local_data_set_mediaInfo.Set_MediaInfo_To_Favorite(id, true)
    } else if (pageMediaStore.page_songlists_selected === 'song_list_recently') {
    } else {
      if (
        store_server_users.server_select_kind === 'jellyfin' ||
        store_server_users.server_select_kind === 'emby'
      ) {
        await store_local_data_set_mediaInfo.Set_MediaInfo_Delete_Selected_Playlist(
          playlist_Menu_Item_IndexId.value,
          pageMediaStore.page_songlists_selected
        )
      } else {
        await store_local_data_set_mediaInfo.Set_MediaInfo_Delete_Selected_Playlist(
          id,
          pageMediaStore.page_songlists_selected
        )
      }
    }
    pageMediaStore.media_Files_temporary = pageMediaStore.media_Files_temporary.filter(
      (media: any) => media.id !== id
    )
    message.success(t('common.delete'))
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()
  } catch (e) {
    console.error(e)
  }
}
/// update selected media_file
const Type_Selected_Media_File_To_Playlist = ref(false)
async function update_playlist_addMediaFile_selected(playlist_id: any) {
  await pageMediaStore.get_selected_playlist_add_MediaFile(playlist_id)
  message.success(t('common.add'))
  Type_Selected_Media_File_To_Playlist.value = false
  click_open_bulk_operation()
}
async function update_lovelist_addMediaFile_selected() {
  pageMediaStore.get_selected_lovelist_add_MediaFile(true)
  message.success(t('common.add'))
  Type_Selected_Media_File_To_Playlist.value = false
  click_open_bulk_operation()
}
async function update_button_deleteMediaFile_selected() {
  if (pageMediaStore.page_songlists_selected === 'song_list_all') {
    await update_locallist_deleteMediaFile_selected(pageMediaStore.page_songlists_selected)
  } else if (pageMediaStore.page_songlists_selected === 'song_list_love') {
    await update_lovelist_deleteMediaFile_selected(pageMediaStore.page_songlists_selected)
  } else if (pageMediaStore.page_songlists_selected !== 'song_list_all') {
    await update_playlist_deleteMediaFile_selected(pageMediaStore.page_songlists_selected)
  }
  pageMediaStore.media_Files_temporary = pageMediaStore.media_Files_temporary.filter(
    (file) => !pageMediaStore.media_Files_selected.some((selected) => selected.id === file.id)
  )
  message.success(t('common.delete'))
}
async function update_playlist_deleteMediaFile_selected(playlist_id: any) {
  await pageMediaStore.get_selected_playlist_delete_MediaFile(playlist_id)
  Type_Selected_Media_File_To_Playlist.value = false
  click_open_bulk_operation()
}
async function update_locallist_deleteMediaFile_selected(playlist_id: any) {
  pageMediaStore.get_selected_locallist_delete_MediaFile(playlist_id)
  Type_Selected_Media_File_To_Playlist.value = false
  click_open_bulk_operation()
}
async function update_lovelist_deleteMediaFile_selected(playlist_id: any) {
  pageMediaStore.get_selected_lovelist_delete_MediaFile(playlist_id)
  Type_Selected_Media_File_To_Playlist.value = false
  click_open_bulk_operation()
}
async function update_recentlist_deletetMediaFile_selected(playlist_id: any) {
  pageMediaStore.get_selected_recentlist_deletet_MediaFile(playlist_id)
  Type_Selected_Media_File_To_Playlist.value = false
  click_open_bulk_operation()
}

/// multi_level_sort
interface SortCondition {
  key: string
  order: string
}
const allSortKeys = computed(() => [
  { label: t('filter.title'), value: 'title' },
  { label: t('entity.album_other'), value: 'album' },
  { label: t('entity.artist_other'), value: 'artist' },
  { label: t('table.column.albumArtist'), value: 'album_artist' },
  { label: t('filter.releaseYear'), value: 'year' },
  { label: t('filter.duration'), value: 'duration' },
  { label: t('common.bitrate'), value: 'bit_rate' },
  { label: t('LabelSize'), value: 'size' },
  { label: t('filter.playCount'), value: 'play_count' },
  { label: t('common.favorite') + t('LabelLevel'), value: 'rating' },
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
  pageMediaStore.page_songlists_multi_sort = generateSortQuery()
  store_general_fetch_media_list.fetchData_Media_of_server_web_start()
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
  const storedQuery = pageMediaStore.page_songlists_multi_sort

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

////// bulk_operation and select_line
const click_select_MediaList_ALL_Line = () => {
  if (pageMediaStore.media_Files_selected.length == 0) {
    pageMediaStore.set_media_Files_selected_all(true)
  } else {
    pageMediaStore.set_media_Files_selected_all(false)
  }
}
const click_open_bulk_operation = () => {
  if (bool_start_play.value == true) {
    bool_start_play.value = false
    pageMediaStore.set_media_Files_selected_all(false)
  } else {
    bool_start_play.value = true
  }
}
////// Right_click_on_songline show menu
let click_count = 0
const bool_start_play = ref<boolean>(true)
const options_dropdown_play_mode = ref<any[]>([
  {
    label: computed(() => t('nsmusics.siderbar_player.playback_1')),
    key: 'options_dropdown_play_mode_1',
    icon() {
      return h(
        NIcon,
        { size: 20 },
        {
          default: () => h(ArrowAutofitDown24Regular),
        }
      )
    },
  },
  {
    label: computed(() => t('nsmusics.siderbar_player.playback_2')),
    key: 'options_dropdown_play_mode_2',
    icon() {
      return h(
        NIcon,
        { size: 20 },
        {
          default: () => h(ArrowRepeatAll16Regular),
        }
      )
    },
  },
  {
    label: computed(() => t('nsmusics.siderbar_player.playback_4')),
    key: 'options_dropdown_play_mode_3',
    icon() {
      return h(
        NIcon,
        { size: 14 },
        {
          default: () => h(Random),
        }
      )
    },
  },
])
const begin_select_MediaList_ALL_Line_of_playback = (key: string | number) => {
  click_count = 2
  if (key === 'options_dropdown_play_mode_1') {
    playerSettingStore.play_order = 'playback-1'
  } else if (key === 'options_dropdown_play_mode_2') {
    playerSettingStore.play_order = 'playback-2'
  } else {
    playerSettingStore.play_order = 'playback-4'
  }
  const mediaFiles = pageMediaStore.media_Files_temporary
  if (mediaFiles.length > 0) {
    let index
    if (key === 'options_dropdown_play_mode_1' || key === 'options_dropdown_play_mode_2') {
      index = 0
    } else {
      index = Math.floor(Math.random() * mediaFiles.length)
    }
    handleItemDbClick(mediaFiles[index], index)
  }
}
async function begin_random_play_model() {
  if (!store_server_user_model.random_play_model) {
    click_count = 2
    playlistStore.playlist_MediaFiles_temporary = []
    playerSettingStore.play_order = 'playback-4'
    if (store_server_users.server_select_kind === 'ninesong') {
      let get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
      await get_NineSong_Temp_Data_To_LocalSqlite.get_random_song_list(
        store_server_login_info.server_url,
        '0',
        '30'
      )
    } else if (store_server_users.server_select_kind === 'navidrome') {
      let get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
      await get_Navidrome_Temp_Data_To_LocalSqlite.get_random_song_list(
        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
        store_server_user_model.username,
        store_server_user_model.token,
        store_server_user_model.salt,
        '30',
        '',
        ''
      )
    } else {
      pageMediaStore.list_options_Hand_Sort = false
      if (store_server_users.server_select_kind === 'jellyfin') {
        pageMediaStore.page_songlists_options_Sort_key = [
          {
            columnKey: String('Random,SortName'),
            order: state_Sort.Ascend,
          },
        ]
      } else if (store_server_users.server_select_kind === 'emby') {
        pageMediaStore.page_songlists_options_Sort_key = [
          {
            columnKey: String('Random'),
            order: state_Sort.Ascend,
          },
        ]
      }
      await page_songlists_handleselected_updatevalue('song_list_all')
      // await store_general_fetch_media_list.fetchData_Media()
      scrollTo(0)
      if (pageMediaStore.media_Files_temporary.length > 0) {
        click_count = 2
        bool_start_play.value = true
        await handleItemDbClick(pageMediaStore.media_Files_temporary[0], 0)
      }
    }
    store_server_user_model.random_play_model = true
  } else {
    store_server_user_model.random_play_model = false
    pageMediaStore.list_options_Hand_Sort = true
    if (store_server_users.server_select_kind === 'ninesong') {
      pageMediaStore.page_songlists_options_Sort_key = [
        {
          columnKey: String('_id'),
          order: state_Sort.Ascend,
        },
      ]
    } else if (store_server_users.server_select_kind === 'navidrome') {
      pageMediaStore.page_songlists_options_Sort_key = [
        {
          columnKey: String('id'),
          order: state_Sort.Ascend,
        },
      ]
    } else {
      if (store_server_users.server_select_kind === 'jellyfin') {
        handleSelect_Sort('Random,SortName')
      } else if (store_server_users.server_select_kind === 'emby') {
        handleSelect_Sort('Random')
      }
    }
  }
}

////// right menu
const contextmenu = ref(null as any)
const menu_item_add_to_songlist = computed(() => t('form.addToPlaylist.title'))
function menu_item_add_to_playlist_end() {
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

    contextmenu.value.hide()
  }
}
function menu_item_add_to_playlist_next() {
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

    contextmenu.value.hide()
  }
}
function menu_item_edit_selected_media_tags() {
  playerTagModifyStore.player_show_tag_kind = 'media'
  const item: Media_File | undefined = pageMediaStore.media_Files_temporary.find(
    (mediaFile: Media_File) => mediaFile.id === playlist_Menu_Item_Id.value
  )
  if (item != undefined && item != 'undefined') {
    playerTagModifyStore.player_current_media_path = item.path
    playerTagModifyStore.player_current_media_id = item.id
    playerTagModifyStore.player_show_tag_modify = true
    contextmenu.value.hide()
  }
}

//////
const isScrolling = ref(false)
const onScrollStart = () => {}
const onScrollEnd = async () => {
  if (isScrolling.value) return
  isScrolling.value = true
  if (store_server_user_model.model_server_type_of_web) {
    await store_general_fetch_media_list.fetchData_Media_of_server_web_end()
  }
  isScrolling.value = false
}
const onScroll = async () => {}

/////
const onRefreshSharp = debounce(async (event, args) => {
  if (store_server_user_model.model_server_type_of_web) {
    if (
      store_server_users.server_select_kind === 'jellyfin' ||
      store_server_users.server_select_kind === 'emby'
    ) {
      playerAppearanceStore.player_mode_of_medialist_from_external_import = false
    } else if (store_server_users.server_select_kind === 'ninesong') {
      store_general_fetch_media_list.set_album_id('')
      store_general_fetch_media_list.set_artist_id('')
    }
    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    pageMediaStore.page_songlists_keyword = ''
    input_search_InstRef.value?.clear()
    pageMediaStore.page_songlists_keywordFilter = ''
    pageMediaStore.page_songlists_bool_show_search_area = false
    store_general_fetch_media_list.fetchData_Media_of_server_web_start()
  } else if (store_server_user_model.model_server_type_of_local) {
    pageMediaStore.page_songlists_bool_show_search_area = true
    show_search_area()
    pageMediaStore.page_songlists_keywordFilter = ''
    pageMediaStore.list_selected_Hand_click = false
    // store_general_fetch_media_list.fetchData_Media()
  }
}, 500)

//////
function current_list_add_to_playlist_end() {
  pageMediaStore.media_Files_temporary.forEach((item: any, index: number) => {
    if (item != undefined && item != 'undefined') {
      const newItem: any = JSON.parse(JSON.stringify(item))
      newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
      playlistStore.playlist_MediaFiles_temporary.push(newItem)
      playlistStore.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
        item.absoluteIndex = index
      })
      playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.push(newItem.id)
      store_system_configs_save.save_system_playlist_item_id_config()
    }
  })
}

const page_songlists_statistic = ref<
  {
    label: ''
    song_count: ''
    id: ''
  }[]
>([])
function Refresh_page_songlists_statistic() {
  page_songlists_statistic.value = []
  pageMediaStore.page_songlists_statistic.forEach((item: any, index: number) => {
    page_songlists_statistic.value.push({
      label: pageMediaStore.page_songlists_statistic[index].label,
      song_count: pageMediaStore.page_songlists_statistic[index].song_count,
      id: pageMediaStore.page_songlists_statistic[index].id,
    })
  })
}
onMounted(() => {
  Refresh_page_songlists_statistic()
})
const stopWatching_boolHandleItemClick_Favorite = watch(
  () => playerSettingStore.boolHandleItemClick_Favorite,
  (newValue) => {
    if (newValue) {
      Refresh_page_songlists_statistic()
      playerSettingStore.boolHandleItemClick_Favorite = false
    }
  }
)
const stopWatching_boolHandleItemClick_Played = watch(
  () => playerSettingStore.boolHandleItemClick_Played,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      Refresh_page_songlists_statistic()
      playerSettingStore.boolHandleItemClick_Played = false
    }
  },
  { immediate: true }
)

///
const browseFolderOptions = ref([])
const browseFolderPathOptions = ref([])
const audioSuffixOptions = ref([
  // 第一梯队：绝对主流
  { label: 'mp3', value: 'mp3' },
  { label: 'wav', value: 'wav' },
  { label: 'aac', value: 'aac' },
  { label: 'flac', value: 'flac' },
  // 第二梯队：常见有条件支持
  { label: 'm4a', value: 'm4a' },
  { label: 'wma', value: 'wma' },
  { label: 'ogg', value: 'ogg' },
  { label: 'opus', value: 'opus' },
  // 第二梯队：专业/生态限定
  { label: 'aiff', value: 'aiff' },
  { label: 'alac', value: 'alac' },
  { label: 'ape', value: 'ape' },
  // 第三梯队：DSD专业格式
  { label: 'dsd', value: 'dsd' },
  { label: 'dff', value: 'dff' },
  { label: 'dsdiff', value: 'dsdiff' },
  { label: 'dsf', value: 'dsf' },
  // 第三梯队：语音编码
  { label: 'amr', value: 'amr' },
  { label: 'spx', value: 'spx' },
  // 第三梯队：冷门无损
  { label: 'wv', value: 'wv' },
  { label: 'tta', value: 'tta' },
  { label: 'tak', value: 'tak' },
])
let folder_Entity_ApiService_of_NineSong = new Folder_Entity_ApiService_of_NineSong(
  store_server_login_info.server_url
)
onMounted(async () => {
  if (
    store_server_user_model.model_server_type_of_web &&
    store_server_users.server_select_kind === 'ninesong'
  ) {
    store_server_users.server_all_library =
      await folder_Entity_ApiService_of_NineSong.getFolder_Entity_All()
    browseFolderOptions.value = store_server_users.server_all_library.map((item: any) => ({
      label: item.name,
      value: item.folderPath,
    }))
  }
  ///
  pageMediaStore.page_songlists_filter_year = 0
  pageMediaStore.page_songlists_bitrate_range = [0, 0]
  pageMediaStore.page_songlists_library_path = ''
  pageMediaStore.page_songlists_library_folder_path = ''
  pageMediaStore.page_songlists_suffix = ''
  pageMediaStore.page_songlists_filter_model = false
})
async function filter_media_folder_path() {
  pageMediaStore.page_songlists_keywordFilter = ''
  pageMediaStore.list_selected_Hand_click = false
  //
  pageMediaStore.page_songlists_filter_model =
    pageMediaStore.page_songlists_filter_year != 0 ||
    pageMediaStore.page_songlists_bitrate_range[0] != 0 ||
    pageMediaStore.page_songlists_bitrate_range[1] != 0 ||
    pageMediaStore.page_songlists_library_path.length > 0 ||
    pageMediaStore.page_songlists_suffix.length > 0
  //
  await store_general_fetch_media_list.fetchData_Media()
}
async function find_server_folder_path(path: string) {
  if (path === undefined || path === '') {
    path = pageMediaStore.page_songlists_library_path
  }
  const result = await folder_Entity_ApiService_of_NineSong.browseFolder_Entity(path)
  if (result) {
    browseFolderPathOptions.value = result.map((item: any) => ({
      label: item.name,
      value: item.path,
    }))
    browseFolderPathOptions.value.unshift({
      label: '...',
      value: pageMediaStore.page_songlists_library_path,
    })
  }
}

////// view songlist_view Remove data
onBeforeUnmount(() => {
  stopWatching_boolHandleItemClick_Favorite()
  stopWatching_boolHandleItemClick_Played()
  stopWatching_router_history_model_of_Media_scroll()
  stopWatching_conditionCount()
  dynamicScroller.value = null
  store_general_fetch_media_list.set_album_id('')
  store_general_fetch_media_list.set_artist_id('')
})

function scrollerStart() {
  if (dynamicScroller.value && dynamicScroller.value.$el) {
    dynamicScroller.value.$el.style.scrollBehavior = 'auto'
    dynamicScroller.value.$el.scrollTop = 0
    setTimeout(() => {
      if (dynamicScroller.value && dynamicScroller.value.$el) {
        dynamicScroller.value.$el.style.scrollBehavior = 'smooth'
      }
    }, 100)
  }
}
function scrollerEnd() {
  if (dynamicScroller.value && dynamicScroller.value.$el) {
    dynamicScroller.value.$el.style.scrollBehavior = 'auto'
    dynamicScroller.value.$el.scrollTop = dynamicScroller.value.$el.scrollHeight
    setTimeout(() => {
      if (dynamicScroller.value && dynamicScroller.value.$el) {
        dynamicScroller.value.$el.style.scrollBehavior = 'smooth'
      }
    }, 100)
  }
}
</script>

<template>
  <n-space vertical :size="12">
    <div class="dynamic-scroller-demo-media">
      <n-space vertical @wheel.prevent style="position: absolute; top: 0">
        <n-space align="center" style="margin-top: 3px">
          <n-space>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button
                  quaternary
                  circle
                  @click="
                    () => {
                      pageMediaStore.page_songlists_bool_show_search_area = true
                      store_general_fetch_media_list.set_album_id('')
                      store_general_fetch_media_list.set_artist_id('')
                      show_search_area()
                    }
                  "
                >
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
                  <n-icon :size="20" :depth="2"><Search20Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('Search') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top" v-if="page_songlists_bool_show_search_area">
            <template #trigger>
              <n-input-group style="width: 144px">
                <n-input
                  style="width: 144px"
                  ref="input_search_InstRef"
                  v-model:value="page_songlists_input_search_Value"
                  @keydown.enter="click_search"
                />
              </n-input-group>
            </template>
            {{
              $t('setting.hotkey_localSearch') +
              ' : (' +
              $t('LabelTitle') +
              ' / ' +
              $t('LabelAlbum') +
              ' / ' +
              $t('LabelArtists') +
              ')->' +
              $t('nsmusics.view_page.pinyin') +
              ' | ' +
              $t('nsmusics.view_page.hybrid_search') +
              ': ' +
              $t('nsmusics.view_page.simplified_chinese') +
              '-' +
              $t('nsmusics.view_page.traditional_chinese') +
              ' | ' +
              $t('Lyrics')
            }}
          </n-tooltip>

          <n-dropdown
            trigger="click"
            :show-arrow="true"
            :dropdown-props="{ style: { maxHeight: '200px', overflowY: 'auto' } }"
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
              <n-badge v-if="page_songlists_multi_sort.length > 0" dot value="1" :offset="[-18, 3]">
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
              <n-badge v-if="page_songlists_filter_model" :offset="[-17, 3]" dot>
                <n-button quaternary circle @click="Type_Filter_Show = true">
                  <template #icon>
                    <n-icon :size="20"><Filter20Filled /></n-icon>
                  </template>
                </n-button>
              </n-badge>
              <n-button v-else quaternary circle @click="Type_Filter_Show = true">
                <template #icon>
                  <n-icon :size="20"><Filter20Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('Filters') }}
          </n-tooltip>

          <n-divider
            v-if="page_songlists_selected !== 'song_list_recently'"
            vertical
            style="
              width: 2px;
              height: 20px;
              margin-top: -4px;
              margin-left: 10px;
              margin-right: 10px;
            "
          />
          <n-tooltip
            v-if="page_songlists_selected !== 'song_list_recently'"
            trigger="hover"
            placement="top"
          >
            <template #trigger>
              <n-button quaternary circle @click="click_open_bulk_operation">
                <template #icon>
                  <n-icon :size="20" :depth="2"><MultiselectLtr20Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('Select') }}
          </n-tooltip>
          <n-space v-if="!bool_start_play">
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button quaternary circle @click="click_select_MediaList_ALL_Line">
                  <template #icon>
                    <n-icon :size="20" :depth="2"><SelectAllOn24Regular /></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('SelectAll') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button
                  quaternary
                  circle
                  @click="
                    Type_Selected_Media_File_To_Playlist = !Type_Selected_Media_File_To_Playlist
                  "
                >
                  <template #icon>
                    <n-icon :size="20" :depth="2"><AddCircle32Regular /></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('action.addToPlaylist') }}
            </n-tooltip>
            <n-tooltip
              trigger="hover"
              placement="top"
              v-if="
                store_server_user_model.model_select !== 'server' ||
                (store_server_user_model.model_select === 'server' &&
                  pageMediaStore.page_songlists_selected !== 'song_list_all') ||
                (store_server_user_model.model_select === 'server' &&
                  pageMediaStore.page_songlists_selected !== 'song_list_all' &&
                  !store_server_user_model.model_server_type_of_web)
              "
            >
              <template #trigger>
                <n-button quaternary circle @click="update_button_deleteMediaFile_selected">
                  <template #icon>
                    <n-icon :size="20" :depth="2"><Delete20Regular /></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('Delete') }}
            </n-tooltip>
            <n-p style="margin-top: 6px">
              {{ $t('nsmusics.view_page.selectedMedia') + ' ' + media_Files_selected.length }}
              *
            </n-p>
          </n-space>

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
          <n-dropdown
            v-if="
              store_server_users.server_select_kind != 'jellyfin' &&
              store_server_users.server_select_kind != 'emby' &&
              store_server_user_model.model_server_type_of_local
            "
            trigger="click"
            :show-arrow="true"
            :options="options_dropdown_play_mode"
            @select="begin_select_MediaList_ALL_Line_of_playback"
          >
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button quaternary circle style="margin-left: 4px">
                  <template #icon>
                    <n-icon :size="20" :depth="2"><Play /></n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('Play') }}
            </n-tooltip>
          </n-dropdown>
          <n-tooltip
            v-if="
              store_server_user_model.model_server_type_of_web &&
              (store_server_users.server_select_kind === 'jellyfin' ||
                store_server_users.server_select_kind === 'emby')
            "
            trigger="hover"
            placement="top"
          >
            <template #trigger>
              <div>
                <n-badge
                  v-if="store_server_user_model.random_play_model"
                  dot
                  :value="store_server_user_model.random_play_model"
                  :offset="[-18, 6]"
                >
                  <n-button
                    quaternary
                    circle
                    @click="begin_random_play_model"
                    style="margin-left: 4px"
                  >
                    <template #icon>
                      <n-icon :size="18" :depth="2"><Random /></n-icon>
                    </template>
                  </n-button>
                </n-badge>
                <n-button
                  v-else
                  quaternary
                  circle
                  @click="begin_random_play_model"
                  style="margin-left: 4px"
                >
                  <template #icon>
                    <n-icon :size="18" :depth="2"><Random /></n-icon>
                  </template>
                </n-button>
              </div>
            </template>
            {{
              $t('Shuffle') + ' ' + $t('HeaderLibraries') + ' ' + $t('nsmusics.view_page.allMedia')
            }}
          </n-tooltip>
          <n-divider
            v-if="
              store_server_user_model.model_server_type_of_web &&
              (store_server_users.server_select_kind === 'jellyfin' ||
                store_server_users.server_select_kind === 'emby')
            "
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
              <n-button quaternary circle @click="scrollerStart">
                <template #icon>
                  <n-icon :size="20" :depth="2"><PaddingTop20Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('action.moveToTop') }}
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-button quaternary circle @click="scrollerEnd">
                <template #icon>
                  <n-icon :size="20" :depth="2"><PaddingDown20Filled /></n-icon>
                </template>
              </n-button>
            </template>
            {{ $t('action.moveToBottom') }}
          </n-tooltip>
        </n-space>
        <n-space align="center">
          <n-space style="margin-left: 10px">
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-select
                  size="small"
                  :value="page_songlists_selected"
                  :options="page_songlists_options"
                  style="width: 191px"
                  @update:value="page_songlists_handleselected_updatevalue"
                />
              </template>
              {{ $t('Select') + $t('LabelPlaylist') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button
                  size="small"
                  style="margin-left: 12px"
                  secondary
                  strong
                  @click="Type_Update_Playlist = !Type_Update_Playlist"
                >
                  <template #icon>
                    <n-icon>
                      <Menu />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('HeaderAdmin') + $t('LabelPlaylist') }}
            </n-tooltip>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button
                  size="small"
                  style="margin-left: 2px"
                  secondary
                  strong
                  @click="Type_Add_Playlist = !Type_Add_Playlist"
                >
                  <template #icon>
                    <n-icon>
                      <Add />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ $t('Add') + $t('LabelPlaylist') }}
            </n-tooltip>
          </n-space>
        </n-space>
      </n-space>

      <div 
        v-if="!media_Files_temporary || media_Files_temporary.length === 0" 
        class="empty-state"
        style="
        margin-left: 10px;
        height: calc(100vh - 241px);
        position: absolute;top: 90px;
        padding-top: 70px;
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
        class="table-media"
        ref="dynamicScroller"
        :style="{
          width: 'calc(100vw - ' + (collapsed_width - 35) + 'px)',
          height: 'calc(100vh - 226px)',
          marginTop: '80px',
        }"
        :items="media_Files_temporary"
        :minItemSize="50"
        :emit-update="true"
        key-field="absoluteIndex"
        @resize="onResize"
        @update="onUpdate"
        @scroll-start="onScrollStart"
        @scroll-end="onScrollEnd"
        @scroll="onScroll"
      >
        <template #before>
          <n-space
            style="
              position: relative;
              z-index: 1;
              width: calc(100vw - 140px);
              height: 196px;
              border-radius: 10px;
              margin-left: 12.5px;
              margin-top: 20px;
            "
          >
            <img
              style="
                width: 194px;
                height: 194px;
                border-radius: 12px;
                object-fit: cover;
                margin-left: -3px;
              "
              :src="getAssetImage(page_top_album_image_url)"
              alt=""
            />
            <n-space vertical justify="end" align="start" style="height: 194px">
              <n-space style="margin-left: 11px">
                <div style="font-size: 26px; font-weight: 600">
                  {{ $t('entity.track_other') + ':' }}
                </div>
              </n-space>
              <n-space style="margin-left: 11px; margin-top: -14px">
                <div
                  :style="{
                    maxWidth: 'calc(100vw - ' + (collapsed_width + 480) + 'px)',
                  }"
                  style="
                    margin-bottom: 8px;
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
                  {{ this_audio_song_name }}
                </div>
              </n-space>
              <n-space
                style="
                  margin-top: -14px;
                  margin-left: 10px;
                  margin-bottom: 4px;
                  border-left: 4px solid var(--primary-color-hover);
                  border-radius: 3px;
                "
              >
                <n-button
                  secondary
                  strong
                  style="height: 36px"
                  @click="
                    () => {
                      click_count = 2
                      handleItemDbClick(media_Files_temporary[0], 0)
                    }
                  "
                >
                  <template #icon>
                    <n-icon size="22" :depth="2">
                      <Play24Filled />
                    </n-icon>
                  </template>
                  <div style="margin-left: 6px; font-size: 14px; font-weight: 600">
                    {{ $t('HeaderPlayAll') }}
                  </div>
                </n-button>
                <n-button
                  secondary
                  strong
                  style="height: 36px"
                  @click="current_list_add_to_playlist_end()"
                >
                  <template #icon>
                    <n-icon size="22" :depth="2">
                      <AddCircle20Filled />
                    </n-icon>
                  </template>
                  <div style="margin-left: 6px; font-size: 14px; font-weight: 600">
                    {{ $t('All') + $t('AddToPlayQueue') }}
                  </div>
                </n-button>
              </n-space>
              <n-space
                vertical
                justify="center"
                style="
                  margin-left: 10px;
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
                  <n-gi v-for="songlist in page_songlists_statistic" :key="songlist.id">
                    <n-statistic :label="songlist.label" :value="songlist.song_count" />
                  </n-gi>
                </n-grid>
              </n-space>
            </n-space>
          </n-space>
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
                playlist_Menu_Item_Rating = item.rating
                playlist_Menu_Item_IndexId = item.order_title
                playlist_Menu_Item = item
              }
            "
            class="message-media"
            :style="{ width: 'calc(100vw - ' + (collapsed_width - 17) + 'px)' }"
            @click="handleItemClick"
            @dblclick="handleItemDbClick(item, index)"
          >
            <div class="media_info" :style="{ width: 'calc(100vw - ' + collapsed_width + 'px)' }">
              <input
                type="checkbox"
                class="checkbox"
                v-if="!bool_start_play"
                v-model="item.selected"
                @change="
                  (event) => {
                    item.selected = event.target.checked
                    pageMediaStore.set_media_Files_selected(item)
                  }
                "
              />
              <div
                style="
                  margin-left: 8px;
                  width: 60px;
                  height: 60px;
                  border-radius: 10px;
                  border: 1.5px solid #ffffff20;
                  overflow: hidden;
                  position: relative;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <img
                  :key="item.id"
                  :src="item.medium_image_url"
                  @error="handleImageError(item)"
                  style="width: 100%; height: 100%; object-fit: cover; position: absolute"
                  alt=""
                />
                <icon
                  class="hover-overlay-media"
                  color="#FFFFFF"
                  :size="28"
                  style="position: relative; z-index: 1; cursor: pointer"
                  @click="
                    () => {
                      click_count = 2
                      handleItemDbClick(item, index)
                    }
                  "
                >
                  <Play style="margin-left: 25%; margin-top: 25%" />
                </icon>
              </div>
              <div class="songlist_name">
                <span
                  class="songlist_title"
                  style="font-size: 16px; font-weight: 550"
                  @click="handleItemClick_title(item.title)"
                >
                  {{ item.title }}
                </span>
                <br />
                <template
                  v-if="item.all_artist_ids === undefined"
                  v-for="artist in item.artist.split(/[\/|｜、]/) ?? item.artist"
                >
                  <span
                    class="songlist_artist"
                    style="font-size: 14px; font-weight: 400"
                    @click="
                      () => {
                        handleItemClick_artist(artist)
                      }
                    "
                  >
                    {{ artist + '&nbsp' }}
                  </span>
                </template>
                <template v-else v-for="artist in item.all_artist_ids">
                  <span
                    class="songlist_artist"
                    style="font-size: 14px; font-weight: 400"
                    @click="
                      () => {
                        if (store_server_users.server_select_kind === 'ninesong') {
                          handleItemClick_artist(artist.ArtistID)
                        } else {
                          handleItemClick_artist(artist.ArtistName)
                        }
                      }
                    "
                  >
                    {{ artist.ArtistName + '&nbsp' }}
                  </span>
                </template>
              </div>
              <div class="songlist_album">
                <span
                  style="font-size: 14px; font-weight: 600"
                  @click="
                    () => {
                      if (store_server_user_model.model_server_type_of_local) {
                        handleItemClick_album(item.album_id)
                      } else if (store_server_user_model.model_server_type_of_web) {
                        if (store_server_users.server_select_kind === 'ninesong') {
                          handleItemClick_album(item.album_id)
                        } else {
                          handleItemClick_album(item.album)
                        }
                      }
                    }
                  "
                  >{{ item.album }}</span
                >
              </div>
              <div
                style="
                  margin-left: auto;
                  margin-right: 0;
                  width: 40px;
                  display: flex;
                  flex-direction: row;
                "
              >
                <button
                  class="love-this-home-album-button"
                  @click="
                    () => {
                      handleItemClick_Favorite(item.id, item.favorite)
                      item.favorite = !item.favorite
                    }
                  "
                  style="
                    border: 0;
                    background-color: transparent;
                    width: 28px;
                    height: 28px;
                    margin-right: 10px;
                    cursor: pointer;
                  "
                >
                  <template v-if="item.favorite">
                    <icon :size="20" color="red" style="margin-left: -2px; margin-top: 3px"
                      ><Heart28Filled
                    /></icon>
                  </template>
                  <template v-else-if="!store_system_configs_info.update_theme">
                    <icon color="#101014" :size="20" style="margin-left: -2px; margin-top: 3px"
                      ><Heart24Regular
                    /></icon>
                  </template>
                  <template v-else-if="store_system_configs_info.update_theme">
                    <icon color="#FAFAFC" :size="20" style="margin-left: -2px; margin-top: 3px"
                      ><Heart24Regular
                    /></icon>
                  </template>
                </button>
              </div>
              <span
                v-if="
                  store_server_user_model.model_server_type_of_web &&
                  (store_server_users.server_select_kind === 'ninesong' ||
                    store_server_users.server_select_kind === 'navidrome')
                "
                style="
                  width: 100px;
                  margin-left: auto;
                  margin-top: 4px;
                  margin-right: 0;
                  text-align: left;
                  font-size: 14px;
                  font-weight: 600;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
                @click="click_count = 0"
              >
                {{ item.suffix + ':' + item.bit_rate }}
              </span>
              <span
                style="
                  width: 50px;
                  margin-left: auto;
                  margin-top: 4px;
                  font-size: 14px;
                  font-weight: 600;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                "
                @click="click_count = 0"
              >
                {{ item.duration_txt }}
              </span>
              <span
                class="index"
                style="
                  margin-left: auto;
                  text-align: left;
                  margin-top: 4px;
                  font-size: 14px;
                  font-weight: 600;
                "
                @click="click_count = 0"
              >
                {{ item.absoluteIndex }}
              </span>
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
            @click="update_playlist_addMediaFile(playlist_Menu_Item_Id, n.value)"
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
              handleItemClick_title(playlist_Menu_Item.title)
            }
          "
        >
          {{ $t('Search') + $t('LabelTitle') }}
        </v-contextmenu-item>
        <v-contextmenu-item
          v-if="
            (store_server_users.server_select_kind != 'jellyfin' &&
              store_server_users.server_select_kind != 'emby') ||
            store_server_user_model.model_server_type_of_local
          "
          @click="
            () => {
              if (store_server_user_model.model_server_type_of_local) {
                handleItemClick_album(playlist_Menu_Item.album_id)
              } else if (store_server_user_model.model_server_type_of_web) {
                if (store_server_users.server_select_kind === 'ninesong') {
                  handleItemClick_album(playlist_Menu_Item.album_id)
                } else {
                  handleItemClick_album(playlist_Menu_Item.album)
                }
              }
            }
          "
        >
          {{ $t('ViewAlbum') }}
        </v-contextmenu-item>
        <template
          v-if="
            store_server_users.server_select_kind === 'navidrome' ||
            store_server_user_model.model_server_type_of_local
          "
          v-for="artist in playlist_Menu_Item.artist.split(/[\/|｜、]/) ??
          playlist_Menu_Item.artist"
        >
          <v-contextmenu-item>
            <span
              style="font-size: 14px; font-weight: 400"
              @click="
                () => {
                  handleItemClick_artist(artist)
                }
              "
            >
              {{ $t('ViewAlbumArtist') + ' | ' + artist + '&nbsp' }}
            </span>
          </v-contextmenu-item>
        </template>
        <v-contextmenu-item
          v-if="
            (store_server_users.server_select_kind != 'jellyfin' &&
              store_server_users.server_select_kind != 'emby') ||
            store_server_user_model.model_server_type_of_local
          "
          @click="
            () => {
              Open_this_artist_all_artist_list_click(playlist_Menu_Item.artist_id)
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
        <v-contextmenu-item
          v-if="
            pageMediaStore.page_songlists_selected !== 'song_list_all' &&
            pageMediaStore.page_songlists_selected !== 'song_list_love' &&
            pageMediaStore.page_songlists_selected !== 'song_list_recently'
          "
          @click="update_playlist_deleteMediaFile(playlist_Menu_Item_Id)"
        >
          {{ $t('common.delete') }}
        </v-contextmenu-item>
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
        <v-contextmenu-divider
          v-if="
            (store_server_users.server_select_kind != 'jellyfin' &&
              store_server_users.server_select_kind != 'emby') ||
            store_server_user_model.model_server_type_of_local
          "
        />
        <v-contextmenu-item
          v-if="
            (store_server_users.server_select_kind != 'jellyfin' &&
              store_server_users.server_select_kind != 'emby') ||
            store_server_user_model.model_server_type_of_local
          "
        >
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
                handleItemClick_Rating(playlist_Menu_Item_Id + '-' + value)
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
            {{ page_songlists_multi_sort }}
          </n-space>
          <n-space
            vertical
            size="large"
            justify="space-between"
            style="width: 400px; margin-bottom: 12px"
          >
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
                    pageMediaStore.page_songlists_multi_sort = ''
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
                    v-model:value="page_songlists_filter_year"
                    @update:value="filter_media_folder_path"
                  />
                  <n-button
                    strong
                    secondary
                    @click="
                      () => {
                        pageMediaStore.page_songlists_filter_year = 0
                        filter_media_folder_path()
                      }
                    "
                  >
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
              </n-space>
              <n-space
                vertical
                v-if="
                  !store_server_user_model.model_server_type_of_web ||
                  (store_server_user_model.model_server_type_of_web &&
                    store_server_users.server_select_kind === 'ninesong')
                "
              >
                <span style="font-size: 14px; font-weight: 600">{{
                  $t('Audio') + $t('LabelFormat')
                }}</span>
                <n-space vertical>
                  <n-select
                    v-model:value="page_songlists_suffix"
                    :options="audioSuffixOptions"
                    placement="bottom"
                    style="width: 200px"
                    @update:value="filter_media_folder_path"
                  />
                  <n-button
                    strong
                    secondary
                    @click="
                      () => {
                        pageMediaStore.page_songlists_suffix = ''
                        filter_media_folder_path()
                      }
                    "
                  >
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
              </n-space>
            </n-space>
            <n-space justify="space-between">
              <n-space
                vertical
                v-if="
                  !store_server_user_model.model_server_type_of_web ||
                  (store_server_user_model.model_server_type_of_web &&
                    store_server_users.server_select_kind === 'ninesong')
                "
              >
                <span style="font-size: 14px; font-weight: 600">{{ $t('HeaderLibraries') }}</span>
                <n-space vertical>
                  <n-select
                    v-model:value="page_songlists_library_path"
                    :options="browseFolderOptions"
                    placement="bottom"
                    style="width: 200px"
                    @update:value="filter_media_folder_path"
                  />
                  <n-button
                    strong
                    secondary
                    @click="
                      () => {
                        pageMediaStore.page_songlists_library_path = ''
                        pageMediaStore.page_songlists_library_folder_path = ''
                        filter_media_folder_path()
                      }
                    "
                  >
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
              </n-space>
              <n-space
                vertical
                v-if="
                  !store_server_user_model.model_server_type_of_web ||
                  (store_server_user_model.model_server_type_of_web &&
                    store_server_users.server_select_kind === 'ninesong')
                "
              >
                <span style="font-size: 14px; font-weight: 600">{{
                  $t('Folders') + $t('Filters')
                }}</span>
                <n-space vertical>
                  <n-select
                    :disabled="page_songlists_library_path.length === 0"
                    v-model:value="page_songlists_library_folder_path"
                    :options="browseFolderPathOptions"
                    placement="bottom"
                    style="width: 200px"
                    @click="
                      find_server_folder_path(pageMediaStore.page_songlists_library_folder_path)
                    "
                    @update:value="filter_media_folder_path"
                  />
                  <n-button
                    strong
                    secondary
                    @click="
                      () => {
                        pageMediaStore.page_songlists_library_folder_path = ''
                        filter_media_folder_path()
                      }
                    "
                  >
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
              </n-space>
            </n-space>
            <n-space justify="space-between">
              <n-space
                vertical
                v-if="
                  !store_server_user_model.model_server_type_of_web ||
                  (store_server_user_model.model_server_type_of_web &&
                    store_server_users.server_select_kind === 'ninesong')
                "
              >
                <span style="font-size: 14px; font-weight: 600">{{
                  $t('nsmusics.view_page.option_min') + $t('common.bitrate')
                }}</span>
                <n-space vertical>
                  <n-input-number
                    v-model:value="page_songlists_bitrate_range[0]"
                    :step="100"
                    clearable
                    placeholder=""
                    style="width: 200px"
                    @update:value="filter_media_folder_path"
                  />
                  <n-button
                    strong
                    secondary
                    @click="
                      () => {
                        pageMediaStore.page_songlists_bitrate_range[0] = 0
                        filter_media_folder_path()
                      }
                    "
                  >
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
              </n-space>
              <n-space
                vertical
                v-if="
                  !store_server_user_model.model_server_type_of_web ||
                  (store_server_user_model.model_server_type_of_web &&
                    store_server_users.server_select_kind === 'ninesong')
                "
              >
                <span style="font-size: 14px; font-weight: 600">{{
                  $t('OptionMax') + $t('common.bitrate')
                }}</span>
                <n-space vertical>
                  <n-input-number
                    v-model:value="page_songlists_bitrate_range[1]"
                    :step="1000"
                    clearable
                    placeholder=""
                    style="width: 200px"
                    @update:value="filter_media_folder_path"
                  />
                  <n-button
                    strong
                    secondary
                    @click="
                      () => {
                        pageMediaStore.page_songlists_bitrate_range[1] = 0
                        filter_media_folder_path()
                      }
                    "
                  >
                    {{ $t('common.clear') }}
                  </n-button>
                </n-space>
              </n-space>
            </n-space>
          </n-space>
        </n-card>
      </n-modal>
    </div>
  </n-space>
  <!-- 管理播放列表 -->
  <n-modal v-model:show="Type_Update_Playlist">
    <n-card style="width: 450px; border-radius: 4px">
      <n-space vertical size="large" style="width: 400px">
        <n-space justify="space-between">
          <span style="font-size: 20px; font-weight: 600">{{
            $t('common.manage') + $t('entity.playlist_other')
          }}</span>
          <n-button
            tertiary
            size="small"
            @click="
              () => {
                Type_Update_Playlist = !Type_Update_Playlist
                playlist_set_of_updatePlaylist_of_playlistcomment = ''
              }
            "
          >
            <template #icon>
              <n-icon>
                <Close />
              </n-icon>
            </template>
          </n-button>
        </n-space>
        <n-select
          :options="playlist_names_ALLLists"
          style="width: 166px"
          @update:value="update_playlist_set_of_updatePlaylist_of_playlistname"
        />
        <n-form>
          <n-space
            v-if="
              (store_server_users.server_select_kind != 'jellyfin' &&
                store_server_users.server_select_kind != 'emby') ||
              store_server_user_model.model_server_type_of_local
            "
            vertical
            style="margin-bottom: 10px"
          >
            <span>{{ $t('common.name') }}</span>
            <n-input
              clearable
              placeholder=""
              v-model:value="playlist_set_of_updatePlaylist_of_playlistcomment"
            />
          </n-space>
          <!--          <n-space vertical style="margin-bottom: 10px;" v-if="store_server_user_model.model_select === 'server_configs_stores'">-->
          <!--            <span>{{ $t('filter.comment') }}</span>-->
          <!--            <n-input clearable placeholder="" v-model:value="playlist_set_of_updatePlaylist_of_comment"/>-->
          <!--          </n-space>-->
          <!--          <n-space vertical style="margin-bottom: 10px;" v-if="store_server_user_model.model_select === 'server_configs_stores'">-->
          <!--            <span>{{ $t('form.createPlaylist.input_public') }}</span>-->
          <!--            <n-switch v-model:value="playlist_set_of_updatePlaylist_of_public"/>-->
          <!--          </n-space>-->
        </n-form>
        <n-space justify="end">
          <n-button
            strong
            secondary
            type="error"
            @click="
              () => {
                update_playlist_deletePlaylist()
              }
            "
          >
            {{ $t('common.delete') }}
          </n-button>
          <n-button
            strong
            secondary
            type="info"
            v-if="
              (store_server_users.server_select_kind != 'jellyfin' &&
                store_server_users.server_select_kind != 'emby') ||
              store_server_user_model.model_server_type_of_local
            "
            @click="
              () => {
                update_playlist_updatePlaylist()
              }
            "
          >
            {{ $t('common.save') }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
  <!-- 添加播放列表 -->
  <n-modal v-model:show="Type_Add_Playlist">
    <n-card style="width: 450px; border-radius: 4px">
      <n-space vertical size="large" style="width: 400px">
        <n-space justify="space-between">
          <span style="font-size: 20px; font-weight: 600">{{
            $t('common.add') + $t('entity.playlist_other')
          }}</span>
          <n-button tertiary size="small" @click="Type_Add_Playlist = !Type_Add_Playlist">
            <template #icon>
              <n-icon>
                <Close />
              </n-icon>
            </template>
          </n-button>
        </n-space>
        <n-form>
          <n-space vertical style="margin-bottom: 10px">
            <span>{{ $t('common.name') }}</span>
            <n-input
              clearable
              placeholder=""
              v-model:value="playlist_set_of_addPlaylist_of_playlistname"
            />
          </n-space>
          <!--          <n-space vertical style="margin-bottom: 10px;" v-if="store_server_user_model.model_select === 'server_configs_stores'">-->
          <!--            <span>{{ $t('filter.comment') }}</span>-->
          <!--            <n-input clearable placeholder="" v-model:value="playlist_set_of_addPlaylist_of_comment"/>-->
          <!--          </n-space>-->
          <!--          <n-space vertical style="margin-bottom: 10px;" v-if="store_server_user_model.model_select === 'server_configs_stores'">-->
          <!--            <span>{{ $t('form.createPlaylist.input_public') }}</span>-->
          <!--            <n-switch v-model:value="playlist_set_of_addPlaylist_of_public" />-->
          <!--          </n-space>-->
        </n-form>
        <n-space justify="end">
          <n-button strong secondary type="info" @click="update_playlist_addPlaylist()">
            {{ $t('common.save') }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
  <!-- 选中歌曲添加 -->
  <n-modal v-model:show="Type_Selected_Media_File_To_Playlist">
    <n-card style="width: 450px; border-radius: 4px">
      <n-space vertical size="large" style="width: 400px">
        <n-space justify="space-between">
          <span style="font-size: 20px; font-weight: 600">{{
            $t('nsmusics.view_page.selectedMedia') +
            ' ' +
            media_Files_selected.length +
            ' * ' +
            $t('form.addToPlaylist.title')
          }}</span>
          <n-button
            tertiary
            size="small"
            @click="Type_Selected_Media_File_To_Playlist = !Type_Selected_Media_File_To_Playlist"
          >
            <template #icon>
              <n-icon>
                <Close />
              </n-icon>
            </template>
          </n-button>
        </n-space>
        <n-space>
          <n-button
            key="song_love"
            class="songlist_more"
            style="
              width: 100px;
              height: 24px;
              border: 0;
              background-color: transparent;
              display: block;
            "
            @click="update_lovelist_addMediaFile_selected"
          >
            {{ $t('nsmusics.view_page.loveMedia') }}
          </n-button>
          <n-button
            v-for="n in playlist_names_ALLLists"
            :key="n.value"
            class="songlist_more"
            style="
              width: 100px;
              height: 24px;
              border: 0;
              background-color: transparent;
              display: block;
            "
            @click="update_playlist_addMediaFile_selected(n.value)"
          >
            {{ n.label }}
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
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

.media_info .hover-overlay-media {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.media_info:hover .hover-overlay-media {
  opacity: 1;
}
.media_info img {
  filter: blur(0px);
}
.media_info:hover img {
  filter: blur(0.5px);
}

.dynamic-scroller-demo-media {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

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
.table-media {
  width: calc(100vw - 200px);
  scroll-behavior: smooth;
}
.message-media {
  width: calc(100vw - 230px);
  height: 77px;
}
.message-media:nth-child(1) {
  margin-top: 12px;
}
.media_info {
  height: 70px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border-radius: 8px; /* iOS-style rounded corners */
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.05); /* Subtle initial shadow */
}
.media_info:hover {
  transform: scale(1.01) translateX(14px); /* Slight zoom on hover */
  box-shadow: 0 0 10px 0 var(--scrollbar-color);
  z-index: 10;
  position: relative;
  background-color: var(--card-color); /* Use a variable for background */
}
.media_info:hover .songlist_title {
  color: var(--primary-color-hover);
}
.media_info:nth-child(1) {
  margin-top: 8px;
}

.checkbox {
  width: 20px;
  transform: scale(1.3);
  margin-left: 12px;
}
.index {
  width: calc(6vw);
  margin-left: 12px;
}
.songlist_name {
  margin-left: 10px;
  text-align: left;
  width: 26vw;
  font-size: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.songlist_name :hover {
  text-decoration: underline;
  cursor: pointer;
  color: var(--primary-color-hover);
}

.songlist_album {
  margin-left: 10px;
  text-align: left;
  width: 16vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.songlist_album :hover {
  text-decoration: underline;
  cursor: pointer;
  color: var(--primary-color-hover);
}
.songlist_more:hover {
  color: var(--primary-color-hover);
}

.scorller_to_SortAZ {
  width: 16px;
  height: calc(100vh - 200px);
  position: absolute;
  top: 106px;
  right: 24px;
  border-radius: 4px;
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
  transform: scale(1.2);
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.7));
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
  display: auto;
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: #88888850;
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background-color: #f1f1f105;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #88888850;
  border-radius: 4px;
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
