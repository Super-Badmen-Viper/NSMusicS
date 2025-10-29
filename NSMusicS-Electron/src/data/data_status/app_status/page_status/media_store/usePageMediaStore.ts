import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Set_LocalSqlite_LibraryInfo } from '@/data/data_repository/app_repository/LocalSqlite_Set_LibraryInfo'
import { store_router_history_data_of_media } from '@/router/router_store/store_router_history_data_of_media'
import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { store_local_data_set_annotionInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_annotionInfo'
import { store_local_data_set_playlistInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_playlistInfo'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_server_data_set_playlistInfo } from '@/data/data_stores/server_api_stores/server_api_core/annotation/store_server_data_set_playlistInfo'
import { store_server_data_set_mediaInfo } from '@/data/data_stores/server_api_stores/server_api_core/annotation/store_server_data_set_mediaInfo'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_general_model_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_model_player_list'

// 定义媒体文件类型接口
interface Media_File {
  id: string | number
  selected?: boolean
  path?: string
  title?: string
  artist?: string
  album?: string
  album_id?: string
  order_title?: string
}

export const usePageMediaStore = defineStore('pageMedia', () => {
  const media_File_metadata = ref<any[]>([])
  const media_Files_temporary = ref<any[]>([])
  const media_Files_selected = ref<any[]>([])
  const media_Files_random_loaded = ref(false)
  const media_page_sizes = ref(15)
  const media_item_count = ref(0)
  const media_starred_count = ref(0)
  const media_recently_count = ref(0)
  const media_playlist_count = ref(0)

  const list_data_StartUpdate = ref(false)
  const list_data_Hand_Search = ref(false)
  const list_options_Hand_Sort = ref(false)
  const list_selected_Hand_click = ref(false)
  const page_songlists_options = ref<any[]>([])
  const page_songlists_statistic = ref<any[]>([])
  const page_songlists = ref<any[]>([])
  const page_songlists_selected = ref('song_list_all')
  const page_songlists_keyword_reset = ref(false)
  const page_songlists_keyword = ref('')
  const page_songlists_keywordFilter = ref('')
  const page_songlists_get_keyword_model_num = ref(0)
  const page_songlists_options_Sort_key = ref<any[]>([])
  const page_songlists_multi_sort = ref('')
  const page_songlists_library_path = ref('')
  const page_songlists_library_folder_path = ref('')
  const page_songlists_suffix = ref('')
  const page_songlists_bitrate_range = ref([0, 0])
  const page_songlists_filter_model = ref(false)
  const page_songlists_filter_year = ref(0)
  const page_songlists_filter_path_folder = ref('')
  const page_songlists_bool_show_search_area = ref(false)
  const page_songlists_input_search_Value = ref('')
  const page_songlists_random_play = ref(false)

  const get_duration_formatTime = (currentTime: number): string => {
    const minutes = Math.floor(currentTime / 60)
    const seconds = Math.floor(currentTime % 60)

    let formattedMinutes = String(minutes)
    let formattedSeconds = String(seconds)

    if (formattedMinutes.length == 1) formattedMinutes = '0' + formattedMinutes

    if (formattedSeconds.length == 1) formattedSeconds = '0' + formattedSeconds

    return `${formattedMinutes}:${formattedSeconds}`
  }

  const set_media_Files_selected = (value: Media_File) => {
    if (value.selected) {
      media_Files_temporary.value.forEach((item: any, index: number) => {
        if (item.id === value.id) {
          media_Files_temporary.value[index].selected = true
        }
      })
      media_Files_selected.value.push(value)
      console.log('media_Files_selected：' + value.path + '  ' + value.selected)
    } else {
      media_Files_temporary.value.forEach((item: any, index: number) => {
        if (item.id === value.id) {
          media_Files_temporary.value[index].selected = false
        }
      })
      media_Files_selected.value = media_Files_selected.value.filter(
        (item: any) => item.id !== value.id
      )
      console.log('media_Files_selected：' + value.path + '  ' + value.selected)
    }
  }

  const set_media_Files_selected_all = (value: boolean) => {
    media_Files_temporary.value.forEach((item: any, index: number) => {
      media_Files_temporary.value[index].selected = value
    })
    if (value) {
      media_Files_selected.value = media_Files_temporary.value.slice()
    } else {
      media_Files_selected.value = []
    }
    console.log('media_Files_selected：' + value)
  }

  const get_selected_playlist_add_MediaFile = async (value: any) => {
    console.log('selected_playlist_addMediaFile', value)
    store_local_data_set_playlistInfo.Set_Selected_MediaInfo_Add_Selected_Playlist(
      media_Files_selected.value.map((file: any) => file.id),
      value
    )
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()

    if (store_server_user_model.model_select === 'server') {
      await store_server_data_set_playlistInfo.Set_Selected_MediaInfo_Add_Selected_Playlist(
        media_Files_selected.value.map((file: any) => file.id),
        value
      )
    }
  }

  const get_selected_playlist_delete_MediaFile = async (value: any) => {
    console.log('selected_playlist_deleteMediaFile', value)
    store_local_data_set_playlistInfo.Set_Selected_MediaInfo_Delete_Selected_Playlist(
      media_Files_selected.value.map((file: any) => file.id),
      value
    )
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()

    if (store_server_user_model.model_select === 'server') {
      await store_server_data_set_playlistInfo.Set_Selected_MediaInfo_Delete_Selected_Playlist(
        store_server_users.server_select_kind === 'emby'
          ? media_Files_selected.value.map((file: any) => file.order_title)
          : media_Files_selected.value.map((file: any) => file.id),
        value
      )
    }
  }

  const get_selected_lovelist_add_MediaFile = (value: any) => {
    console.log('selected_lovelist_addMediaFile', value)
    store_local_data_set_annotionInfo.Set_MediaInfo_Add_Selected_Favorite(
      media_Files_selected.value.map((file: any) => file.id),
      true
    )
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()

    if (store_server_user_model.model_select === 'server') {
      media_Files_selected.value.forEach((media: any) => {
        store_server_data_set_mediaInfo.Set_MediaInfo_To_Favorite_Server(media.id, false)
      })
    }
  }

  const get_selected_lovelist_delete_MediaFile = (value: any) => {
    console.log('selected_lovelist_deleteMediaFile', value)
    store_local_data_set_annotionInfo.Set_MediaInfo_Delete_Selected_Favorite(
      media_Files_selected.value.map((file: any) => file.id),
      value
    )
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()

    if (store_server_user_model.model_select === 'server') {
      media_Files_selected.value.forEach((media: any) => {
        store_server_data_set_mediaInfo.Set_MediaInfo_To_Favorite_Server(media.id, true)
      })
    }
  }

  const get_selected_locallist_delete_MediaFile = (value: any) => {
    console.log('selected_locallist_deleteMediaFile', value)
    const set_LibraryInfo_To_LocalSqlite = new Set_LocalSqlite_LibraryInfo()
    set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Delete_Selected_Playlist(
      media_Files_selected.value.map((file: any) => file.id)
    )
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()
  }

  const get_selected_recentlist_deletet_MediaFile = (value: any) => {
    console.log('selected_recentlist_deletetMediaFile', value)
    store_local_data_set_annotionInfo.Set_MediaInfo_To_Selected_PlayCount_of_Delete(
      media_Files_selected.value.map((file: any) => file.id),
      value
    )
    store_general_model_player_list.get_playlist_tracks_temporary_update_media_file()
  }

  const get_page_songlists_keyword = async (newValue: any) => {
    page_songlists_multi_sort.value = ''
    page_songlists_keyword.value = newValue
    // 使用局部变量进行字符串操作，避免直接修改 newValue
    let search = newValue
    if (search.indexOf('accurate_search') > 0) {
      search = search.replace('accurate_search', '')
      if (search.indexOf('__title__') > 0) {
        search = search.replace('__title__', '')
        page_songlists_keywordFilter.value = `WHERE title LIKE '${search}'`
      } else if (search.indexOf('__artist__') > 0) {
        search = search.replace('__artist__', '')
        page_songlists_keywordFilter.value = `WHERE artist LIKE '${search}'`
      } else if (search.indexOf('__album__') > 0) {
        search = search.replace('__album__', '')
        page_songlists_keywordFilter.value = `WHERE album_id = '${search}'`
      }
    } else {
      page_songlists_keywordFilter.value =
        newValue.length > 0
          ? `WHERE title LIKE '%${newValue}%' OR artist LIKE '%${newValue}%' OR album LIKE '%${newValue}%'`
          : ''
    }
    page_songlists_keyword_reset.value = true
    console.log('page_songlists_keyword:' + newValue)

    // 添加空值检查
    if (store_router_data_info.router) {
      store_router_data_info.router.push('media')
    }
    await store_general_fetch_media_list.fetchData_Media()
  }

  const get_page_songlists_selected = async (newValue: any) => {
    page_songlists_selected.value = newValue
    const playerAppearanceStore = usePlayerAppearanceStore()
    if (playerAppearanceStore.player_mode_of_medialist_from_external_import) {
      playerAppearanceStore.player_mode_of_medialist_from_external_import = false
    } else {
      if (list_selected_Hand_click.value) {
        page_songlists_keywordFilter.value = ''
      }
      list_selected_Hand_click.value = false
      console.log('page_songlists_selected：' + newValue)
      await store_general_fetch_media_list.fetchData_Media()
      await store_system_configs_save.save_system_config_of_Player_Configs_of_Audio_Info()
      page_songlists_keyword.value = ''
    }
  }

  // 监听逻辑
  watch(page_songlists_options_Sort_key, async (newValue) => {
    if (newValue != null && list_options_Hand_Sort.value) {
      list_options_Hand_Sort.value = false
      store_router_history_data_of_media.fix_router_history_of_Media_scroller_value(
        store_router_history_data_of_media.router_history_model_of_Media_scroller_value
      ) // 保留此滚轮值(上次浏览位置)
      await store_general_fetch_media_list.fetchData_Media()
    }
  })

  watch(list_data_StartUpdate, async (newValue) => {
    if (newValue) {
      page_songlists_keyword.value = ''
      if (list_selected_Hand_click.value) {
        page_songlists_keywordFilter.value = ''
      }
      store_router_data_info.find_music_model = false
      await store_general_fetch_media_list.fetchData_Media()

      store_router_history_data_of_media.router_history_datas_of_Media = []
      if (store_router_history_data_of_media.router_select_history_date_of_Media) {
        store_router_history_data_of_media.router_select_history_date_of_Media.id = 1
        store_router_history_data_of_media.router_history_datas_of_Media.push(
          store_router_history_data_of_media.router_select_history_date_of_Media
        )
      }

      list_data_StartUpdate.value = false
      console.log('list_data_StartUpdate')
    }
  })

  watch(page_songlists_filter_path_folder, async (newValue) => {
    page_songlists_filter_model.value = page_songlists_filter_path_folder.value !== ''
    await store_system_configs_save.save_system_config_of_App_Configs()
    page_songlists_keywordFilter.value = ''
    list_selected_Hand_click.value = false
    await store_general_fetch_media_list.fetchData_Media()
  })

  watch(page_songlists_multi_sort, async (newValue) => {
    await store_general_fetch_media_list.fetchData_Media_of_server_web_start()
  })

  // 返回状态和方法
  return {
    media_File_metadata,
    media_Files_temporary,
    media_Files_selected,
    media_Files_random_loaded,
    media_page_sizes,
    media_item_count,
    media_starred_count,
    media_recently_count,
    media_playlist_count,

    list_data_StartUpdate,
    list_data_Hand_Search,
    list_options_Hand_Sort,
    list_selected_Hand_click,
    page_songlists_options,
    page_songlists_statistic,
    page_songlists,
    page_songlists_selected,
    page_songlists_keyword_reset,
    page_songlists_keyword,
    page_songlists_keywordFilter,
    page_songlists_get_keyword_model_num,
    page_songlists_options_Sort_key,
    page_songlists_multi_sort,
    page_songlists_library_path,
    page_songlists_library_folder_path,
    page_songlists_suffix,
    page_songlists_bitrate_range,
    page_songlists_filter_model,
    page_songlists_filter_year,
    page_songlists_filter_path_folder,
    page_songlists_bool_show_search_area,
    page_songlists_input_search_Value,
    page_songlists_random_play,

    get_duration_formatTime,
    set_media_Files_selected,
    set_media_Files_selected_all,
    get_selected_playlist_add_MediaFile,
    get_selected_playlist_delete_MediaFile,
    get_selected_lovelist_add_MediaFile,
    get_selected_lovelist_delete_MediaFile,
    get_selected_locallist_delete_MediaFile,
    get_selected_recentlist_deletet_MediaFile,
    get_page_songlists_keyword,
    get_page_songlists_selected,
  }
})
