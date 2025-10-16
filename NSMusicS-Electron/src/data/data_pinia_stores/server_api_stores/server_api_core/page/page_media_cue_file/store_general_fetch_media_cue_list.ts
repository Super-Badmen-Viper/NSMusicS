import { defineStore, ref } from 'pinia'
import { store_player_appearance } from '@/views/view_app/page/page_player/store/store_player_appearance'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_view_media_cue_page_info } from '@/views/view_app/page/page_media_cue/store/store_view_media_cue_page_info'
import { store_view_media_cue_page_logic } from '@/views/view_app/page/page_media_cue/store/store_view_media_cue_page_logic'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { store_playlist_list_info } from '@/views/view_app/components/player_list/store/store_playlist_list_info'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useGeneralFetchAlbumListStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { useGeneralFetchPlayerListStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import error_album from '@/assets/img/error_album.jpg'
import { isElectron } from '@/utils/electron/isElectron'
import { store_playlist_appearance } from '@/views/view_app/components/player_list/store/store_playlist_appearance'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { watch } from 'vue'

/**
 * CUE文件媒体列表数据获取逻辑 store
 * 提供CUE媒体文件数据的获取和处理功能
 */
export const useGeneralFetchMediaCueListStore = defineStore('generalFetchMediaCueList', () => {
  // 获取其他store的引用
  const serverUserModelStore = useServerUserModelStore()
  const serverUsersStore = useServerUsersStore()
  const generalFetchAlbumListStore = useGeneralFetchAlbumListStore()
  const generalFetchPlayerListStore = useGeneralFetchPlayerListStore()

  // 状态定义
  const _totalCount = ref(0)
  const _start = ref(0)
  const _end = ref(30)
  const _artist_id = ref('')
  const _media_id = ref('')
  const _load_model = ref('search')
  const _album_id = ref('')
  const _search = ref('')

  /**
   * 获取媒体数据
   */
  async function fetchData_Media() {
    try {
      if (serverUserModelStore.model_server_type_of_web) {
        store_view_media_cue_page_info.media_Files_temporary = []
        await fetchData_Media_of_server_web_start()
      }
    } catch (e) {
      console.error('fetchData_Media: ' + e)
    }
  }

  /**
   * 根据专辑ID查找媒体文件
   * @param id 专辑ID
   */
  async function fetchData_Media_Find_This_Album(id: string) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      if (serverUserModelStore.model_server_type_of_local) {
        if (isElectron) {
          let db: any = null
          db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')
          let stmt_media_file = null
          let stmt_media_file_string = ''
          
          stmt_media_file_string = `SELECT *
                         FROM ${serverUserModelStore.media_file}
                         WHERE album_id = ?`
          stmt_media_file = db.prepare(stmt_media_file_string)
          const rows = stmt_media_file.all(id)
          rows.forEach((row: any, index: number) => {
            row.absoluteIndex = index
            row.selected = false
            row.duration_txt = store_view_media_cue_page_logic.get_duration_formatTime(row.duration)
            setMediumImageUrl(row)
            store_view_media_cue_page_info.media_Files_temporary.push(row)
          })
          store_view_media_cue_page_info.media_Files_temporary.forEach(
            (item: any, index: number) => {
              item.absoluteIndex = index + 1
            }
          )
        } else {
          // other
        }
      } else if (serverUserModelStore.model_server_type_of_web) {
        fetchData_Media_of_server_web_clear_index()
        await fetchData_Media_of_server_web(true)
      }
    } else if (serverUserModelStore.model_server_type_of_web) {
      if (
        serverUsersStore.server_select_kind === 'jellyfin' ||
        serverUsersStore.server_select_kind === 'emby' ||
        serverUsersStore.server_select_kind === 'ninesong'
      ) {
        fetchData_Media_of_server_web_clear_index()
        await fetchData_Media_of_server_web(true)
      }
    }
  }

  /**
   * 根据艺术家ID查找媒体文件
   * @param id 艺术家ID
   */
  async function fetchData_Media_Find_This_Artist(id: string) {
    if (
      serverUserModelStore.model_server_type_of_local ||
      (serverUsersStore.server_select_kind === 'navidrome' &&
        serverUserModelStore.model_server_type_of_web)
    ) {
      if (serverUserModelStore.model_server_type_of_local) {
        if (isElectron) {
          let db: any = null
          db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')
          let stmt_media_file = null
          let stmt_media_file_string = ''
          stmt_media_file_string = `SELECT *
                                              FROM ${serverUserModelStore.media_file}
                                              WHERE artist_id = '${id}'`
          stmt_media_file = db.prepare(stmt_media_file_string)
          const rows = stmt_media_file.all()
          rows.forEach((row: any, index: number) => {
            row.absoluteIndex = index
            row.selected = false
            row.duration_txt = store_view_media_cue_page_logic.get_duration_formatTime(row.duration)
            setMediumImageUrl(row)
            store_view_media_cue_page_info.media_Files_temporary.push(row)
          })
          store_view_media_cue_page_info.media_Files_temporary.forEach(
            (item: any, index: number) => {
              item.absoluteIndex = index + 1
            }
          )
        } else {
          // other
        }
      } else if (serverUserModelStore.model_server_type_of_web) {
        fetchData_Media_of_server_web_clear_index()
        _artist_id.value = id
        await fetchData_Media_of_server_web(true)
        _artist_id.value = ''
      }
    } else if (serverUserModelStore.model_server_type_of_web) {
      if (
        serverUsersStore.server_select_kind === 'jellyfin' ||
        serverUsersStore.server_select_kind === 'emby' ||
        serverUsersStore.server_select_kind === 'ninesong'
      ) {
        fetchData_Media_of_server_web_clear_index()
        _artist_id.value = id
        await fetchData_Media_of_server_web(true)
        _artist_id.value = ''
      }
    }
  }

  /**
   * 设置媒体文件的中等尺寸图片URL
   * @param row 媒体文件对象
   */
  function setMediumImageUrl(row: any) {
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

  /**
   * 移除查询条件
   */
  function removeCondition(filter: string, condition: string): string {
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

  /**
   * 添加查询条件
   */
  function addCondition(filter: string, condition: string): string {
    if (filter.length === 0) {
      return `WHERE ${condition}`
    } else {
      return `${filter} AND ${condition}`
    }
  }

  /**
   * 设置艺术家ID
   */
  function set_artist_id(id: string) {
    _artist_id.value = id
    generalFetchPlayerListStore._artist_id = id
  }

  /**
   * 清空所有参数
   */
  function fetchData_Media_of_server_web_clear_all_parms() {
    _artist_id.value = ''
    generalFetchAlbumListStore._artist_id = ''
    _media_id.value = ''
    generalFetchPlayerListStore._artist_id = ''
  }

  /**
   * 清空搜索参数
   */
  function fetchData_Media_of_server_web_clear_search_parms() {
    _artist_id.value = ''
    generalFetchAlbumListStore._artist_id = ''
    _media_id.value = ''
  }

  /**
   * 清空Web服务器查询索引
   */
  function fetchData_Media_of_server_web_clear_index() {
    if (_load_model.value === 'search') {
      _start.value = 0
      _end.value = 30
    } else {
      generalFetchPlayerListStore._start = 0
      generalFetchPlayerListStore._end = 30
    }
  }

  /**
   * Web服务器起始数据获取
   */
  async function fetchData_Media_of_server_web_start() {
    try {
      if (
        serverUserModelStore.random_play_model &&
        serverUsersStore.server_select_kind !== 'navidrome'
      ) {
        // 随机播放逻辑
      } else {
        store_view_media_cue_page_info.media_Files_temporary = []
      }

      _start.value = 0
      _end.value = 30
      generalFetchPlayerListStore._start = 0
      generalFetchPlayerListStore._end = 30

      await fetchData_Media_of_server_web(false)

      if (store_player_appearance.player_mode_of_medialist_from_external_import) {
        fetchData_Media_of_server_web_clear_search_parms()
      }
    } catch (error) {
      console.error('Failed to fetch media data start:', error)
    }
  }

  /**
   * Web服务器后续数据获取
   */
  async function fetchData_Media_of_server_web_end() {
    try {
      if (
        serverUserModelStore.model_server_type_of_local ||
        (serverUsersStore.server_select_kind === 'navidrome' &&
          serverUserModelStore.model_server_type_of_web)
      ) {
        if (_load_model.value === 'search') {
          _start.value += 30
          _end.value += 30
        } else {
          generalFetchPlayerListStore._start += 30
          generalFetchPlayerListStore._end += 30
        }
      } else if (
        serverUserModelStore.model_server_type_of_web &&
        (serverUsersStore.server_select_kind === 'jellyfin' ||
          serverUsersStore.server_select_kind === 'emby')
      ) {
        if (serverUserModelStore.random_play_model) {
          await fetchData_Media_of_server_web_start()
        } else {
          if (_load_model.value === 'search') {
            _end.value += 30
            _start.value = _end.value - 30
          } else {
            generalFetchPlayerListStore._end += 30
            generalFetchPlayerListStore._start = generalFetchPlayerListStore._end - 30
          }
        }
      } else if (
        serverUserModelStore.model_server_type_of_web &&
        serverUsersStore.server_select_kind === 'ninesong'
      ) {
        if (_load_model.value === 'search') {
          _start.value += 30
          _end.value += 30
        } else {
          generalFetchPlayerListStore._start += 30
          generalFetchPlayerListStore._end += 30
        }
      }

      await fetchData_Media_of_server_web(false)
    } catch (error) {
      console.error('Failed to fetch media data end:', error)
    }
  }

  /**
   * Web服务器数据获取核心方法
   */
  async function fetchData_Media_of_server_web(find_model: boolean) {
    try {
      const _search =
        (store_view_media_cue_page_logic.page_songlists_keywordFilter || '').match(
          /%([^%]+)%/
        )?.[1] || ''
      const selected = store_view_media_cue_page_logic.page_songlists_selected

      let _sort =
        store_view_media_cue_page_logic.page_songlists_options_Sort_key.length > 0 &&
        store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].order !== 'default'
          ? store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].columnKey
          : 'id'
      let _order =
        store_view_media_cue_page_logic.page_songlists_options_Sort_key.length > 0 &&
        store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].order !== 'default'
          ? store_view_media_cue_page_logic.page_songlists_options_Sort_key[0].order.replace(
              'end',
              ''
            )
          : 'ASC'

      let _starred = ''
      let playlist_id = ''
      if (selected === 'song_list_love') {
        _starred = 'true'
      } else if (selected === 'song_list_recently') {
        _order = 'desc'
        _sort = 'playDate'
        if (serverUsersStore.server_select_kind === 'jellyfin') {
          _sort = 'DatePlayed'
        } else if (serverUsersStore.server_select_kind === 'emby') {
          _sort = 'DatePlayed,SortName'
        } else if (serverUsersStore.server_select_kind === 'ninesong') {
          _sort = 'play_date'
        }
      } else if (selected !== 'song_list_all') {
        if (!find_model) {
          playlist_id = selected
        }
      }

      const _artist_id_value =
        _load_model.value === 'search' ? _artist_id.value : generalFetchPlayerListStore._artist_id

      if (serverUserModelStore.model_server_type_of_web) {
        if (serverUsersStore.server_select_kind === 'ninesong') {
          const limit =
            _load_model.value === 'search'
              ? String(_end.value)
              : String(generalFetchPlayerListStore._end)
          const startIndex =
            _load_model.value === 'search'
              ? String(_start.value)
              : String(generalFetchPlayerListStore._start)

          const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_NineSong_Temp_Data_To_LocalSqlite.get_media_cue_list(
            store_server_login_info.server_url,
            startIndex,
            limit,
            _sort,
            _order,
            store_view_media_cue_page_logic.page_songlists_multi_sort,
            _starred,
            _search,
            store_view_media_cue_page_logic.page_songlists_filter_year > 0
              ? store_view_media_cue_page_logic.page_songlists_filter_year
              : '',
            playlist_id,
            _artist_id_value
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch media data:', error)
    }
  }

  /**
   * 数据同步到播放列表
   */
  function fetchData_Media_of_data_synchronization_to_playlist() {
    store_view_media_cue_page_info.media_Files_temporary.forEach((row: any) => {
      const existingIndex = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex(
        (item: any) => item.id === row.id
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
    async (newValue) => {
      if (newValue) {
        _load_model.value = 'play'
        const index = store_playlist_list_info.playlist_MediaFiles_temporary.length / 30
        if (index > 0) {
          generalFetchPlayerListStore._start = 30 * index - 30
          generalFetchPlayerListStore._end = 30 * index
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
    _media_id,
    _load_model,
    _album_id,
    _search,
    // 方法暴露
    fetchData_Media,
    fetchData_Media_Find_This_Album,
    fetchData_Media_Find_This_Artist,
    setMediumImageUrl,
    removeCondition,
    addCondition,
    set_artist_id,
    fetchData_Media_of_server_web_clear_all_parms,
    fetchData_Media_of_server_web_clear_search_parms,
    fetchData_Media_of_server_web_clear_index,
    fetchData_Media_of_server_web_start,
    fetchData_Media_of_server_web_end,
    fetchData_Media_of_server_web,
    fetchData_Media_of_data_synchronization_to_playlist
  }
})