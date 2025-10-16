import { defineStore, ref } from 'pinia'
import { watch } from 'vue'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_view_media_page_logic } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { store_view_media_page_info } from '@/views/view_app/page/page_media/store/store_view_media_page_info'
import { store_playlist_list_info } from '@/views/view_app/components/player_list/store/store_playlist_list_info'
import { store_playlist_appearance } from '@/views/view_app/components/player_list/store/store_playlist_appearance'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/utils/Get_Navidrome_Temp_Data_To_LocalSqlite'
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/utils/Get_Jellyfin_Temp_Data_To_LocalSqlite'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/utils/Get_NineSong_Temp_Data_To_LocalSqlite'
import { Get_Local_Temp_Data_To_LocalSqlite } from '@/utils/Get_Local_Temp_Data_To_LocalSqlite'
import type { Media_File } from '../../../../../types/Media_File'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useGeneralFetchAlbumListStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { useGeneralFetchPlayerListStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import error_album from '@/assets/img/error_album.jpg'

/**
 * 媒体文件列表数据获取逻辑 store
 * 提供媒体文件数据的获取和处理功能
 */
export const useGeneralFetchMediaListStore = defineStore('generalFetchMediaList', () => {
  // 获取其他store的引用
  const serverUsersStore = useServerUsersStore()
  const generalFetchAlbumListStore = useGeneralFetchAlbumListStore()
  const generalFetchPlayerListStore = useGeneralFetchPlayerListStore()
  
  // 类型定义
  interface MediaItem {
    [key: string]: any
    absoluteIndex?: number
    selected?: boolean
    duration_txt?: string
    album?: string
    artist?: string
    title?: string
    album_id?: string
    cover_art_id?: string
    id?: string
  }
  // 状态定义
  const _totalCount = ref(0)
  const _start = ref(0)
  const _end = ref(30)
  const _artist_id = ref('')
  const _album_id = ref('')
  const _album_artist_id = ref('')
  const _media_id = ref('')
  const _load_model = ref('search')
  const _search = ref('')

  /**
   * 获取媒体数据
   */
  const fetchData_Media = async () => {
    try {
      if (store_server_user_model.model_server_type_of_local) {
        store_view_media_page_info.media_Files_temporary = []
        const selected = store_view_media_page_logic.page_songlists_selected
        const __search = 
          (store_view_media_page_logic.page_songlists_keywordFilter || '').match(/%([^%]+)%/)?.[1] || ''
        
        // 排序处理 - 简化实现
        const sortKey = 'id'
        const sortOrder = ''
        
        let query = ''
        if (__search) {
          query = `title LIKE '%${__search}%' OR artist LIKE '%${__search}%' OR album LIKE '%${__search}%'`
        }
        
        if (store_view_media_page_logic.page_songlists_filter_year > 0) {
          query = query ? `(${query}) AND year = ${store_view_media_page_logic.page_songlists_filter_year}` : `year = ${store_view_media_page_logic.page_songlists_filter_year}`
        }
        
        if (store_view_media_page_logic.page_songlists_library_path) {
          const pathCondition = `path LIKE '%${store_view_media_page_logic.page_songlists_library_path}%'`
          query = query ? `(${query}) AND ${pathCondition}` : pathCondition
        }
        
        const get_Local_Temp_Data_To_LocalSqlite = new Get_Local_Temp_Data_To_LocalSqlite()
        
        if (selected === 'song_list_love') {
          query = query ? `(${query}) AND love = 1` : 'love = 1'
          await get_Local_Temp_Data_To_LocalSqlite.get_media_list(query, 'id', 'ASC', String(_start.value), String(_end.value - _start.value))
        } else if (selected === 'song_list_recently') {
          query = query ? `(${query}) AND play_count > 0` : 'play_count > 0'
          await get_Local_Temp_Data_To_LocalSqlite.get_media_list(query, 'play_date', 'DESC', String(_start.value), String(_end.value - _start.value))
        } else if (selected !== 'song_list_all') {
          await get_Local_Temp_Data_To_LocalSqlite.get_media_list_of_playlist(selected, String(_start.value), String(_end.value - _start.value))
        } else {
          await get_Local_Temp_Data_To_LocalSqlite.get_media_list(query, 'id', 'ASC', String(_start.value), String(_end.value - _start.value))
        }
        
        // 处理注释信息
        store_view_media_page_info.media_Files_temporary.forEach((item: MediaItem) => {
          if (item.love === 1) {
            item.love = true
          }
          if (item.play_count === undefined || item.play_count === null) {
            item.play_count = 0
          }
          if (!item.play_date) {
            item.play_date = ''
          }
          setMediumImageUrl(item)
        })
        
        // 设置绝对索引
        store_view_media_page_info.media_Files_temporary.forEach((item: MediaItem, index: number) => {
          item.absoluteIndex = index + 1
        })
      } else if (store_server_user_model.model_server_type_of_web) {
        await fetchData_Media_of_server_web(false)
      }
    } catch (error) {
      console.error('Failed to fetch media data:', error)
    }
  }

  /**
   * 根据专辑ID查找媒体文件
   * @param id 专辑ID
   */
  const fetchData_Media_Find_This_Album = async (id: string) => {
    try {
      if (store_server_user_model.model_server_type_of_local) {
        store_view_media_page_info.media_Files_temporary = []
        const get_Local_Temp_Data_To_LocalSqlite = new Get_Local_Temp_Data_To_LocalSqlite()
        await get_Local_Temp_Data_To_LocalSqlite.get_media_list(`album_id = '${id}'`, 'id', 'ASC', String(_start.value), String(_end.value - _start.value))
        
        store_view_media_page_info.media_Files_temporary.forEach((item: MediaItem) => {
          setMediumImageUrl(item)
        })
        
        store_view_media_page_info.media_Files_temporary.forEach((item: MediaItem, index: number) => {
          item.absoluteIndex = index + 1
        })
      } else if (store_server_user_model.model_server_type_of_web) {
        fetchData_Media_of_server_web_clear_index()
        _album_id.value = id
        await fetchData_Media_of_server_web(true)
        _album_id.value = ''
      }
    } catch (error) {
      console.error('Failed to fetch album media data:', error)
    }
  }

  /**
   * 根据艺术家ID查找媒体文件
   * @param id 艺术家ID
   */
  const fetchData_Media_Find_This_Artist = async (id: string) => {
    try {
      if (store_server_user_model.model_server_type_of_local) {
        store_view_media_page_info.media_Files_temporary = []
        const get_Local_Temp_Data_To_LocalSqlite = new Get_Local_Temp_Data_To_LocalSqlite()
        await get_Local_Temp_Data_To_LocalSqlite.get_media_list(`artist_id = '${id}'`, 'id', 'ASC', String(_start.value), String(_end.value - _start.value))
        
        store_view_media_page_info.media_Files_temporary.forEach((item: MediaItem) => {
          setMediumImageUrl(item)
        })
        
        store_view_media_page_info.media_Files_temporary.forEach((item: MediaItem, index: number) => {
          item.absoluteIndex = index + 1
        })
      } else if (store_server_user_model.model_server_type_of_web) {
        if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby' ||
          store_server_users.server_select_kind === 'ninesong'
        ) {
          fetchData_Media_of_server_web_clear_index()
          _artist_id.value = id
          await fetchData_Media_of_server_web(true)
          _artist_id.value = ''
        }
      }
    } catch (error) {
      console.error('Failed to fetch artist media data:', error)
    }
  }

  /**
   * 设置媒体文件的中等尺寸图片URL
   * @param row 媒体文件对象
   */
  const setMediumImageUrl = (row: Media_File | MediaItem) => {
    if (!row.medium_image_url?.trim()) {
      const path = row.path || row.medium_image_url
      if (path) {
        const fileName = path.split(/[\\/]/).pop()!
        const newFileName = 
          fileName != undefined && fileName.length > 0
            ? fileName.replace(/\.(mp3|flac)$/i, '.jpg')
            : ''
        row.medium_image_url = 
          newFileName != undefined && newFileName.length > 0
            ? `${store_system_configs_info.driveTempPath}/${encodeURIComponent(newFileName)}`
            : error_album
      } else {
        row.medium_image_url = error_album
      }
    }
  }

  const removeCondition = (filter: string, condition: string) => {
    if (filter.indexOf(`WHERE ${condition}`) >= 0) {
      filter = filter.substring(0, filter.indexOf(`WHERE ${condition}`)).trim()
      if (filter.endsWith('AND')) {
        filter = filter.substring(0, filter.lastIndexOf('AND')).trim()
      }
    }
    if (filter.indexOf(`AND ${condition}`) >= 0) {
      filter = filter.substring(0, filter.indexOf(`AND ${condition}`)).trim()
      if (filter.endsWith('AND')) {
        filter = filter.substring(0, filter.lastIndexOf('AND')).trim()
      }
    }
    return filter
  }

  const addCondition = (filter: string, condition: string) => {
    if (filter.length === 0) {
      return `WHERE ${condition}`
    } else {
      return `${filter} AND ${condition}`
    }
  }

  const set_album_id = (id: string) => {
    _album_id.value = id
    store_general_fetch_player_list._album_id = id
  }

  const set_artist_id = (id: string) => {
    _artist_id.value = id
    store_general_fetch_player_list._artist_id = id
  }

  const set_album_artist_id = (id: string) => {
    fetchData_Media_of_server_web_clear_all_parms()
    _album_artist_id.value = id
    store_general_fetch_player_list._album_artist_id = id
  }

  const fetchData_Media_of_server_web_clear_all_parms = () => {
    _album_id.value = ''
    _artist_id.value = ''
    generalFetchAlbumListStore._artist_id = ''
    _album_artist_id.value = ''
    _media_id.value = ''

    generalFetchPlayerListStore._album_id = ''
    generalFetchPlayerListStore._artist_id = ''
    generalFetchPlayerListStore._album_artist_id = ''
  }

  const fetchData_Media_of_server_web_clear_search_parms = () => {
    _album_id.value = ''
    _artist_id.value = ''
    generalFetchAlbumListStore._artist_id = ''

    _album_artist_id.value = ''
    _media_id.value = ''
  }

  const fetchData_Media_of_server_web_clear_index = () => {
    if (_load_model.value === 'search') {
      _start.value = 0
      _end.value = 30
    } else {
      generalFetchPlayerListStore._start = 0
      generalFetchPlayerListStore._end = 30
    }
  }

  const fetchData_Media_of_server_web_start = async () => {
    try {
      if (
        store_server_user_model.random_play_model &&
        store_server_users.server_select_kind !== 'navidrome'
      ) {
        // 随机播放逻辑
      } else {
        store_view_media_page_info.media_Files_temporary = []
      }

      _start.value = 0
      _end.value = 30
      store_general_fetch_player_list._start = 0
      store_general_fetch_player_list._end = 30

      await fetchData_Media_of_server_web(false)

      // 移除对不存在的store_player_appearance的引用
      if (false) {
        fetchData_Media_of_server_web_clear_search_parms()
      }
    } catch (error) {
      console.error('Failed to fetch media data start:', error)
    }
  }

  const fetchData_Media_of_server_web_end = async () => {
    try {
     } else if (
      store_server_user_model.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web)
    ) {
        if (_load_model.value === 'search') {
          _start.value += 30
          _end.value += 30
        } else {
          store_general_fetch_player_list._start += 30
          store_general_fetch_player_list._end += 30
        }
      } else if (
        store_server_user_model.model_server_type_of_web &&
        (store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby')
      ) {
        if (store_server_user_model.random_play_model) {
          await fetchData_Media_of_server_web_start()
        } else {
          if (_load_model.value === 'search') {
            _end.value += 30
            _start.value = _end.value - 30
          } else {
            store_general_fetch_player_list._end += 30
            store_general_fetch_player_list._start = store_general_fetch_player_list._end - 30
          }
        }
      } else if (
        store_server_user_model.model_server_type_of_web &&
        store_server_users.server_select_kind === 'ninesong'
      ) {
        if (_load_model.value === 'search') {
          _start.value += 30
          _end.value += 30
        } else {
          store_general_fetch_player_list._start += 30
          store_general_fetch_player_list._end += 30
        }
      }

      await fetchData_Media_of_server_web(false)
    } catch (error) {
      console.error('Failed to fetch media data end:', error)
    }
  }

  const fetchData_Media_of_server_web = async (find_model: boolean) => {
    try {
      const __search = 
        (store_view_media_page_logic.page_songlists_keywordFilter || '').match(/%([^%]+)%/)?.[1] || ''
      const selected = store_view_media_page_logic.page_songlists_selected

      let _sort = 
        store_view_media_page_logic.page_songlists_options_Sort_key.length > 0 &&
        store_view_media_page_logic.page_songlists_options_Sort_key[0].order !== 'default'
          ? store_view_media_page_logic.page_songlists_options_Sort_key[0].columnKey
          : 'id'
      let _order = 
        store_view_media_page_logic.page_songlists_options_Sort_key.length > 0 &&
        store_view_media_page_logic.page_songlists_options_Sort_key[0].order !== 'default'
          ? store_view_media_page_logic.page_songlists_options_Sort_key[0].order.replace('end', '')
          : 'ASC'

      let _starred = ''
      let playlist_id = ''
      if (selected === 'song_list_love') {
        _starred = 'true'
      } else if (selected === 'song_list_recently') {
        _order = 'desc'
        _sort = 'playDate'
        if (store_server_users.server_select_kind === 'jellyfin') {
          _sort = 'DatePlayed'
        } else if (store_server_users.server_select_kind === 'emby') {
          _sort = 'DatePlayed,SortName'
        } else if (store_server_users.server_select_kind === 'ninesong') {
          _sort = 'play_date'
        }
      } else if (selected !== 'song_list_all') {
        if (!find_model) {
          playlist_id = selected
        }
      }

      const __artist_id = _load_model.value === 'search' ? _artist_id.value : store_general_fetch_player_list._artist_id
      const __album_id = _load_model.value === 'search' ? _album_id.value : store_general_fetch_player_list._album_id
      const __album_artist_id = _load_model.value === 'search' ? _album_artist_id.value : store_general_fetch_player_list._album_artist_id

      if (
        store_server_user_model.model_server_type_of_local ||
        (store_server_users.server_select_kind === 'navidrome' &&
          store_server_user_model.model_server_type_of_web)
      ) {
        const limit = _load_model.value === 'search' ? String(_end.value) : String(store_general_fetch_player_list._end)
        const startIndex = _load_model.value === 'search' ? String(_start.value) : String(store_general_fetch_player_list._start)

        const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
        await get_Navidrome_Temp_Data_To_LocalSqlite.get_media_list(
          store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
          store_server_user_model.username,
          store_server_user_model.token,
          store_server_user_model.salt,
          limit,
          _order,
          _sort,
          startIndex,
          __search,
          _starred,
          playlist_id,
          __album_id,
          __artist_id,
          store_view_media_page_logic.page_songlists_filter_year > 0
            ? store_view_media_page_logic.page_songlists_filter_year
            : ''
        )
      } else if (store_server_user_model.model_server_type_of_web) {
        if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          const sortBy = _sort === 'DatePlayed' ? 'DatePlayed,SortName' : _sort !== 'id' ? _sort : 'SortName'
          const sortOrder = _sort === 'DatePlayed' ? 'Descending' : _order === 'desc' ? 'Descending' : 'Ascending'
          const filter = _starred === 'true' ? 'IsFavorite' : ''

          const limit = 
            _load_model.value === 'search'
              ? String(_end.value - _start.value)
              : String(store_general_fetch_player_list._end - store_general_fetch_player_list._start)
          const startIndex = 
            _load_model.value === 'search'
              ? String(_start.value)
              : String(store_general_fetch_player_list._start)

          const get_Jellyfin_Temp_Data_To_LocalSqlite = new Get_Jellyfin_Temp_Data_To_LocalSqlite()
          if (_media_id.value.length === 0) {
            if (__artist_id.length === 0) {
              if (__album_artist_id.length === 0) {
                const parentId = __album_id.length === 0 ? store_server_user_model.parentid_of_Je_Music : __album_id
                await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list(
                  playlist_id,
                  store_server_user_model.userid_of_Je,
                  parentId,
                  __search,
                  sortBy,
                  sortOrder,
                  limit,
                  startIndex,
                  'Audio',
                  'ParentId',
                  'Primary,Backdrop,Thumb',
                  'true',
                  '1',
                  store_view_media_page_logic.page_songlists_filter_year > 0
                    ? store_view_media_page_logic.page_songlists_filter_year
                    : '',
                  filter
                )
              } else {
                await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list_of_home$album_of_Em(
                  __album_artist_id,
                  limit,
                  startIndex
                )
              }
            } else {
              await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list_of_artist(
                __artist_id,
                limit,
                startIndex
              )
            }
          } else {
            await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list_of_home$media_of_Je(
              _media_id.value,
              limit,
              startIndex
            )
          }
        } else if (store_server_users.server_select_kind === 'ninesong') {
          const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          if (_media_id.value.length === 0) {
            const limit = _load_model.value === 'search' ? String(_end.value) : String(store_general_fetch_player_list._end)
            const startIndex = _load_model.value === 'search' ? String(_start.value) : String(store_general_fetch_player_list._start)

            await get_NineSong_Temp_Data_To_LocalSqlite.get_media_list(
              store_server_login_info.server_url,
              startIndex,
              limit,
              _sort,
              _order,
              store_view_media_page_logic.page_songlists_multi_sort,
              _starred,
              __search,
              store_view_media_page_logic.page_songlists_filter_year > 0
                ? store_view_media_page_logic.page_songlists_filter_year
                : '',
              playlist_id,
              __album_id,
              __artist_id,
              store_view_media_page_logic.page_songlists_suffix,
              store_view_media_page_logic.page_songlists_bitrate_range[0],
              store_view_media_page_logic.page_songlists_bitrate_range[1],
              store_view_media_page_logic.page_songlists_library_path
            )
          } else {
            await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_medias([_media_id.value])
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch media data:', error)
    }
  }

  const fetchData_Media_of_data_synchronization_to_playlist = () => {
    store_view_media_page_info.media_Files_temporary.forEach((row) => {
      const existingIndex = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex(
        (item) => item.id === row.id
      )
      if (existingIndex === -1) {
        const newRow = {
          ...row,
          play_id: row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000,
        }
        store_playlist_list_info.playlist_MediaFiles_temporary.push(newRow)
      }
    })
  }

  // 监听播放列表显示状态
  watch(
    () => store_playlist_appearance.playlist_show,
    (newValue) => {
      if (newValue) {
        _load_model.value = 'play'
        const index = store_playlist_list_info.playlist_MediaFiles_temporary.length / 30
        if (index > 0) {
          store_general_fetch_player_list._start = 30 * index - 30
          store_general_fetch_player_list._end = 30 * index
        }
      } else {
        _load_model.value = 'search'
      }
    }
  )

  return {
    // 状态暴露
    _totalCount,
    _start,
    _end,
    _artist_id,
    _album_id,
    _album_artist_id,
    _media_id,
    _load_model,
    _search,
    // 方法暴露
    fetchData_Media,
    fetchData_Media_Find_This_Album,
    fetchData_Media_Find_This_Artist,
    setMediumImageUrl,
    removeCondition,
    addCondition,
    set_album_id,
    set_artist_id,
    set_album_artist_id,
    fetchData_Media_of_server_web_clear_all_parms,
    fetchData_Media_of_server_web_clear_search_parms,
    fetchData_Media_of_server_web_clear_index,
    fetchData_Media_of_server_web_start,
    fetchData_Media_of_server_web_end,
    fetchData_Media_of_server_web,
    fetchData_Media_of_data_synchronization_to_playlist
  }
})