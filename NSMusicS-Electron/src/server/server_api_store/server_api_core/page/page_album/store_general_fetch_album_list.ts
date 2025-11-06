import { reactive } from 'vue'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_router_history_data_of_album } from '@/router/router_store/store_router_history_data_of_album'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { usePageAlbumStore } from '@/data/data_status/page_status/album_store/usePageAlbumStore'
import { usePlayerAppearanceStore } from '@/data/data_status/comment_status/player_store/usePlayerAppearanceStore'
import { usePageMediaStore } from '@/data/data_status/page_status/media_store/usePageMediaStore'
import { store_general_fetch_media_list } from '@/server/server_api_store/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { usePlaylistStore } from '@/data/data_status/comment_status/playlist_store/usePlaylistStore'

import { store_server_users } from '@/server/server_management/store_server_users'
import { store_general_fetch_player_list } from '@/server/server_api_store/server_api_core/components/player_list/store_general_fetch_player_list'
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { usePlayerSettingStore } from '@/data/data_status/comment_status/player_store/usePlayerSettingStore'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/server/server_api/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/server/server_api/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/server/server_api/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/data/data_status/comment_status/login_store/store_server_login_info'

export const store_general_fetch_album_list = reactive({
  async fetchData_Album() {
    const pageAlbumStore = usePageAlbumStore()
    if (store_server_user_model.model_server_type_of_local) {
      if (isElectron) {
        let db: any = null
        let moment = require('moment')
        // clear RouterView of vue-virtual-scroller data
        const playerAppearanceStore = usePlayerAppearanceStore()
        if (playerAppearanceStore.player_mode_of_medialist_from_external_import) {
          playerAppearanceStore.player_mode_of_medialist_from_external_import = false
        } else {
          store_router_data_logic.clearAllTemporaryFiles()
          store_router_data_info.router_select = 'album'
        }

        try {
          db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')

          let stmt_album = null
          let stmt_album_string = ''

          // load album_Files_temporary data
          if (store_router_history_data_of_album.router_history_model_of_Album === 0) {
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
            let keywordFilter =
              pageAlbumStore.page_albumlists_keyword.length > 0
                ? `WHERE id LIKE '%${pageAlbumStore.page_albumlists_keyword}%' 
                        OR name LIKE '%${pageAlbumStore.page_albumlists_keyword}%' 
                        OR artist LIKE '%${pageAlbumStore.page_albumlists_keyword}%' 
                        OR artist_id LIKE '%${pageAlbumStore.page_albumlists_keyword}%' 
                        OR created_at LIKE '%${pageAlbumStore.page_albumlists_keyword}%'`
                : ''
            if (store_router_data_info.find_album_model) {
              if (pageAlbumStore.page_albumlists_get_keyword_model_num != 1)
                keywordFilter = `WHERE artist_id = '${pageAlbumStore.page_albumlists_keyword}'`
              else
                keywordFilter = `WHERE created_at LIKE '${pageAlbumStore.page_albumlists_keyword}'`
              store_router_data_info.find_album_model = false
            } else {
              if (pageAlbumStore.page_albumlists_get_keyword_model_num != 0) {
                if (keywordFilter.length > 0) {
                  keywordFilter = keywordFilter
                    .replace('LIKE', '=')
                    .replace(/%/g, '')
                    .replace('artist', 'artist_id')
                }
              }
            }
            if (
              pageAlbumStore.page_albumlists_filter_year != 0 &&
              pageAlbumStore.page_albumlists_filter_year != undefined &&
              pageAlbumStore.page_albumlists_filter_year != 'undefined'
            ) {
              keywordFilter = this.addCondition(
                keywordFilter,
                `min_year = ${pageAlbumStore.page_albumlists_filter_year}`
              )
            }
            stmt_album_string = `SELECT *
                                             FROM ${store_server_user_model.album} ${keywordFilter}
                                             ORDER BY ${sortKey} ${sortOrder}`
            stmt_album = db.prepare(stmt_album_string)
            //////
            if (!pageAlbumStore.page_albumlists_filter_model) {
              if (
                store_router_history_data_of_album.router_select_history_date_of_Album &&
                pageAlbumStore.page_albumlists_keyword_reset
              ) {
                store_router_history_data_of_album.remove_router_history_of_Album(
                  store_router_history_data_of_album.router_select_history_date_of_Album.id
                ) // 若存在新操作，则覆盖后续的路由
                pageAlbumStore.page_albumlists_keyword_reset = false
              }
              const routerDate: Interface_View_Router_Date = {
                id: 0,
                menu_select_active_key: 'album',
                router_name: 'album',
                router_select: 'album',
                page_lists_keyword: pageAlbumStore.page_albumlists_keyword,
                stmt_string: stmt_album_string,
                page_lists_selected: pageAlbumStore.page_albumlists_selected,
                columnKey:
                  pageAlbumStore.page_albumlists_options_Sort_key.length > 0 &&
                  pageAlbumStore.page_albumlists_options_Sort_key[0].order !== 'default'
                    ? pageAlbumStore.page_albumlists_options_Sort_key[0].columnKey
                    : 'id',
                order:
                  pageAlbumStore.page_albumlists_options_Sort_key.length > 0 &&
                  pageAlbumStore.page_albumlists_options_Sort_key[0].order !== 'default'
                    ? pageAlbumStore.page_albumlists_options_Sort_key[0].order.replace('end', '')
                    : '',
                page_lists_scrollindex:
                  store_router_history_data_of_album.router_history_model_of_Album_scroller_value,
              }
              store_router_history_data_of_album.add_router_history_of_Album(routerDate)
            } // 添加新记录
            //////
          } else {
            if (store_router_history_data_of_album.router_select_history_date_of_Album) {
              store_router_data_info.router.push('album')
              store_router_data_info.router_select = 'album'
              pageAlbumStore.page_albumlists_keyword =
                store_router_history_data_of_album.router_select_history_date_of_Album.page_lists_keyword
              pageAlbumStore.page_albumlists_selected =
                store_router_history_data_of_album.router_select_history_date_of_Album.page_lists_selected
              pageAlbumStore.page_albumlists_options_Sort_key = [
                {
                  columnKey:
                    store_router_history_data_of_album.router_select_history_date_of_Album
                      .columnKey,
                  order:
                    store_router_history_data_of_album.router_select_history_date_of_Album.order,
                },
              ]
              store_router_history_data_of_album.router_history_model_of_Album_scroller_value =
                store_router_history_data_of_album.router_select_history_date_of_Album.page_lists_scrollindex
              stmt_album = db.prepare(
                store_router_history_data_of_album.router_select_history_date_of_Album.stmt_string
              )
            }
            store_router_history_data_of_album.router_history_model_of_Album = 0
          }
          pageAlbumStore.album_Files_temporary = []
          const rows = stmt_album.all()
          rows.forEach((row: Album) => {
            if (row.medium_image_url == null || row.medium_image_url.length == 0) {
              if (row.embed_art_path) {
                const fileName = row.embed_art_path.split(/[\\/]/).pop() // 兼容 Windows 和 Unix 路径分隔符
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
            const fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/)
            const fileNameWithExtension = fileNameMatch ? fileNameMatch[0] : null
            const fileNameWithoutExtension = fileNameWithExtension
              ? fileNameWithExtension.replace(/\.[^.]+$/, '')
              : null
            const fileNameWithoutPrefix = fileNameWithoutExtension
              ? fileNameWithoutExtension.replace(/.*?-\s*/, '')
              : null
            if (fileNameWithoutPrefix !== null) {
              row.title = fileNameWithoutPrefix
            }
            row.album_title = row.title + '<br>' + row.artist
            row.updated_time = row.updated_at
              ? moment(row.updated_at, moment.ISO_8601).format('YYYY-MM-DD')
              : ''
            row.created_time = row.created_at
              ? moment(row.created_at, moment.ISO_8601).format('YYYY-MM-DD')
              : ''
            pageAlbumStore.album_Files_temporary.push(row)
          })
          rows.length = 0
          moment = null
          ////// find favorite for album_Files_temporary
          const stmt_album_Annotation_Starred_Items = db.prepare(`
                        SELECT item_id
                        FROM ${store_server_user_model.annotation}
                        WHERE starred = 1
                          AND item_type = 'album'
                    `)
          const annotations = stmt_album_Annotation_Starred_Items.all()
          for (let i = 0; i < pageAlbumStore.album_Files_temporary.length; i++) {
            pageAlbumStore.album_Files_temporary[i].favorite = !!annotations.some(
              (annotation: { item_id: string }) =>
                annotation.item_id === pageAlbumStore.album_Files_temporary[i].id
            )
          }
          ////// find rating for album_Files_temporary
          const stmt_album_Annotation_Rating_Items = db.prepare(`
                        SELECT item_id, rating
                        FROM ${store_server_user_model.annotation}
                        WHERE rating > 0
                          AND item_type = 'album'
                    `)
          const annotations_rating = stmt_album_Annotation_Rating_Items.all()
          for (let i = 0; i < pageAlbumStore.album_Files_temporary.length; i++) {
            const albumFile = pageAlbumStore.album_Files_temporary[i]
            const matchingAnnotation = annotations_rating.find(
              (annotation: { item_id: string; rating: number }) =>
                annotation.item_id === albumFile.id
            )
            if (matchingAnnotation) albumFile.rating = matchingAnnotation.rating
            else albumFile.rating = 0
          }
          ////// filter selected_list for album_Files_temporary
          let order_play_date: any[] = []
          if (pageAlbumStore.page_albumlists_selected === 'album_list_recently') {
            order_play_date = db
              .prepare(
                `
                            SELECT item_id
                            FROM ${store_server_user_model.annotation}
                            WHERE item_type = 'album'
                              AND play_count > 0
                            ORDER BY play_date DESC
                        `
              )
              .all()
              .map((annotation: any) => annotation.item_id)
          }
          pageAlbumStore.album_Files_temporary = pageAlbumStore.album_Files_temporary.filter(
            (item: any) => {
              if (pageAlbumStore.page_albumlists_selected === 'album_list_all') {
                return true
              } else if (pageAlbumStore.page_albumlists_selected === 'album_list_love') {
                return annotations.some(
                  (annotation: { item_id: string }) => annotation.item_id === item.id
                )
              } else if (pageAlbumStore.page_albumlists_selected === 'album_list_recently') {
                return order_play_date.includes(item.id)
              } else if (pageAlbumStore.page_albumlists_selected === 'album_list_all_PlayList') {
                return true
              }
            }
          )
          if (pageAlbumStore.page_albumlists_selected === 'album_list_recently') {
            const new_sort: Album[] = pageAlbumStore.album_Files_temporary.slice()
            pageAlbumStore.album_Files_temporary = []
            order_play_date.forEach((id) => {
              const index = new_sort.findIndex((item) => item.id === id)
              if (index !== -1) {
                pageAlbumStore.album_Files_temporary.push(new_sort[index])
                new_sort.splice(index, 1)
              }
            })
          }
          pageAlbumStore.album_Files_temporary.forEach((item: any, index: number) => {
            item.absoluteIndex = index + 1
          })
        } catch (err: any) {
          console.error(err)
        } finally {
          db.close()
          console.log('db.close().......')
          db = null
        }
      }
    } else if (store_server_user_model.model_server_type_of_web) {
      pageAlbumStore.album_Files_temporary = []
      await this.fetchData_Album_of_server_web_start()
    }
  },
  async fetchData_This_Album_MediaList(album_id: any) {
    const playerAppearanceStore = usePlayerAppearanceStore()
    playerAppearanceStore.player_mode_of_medialist_from_external_import = true

    const pageMediaStore = usePageMediaStore()
    pageMediaStore.page_songlists_keywordFilter = `WHERE album_id = '${album_id}'`
    pageMediaStore.page_songlists_selected = 'song_list_all'
    pageMediaStore.media_Files_temporary = []

    store_router_data_info.find_music_model = true
    store_router_data_info.find_album_model = false
    store_router_data_info.find_artist_model = false
    await store_general_fetch_media_list.fetchData_Media()
    store_router_data_info.find_music_model = false

    store_general_fetch_player_list.fetchData_PlayList(false)

    if (
      store_router_data_info.router_select != 'home' &&
      store_router_data_info.router_select != 'recently_added'
    ) {
      store_router_data_info.router_select = 'album'
      // home-page-album 传入则不需要指定album模式
      // recently-added-page-album 传入则不需要指定album模式
    }

    const playlistStore = usePlaylistStore()
    if (playlistStore.playlist_MediaFiles_temporary.length > 0) {
      playerAppearanceStore.player_mode_of_lock_playlist = false
      const media_file = playlistStore.playlist_MediaFiles_temporary[0]
      const playerSettingStore = usePlayerSettingStore()
      await playerSettingStore.update_current_media_info(media_file, media_file.absoluteIndex)
      //
      playlistStore.media_page_handleItemDbClick = false
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
  _end: 100,
  _artist_id: '',
  set_artist_id(id: string) {
    store_general_fetch_album_list._artist_id = id
    store_general_fetch_player_list._artist_id = id
  },
  async fetchData_Album_of_server_web_start() {
    const pageAlbumStore = usePageAlbumStore()
    pageAlbumStore.album_Files_temporary = []
    this._start = 0
    this._end = 30
    await this.fetchData_Album_of_server_web()

    const playerAppearanceStore = usePlayerAppearanceStore()
    if (playerAppearanceStore.player_mode_of_medialist_from_external_import) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    }
  },
  async fetchData_Album_of_server_web_end() {
    this._start += 30
    this._end += 30
    await this.fetchData_Album_of_server_web()
  },
  async fetchData_Album_of_server_web() {
    try {
      const pageAlbumStore = usePageAlbumStore()
      const _search = pageAlbumStore.page_albumlists_keyword
      const selected = pageAlbumStore.page_albumlists_selected

      let _sort =
        pageAlbumStore.page_albumlists_options_Sort_key.length > 0 &&
        pageAlbumStore.page_albumlists_options_Sort_key[0].order !== 'default'
          ? pageAlbumStore.page_albumlists_options_Sort_key[0].columnKey
          : 'id'
      let _order =
        pageAlbumStore.page_albumlists_options_Sort_key.length > 0 &&
        pageAlbumStore.page_albumlists_options_Sort_key[0].order !== 'default'
          ? pageAlbumStore.page_albumlists_options_Sort_key[0].order.replace('end', '')
          : 'ASC'

      let _starred = ''
      if (selected === 'album_list_love') {
        _starred = 'true'
      } else if (selected === 'album_list_recently') {
        _order = 'desc'
        _sort = 'playDate'
        if (store_server_user_model.model_server_type_of_web) {
          if (
            store_server_users.server_select_kind === 'jellyfin' ||
            store_server_users.server_select_kind === 'emby'
          ) {
            _sort = 'DatePlayed'
          } else if (store_server_users.server_select_kind === 'ninesong') {
            _sort = 'play_date'
          }
        }
      }

      if (
        store_server_user_model.model_server_type_of_local ||
        (store_server_users.server_select_kind === 'navidrome' &&
          store_server_user_model.model_server_type_of_web)
      ) {
        const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
        await get_Navidrome_Temp_Data_To_LocalSqlite.get_album_list(
          store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
          store_server_user_model.username,
          store_server_user_model.token,
          store_server_user_model.salt,
          String(this._end),
          _order,
          _sort,
          String(this._start),
          _search,
          _starred,
          this._artist_id
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
          const find_artist_albums = this._artist_id.length === 0

          const get_Jellyfin_Temp_Data_To_LocalSqlite = new Get_Jellyfin_Temp_Data_To_LocalSqlite()
          if (find_artist_albums) {
            await get_Jellyfin_Temp_Data_To_LocalSqlite.get_album_list(
              store_server_user_model.userid_of_Je,
              store_server_user_model.parentid_of_Je_Music,
              _search,
              sortBy,
              sortOrder,
              String(this._end - this._start),
              String(this._start),
              'MusicAlbum',
              'ParentId',
              'Primary,Backdrop,Thumb',
              'true',
              '1',
              pageAlbumStore.page_albumlists_filter_year > 0
                ? pageAlbumStore.page_albumlists_filter_year
                : '',
              filter
            )
          } else {
            await get_Jellyfin_Temp_Data_To_LocalSqlite.get_album_list_find_artist_id(
              store_server_user_model.userid_of_Je,
              this._artist_id,
              sortBy,
              sortOrder,
              String(this._end - this._start),
              String(this._start),
              'MusicAlbum',
              'ParentId,PrimaryImageAspectRatio,ParentId,PrimaryImageAspectRatio',
              'true',
              'false'
            )
          }
        } else if (store_server_users.server_select_kind === 'ninesong') {
          const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_NineSong_Temp_Data_To_LocalSqlite.get_album_list(
            store_server_login_info.server_url,
            String(this._start),
            String(this._end),
            _sort,
            _order,
            pageAlbumStore.page_albumlists_multi_sort,
            _starred,
            _search,
            pageAlbumStore.page_albumlists_filter_year > 0
              ? pageAlbumStore.page_albumlists_filter_year
              : '',
            pageAlbumStore.page_albumlists_filter_year > 0
              ? pageAlbumStore.page_albumlists_filter_year
              : '',
            this._artist_id
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch album data:', error)
    }
  },
})
