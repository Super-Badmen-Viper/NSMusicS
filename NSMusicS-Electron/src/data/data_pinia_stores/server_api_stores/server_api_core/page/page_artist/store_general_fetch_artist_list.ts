import { defineStore, ref } from 'pinia'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_router_history_data_of_artist } from '@/router/router_store/store_router_history_data_of_artist'
import { store_view_artist_page_logic } from '@/views/view_app/page/page_artist/store/store_view_artist_page_logic'
import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_view_artist_page_info } from '@/views/view_app/page/page_artist/store/store_view_artist_page_info'
import { store_player_appearance } from '@/views/view_app/page/page_player/store/store_player_appearance'
import { store_view_media_page_logic } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { store_view_media_page_info } from '@/views/view_app/page/page_media/store/store_view_media_page_info'
import { store_general_fetch_media_list } from '@/data/data_stores/server_api_stores/server_api_core/page/page_media_file/store_general_fetch_media_list'
import { store_playlist_list_info } from '@/views/view_app/components/player_list/store/store_playlist_list_info'
import { store_local_data_set_artistInfo } from '@/data/data_stores/local_app_stores/local_data_synchronization/store_local_data_set_artistInfo'
import { store_server_users } from '@/data/data_stores/server_configs_stores/store_server_users'
import { store_playlist_list_logic } from '@/views/view_app/components/player_list/store/store_playlist_list_logic'
import { store_general_fetch_player_list } from '@/data/data_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import error_album from '@/assets/img/error_album.jpg'
import { isElectron } from '@/utils/electron/isElectron'
import { Get_LocalSqlite_AnnotationInfo } from '@/data/data_repository/app_repository/LocalSqlite_Get_AnnotationInfo'
import { store_player_audio_logic } from '@/views/view_app/page/page_player/store/store_player_audio_logic'
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/data/data_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite'
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/data/data_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite'
import { Get_NineSong_Temp_Data_To_LocalSqlite } from '@/data/data_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

/**
 * 艺术家列表数据获取逻辑 store
 * 提供艺术家数据的获取和处理功能
 */
export const useGeneralFetchArtistListStore = defineStore('generalFetchArtistList', () => {
  // 状态定义
  const _totalCount = ref(0)
  const _start = ref(0)
  const _end = ref(30)
  const _artist_id = ref('')
  const _album_id = ref('')

  /**
   * 获取艺术家数据
   */
  async function fetchData_Artist() {
    // clear RouterView of vue-virtual-scroller data
    store_router_data_logic.clear_Files_temporary()
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
            const sortKey = store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 &&
              store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default'
              ? store_view_artist_page_logic.page_artistlists_options_Sort_key[0].columnKey
              : 'id'
            const sortOrder = store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 &&
              store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default'
              ? store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order.replace('end', '')
              : ''
            const keywordFilter = store_view_artist_page_logic.page_artistlists_keyword.length > 0
              ? `WHERE name LIKE '%${store_view_artist_page_logic.page_artistlists_keyword}%' 
                OR external_info_updated_at LIKE '%${store_view_artist_page_logic.page_artistlists_keyword}%'`
              : ''
            stmt_artist_string = `SELECT *
                                              FROM ${store_server_user_model.artist} ${keywordFilter}
                                              ORDER BY ${sortKey} ${sortOrder}`
            stmt_artist = db.prepare(stmt_artist_string)
            //////
            if (store_router_history_data_of_artist.router_select_history_date_of_Artist &&
              store_view_artist_page_logic.page_artistlists_keyword_reset) {
              store_router_history_data_of_artist.remove_router_history_of_Artist(
                store_router_history_data_of_artist.router_select_history_date_of_Artist.id
              ) // 若存在新操作，则覆盖后续的路由
              store_view_artist_page_logic.page_artistlists_keyword_reset = false
            }
            const routerDate: any = {
              id: 0,
              menu_select_active_key: 'artist',
              router_name: 'artist',
              router_select: 'artist',
              page_lists_keyword: store_view_artist_page_logic.page_artistlists_keyword,
              stmt_string: stmt_artist_string,
              page_lists_selected: store_view_artist_page_logic.page_artistlists_selected,
              columnKey: store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 &&
                store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default'
                ? store_view_artist_page_logic.page_artistlists_options_Sort_key[0].columnKey
                : 'id',
              order: store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 &&
                store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default'
                ? store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order.replace('end', '')
                : '',
              page_lists_scrollindex: store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value,
            }
            store_router_history_data_of_artist.add_router_history_of_Artist(routerDate)
            //////
          } else {
            if (store_router_history_data_of_artist.router_select_history_date_of_Artist) {
              store_router_data_info.router.push('artist')
              store_router_data_info.router_select_model_artist = true
              store_view_artist_page_logic.page_artistlists_keyword =
                store_router_history_data_of_artist.router_select_history_date_of_Artist.page_lists_keyword
              store_view_artist_page_logic.page_artistlists_selected =
                store_router_history_data_of_artist.router_select_history_date_of_Artist.page_lists_selected
              store_view_artist_page_logic.page_artistlists_options_Sort_key = [
                {
                  columnKey: store_router_history_data_of_artist.router_select_history_date_of_Artist.columnKey,
                  order: store_router_history_data_of_artist.router_select_history_date_of_Artist.order,
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
          const stmt_media_file = db.prepare(`SELECT * FROM ${store_server_user_model.media_file}`)
          const pathfiles = stmt_media_file.all()
          store_view_artist_page_info.artist_Files_temporary = []
          const rows = stmt_artist.all()
          rows.forEach((row: any) => {
            for (let j = 0; j < pathfiles.length; j++) {
              if (pathfiles[j].artist_id === row.id) {
                if (row.medium_image_url == null || row.medium_image_url.length == 0) {
                  if (pathfiles[j].path) {
                    const fileName = pathfiles[j].path.split(/[\\/]/).pop() // 兼容 Windows 和 Unix 路径分隔符
                    const newFileName = fileName != undefined && fileName.length > 0
                      ? fileName.replace(/\.(mp3|flac)$/i, '.jpg')
                      : ''
                    row.medium_image_url = newFileName != undefined && newFileName.length > 0
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
            store_view_artist_page_info.artist_Files_temporary.push(row)
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
          for (let i = 0; i < store_view_artist_page_info.artist_Files_temporary.length; i++) {
            store_view_artist_page_info.artist_Files_temporary[i].favorite = !!annotations.some(
              (annotation: { item_id: string }) =>
                annotation.item_id === store_view_artist_page_info.artist_Files_temporary[i].id
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
          for (let i = 0; i < store_view_artist_page_info.artist_Files_temporary.length; i++) {
            const artistFile = store_view_artist_page_info.artist_Files_temporary[i]
            const matchingAnnotation = annotations_rating.find(
              (annotation: { item_id: string; rating: number }) =>
                annotation.item_id === artistFile.id
            )
            if (matchingAnnotation) artistFile.rating = matchingAnnotation.rating
            else artistFile.rating = 0
          }
          ////// filter selected_list for artist_Files_temporary
          let order_play_date: any[] = []
          if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_recently') {
            order_play_date = db
              .prepare(`
                            SELECT item_id
                            FROM ${store_server_user_model.annotation}
                            WHERE item_type = 'artist'
                              AND play_count > 0
                            ORDER BY play_date DESC
                        `)
              .all()
              .map((annotation: any) => annotation.item_id)
          }
          store_view_artist_page_info.artist_Files_temporary =
            store_view_artist_page_info.artist_Files_temporary.filter((item: any) => {
              if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_all') {
                return true
              } else if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_love') {
                return annotations.some(
                  (annotation: { item_id: string }) => annotation.item_id === item.id
                )
              } else if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_recently') {
                return order_play_date.includes(item.id)
              } else if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_all_PlayList') {
                return true
              }
            })
          if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_recently') {
            const new_sort: any[] = store_view_artist_page_info.artist_Files_temporary.slice()
            store_view_artist_page_info.artist_Files_temporary = []
            order_play_date.forEach((id: any) => {
              const index = new_sort.findIndex((item: any) => item.id === id)
              if (index !== -1) {
                store_view_artist_page_info.artist_Files_temporary.push(new_sort[index])
                new_sort.splice(index, 1)
              }
            })
          }
        } catch (err: any) {
          console.error(err)
        } finally {
          db.close()
          console.log('db.close().......')
          db = null
        }
      }
    } else if (store_server_user_model.model_server_type_of_web) {
      store_view_artist_page_info.artist_Files_temporary = []
      await fetchData_Artist_of_server_web_start()
    }
  }

  /**
   * 获取艺术家的媒体列表
   */
  async function fetchData_This_Artist_MediaList(artist_id: any) {
    if (store_server_users.server_select_kind != 'jellyfin' ||
      store_server_users.server_select_kind != 'emby') {
      store_player_appearance.player_mode_of_medialist_from_external_import = true
    }

    store_view_media_page_logic.page_songlists_keywordFilter = `WHERE artist_id = '${artist_id}'`
    store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    store_view_media_page_info.media_Files_temporary = []

    store_router_data_info.find_music_model = false
    store_router_data_info.find_album_model = false
    store_router_data_info.find_artist_model = true
    await store_general_fetch_media_list.fetchData_Media()
    store_router_data_info.find_artist_model = false

    store_general_fetch_player_list.fetchData_PlayList(false)

    store_router_data_info.router_select_model_artist = true

    if (store_playlist_list_info.playlist_MediaFiles_temporary.length > 0) {
      store_player_appearance.player_mode_of_lock_playlist = false
      const media_file = store_playlist_list_info.playlist_MediaFiles_temporary[0]
      await store_player_audio_logic.update_current_media_info(media_file, media_file.absoluteIndex)
      //
      store_playlist_list_logic.media_page_handleItemDbClick = false
    }

    store_local_data_set_artistInfo.Set_ArtistInfo_To_PlayCount_of_Artist(
      store_playlist_list_info.playlist_MediaFiles_temporary[0].artist_id
    )
    if (store_server_user_model.model_server_type_of_local) {
      const get_LocalSqlite_AnnotationInfo = new Get_LocalSqlite_AnnotationInfo()
      store_view_artist_page_info.artist_recently_count = 
        get_LocalSqlite_AnnotationInfo.Get_Annotation_ItemInfo_Play_Count('artist')
      store_player_audio_logic.boolHandleItemClick_Played = true
    }
  }

  /**
   * 添加条件到SQL查询
   */
  function addCondition(condition: string, add: string): string {
    if (condition.length > 0) {
      return `${condition} AND ${add}`
    }
    return `WHERE ${add}`
  }

  /**
   * Web服务器起始数据获取
   */
  async function fetchData_Artist_of_server_web_start() {
    store_view_artist_page_info.artist_Files_temporary = []
    _start.value = 0
    _end.value = 30
    await fetchData_Artist_of_server_web()

    if (store_player_appearance.player_mode_of_medialist_from_external_import) {
      store_general_fetch_media_list.fetchData_Media_of_server_web_clear_search_parms()
    }
  }

  /**
   * Web服务器后续数据获取
   */
  async function fetchData_Artist_of_server_web_end() {
    _start.value += 30
    _end.value += 30
    await fetchData_Artist_of_server_web()
  }

  /**
   * Web服务器数据获取核心方法
   */
  async function fetchData_Artist_of_server_web() {
    try {
      const _search = store_view_artist_page_logic.page_artistlists_keyword
      const selected = store_view_artist_page_logic.page_artistlists_selected

      let _sort = store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 &&
        store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default'
        ? store_view_artist_page_logic.page_artistlists_options_Sort_key[0].columnKey
        : 'id'
      let _order = store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 &&
        store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default'
        ? store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order.replace('end', '')
        : 'ASC'

      let _starred = ''
      let playlist_id = ''
      if (selected === 'artist_list_love') {
        _starred = 'true'
      } else if (selected === 'artist_list_recently') {
        _order = 'desc'
        _sort = 'playDate'
        if (store_server_user_model.model_server_type_of_web) {
          if (store_server_users.server_select_kind === 'jellyfin' ||
            store_server_users.server_select_kind === 'emby') {
            _sort = 'DatePlayed'
          } else if (store_server_users.server_select_kind === 'ninesong') {
            _sort = 'play_date'
          }
        }
      } else if (selected !== 'artist_list_all') {
        playlist_id = selected
      }

      if (store_server_user_model.model_server_type_of_local ||
        (store_server_users.server_select_kind === 'navidrome' &&
          store_server_user_model.model_server_type_of_web)) {
        const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
        await get_Navidrome_Temp_Data_To_LocalSqlite.get_artist_list(
          store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
          store_server_user_model.username,
          store_server_user_model.token,
          store_server_user_model.salt,
          String(_end.value),
          _order,
          _sort,
          String(_start.value),
          _search,
          _starred
        )
      } else if (store_server_user_model.model_server_type_of_web) {
        if (store_server_users.server_select_kind === 'jellyfin' ||
          store_server_users.server_select_kind === 'emby') {
          const filter = _starred === 'true' ? 'IsFavorite' : ''
          const get_Jellyfin_Temp_Data_To_LocalSqlite = new Get_Jellyfin_Temp_Data_To_LocalSqlite()
          await get_Jellyfin_Temp_Data_To_LocalSqlite.get_artist_list(
            store_server_user_model.userid_of_Je,
            store_server_user_model.parentid_of_Je_Music,
            _search,
            '',
            '',
            String(_end.value - _start.value),
            String(_start.value),
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
            String(_start.value),
            String(_end.value),
            _sort,
            _order,
            store_view_artist_page_logic.page_artistlists_multi_sort,
            _starred,
            _search
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch artist data:', error)
    }
  }

  return {
    // 状态暴露
    _totalCount,
    _start,
    _end,
    _artist_id,
    _album_id,
    // 方法暴露
    fetchData_Artist,
    fetchData_This_Artist_MediaList,
    addCondition,
    fetchData_Artist_of_server_web_start,
    fetchData_Artist_of_server_web_end,
    fetchData_Artist_of_server_web
  }
})