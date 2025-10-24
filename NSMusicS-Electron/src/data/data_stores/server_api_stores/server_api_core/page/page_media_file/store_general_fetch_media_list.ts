import { reactive, watch } from 'vue'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'
import { store_router_history_data_of_media } from '@/router/router_store/store_router_history_data_of_media'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'

import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/data/data_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_general_fetch_album_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_album/store_general_fetch_album_list'
import { store_general_fetch_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/data/data_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite'

import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

/**
 * -> 歌单加载: LoadList、歌曲列表: PlayList -> 合并联合查询
 * local歌单加载：一次性全局加载
 * -> PlayList直接复制LoadList
 * web歌单加载：根据数标状态位 -> 触底加载
 * -> PlayList独立于LoadList -> 数标状态位随LoadList数标状态位刷新
 * -> 数标状态位：【_start、_end】【_album_id、_artist_id、_album_artist_id】
 */
export const store_general_fetch_media_list = reactive({
  async fetchData_Media() {
    const pageMediaStore = usePageMediaStore()
    try {
      if (store_server_user_model.model_server_type_of_local) {
        if (isElectron) {
          let db: any = null
          // clear RouterView of vue-virtual-scroller data
          const playerAppearanceStore = usePlayerAppearanceStore()
          if (playerAppearanceStore.player_mode_of_medialist_from_external_import) {
            // playerAppearanceStore.player_mode_of_medialist_from_external_import = false;
          } else {
            store_router_data_logic.clearAllTemporaryFiles()
            store_router_data_info.router_select = 'media'
          }
          try {
            db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
            db.pragma('journal_mode = WAL')
            db.exec('PRAGMA foreign_keys = OFF')

            let stmt_media_file = null
            let stmt_media_file_string = ''

            // Init media_model data
            const playlistStore = usePlaylistStore()
            playlistStore.playlist_names_StartUpdate = true

            // load media_Files_temporary data
            if (store_router_history_data_of_media.router_history_model_of_Media === 0) {
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
              if (pageMediaStore.page_songlists_keywordFilter.length === 0) {
                // 1. 处理 year 条件
                pageMediaStore.page_songlists_keywordFilter = this.removeCondition(
                  pageMediaStore.page_songlists_keywordFilter,
                  'year'
                )
                if (pageMediaStore.page_songlists_filter_year > 0) {
                  pageMediaStore.page_songlists_keywordFilter = this.addCondition(
                    pageMediaStore.page_songlists_keywordFilter,
                    `year = ${pageMediaStore.page_songlists_filter_year}`
                  )
                }
                // 2. 处理 path 条件
                pageMediaStore.page_songlists_keywordFilter = this.removeCondition(
                  pageMediaStore.page_songlists_keywordFilter,
                  'path'
                )
                if (pageMediaStore.page_songlists_filter_path_folder.length > 0) {
                  const pathFilter = `path LIKE '${pageMediaStore.page_songlists_filter_path_folder}%'`
                  pageMediaStore.page_songlists_keywordFilter = this.addCondition(
                    pageMediaStore.page_songlists_keywordFilter,
                    pathFilter
                  )
                }
              } else {
                if (pageMediaStore.page_songlists_keywordFilter === '_id') {
                  pageMediaStore.page_songlists_keywordFilter = ''
                }
              }
              ///
              try {
                stmt_media_file_string = `SELECT *
                                     FROM ${store_server_user_model.media_file} ${pageMediaStore.page_songlists_keywordFilter}
                                     ORDER BY ${sortKey} ${sortOrder}`
                stmt_media_file = db.prepare(stmt_media_file_string)
              } catch (err: any) {
                console.error(err)
              }
              //////
              if (!pageMediaStore.page_songlists_filter_model) {
                if (
                  store_router_history_data_of_media.router_select_history_date_of_Media &&
                  pageMediaStore.page_songlists_keyword_reset
                ) {
                  store_router_history_data_of_media.remove_router_history_of_Media(
                    store_router_history_data_of_media.router_select_history_date_of_Media.id
                  ) // 若存在新操作，则覆盖后续的路由
                  pageMediaStore.page_songlists_keyword_reset = false
                }
                const routerDate: Interface_View_Router_Date = {
                  id: 0,
                  menu_select_active_key: 'media',
                  router_name: 'media',
                  router_select: 'media',
                  page_lists_keyword: pageMediaStore.page_songlists_keyword,
                  page_songlists_keywordFilter: pageMediaStore.page_songlists_keywordFilter,
                  stmt_string: stmt_media_file_string,
                  page_lists_selected: pageMediaStore.page_songlists_selected,
                  columnKey:
                    pageMediaStore.page_songlists_options_Sort_key.length > 0 &&
                    pageMediaStore.page_songlists_options_Sort_key[0].columnKey !== '_id' &&
                    pageMediaStore.page_songlists_options_Sort_key[0].order !== 'default'
                      ? pageMediaStore.page_songlists_options_Sort_key[0].columnKey
                      : 'id',
                  order:
                    pageMediaStore.page_songlists_options_Sort_key.length > 0 &&
                    pageMediaStore.page_songlists_options_Sort_key[0].order !== 'default'
                      ? pageMediaStore.page_songlists_options_Sort_key[0].order.replace('end', '')
                      : '',
                  page_lists_scrollindex:
                    store_router_history_data_of_media.router_history_model_of_Media_scroller_value,
                }
                store_router_history_data_of_media.add_router_history_of_Media(routerDate) // 添加新记录
              }
              //////
            } else {
              if (store_router_history_data_of_media.router_select_history_date_of_Media) {
                store_router_data_info.router.push('media')
                store_router_data_info.router_select = 'media'
                pageMediaStore.page_songlists_keyword =
                  store_router_history_data_of_media.router_select_history_date_of_Media.page_lists_keyword
                pageMediaStore.page_songlists_keywordFilter =
                  store_router_history_data_of_media.router_select_history_date_of_Media.page_songlists_keywordFilter
                pageMediaStore.page_songlists_selected =
                  store_router_history_data_of_media.router_select_history_date_of_Media.page_lists_selected
                pageMediaStore.list_options_Hand_Sort = false
                pageMediaStore.page_songlists_options_Sort_key = [
                  {
                    columnKey:
                      store_router_history_data_of_media.router_select_history_date_of_Media
                        .columnKey,
                    order:
                      store_router_history_data_of_media.router_select_history_date_of_Media.order,
                  },
                ]
                store_router_history_data_of_media.router_history_model_of_Media_scroller_value =
                  store_router_history_data_of_media.router_select_history_date_of_Media.page_lists_scrollindex
                stmt_media_file = db.prepare(
                  store_router_history_data_of_media.router_select_history_date_of_Media.stmt_string
                )
              }
              store_router_history_data_of_media.router_history_model_of_Media = 0
            }
            pageMediaStore.media_Files_temporary = []
            const rows = stmt_media_file.all()
            rows.forEach((row: Media_File, index: number) => {
              row.absoluteIndex = index
              row.selected = false
              row.duration_txt = pageMediaStore.get_duration_formatTime(row.duration)
              this.setMediumImageUrl(row)
              pageMediaStore.media_Files_temporary.push(row)
            })
            ////// find favorite for media_Files_temporary
            const stmt_media_Annotation_Starred_Items = db.prepare(`
                            SELECT item_id
                            FROM ${store_server_user_model.annotation}
                            WHERE starred = 1
                              AND item_type = 'media_file'
                        `)
            const annotations = stmt_media_Annotation_Starred_Items.all()
            for (let i = 0; i < pageMediaStore.media_Files_temporary.length; i++) {
              pageMediaStore.media_Files_temporary[i].favorite = !!annotations.some(
                (annotation: { item_id: string }) =>
                  annotation.item_id === pageMediaStore.media_Files_temporary[i].id
              )
            }
            ////// find rating for media_Files_temporary
            const stmt_media_Annotation_Rating_Items = db.prepare(`
                            SELECT item_id, rating
                            FROM ${store_server_user_model.annotation}
                            WHERE rating > 0
                              AND item_type = 'media_file'
                        `)
            const annotations_rating = stmt_media_Annotation_Rating_Items.all()
            for (let i = 0; i < pageMediaStore.media_Files_temporary.length; i++) {
              const mediaFile = pageMediaStore.media_Files_temporary[i]
              const matchingAnnotation = annotations_rating.find(
                (annotation: { item_id: string; rating: number }) =>
                  annotation.item_id === mediaFile.id
              )
              if (matchingAnnotation) mediaFile.rating = matchingAnnotation.rating
              else mediaFile.rating = 0
            }
            ////// find playCount for media_Files_temporary
            const stmt_media_Annotation_playCount_Items = db.prepare(`
                            SELECT item_id, play_count, play_date
                            FROM ${store_server_user_model.annotation}
                            WHERE item_type = 'media_file'
                        `)
            const annotations_play_count = stmt_media_Annotation_playCount_Items.all()
            for (let i = 0; i < pageMediaStore.media_Files_temporary.length; i++) {
              const mediaFile = pageMediaStore.media_Files_temporary[i]
              const matchingAnnotation = annotations_play_count.find(
                (annotation: { item_id: string; play_count: number }) =>
                  annotation.item_id === mediaFile.id
              )
              if (matchingAnnotation) {
                mediaFile.play_count = matchingAnnotation.play_count
                mediaFile.play_date = matchingAnnotation.play_date
              } else mediaFile.play_count = 0
            }
            ////// filter selected_list for media_Files_temporary
            let order_play_date: any[] = []
            if (pageMediaStore.page_songlists_selected === 'song_list_recently') {
              order_play_date = db
                .prepare(
                  `
                                SELECT item_id
                                FROM ${store_server_user_model.annotation}
                                WHERE item_type = 'media_file'
                                  AND play_count > 0
                                ORDER BY play_date DESC
                            `
                )
                .all()
                .map((annotation: any) => annotation.item_id)
            }
            pageMediaStore.media_Files_temporary = pageMediaStore.media_Files_temporary.filter(
              (item: any) => {
                if (pageMediaStore.list_data_Hand_Search) {
                  return true
                } else if (pageMediaStore.page_songlists_selected === 'song_list_all') {
                  return true
                } else if (pageMediaStore.page_songlists_selected === 'song_list_love') {
                  return annotations.some((annotation: any) => annotation.item_id === item.id)
                } else if (pageMediaStore.page_songlists_selected === 'song_list_recently') {
                  return order_play_date.includes(item.id)
                } else {
                  const index = playlistStore.playlist_tracks_temporary_of_ALLLists.findIndex(
                    (list: any) => list.playlist.id === pageMediaStore.page_songlists_selected
                  )
                  let playlistTracks: any[] = []
                  if (index >= 0) {
                    playlistTracks = playlistStore.playlist_tracks_temporary_of_ALLLists[
                      index
                    ].playlist_tracks.map((track) => track.media_file_id)
                  }
                  return playlistTracks.includes(item.id)
                }
              }
            )
            pageMediaStore.list_data_Hand_Search = false
            if (pageMediaStore.page_songlists_selected === 'song_list_recently') {
              const new_sort: Media_File[] = pageMediaStore.media_Files_temporary.slice()
              pageMediaStore.media_Files_temporary = []
              order_play_date.forEach((id) => {
                const index = new_sort.findIndex((item) => item.id === id)
                if (index !== -1) {
                  pageMediaStore.media_Files_temporary.push(new_sort[index])
                  new_sort.splice(index, 1)
                }
              })
            }
            pageMediaStore.media_Files_temporary.forEach((item: any, index: number) => {
              item.absoluteIndex = index + 1
            })
          } catch (err: any) {
            console.error(err)
          } finally {
            db.close()
            console.log('db.close().......')
            db = null
          }
        } else {
          // other
        }
      } else if (store_server_user_model.model_server_type_of_web) {
        pageMediaStore.media_Files_temporary = []
        await this.fetchData_Media_of_server_web_start()
      }
    } catch (e) {
      console.error('fetchData_Media: ' + e)
    }
  },
  async fetchData_Media_Find_This_Album(id: string) {
    const pageMediaStore = usePageMediaStore()
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
            row.duration_txt = pageMediaStore.get_duration_formatTime(row.duration)
            this.setMediumImageUrl(row)
            pageMediaStore.media_Files_temporary.push(row)
          })
          pageMediaStore.media_Files_temporary.forEach((item: any, index: number) => {
            item.absoluteIndex = index + 1
          })
        } else {
          // other
        }
      } else if (store_server_user_model.model_server_type_of_web) {
        this.fetchData_Media_of_server_web_clear_index()
        this._album_id = id
        await this.fetchData_Media_of_server_web(true)
        this._album_id = ''
      }
    } else if (store_server_user_model.model_server_type_of_web) {
      if (
        store_server_users.server_select_kind === 'jellyfin' ||
        store_server_users.server_select_kind === 'emby' ||
        store_server_users.server_select_kind === 'ninesong'
      ) {
        this.fetchData_Media_of_server_web_clear_index()
        this._album_id = id
        await this.fetchData_Media_of_server_web(true)
        this._album_id = ''
      }
    }
  },
  async fetchData_Media_Find_This_Artist(id: string) {
    const pageMediaStore = usePageMediaStore()
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
            row.duration_txt = pageMediaStore.get_duration_formatTime(row.duration)
            this.setMediumImageUrl(row)
            pageMediaStore.media_Files_temporary.push(row)
          })
          pageMediaStore.media_Files_temporary.forEach((item: any, index: number) => {
            item.absoluteIndex = index + 1
          })
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
  _album_id: '',
  set_album_id(id: string) {
    store_general_fetch_media_list._album_id = id
    store_general_fetch_player_list._album_id = id
  },
  _artist_id: '',
  set_artist_id(id: string) {
    store_general_fetch_media_list._artist_id = id
    store_general_fetch_player_list._artist_id = id
  },
  _album_artist_id: '', // Emby Home$Album
  set_album_artist_id(id: string) {
    this.fetchData_Media_of_server_web_clear_all_parms()
    store_general_fetch_media_list._album_artist_id = id
    store_general_fetch_player_list._album_artist_id = id
  },
  fetchData_Media_of_server_web_clear_all_parms() {
    store_general_fetch_media_list._album_id = ''
    store_general_fetch_media_list._artist_id = ''
    store_general_fetch_album_list._artist_id = ''
    store_general_fetch_media_list._album_artist_id = ''
    store_general_fetch_media_list._media_id = ''

    store_general_fetch_player_list._album_id = ''
    store_general_fetch_player_list._artist_id = ''
    store_general_fetch_player_list._album_artist_id = ''
  },
  _media_id: '', // Jellyfin Home$Media
  _load_model: 'search', // 'search' and 'play'
  fetchData_Media_of_server_web_clear_search_parms() {
    store_general_fetch_media_list._album_id = ''
    store_general_fetch_media_list._artist_id = ''
    store_general_fetch_album_list._artist_id = ''

    store_general_fetch_media_list._album_artist_id = ''
    store_general_fetch_media_list._media_id = ''
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
    const pageMediaStore = usePageMediaStore()
    try {
      if (
        store_server_user_model.random_play_model &&
        store_server_users.server_select_kind !== 'navidrome'
      ) {
        // 随机播放逻辑
      } else {
        pageMediaStore.media_Files_temporary = []
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
    const pageMediaStore = usePageMediaStore()
    try {
      const _search =
        (pageMediaStore.page_songlists_keywordFilter || '').match(/%([^%]+)%/)?.[1] || ''
      const selected = pageMediaStore.page_songlists_selected

      let _sort =
        pageMediaStore.page_songlists_options_Sort_key.length > 0 &&
        pageMediaStore.page_songlists_options_Sort_key[0].order !== 'default'
          ? pageMediaStore.page_songlists_options_Sort_key[0].columnKey
          : 'id'
      let _order =
        pageMediaStore.page_songlists_options_Sort_key.length > 0 &&
        pageMediaStore.page_songlists_options_Sort_key[0].order !== 'default'
          ? pageMediaStore.page_songlists_options_Sort_key[0].order.replace('end', '')
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
      const _album_id =
        this._load_model === 'search' ? this._album_id : store_general_fetch_player_list._album_id
      const _album_artist_id =
        this._load_model === 'search'
          ? this._album_artist_id
          : store_general_fetch_player_list._album_artist_id

      if (
        store_server_user_model.model_server_type_of_local ||
        (store_server_users.server_select_kind === 'navidrome' &&
          store_server_user_model.model_server_type_of_web)
      ) {
        const limit =
          this._load_model === 'search'
            ? String(this._end)
            : String(store_general_fetch_player_list._end)
        const startIndex =
          this._load_model === 'search'
            ? String(this._start)
            : String(store_general_fetch_player_list._start)

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
          _search,
          _starred,
          playlist_id,
          _album_id,
          _artist_id,
          pageMediaStore.page_songlists_filter_year > 0
            ? pageMediaStore.page_songlists_filter_year
            : ''
        )
      } else if (store_server_user_model.model_server_type_of_web) {
        if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          const sortBy =
            _sort === 'DatePlayed' ? 'DatePlayed,SortName' : _sort !== 'id' ? _sort : 'SortName'
          const sortOrder =
            _sort === 'DatePlayed' ? 'Descending' : _order === 'desc' ? 'Descending' : 'Ascending'
          const filter = _starred === 'true' ? 'IsFavorite' : ''

          const limit =
            this._load_model === 'search'
              ? String(this._end - this._start)
              : String(
                  store_general_fetch_player_list._end - store_general_fetch_player_list._start
                )
          const startIndex =
            this._load_model === 'search'
              ? String(this._start)
              : String(store_general_fetch_player_list._start)

          const get_Jellyfin_Temp_Data_To_LocalSqlite = new Get_Jellyfin_Temp_Data_To_LocalSqlite()
          if (this._media_id.length === 0) {
            if (_artist_id.length === 0) {
              if (_album_artist_id.length === 0) {
                const parentId =
                  _album_id.length === 0 ? store_server_user_model.parentid_of_Je_Music : _album_id
                await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list(
                  playlist_id,
                  store_server_user_model.userid_of_Je,
                  parentId,
                  _search,
                  sortBy,
                  sortOrder,
                  limit,
                  startIndex,
                  'Audio',
                  'ParentId',
                  'Primary,Backdrop,Thumb',
                  'true',
                  '1',
                  pageMediaStore.page_songlists_filter_year > 0
                    ? pageMediaStore.page_songlists_filter_year
                    : '',
                  filter
                )
              } else {
                await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list_of_home$album_of_Em(
                  _album_artist_id,
                  limit,
                  startIndex
                )
              }
            } else {
              await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list_of_artist(
                _artist_id,
                limit,
                startIndex
              )
            }
          } else {
            await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list_of_home$media_of_Je(
              this._media_id,
              limit,
              startIndex
            )
          }
        } else if (store_server_users.server_select_kind === 'ninesong') {
          const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          if (this._media_id.length === 0) {
            const limit =
              this._load_model === 'search'
                ? String(this._end)
                : String(store_general_fetch_player_list._end)
            const startIndex =
              this._load_model === 'search'
                ? String(this._start)
                : String(store_general_fetch_player_list._start)

            await get_NineSong_Temp_Data_To_LocalSqlite.get_media_list(
              store_server_login_info.server_url,
              startIndex,
              limit,
              _sort,
              _order,
              pageMediaStore.page_songlists_multi_sort,
              _starred,
              _search,
              pageMediaStore.page_songlists_filter_year > 0
                ? pageMediaStore.page_songlists_filter_year
                : '',
              playlist_id,
              _album_id,
              _artist_id,
              pageMediaStore.page_songlists_suffix,
              pageMediaStore.page_songlists_bitrate_range[0],
              pageMediaStore.page_songlists_bitrate_range[1],
              pageMediaStore.page_songlists_library_path
            )
          } else {
            await get_NineSong_Temp_Data_To_LocalSqlite.get_recommend_medias([this._media_id])
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch media data:', error)
    }
  },
  fetchData_Media_of_data_synchronization_to_playlist() {
    const pageMediaStore = usePageMediaStore()
    const playlistStore = usePlaylistStore()
    pageMediaStore.media_Files_temporary.forEach((row) => {
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
