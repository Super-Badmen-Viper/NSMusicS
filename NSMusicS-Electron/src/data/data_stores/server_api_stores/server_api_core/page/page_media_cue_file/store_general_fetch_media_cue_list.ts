import { reactive, watch } from 'vue'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_view_media_cue_page_info } from '@/views/view_app/page/page_media_cue/store/store_view_media_cue_page_info'
import { store_view_media_cue_page_logic } from '@/views/view_app/page/page_media_cue/store/store_view_media_cue_page_logic'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { store_general_fetch_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'

import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

/**
 * -> 歌单加载: LoadList、歌曲列表: PlayList -> 合并联合查询
 * local歌单加载：一次性全局加载
 * -> PlayList直接复制LoadList
 * web歌单加载：根据数标状态位 -> 触底加载
 * -> PlayList独立于LoadList -> 数标状态位随LoadList数标状态位刷新
 * -> 数标状态位：【_start、_end】【_artist_id】
 */
export const store_general_fetch_media_cue_list = reactive({
  async fetchData_Media() {
    try {
      if (store_server_user_model.model_server_type_of_web) {
        store_view_media_cue_page_info.media_Files_temporary = []
        await this.fetchData_Media_of_server_web_start()
      }
    } catch (e) {
      console.error('fetchData_Media: ' + e)
    }
  },
  async fetchData_Media_Find_This_Album(id: string) {
    if (
      store_server_user_model.model_server_type_of_local ||
      (store_server_users.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web)
    ) {
      if (store_server_user_model.model_server_type_of_local) {
        if (isElectron) {
          let db: any = null
          db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')
          let stmt_media_file = null
          let stmt_media_file_string = ''
          ///
          stmt_media_file_string = `SELECT *
                         FROM ${store_server_user_model.media_file}
                         WHERE album_id = ?`
          stmt_media_file = db.prepare(stmt_media_file_string)
          const rows = stmt_media_file.all(id)
          rows.forEach((row: Media_File, index: number) => {
            row.absoluteIndex = index
            row.selected = false
            row.duration_txt = store_view_media_cue_page_logic.get_duration_formatTime(row.duration)
            this.setMediumImageUrl(row)
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
      } else if (store_server_user_model.model_server_type_of_web) {
        this.fetchData_Media_of_server_web_clear_index()
        await this.fetchData_Media_of_server_web(true)
      }
    } else if (store_server_user_model.model_server_type_of_web) {
      if (
        store_server_users.server_select_kind === 'jellyfin' ||
        store_server_users.server_select_kind === 'emby' ||
        store_server_users.server_select_kind === 'ninesong'
      ) {
        this.fetchData_Media_of_server_web_clear_index()
        await this.fetchData_Media_of_server_web(true)
      }
    }
  },
  async fetchData_Media_Find_This_Artist(id: string) {
    if (
      store_server_user_model.model_server_type_of_local ||
      (store_server_users.server_select_kind === 'navidrome' &&
        store_server_user_model.model_server_type_of_web)
    ) {
      if (store_server_user_model.model_server_type_of_local) {
        if (isElectron) {
          let db: any = null
          db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')
          let stmt_media_file = null
          let stmt_media_file_string = ''
          stmt_media_file_string = `SELECT *
                                              FROM ${store_server_user_model.media_file}
                                              WHERE artist_id = '${id}'`
          stmt_media_file = db.prepare(stmt_media_file_string)
          const rows = stmt_media_file.all()
          rows.forEach((row: Media_File, index: number) => {
            row.absoluteIndex = index
            row.selected = false
            row.duration_txt = store_view_media_cue_page_logic.get_duration_formatTime(row.duration)
            this.setMediumImageUrl(row)
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
      } else if (store_server_user_model.model_server_type_of_web) {
        this.fetchData_Media_of_server_web_clear_index()
        this._artist_id = id
        await this.fetchData_Media_of_server_web(true)
        this._artist_id = ''
      }
    } else if (store_server_user_model.model_server_type_of_web) {
      if (
        store_server_users.server_select_kind === 'jellyfin' ||
        store_server_users.server_select_kind === 'emby' ||
        store_server_users.server_select_kind === 'ninesong'
      ) {
        this.fetchData_Media_of_server_web_clear_index()
        this._artist_id = id
        await this.fetchData_Media_of_server_web(true)
        this._artist_id = ''
      }
    }
  },
  setMediumImageUrl(row: Media_File) {
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
  },
  removeCondition(filter, condition) {
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
  },
  addCondition(filter, condition) {
    if (filter.length === 0) {
      return `WHERE ${condition}`
    } else {
      return `${filter} AND ${condition}`
    }
  },

  _start: 0,
  _end: 30,
  _artist_id: '',
  set_artist_id(id: string) {
    store_general_fetch_media_cue_list._artist_id = id
    store_general_fetch_player_list._artist_id = id
  },
  fetchData_Media_of_server_web_clear_all_parms() {
    store_general_fetch_media_cue_list._artist_id = ''
    store_general_fetch_album_list._artist_id = ''
    store_general_fetch_media_cue_list._media_id = ''

    store_general_fetch_player_list._artist_id = ''
  },
  _media_id: '', // Jellyfin Home$Media
  _load_model: 'search', // 'search' and 'play'
  fetchData_Media_of_server_web_clear_search_parms() {
    store_general_fetch_media_cue_list._artist_id = ''
    store_general_fetch_album_list._artist_id = ''

    store_general_fetch_media_cue_list._media_id = ''
  },
  fetchData_Media_of_server_web_clear_index() {
    if (this._load_model === 'search') {
      this._start = 0
      this._end = 30
    } else {
      store_general_fetch_player_list._start = 0
      store_general_fetch_player_list._end = 30
    }
  },
  async fetchData_Media_of_server_web_start() {
    try {
      if (
        store_server_user_model.random_play_model &&
        store_server_users.server_select_kind !== 'navidrome'
      ) {
        // 随机播放逻辑
      } else {
        store_view_media_cue_page_info.media_Files_temporary = []
      }

      this._start = 0
      this._end = 30
      store_general_fetch_player_list._start = 0
      store_general_fetch_player_list._end = 30

      await this.fetchData_Media_of_server_web(false)

      const playerAppearanceStore = usePlayerAppearanceStore()
      if (playerAppearanceStore.player_mode_of_medialist_from_external_import) {
        this.fetchData_Media_of_server_web_clear_search_parms()
      }
    } catch (error) {
      console.error('Failed to fetch media data start:', error)
    }
  },

  async fetchData_Media_of_server_web_end() {
    try {
      if (
        store_server_user_model.model_server_type_of_local ||
        (store_server_users.server_select_kind === 'navidrome' &&
          store_server_user_model.model_server_type_of_web)
      ) {
        if (this._load_model === 'search') {
          this._start += 30
          this._end += 30
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
          await this.fetchData_Media_of_server_web_start()
        } else {
          if (this._load_model === 'search') {
            this._end += 30
            this._start = this._end - 30
          } else {
            store_general_fetch_player_list._end += 30
            store_general_fetch_player_list._start = store_general_fetch_player_list._end - 30
          }
        }
      } else if (
        store_server_user_model.model_server_type_of_web &&
        store_server_users.server_select_kind === 'ninesong'
      ) {
        if (this._load_model === 'search') {
          this._start += 30
          this._end += 30
        } else {
          store_general_fetch_player_list._start += 30
          store_general_fetch_player_list._end += 30
        }
      }

      await this.fetchData_Media_of_server_web(false)
    } catch (error) {
      console.error('Failed to fetch media data end:', error)
    }
  },

  async fetchData_Media_of_server_web(find_model: boolean) {
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

      const _artist_id =
        this._load_model === 'search' ? this._artist_id : store_general_fetch_player_list._artist_id

      if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'ninesong') {
          const limit =
            this._load_model === 'search'
              ? String(this._end)
              : String(store_general_fetch_player_list._end)
          const startIndex =
            this._load_model === 'search'
              ? String(this._start)
              : String(store_general_fetch_player_list._start)

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
            _artist_id
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch media data:', error)
    }
  },
  fetchData_Media_of_data_synchronization_to_playlist() {
    const playlistStore = usePlaylistStore()
    store_view_media_cue_page_info.media_Files_temporary.forEach((row) => {
      const existingIndex = playlistStore.playlist_MediaFiles_temporary.findIndex(
        (item) => item.id === row.id
      )
      if (existingIndex === -1) {
        const newRow = {
          ...row,
          play_id: row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000,
        }
        playlistStore.playlist_MediaFiles_temporary.push(newRow)
      }
    })
  },
})
