import { reactive } from 'vue'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_router_history_data_of_artist } from '@/router/router_store/store_router_history_data_of_artist'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { usePageArtistStore } from '@/data/data_status/app_status/page_status/artist_store/usePageArtistStore'
import { usePlayerAppearanceStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerAppearanceStore'
import { usePageMediaStore } from '@/data/data_status/app_status/page_status/media_store/usePageMediaStore'
import { store_general_fetch_media_list } from '@/server/server_api_store/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { usePlaylistStore } from '@/data/data_status/app_status/comment_status/playlist_store/usePlaylistStore'

import { store_local_data_set_artistInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_artistInfo'
import { store_server_users } from '@/server/server_management/store_server_users'

import { store_general_fetch_player_list } from '@/server/server_api_store/server_api_core/components/player_list/store_general_fetch_player_list'
import error_album from '@/assets/img/error_album.jpg'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { Get_LocalSqlite_AnnotationInfo } from '@/data/data_repository/app_repository/LocalSqlite_Get_AnnotationInfo'
import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/server/server_api/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/server/server_api/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/server/server_api/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { store_general_fetch_artist_tree } from '@/server/server_api_store/server_api_core/page/page_artist/store_general_fetch_artist_tree'

export const store_general_fetch_artist_list = reactive({
  async fetchData_Artist() {
    const pageArtistStore = usePageArtistStore()
    // clear RouterView of vue-virtual-scroller data
    store_router_data_logic.clearAllTemporaryFiles()
    store_router_data_info.router_select = 'artist'
    if (store_server_user_model.model_server_type_of_local) {
      if (isElectron) {
        let db: any = null
        try {
          db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')

          let stmt_artist = null
          let stmt_artist_string = ''

          // load artist_Files_temporary data
          if (store_router_history_data_of_artist.router_history_model_of_Artist === 0) {
            const sortKey =
              pageArtistStore.page_artistlists_options_Sort_key.length > 0 &&
              pageArtistStore.page_artistlists_options_Sort_key[0].order !== 'default'
                ? pageArtistStore.page_artistlists_options_Sort_key[0].columnKey
                : 'id'
            const sortOrder =
              pageArtistStore.page_artistlists_options_Sort_key.length > 0 &&
              pageArtistStore.page_artistlists_options_Sort_key[0].order !== 'default'
                ? pageArtistStore.page_artistlists_options_Sort_key[0].order.replace('end', '')
                : ''
            const keywordFilter =
              pageArtistStore.page_artistlists_keyword.length > 0
                ? `WHERE name LIKE '%${pageArtistStore.page_artistlists_keyword}%' 
                OR external_info_updated_at LIKE '%${pageArtistStore.page_artistlists_keyword}%'`
                : ''
            stmt_artist_string = `SELECT *
                                              FROM ${store_server_user_model.artist} ${keywordFilter}
                                              ORDER BY ${sortKey} ${sortOrder}`
            stmt_artist = db.prepare(stmt_artist_string)
            //////
            if (
              store_router_history_data_of_artist.router_select_history_date_of_Artist &&
              pageArtistStore.page_artistlists_keyword_reset
            ) {
              store_router_history_data_of_artist.remove_router_history_of_Artist(
                store_router_history_data_of_artist.router_select_history_date_of_Artist.id
              ) // 若存在新操作，则覆盖后续的路由
              pageArtistStore.page_artistlists_keyword_reset = false
            }
            const routerDate: Interface_View_Router_Date = {
              id: 0,
              menu_select_active_key: 'artist',
              router_name: 'artist',
              router_select: 'artist',
              page_lists_keyword: pageArtistStore.page_artistlists_keyword,
              stmt_string: stmt_artist_string,
              page_lists_selected: pageArtistStore.page_artistlists_selected,
              columnKey:
                pageArtistStore.page_artistlists_options_Sort_key.length > 0 &&
                pageArtistStore.page_artistlists_options_Sort_key[0].order !== 'default'
                  ? pageArtistStore.page_artistlists_options_Sort_key[0].columnKey
                  : 'id',
              order:
                pageArtistStore.page_artistlists_options_Sort_key.length > 0 &&
                pageArtistStore.page_artistlists_options_Sort_key[0].order !== 'default'
                  ? pageArtistStore.page_artistlists_options_Sort_key[0].order.replace('end', '')
                  : '',
              page_lists_scrollindex:
                store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value,
            }
            store_router_history_data_of_artist.add_router_history_of_Artist(routerDate)
            //////
          } else {
            if (store_router_history_data_of_artist.router_select_history_date_of_Artist) {
              store_router_data_info.router.push('artist')
              store_router_data_info.router_select_model_artist = true
              pageArtistStore.page_artistlists_keyword =
                store_router_history_data_of_artist.router_select_history_date_of_Artist.page_lists_keyword
              pageArtistStore.page_artistlists_selected =
                store_router_history_data_of_artist.router_select_history_date_of_Artist.page_lists_selected
              pageArtistStore.page_artistlists_options_Sort_key = [
                {
                  columnKey:
                    store_router_history_data_of_artist.router_select_history_date_of_Artist
                      .columnKey,
                  order:
                    store_router_history_data_of_artist.router_select_history_date_of_Artist.order,
                },
              ]
              store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value =
                store_router_history_data_of_artist.router_select_history_date_of_Artist.page_lists_scrollindex
              stmt_artist = db.prepare(
                store_router_history_data_of_artist.router_select_history_date_of_Artist.stmt_string
              )
            }
            store_router_history_data_of_artist.router_history_model_of_Artist = 0
          }
          const stmt_media_file = db.prepare(`SELECT *
                                                        FROM ${store_server_user_model.media_file}`)
          const pathfiles = stmt_media_file.all()
          pageArtistStore.artist_Files_temporary = []
          const rows = stmt_artist.all()
          rows.forEach((row: Artist) => {
            for (let j = 0; j < pathfiles.length; j++) {
              if (pathfiles[j].artist_id === row.id) {
                if (row.medium_image_url == null || row.medium_image_url.length == 0) {
                  if (pathfiles[j].path) {
                    const fileName = pathfiles[j].path.split(/[\\/]/).pop() // 兼容 Windows 和 Unix 路径分隔符
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
                break
              }
              if (j === pathfiles.length - 1) {
                row.medium_image_url = error_album
              }
            }
            pageArtistStore.artist_Files_temporary.push(row)
          })
          rows.length = 0
          ////// find favorite for artist_Files_temporary
          const stmt_artist_Annotation_Starred_Items = db.prepare(`
                        SELECT item_id
                        FROM ${store_server_user_model.annotation}
                        WHERE starred = 1
                          AND item_type = 'artist'
                    `)
          const annotations = stmt_artist_Annotation_Starred_Items.all()
          for (let i = 0; i < pageArtistStore.artist_Files_temporary.length; i++) {
            pageArtistStore.artist_Files_temporary[i].favorite = !!annotations.some(
              (annotation: { item_id: string }) =>
                annotation.item_id === pageArtistStore.artist_Files_temporary[i].id
            )
          }
          ////// find rating for artist_Files_temporary
          const stmt_artist_Annotation_Rating_Items = db.prepare(`
                        SELECT item_id, rating
                        FROM ${store_server_user_model.annotation}
                        WHERE rating > 0
                          AND item_type = 'artist'
                    `)
          const annotations_rating = stmt_artist_Annotation_Rating_Items.all()
          for (let i = 0; i < pageArtistStore.artist_Files_temporary.length; i++) {
            const artistFile = pageArtistStore.artist_Files_temporary[i]
            const matchingAnnotation = annotations_rating.find(
              (annotation: { item_id: string; rating: number }) =>
                annotation.item_id === artistFile.id
            )
            if (matchingAnnotation) artistFile.rating = matchingAnnotation.rating
            else artistFile.rating = 0
          }
          ////// filter selected_list for artist_Files_temporary
          let order_play_date: any[] = []
          if (pageArtistStore.page_artistlists_selected === 'artist_list_recently') {
            order_play_date = db
              .prepare(
                `
                            SELECT item_id
                            FROM ${store_server_user_model.annotation}
                            WHERE item_type = 'artist'
                              AND play_count > 0
                            ORDER BY play_date DESC
                        `
              )
              .all()
              .map((annotation: any) => annotation.item_id)
          }
          pageArtistStore.artist_Files_temporary = pageArtistStore.artist_Files_temporary.filter(
            (item: any) => {
              if (pageArtistStore.page_artistlists_selected === 'artist_list_all') {
                return true
              } else if (pageArtistStore.page_artistlists_selected === 'artist_list_love') {
                return annotations.some(
                  (annotation: { item_id: string }) => annotation.item_id === item.id
                )
              } else if (pageArtistStore.page_artistlists_selected === 'artist_list_recently') {
                return order_play_date.includes(item.id)
              } else if (pageArtistStore.page_artistlists_selected === 'artist_list_all_PlayList') {
                return true
              }
            }
          )
          if (pageArtistStore.page_artistlists_selected === 'artist_list_recently') {
            const new_sort: Artist[] = pageArtistStore.artist_Files_temporary.slice()
            pageArtistStore.artist_Files_temporary = []
            order_play_date.forEach((id) => {
              const index = new_sort.findIndex((item) => item.id === id)
              if (index !== -1) {
                pageArtistStore.artist_Files_temporary.push(new_sort[index])
                new_sort.splice(index, 1)
              }
            })
          }
          // pageArtistStore.artist_Files_temporary.forEach((item: any, index: number) => {
          //   item.absoluteIndex = index + 1;
          // });
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
      const pageArtistStore = usePageArtistStore()
      pageArtistStore.artist_Files_temporary = []
      await this.fetchData_Artist_of_server_web_start()
      ///
      if (
        store_server_users.server_select_kind === 'ninesong' &&
        store_router_data_info.router_select === 'artist'
      ) {
        if (pageArtistStore.artist_Files_temporary.length > 0) {
          store_general_fetch_artist_tree._artist_id = pageArtistStore.artist_Files_temporary[0].id
          await store_general_fetch_artist_tree.fetchData_ArtistTree()
        }
      }
    }
  },
  async fetchData_This_Artist_MediaList(artist_id: any) {
    const pageArtistStore = usePageArtistStore()
    const playerAppearanceStore = usePlayerAppearanceStore()
    if (
      store_server_users.server_select_kind != 'jellyfin' ||
      store_server_users.server_select_kind != 'emby'
    ) {
      playerAppearanceStore.player_mode_of_medialist_from_external_import = true
    }

    const pageMediaStore = usePageMediaStore()
    pageMediaStore.page_songlists_keywordFilter = `WHERE artist_id = '${artist_id}'`
    pageMediaStore.page_songlists_selected = 'song_list_all'
    pageMediaStore.media_Files_temporary = []

    store_router_data_info.find_music_model = false
    store_router_data_info.find_album_model = false
    store_router_data_info.find_artist_model = true
    await store_general_fetch_media_list.fetchData_Media()
    store_router_data_info.find_artist_model = false

    await store_general_fetch_player_list.fetchData_PlayList(false)

    store_router_data_info.router_select_model_artist = true

    const playerSettingStore = usePlayerSettingStore()
    const playlistStore = usePlaylistStore()
    if (playlistStore.playlist_MediaFiles_temporary.length > 0) {
      playerAppearanceStore.player_mode_of_lock_playlist = false
      const media_file = playlistStore.playlist_MediaFiles_temporary[0]
      await playerSettingStore.update_current_media_info(media_file, media_file.absoluteIndex)
      //
      playlistStore.media_page_handleItemDbClick = false
    }

    store_local_data_set_artistInfo.Set_ArtistInfo_To_PlayCount_of_Artist(
      playlistStore.playlist_MediaFiles_temporary[0].artist_id
    )
    if (store_server_user_model.model_server_type_of_local) {
      const get_LocalSqlite_AnnotationInfo = new Get_LocalSqlite_AnnotationInfo()
      pageArtistStore.artist_recently_count =
        get_LocalSqlite_AnnotationInfo.Get_Annotation_ItemInfo_Play_Count('artist')
      playerSettingStore.boolHandleItemClick_Played = true
    }
  },

  _start: 0,
  _end: 30,
  async fetchData_Artist_of_server_web_start() {
    const pageArtistStore = usePageArtistStore()
    pageArtistStore.artist_Files_temporary = []
    this._start = 0
    this._end = 30
    await this.fetchData_Artist_of_server_web()

    const playerAppearanceStore = usePlayerAppearanceStore()
    if (playerAppearanceStore.player_mode_of_medialist_from_external_import) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    }
  },
  async fetchData_Artist_of_server_web_end() {
    this._start += 30
    this._end += 30
    await this.fetchData_Artist_of_server_web()
  },
  async fetchData_Artist_of_server_web() {
    try {
      const pageArtistStore = usePageArtistStore()
      const _search = pageArtistStore.page_artistlists_keyword
      const selected = pageArtistStore.page_artistlists_selected

      let _sort =
        pageArtistStore.page_artistlists_options_Sort_key.length > 0 &&
        pageArtistStore.page_artistlists_options_Sort_key[0].order !== 'default'
          ? pageArtistStore.page_artistlists_options_Sort_key[0].columnKey
          : 'id'
      let _order =
        pageArtistStore.page_artistlists_options_Sort_key.length > 0 &&
        pageArtistStore.page_artistlists_options_Sort_key[0].order !== 'default'
          ? pageArtistStore.page_artistlists_options_Sort_key[0].order.replace('end', '')
          : 'ASC'

      let _starred = ''
      let playlist_id = ''
      if (selected === 'artist_list_love') {
        _starred = 'true'
      } else if (selected === 'artist_list_recently') {
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
      } else if (selected !== 'artist_list_all') {
        playlist_id = selected
      }

      if (
        store_server_user_model.model_server_type_of_local ||
        (store_server_users.server_select_kind === 'navidrome' &&
          store_server_user_model.model_server_type_of_web)
      ) {
        const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
        await get_Navidrome_Temp_Data_To_LocalSqlite.get_artist_list(
          store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
          store_server_user_model.username,
          store_server_user_model.token,
          store_server_user_model.salt,
          String(this._end),
          _order,
          _sort,
          String(this._start),
          _search,
          _starred
        )
      } else if (store_server_user_model.model_server_type_of_web) {
        if (
          store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby'
        ) {
          const filter = _starred === 'true' ? 'IsFavorite' : ''
          const get_Jellyfin_Temp_Data_To_LocalSqlite = new Get_Jellyfin_Temp_Data_To_LocalSqlite()
          await get_Jellyfin_Temp_Data_To_LocalSqlite.get_artist_list(
            store_server_user_model.userid_of_Je,
            store_server_user_model.parentid_of_Je_Music,
            _search,
            '',
            '',
            String(this._end - this._start),
            String(this._start),
            'Artist',
            'ParentId',
            'Primary,Backdrop,Thumb',
            'true',
            '1',
            '',
            filter
          )
        } else if (store_server_users.server_select_kind === 'ninesong') {
          const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
          await get_NineSong_Temp_Data_To_LocalSqlite.get_artist_list(
            store_server_login_info.server_url,
            String(this._start),
            String(this._end),
            _sort,
            _order,
            pageArtistStore.page_artistlists_multi_sort,
            _starred,
            _search
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch artist data:', error)
    }
  },
})
