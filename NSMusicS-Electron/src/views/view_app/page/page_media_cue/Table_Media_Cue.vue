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
  ChevronRight16Filled,
  Filter20Filled,
  PaddingTop20Filled,
  PaddingDown20Filled,
  ArrowRepeatAll16Regular,
  ArrowAutofitDown24Regular,
} from '@vicons/fluent'
import { Random } from '@vicons/fa'
import { Play, RefreshSharp } from '@vicons/ionicons5'
import { Icon } from '@vicons/utils'
import { Add, Close, Menu } from '@vicons/carbon'

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
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { storeToRefs } from 'pinia'

// 在setup上下文中获取Store实例
const playlistStore = usePlaylistStore()

// 使用 storeToRefs 解构出所需的响应式属性
const {
  playlist_Menu_Item_Rating,
  playlist_Menu_Item_Id,
  playlist_Menu_Item_IndexId,
  playlist_Menu_Item,
} = storeToRefs(playlistStore)

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
const options_Sort_key = ref([
  { label: computed(() => t('filter.title')), key: 'title', state_Sort: state_Sort.Default },
  {
    label: computed(() => t('entity.artist_other')),
    key: 'performer', // 修复：artist → performer
    state_Sort: state_Sort.Default,
  },
  {
    label: computed(() => t('filter.releaseYear')),
    key: 'rem.date', // 修复：year → rem.date
    state_Sort: state_Sort.Default,
  },
  {
    label: computed(() => t('filter.duration')),
    key: 'cue_duration', // 修复：duration → cue_duration
    state_Sort: state_Sort.Default,
  },
  {
    label: computed(() => t('common.bitrate')),
    key: 'cue_bit_rate', // 修复：bit_rate → cue_bit_rate
    state_Sort: state_Sort.Default,
  },
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
  {
    label: computed(() => t('Track') + t('nsmusics.view_page.count')),
    key: 'cue_track_count', // 新增：音轨数排序
    state_Sort: state_Sort.Default,
  },
])
let Select_Sort_Model = false
let options_Sort = computed(() => {
  if (
    store_view_media_cue_page_logic.page_songlists_options_Sort_key != null &&
    store_view_media_cue_page_logic.page_songlists_options_Sort_key.length > 0
  ) {
    options_Sort_key.value.forEach((element) => {
      if (
        element.key === store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].columnKey
      )
        if (
          store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].order ===
          state_Sort.Ascend
        )
          element.state_Sort = state_Sort.Ascend
        else if (
          store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].order ===
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
  store_view_media_cue_page_logic.page_songlists_multi_sort = ''
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
  store_view_media_cue_page_logic.list_options_Hand_Sort = true
  store_view_media_cue_page_logic.page_songlists_options_Sort_key = [
    {
      columnKey: String(key),
      order: _state_Sort_,
    },
  ]

  const sortKey =
    store_view_media_cue_page_logic.page_songlists_options_Sort_key.length > 0 &&
    store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].columnKey !== '_id' &&
    store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].order !== 'default'
      ? store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].columnKey
      : 'id'
  const sortOrder =
    store_view_media_cue_page_logic.page_songlists_options_Sort_key.length > 0 &&
    store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].order !== 'default'
      ? store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].order.replace('end', '')
      : ''
  Select_Sort_Model = !(
    (sortKey === '_id' || sortKey === 'id') &&
    (sortOrder === '' || sortOrder === 'ascend')
  )

  scrollTo(0)
}
const options_Sort_key_Default_key = ref()
const options_Sort_key_Default = ref<SortItem[]>()
// lineItems Search(filter)
const show_search_area = () => {
  if (store_view_media_cue_page_logic.page_songlists_bool_show_search_area) {
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = false
    input_search_InstRef.value?.clear()
    if (bool_input_search) {
      // store_view_media_cue_page_logic.list_data_StartUpdate = true
      back_search_default()
      bool_input_search = false
      scrollTo(0)
    }
    if (store_server_user_model.model_server_type_of_web) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    }
    input_search_InstRef.value?.clear()
    store_view_media_cue_page_logic.page_songlists_keywordFilter = ''
    click_search()
  } else {
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = true
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
  if (store_view_media_cue_page_logic.page_songlists_input_search_Value) {
    const page_songlists_keyword =
      store_view_media_cue_page_logic.page_songlists_input_search_Value.toLowerCase()
    store_view_media_cue_page_logic.get_page_songlists_keyword(page_songlists_keyword)
    bool_input_search = true
    options_Sort_key.value.forEach((element) => {
      element.state_Sort = state_Sort.Default
    })
  } else {
    store_view_media_cue_page_logic.page_songlists_keywordFilter = ''
    store_view_media_cue_page_logic.list_data_StartUpdate = true
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
          store_view_media_cue_page_logic.list_options_Hand_Sort = true
          store_view_media_cue_page_logic.page_songlists_options_Sort_key = null
        } else {
          const sorter = {
            columnKey: options_Sort_key.value[i].key,
            order: options_Sort_key.value[i].state_Sort,
          }
          sortersArray.push(sorter)
          store_view_media_cue_page_logic.list_options_Hand_Sort = true
          store_view_media_cue_page_logic.page_songlists_options_Sort_key = sortersArray
        }
        break
      }
    }
  }
}
onMounted(() => {
  store_view_media_cue_page_logic.page_songlists_input_search_Value =
    store_view_media_cue_page_logic.page_songlists_keyword
  if (store_view_media_cue_page_logic.page_songlists_input_search_Value.length > 0) {
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = true
    bool_input_search = true
  } else {
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = false
    bool_input_search = false
  }

  if (store_general_fetch_media_list._album_id.length > 0) {
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = true
    bool_input_search = true
    store_view_media_cue_page_logic.page_songlists_input_search_Value =
      store_general_fetch_media_list._album_id
  }
})
// lineItems Filter To Favorite
const Type_Filter_Show = ref(false)

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

  store_router_history_data_of_media.router_history_model_of_Media_scroller_value = viewEndIndex

  show_top_selectedlist.value = dynamicScroller.value.$el.scrollTop > 150
}
const show_top_selectedlist = ref(false)
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
  } else if (store_server_user_model.model_server_type_of_web) {
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
    store_view_media_cue_page_logic.page_songlists_keyword = ''
    input_search_InstRef.value?.clear()
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = false
  }
  /// navidrome/app
  store_view_media_cue_page_logic.set_media_Files_selected_all(false)
  store_view_media_cue_page_logic.list_selected_Hand_click = true
  await store_view_media_cue_page_logic.get_page_songlists_selected(value)
  console.log('selected_value_for_songlistall：' + value)
  breadcrumbItems.value =
    store_view_media_cue_page_logic.page_songlists_options.find((option) => option.value === value)
      ?.label || ''
  bool_start_play.value = true
  store_view_media_cue_page_logic.set_media_Files_selected_all(false)
}

/////// emits audio_info of songlist_view_list
const handleItemClick = () => {
  click_count++
}
const handleItemDbClick = async (media_file: any, index: any) => {
  if (bool_start_play.value == true) {
    if (click_count >= 2) {
      click_count = 0
      if (media_file.path != playerAudioStore.this_audio_file_path) {
        if (store_server_user_model.model_server_type_of_web) {
          store_general_fetch_media_cue_list.fetchData_Media_of_data_synchronization_to_playlist()
          store_server_user_model.random_play_model = false
        }
        await playerSettingStore.update_current_media_info(media_file, index)
        playlistStore.media_page_handleItemDbClick = true
        playerAppearanceStore.player_mode_of_lock_playlist = false
        playerAudioStore.this_audio_restart_play = true
        //
        store_general_fetch_player_list.fetchData_PlayList(true)
        //
        playlistStore.reset_carousel()
      } else {
        const index_num = typeof index === 'number' ? Number(index) : Number(index.split('-')[1])
        // cue
        if (media_file.cue_tracks === undefined) {
          playerAudioStore.this_audio_cue_track_current_no = 0
          playerAudioStore.this_audio_cue_track_current_indexes = []
          playerAudioStore.this_audio_cue_tracks = []
          playerSettingStore.player_model_cue = false
        } else {
          playerAudioStore.this_audio_cue_track_current_no = index_num
          playerAudioStore.this_audio_cue_track_current_indexes =
            media_file.cue_tracks[index_num - 1].INDEXES
          ///
          playerAudioStore.this_audio_song_name = media_file.cue_tracks[index_num - 1].Title
          if (playerAudioStore.this_audio_song_name.length === 0) {
            playerAudioStore.this_audio_song_name = index_num + ':' + media_file.title
          }
          playerAudioStore.this_audio_artist_name =
            media_file.cue_tracks[index_num - 1].Performer
          playerAudioStore.this_audio_album_name = media_file.title
          ///
          playerSettingStore.player_model_cue = true
        }
        if (playerAudioStore.this_audio_cue_track_current_indexes.length > 0) {
          const track_str = playerAudioStore.this_audio_cue_track_current_indexes[0].TIME
          if (track_str.length > 0) {
            const track_time = playerSettingStore.formatStrTime(track_str)
            playerSettingStore.player.setCurrentTime(track_time / 1000)
          }
        }
      }
    }
  }
}
const handleItemClick_title = (title: string) => {
  if (store_server_user_model.model_server_type_of_local) {
    click_count = 0
    store_view_media_cue_page_logic.page_songlists_input_search_Value = title //+'accurate_search'+'__title__'
    store_view_media_cue_page_logic.get_page_songlists_keyword(title)
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = false
    show_search_area()
    click_search()
    scrollTo(0)
  } else if (store_server_user_model.model_server_type_of_web) {
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = true
    store_view_media_cue_page_logic.page_songlists_input_search_Value = title
    store_view_media_cue_page_logic.get_page_songlists_keyword(title)
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
      store_view_media_cue_page_logic.page_songlists_input_search_Value = artist //+'accurate_search'+'__artist__'//artist不参与精确搜索
      store_view_media_cue_page_logic.get_page_songlists_keyword(artist)
      store_view_media_cue_page_logic.page_songlists_bool_show_search_area = false
      show_search_area()
      click_search()
      scrollTo(0)
    } else if (store_server_user_model.model_server_type_of_web) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
      store_view_media_cue_page_logic.page_songlists_bool_show_search_area = true
      store_view_media_cue_page_logic.page_songlists_input_search_Value = artist
      store_view_media_cue_page_logic.get_page_songlists_keyword(artist)
    }
  } else if (
    store_server_users.server_select_kind === 'ninesong' &&
    store_server_user_model.model_server_type_of_web
  ) {
    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = true
    store_view_media_cue_page_logic.page_songlists_input_search_Value = artist
    // store_view_media_cue_page_logic.get_page_songlists_keyword(artist)
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
      store_view_media_cue_page_logic.page_songlists_input_search_Value =
        album_id + 'accurate_search' + '__album__'
      store_view_media_cue_page_logic.get_page_songlists_keyword(
        album_id + 'accurate_search' + '__album__'
      )
      store_view_media_cue_page_logic.page_songlists_bool_show_search_area = false
      show_search_area()
      click_search()
      scrollTo(0)
    } else if (store_server_user_model.model_server_type_of_web) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
      store_view_media_cue_page_logic.page_songlists_bool_show_search_area = true
      store_view_media_cue_page_logic.page_songlists_input_search_Value = album_id
      store_view_media_cue_page_logic.get_page_songlists_keyword(album_id)
    }
  } else if (
    store_server_users.server_select_kind === 'ninesong' &&
    store_server_user_model.model_server_type_of_web
  ) {
    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = true
    store_view_media_cue_page_logic.page_songlists_input_search_Value = album_id
    store_general_fetch_media_list.set_album_id(album_id)
    await store_general_fetch_media_list.fetchData_Media()
  } else {
    message.warning(
      'Jellyfin / Emby ' + t('ContainerNotSupported') + ' ' + t('setting.hotkey_localSearch')
    )
  }
}

////// changed_data write to sqlite
const handleItemClick_Favorite = (id: any, favorite: boolean) => {
  click_count = 0
  store_server_data_set_media_cueInfo.Set_MediaInfo_To_Favorite_Server(id, favorite)
  page_songlists_statistic.value.forEach((item: any) => {
    if (item.id === 'song_list_love') {
      store_view_media_cue_page_info.media_starred_count += !favorite ? 1 : -1
      item.song_count = store_view_media_cue_page_info.media_starred_count + ' *'
    }
  })
  if (id === playerAudioStore.this_audio_song_id) {
    playerAudioStore.this_audio_song_favorite = !favorite
    //
    const item_playlist: Media_File | undefined =
      playlistStore.playlist_MediaFiles_temporary.find(
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
  const rating_item: Media_File | undefined =
    store_view_media_cue_page_info.media_Files_temporary.find(
      (mediaFile: Media_File) => mediaFile.id === playlistStore.playlist_Menu_Item_Id
    )
  if (rating_item != undefined) {
    const [id, rating] = id_rating.split('-')
    if (after_rating) {
      store_server_data_set_media_cueInfo.Set_MediaInfo_To_Rating_Server(id, 0)
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
      store_server_data_set_media_cueInfo.Set_MediaInfo_To_Rating_Server(id, rating)
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
import { usePlayerAudioStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAudioStore'

// 在setup上下文中获取Store实例
const playerAudioStore = usePlayerAudioStore()
// 使用 storeToRefs 解构出所需的响应式属性
const { page_top_album_image_url, this_audio_song_name } = storeToRefs(playerAudioStore)

import { store_view_media_cue_page_info } from '@/views/view_app/page/page_media_cue/store/store_view_media_cue_page_info'
import { store_view_media_cue_page_logic } from '@/views/view_app/page/page_media_cue/store/store_view_media_cue_page_logic'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { store_router_history_data_of_media } from '@/router/router_store/store_router_history_data_of_media'
import { store_server_data_set_media_cueInfo } from '@/data/data_stores/server_api_stores/server_api_core/annotation/store_server_data_set_media_cueInfo'
import type { SelectBaseOption } from 'naive-ui/es/select/src/interface'
import { store_local_db_info } from '@/data/data_stores/local_app_stores/store_local_db_info'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_server_data_set_playlistInfo } from '@/data/data_stores/server_api_stores/server_api_core/annotation/store_server_data_set_playlistInfo'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'

// 在setup上下文中获取Store实例
const playerAppearanceStore = usePlayerAppearanceStore()

const playerSettingStore = usePlayerSettingStore()
import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { store_general_fetch_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import { store_player_tag_modify } from '@/views/view_app/page/page_player/store/store_player_tag_modify'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/data/data_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_view_album_page_logic } from '@/views/view_app/page/page_album/store/store_view_album_page_logic'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_general_model_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { debounce } from 'lodash'
import { store_view_media_page_logic } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { MultipleStopOutlined } from '@vicons/material'
import { store_general_fetch_media_cue_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_cue_file/store_general_fetch_media_cue_list'

////// Right_click_on_songline show menu
let click_count = 0
const bool_start_play = ref<boolean>(true)

/// multi_level_sort
interface SortCondition {
  key: string
  order: string
}
const allSortKeys = computed(() => [
  { label: t('filter.title'), value: 'title' },
  // { label: t('entity.album_other'), value: 'album' }, // 移除（后端无直接映射）
  { label: t('entity.artist_other'), value: 'performer' }, // 修复：artist → performer [1](@ref)
  // { label: t('table.column.albumArtist'), value: 'album_artist' }, // 移除（后端无映射）
  { label: t('filter.releaseYear'), value: 'rem.date' }, // 修复：year → rem.date [1](@ref)
  { label: t('filter.duration'), value: 'cue_duration' }, // 修复：duration → cue_duration [1](@ref)
  { label: t('common.bitrate'), value: 'cue_bit_rate' }, // 修复：bit_rate → cue_bit_rate [1](@ref)
  { label: t('LabelSize'), value: 'size' },
  { label: t('filter.playCount'), value: 'play_count' },
  { label: t('common.favorite') + t('LabelLevel'), value: 'rating' },
  { label: t('common.favorite') + t('LabelDate'), value: 'starred_at' },
  { label: t('filter.dateAdded'), value: 'created_at' },
  { label: t('filter.recentlyUpdated'), value: 'updated_at' },
  { label: t('Track') + t('nsmusics.view_page.count'), value: 'cue_track_count' }, // 新增：支持按音轨数排序 [1](@ref)
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
  store_view_media_cue_page_logic.page_songlists_multi_sort = generateSortQuery()
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
  const storedQuery = store_view_media_cue_page_logic.page_songlists_multi_sort

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

////// right menu
const contextmenu = ref(null)
function menu_item_add_to_playlist_end() {
  const item: Media_File | undefined = store_view_media_cue_page_info.media_Files_temporary.find(
    (mediaFile: Media_File) => mediaFile.id === playlistStore.playlist_Menu_Item_Id
  )
  if (item != undefined && item != 'undefined') {
    const newItem: any = JSON.parse(JSON.stringify(item))
    newItem.play_id = newItem.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
    playlistStore.playlist_MediaFiles_temporary.push(newItem)
    playlistStore.playlist_MediaFiles_temporary.forEach((item: any, index: number) => {
      item.order_title = index + 1
    })
    playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.push(newItem.id)

    store_system_configs_save.save_system_playlist_item_id_config()

    contextmenu.value.hide()
  }
}

function menu_item_add_to_playlist_next() {
  const rating_item: Media_File | undefined =
    store_view_media_cue_page_info.media_Files_temporary.find(
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
      item.order_title = index + 1
    })
    playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds.splice(index + 1, 0, newItem.id)

    store_system_configs_save.save_system_playlist_item_id_config()

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
    await store_general_fetch_media_list.fetchData_Media_of_server_web_end()
  }
  isScrolling.value = false
}
const onScroll = async () => {
  show_top_selectedlist.value = dynamicScroller.value.$el.scrollTop > 150
}

/////
const onRefreshSharp = debounce(async (event, args) => {
  if (store_server_user_model.model_server_type_of_web) {
    if (store_server_users.server_select_kind === 'ninesong') {
      store_general_fetch_media_list.set_album_id('')
      store_general_fetch_media_list.set_artist_id('')
    }
    store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    store_view_media_cue_page_logic.page_songlists_keyword = ''
    input_search_InstRef.value?.clear()
    store_view_media_cue_page_logic.page_songlists_keywordFilter = ''
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = false
    store_general_fetch_media_list.fetchData_Media_of_server_web_start()
  }
}, 500)

const page_songlists_statistic = ref<
  {
    label: ''
    song_count: ''
    id: ''
  }[]
>([])
function Refresh_page_songlists_statistic() {
  page_songlists_statistic.value = []
  store_view_media_cue_page_logic.page_songlists_statistic.forEach((item: any, index: number) => {
    page_songlists_statistic.value.push({
      label: store_view_media_cue_page_logic.page_songlists_statistic[index].label,
      song_count: store_view_media_cue_page_logic.page_songlists_statistic[index].song_count,
      id: store_view_media_cue_page_logic.page_songlists_statistic[index].id,
    })
  })
}
onMounted(() => {
  Refresh_page_songlists_statistic()
  if (
    store_general_fetch_media_list._artist_id.length > 0 ||
    store_general_fetch_media_list._album_id.length > 0 ||
    store_general_fetch_media_list._album_artist_id.length > 0
  ) {
    store_view_media_cue_page_logic.page_songlists_bool_show_search_area = true
  }
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
</script>

<template>
  <n-space vertical :size="12">
    <div class="dynamic-scroller-demo-media-cue">
      <n-space vertical @wheel.prevent style="overflow: hidden">
        <n-space align="center" style="margin-top: 3px">
          <n-space>
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-button
                  quaternary
                  circle
                  @click="
                    () => {
                      store_view_media_cue_page_logic.page_songlists_bool_show_search_area = true
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
          <n-divider vertical style="width: 2px; height: 20px; margin-top: -4px" />

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
          <n-tooltip
            trigger="hover"
            placement="top"
            v-if="store_view_media_cue_page_logic.page_songlists_bool_show_search_area"
          >
            <template #trigger>
              <n-input-group style="width: 144px">
                <n-input
                  style="width: 144px"
                  ref="input_search_InstRef"
                  v-model:value="store_view_media_cue_page_logic.page_songlists_input_search_Value"
                  @keydown.enter="click_search"
                />
              </n-input-group>
            </template>
            {{ $t('setting.hotkey_localSearch') }}
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
              <n-badge
                v-if="store_view_media_cue_page_logic.page_songlists_multi_sort.length > 0"
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
                {{ store_view_media_cue_page_logic.page_songlists_multi_sort }}
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
                        store_view_media_cue_page_logic.page_songlists_multi_sort = ''
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

          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <n-badge
                :value="store_view_media_cue_page_logic.page_songlists_filter_year"
                :offset="[22, 17]"
              >
                <n-button quaternary circle @click="Type_Filter_Show = true">
                  <template #icon>
                    <n-icon :size="20"><Filter20Filled /></n-icon>
                  </template>
                </n-button>
              </n-badge>
            </template>
            {{ $t('Filters') }}
          </n-tooltip>
          <n-modal v-model:show="Type_Filter_Show">
            <n-card style="width: 480px; border-radius: 4px">
              <n-space vertical size="large">
                <n-space>
                  <span style="font-size: 20px; font-weight: 600">{{
                    $t('common.filter_other')
                  }}</span>
                </n-space>
                <n-space justify="space-between">
                  <n-space vertical>
                    <span style="font-size: 14px; font-weight: 600">{{ $t('common.year') }}</span>
                    <n-space vertical>
                      <n-input
                        clearable
                        placeholder=""
                        style="width: 200px"
                        v-model:value="store_view_media_cue_page_logic.page_songlists_filter_year"
                      />
                      <n-button
                        strong
                        secondary
                        @click="store_view_media_cue_page_logic.page_songlists_filter_year = 0"
                      >
                        {{ $t('common.clear') }}
                      </n-button>
                    </n-space>
                  </n-space>
                  <n-space vertical v-if="!store_server_user_model.model_server_type_of_web">
                    <span style="font-size: 14px; font-weight: 600">{{
                      $t('HeaderLibraries')
                    }}</span>
                    <n-space vertical>
                      <n-select
                        :value="store_view_media_cue_page_logic.page_songlists_filter_path_folder"
                        :options="store_local_db_info.local_config_of_all_user_of_select"
                        style="width: 200px"
                        @update:value="
                          (value: any) => {
                            store_view_media_cue_page_logic.page_songlists_filter_path_folder =
                              value
                          }
                        "
                      />
                      <n-button
                        strong
                        secondary
                        @click="
                          store_view_media_cue_page_logic.page_songlists_filter_path_folder = ''
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

          <n-divider vertical style="width: 2px; height: 20px; margin-top: -4px" />

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
        <n-space align="center">
          <n-space v-if="show_top_selectedlist" style="margin-left: 7px; margin-bottom: 14px">
            <n-tooltip trigger="hover" placement="top">
              <template #trigger>
                <n-select
                  size="small"
                  :value="store_view_media_cue_page_logic.page_songlists_selected"
                  :options="store_view_media_cue_page_logic.page_songlists_options"
                  style="width: 181px"
                  @update:value="page_songlists_handleselected_updatevalue"
                />
              </template>
              {{ $t('Select') + $t('LabelPlaylist') }}
            </n-tooltip>
          </n-space>
        </n-space>
      </n-space>

      <DynamicScroller
        class="table_media_cue"
        ref="dynamicScroller"
        :style="{
          width: 'calc(100vw - ' + (collapsed_width - 35) + 'px)',
          height: show_top_selectedlist ? 'calc(100vh - 236px)' : 'calc(100vh - 194px)',
        }"
        :items="store_view_media_cue_page_info.media_Files_temporary"
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
          <div class="notice">
            <div
              :style="{ width: 'calc(100vw - ' + (collapsed_width - 17) + 'px)' }"
              style="
                position: absolute;
                z-index: 0;
                height: 283px;
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
                :src="getAssetImage(page_top_album_image_url)"
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
                margin-left: 12px;
              "
            >
              <template #title>
                <n-space vertical align="start" style="height: 280px; margin-left: 12px">
                  <n-space style="margin-top: 26px; margin-left: 11px">
                    <div style="font-size: 32px; font-weight: 600">
                      {{ 'CUE ' + $t('nsmusics.view_page.disk') }}
                    </div>
                    <div
                      v-if="this_audio_song_name.length > 0"
                      style="font-size: 32px; font-weight: 600; margin-top: -2px"
                    >
                      {{ ' : ' }}
                    </div>
                    <div
                      :style="{
                        maxWidth: 'calc(100vw - ' + (collapsed_width + 540) + 'px)',
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
                      {{ this_audio_song_name }}
                    </div>
                  </n-space>
                  <n-space align="center" style="margin-top: 2px; margin-left: 11px">
                    <div style="color: #767c82; font-size: 15px; font-weight: 600">
                      {{ $t('GuideProviderSelectListings') + ' >' }}
                    </div>
                    <n-tooltip trigger="hover" placement="top">
                      <template #trigger>
                        <n-select
                          :value="store_view_media_cue_page_logic.page_songlists_selected"
                          :options="store_view_media_cue_page_logic.page_songlists_options"
                          style="width: 166px"
                          @update:value="page_songlists_handleselected_updatevalue"
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
                      <n-gi v-for="songlist in page_songlists_statistic" :key="songlist.id">
                        <n-statistic :label="songlist.label" :value="songlist.song_count" />
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
                playlist_Menu_Item_Rating = item.rating
                playlist_Menu_Item_IndexId = item.order_title
                playlist_Menu_Item = item
              }
            "
            class="message_media_cue"
            :style="{
              width: 'calc(100vw - ' + (collapsed_width - 17) + 'px)',
              height: item.cue_track_count > 0 ? 80 * item.cue_track_count + 'px' : '70px',
            }"
            @click="handleItemClick"
          >
            <div v-for="track in item.cue_tracks" :key="track.TRACK">
              <div
                class="media_cue_info"
                :style="{
                  width: 'calc(100vw - ' + (collapsed_width - 10) + 'px)',
                }"
                @dblclick="
                  () => {
                    playerAudioStore.this_audio_cue_tracks = item.cue_tracks
                    handleItemDbClick(item, item.absoluteIndex + '-' + track.TRACK)
                  }
                "
              >
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
                    class="hover-overlay"
                    color="#FFFFFF"
                    :size="28"
                    style="position: relative; z-index: 1; cursor: pointer"
                    @click="
                      () => {
                        click_count = 2
                        playerAudioStore.this_audio_cue_tracks = item.cue_tracks
                        handleItemDbClick(item, item.absoluteIndex + '-' + track.TRACK)
                      }
                    "
                  >
                    <Play style="margin-left: 25%; margin-top: 25%" />
                  </icon>
                </div>
                <div class="songlist_cue_name">
                  <span
                    v-if="track.Title !== undefined && track.Title !== ''"
                    class="songlist_cue_title"
                    style="font-size: 16px; font-weight: 550"
                    @click="handleItemClick_title(track.Title)"
                  >
                    {{ track.Title }}
                  </span>
                  <span
                    v-else
                    class="songlist_cue_title"
                    style="font-size: 16px; font-weight: 550"
                    @click="handleItemClick_title(track.Title)"
                  >
                    {{ $t('Unknown') + $t('MediaInfoTitle') }}
                  </span>
                  <br />
                  <template
                    v-if="track.Performer !== undefined && track.Performer !== ''"
                    v-for="artist in track.Performer.split(/[\/|｜、]/) ?? track.Performer"
                  >
                    <span
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
                  <span
                    v-else
                    style="font-size: 14px; font-weight: 400"
                    @click="
                      () => {
                        handleItemClick_artist(item.artist)
                      }
                    "
                  >
                    {{ item.artist }}
                  </span>
                </div>
                <div class="songlist_cue_album">
                  <span
                    style="font-size: 14px; font-weight: 600"
                    @click="
                      () => {
                        handleItemClick_album(item.title)
                      }
                    "
                    >{{ item.title }}</span
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
                      margin-top: 2px;
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
                  class="duration_cue_txt"
                  style="
                    margin-left: auto;
                    margin-top: 4px;
                    margin-right: 0;
                    text-align: left;
                    font-size: 14px;
                    font-weight: 600;
                  "
                  @click="click_count = 0"
                >
                  {{ track.INDEXES[0].TIME }}
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
                  {{ item.absoluteIndex + '-' + track.TRACK }}
                </span>
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
        <template
          v-if="
            store_server_users.server_select_kind === 'navidrome' ||
            store_server_user_model.model_server_type_of_local
          "
          v-for="artist in playlist_Menu_Item.artist.split(/[/|｜、]/) ?? playlist_Menu_Item.artist"
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
        <v-contextmenu-item @click="menu_item_add_to_playlist_end">
          {{ $t('player.addLast') }}
        </v-contextmenu-item>
        <v-contextmenu-item @click="menu_item_add_to_playlist_next">
          {{ $t('player.addNext') }}
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

.media_cue_info .hover-overlay {
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
.media_cue_info:hover .hover-overlay {
  opacity: 1;
}
.media_cue_info img {
  filter: blur(0px);
}
.media_cue_info:hover img {
  filter: blur(0.5px);
}

.dynamic-scroller-demo-media-cue {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
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
.table_media_cue {
  width: calc(100vw - 200px);
}
.message_media_cue {
  width: calc(100vw - 230px);
  height: 77px;
}
.media_cue_info {
  width: calc(100vw - 230px);
  height: 70px;
  display: flex;
  align-items: center;
  transition: all 0.2s ease-in-out; /* Smooth transition for all properties */
  border-radius: 8px; /* iOS-style rounded corners */
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.05); /* Subtle initial shadow */
}
.media_cue_info:nth-child(1) {
  margin-top: 8px;
}
.media_cue_info:hover {
  transform: scale(1.01) translateX(14px); /* Slight zoom on hover */
  box-shadow: 0 0 10px 0 var(--scrollbar-color);
  z-index: 10;
  position: relative;
  background-color: var(--card-color); /* Use a variable for background */
}
.media_cue_info:hover .songlist_cue_title {
  margin: 0;
  color: var(--primary-color-hover);
}
/*
.media_cue_info:hover .songlist_artist {
  color: var(--primary-color-hover);
}
*/

.checkbox {
  width: 20px;
  transform: scale(1.3);
  margin-left: 12px;
}
.index {
  width: calc(6vw);
  margin-left: 12px;
}
.songlist_cue_name {
  margin-left: 10px;
  text-align: left;
  width: 30vw;
  font-size: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.songlist_cue_name :hover {
  text-decoration: underline;
  cursor: pointer;
  color: var(--primary-color-hover);
}
.songlist_cue_title {
  margin: 0;
}
.songlist_cue_album {
  margin-left: 10px;
  text-align: left;
  width: 22vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.songlist_cue_album :hover {
  text-decoration: underline;
  cursor: pointer;
  color: var(--primary-color-hover);
}
.duration_cue_txt {
  margin-left: 10px;
  text-align: left;
  width: 40px;
}
.songlist_cue_more:hover {
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
</style>
