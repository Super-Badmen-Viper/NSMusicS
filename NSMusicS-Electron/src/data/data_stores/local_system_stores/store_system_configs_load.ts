import { reactive } from 'vue'
import { darkTheme, lightTheme } from 'naive-ui'
import { Read_LocalSqlite_System_Configs } from '@/data/data_repository/system_repository/Read_LocalSqlite_System_Configs'
import { Get_LocalSqlite_PlaylistInfo } from '@/data/data_repository/app_repository/LocalSqlite_Get_PlaylistInfo'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { usePlayerAppearanceStore } from '@/data/data_status/comment_status/player_store/usePlayerAppearanceStore'
import { usePlayerAudioStore } from '@/data/data_status/comment_status/player_store/usePlayerAudioStore'
import { usePlayerSettingStore } from '@/data/data_status/comment_status/player_store/usePlayerSettingStore'
import { usePlaylistStore } from '@/data/data_status/comment_status/playlist_store/usePlaylistStore'
import { store_server_users } from '@/server/server_management/store_server_users'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { usePageMediaStore } from '@/data/data_status/page_status/media_store/usePageMediaStore'
import { usePageAlbumStore } from '@/data/data_status/page_status/album_store/usePageAlbumStore'
import { usePageArtistStore } from '@/data/data_status/page_status/artist_store/usePageArtistStore'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { store_router_history_data_of_media } from '@/router/router_store/store_router_history_data_of_media'
import { store_router_history_data_of_album } from '@/router/router_store/store_router_history_data_of_album'
import { store_router_history_data_of_artist } from '@/router/router_store/store_router_history_data_of_artist'
import { store_system_configs_save } from '@/data/data_stores/local_system_stores/store_system_configs_save'
import { store_general_fetch_player_list } from '@/server/server_api_store/server_api_core/components/player_list/store_general_fetch_player_list'
import shrink_up_arrow from '@/assets/svg/shrink_up_arrow.svg'
import { store_local_db_info } from '@/data/data_stores/local_app_stores/store_local_db_info'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { store_server_auth_token } from '@/server/server_api_store/server_api_auth/auth_token'
import { store_server_model_statistics } from '@/server/server_api_store/server_api_core/model/model_statistics'
import { Audio_howler } from '@/data/data_models/app_models/song_Audio_Out/Audio_howler'

export const store_system_configs_load = reactive({
  app_configs_loading: false,
  async load_app_config() {
    const playerAppearanceStore = usePlayerAppearanceStore()
    const playerAudioStore = usePlayerAudioStore()
    const playerSettingStore = usePlayerSettingStore()
    const playlistStore = usePlaylistStore()

    this.app_configs_loading = true
    try {
      /// system configs
      const system_Configs_Read = new Read_LocalSqlite_System_Configs()
      await system_Configs_Read.init()
      try {
        /// App_Configs load
        store_server_user_model.server_select =
          '' + system_Configs_Read.app_Configs.value['server_select']
        store_server_users.server_select_kind =
          '' + system_Configs_Read.app_Configs.value['server_select_kind']
        store_server_user_model.username = '' + system_Configs_Read.app_Configs.value['username']
        store_server_user_model.password = '' + system_Configs_Read.app_Configs.value['password']
        store_server_user_model.model_server_type_of_web =
          '' + system_Configs_Read.app_Configs.value['model_server_type_of_web'] === 'true'
        store_server_user_model.model_server_type_of_local =
          '' + system_Configs_Read.app_Configs.value['model_server_type_of_local'] === 'true'
        store_server_user_model.model_server_type_of_local_server_download =
          '' +
            system_Configs_Read.app_Configs.value['model_server_type_of_local_server_download'] ===
          'true'
        store_server_user_model.authorization_of_nd =
          '' + system_Configs_Read.app_Configs.value['authorization_of_nd']
        store_server_user_model.client_unique_id =
          '' + system_Configs_Read.app_Configs.value['client_unique_id']
        const pageMediaStore = usePageMediaStore()
        const pageAlbumStore = usePageAlbumStore()
        const pageArtistStore = usePageArtistStore()
        pageMediaStore.media_page_sizes = Number(
          '' + system_Configs_Read.app_Configs.value['media_page_sizes']
        )
        pageAlbumStore.album_page_sizes = Number(
          '' + system_Configs_Read.app_Configs.value['album_page_sizes']
        )
        pageArtistStore.artist_page_sizes = Number(
          '' + system_Configs_Read.app_Configs.value['artist_page_sizes']
        )
        ////// clear_UserExperience_Model
        // const configKeys = ['clear_Memory_Model', 'clear_Equilibrium_Model', 'clear_UserExperience_Model'];
        // let foundTrue = false;
        // configKeys.forEach(key => {
        //     const value = '' + system_Configs_Read.app_Configs.value[key] === 'true';
        //     if (value && !foundTrue) {
        //         foundTrue = true;
        //         store_router_data_logic[key] = true;
        //     } else {
        //         store_router_data_logic[key] = false;
        //     }
        // });
        // if (
        //     !store_router_data_logic.clear_Memory_Model &&
        //     !store_router_data_logic.clear_UserExperience_Model &&
        //     !store_router_data_logic.clear_Equilibrium_Model
        // ) {
        //     store_router_data_logic.clear_Equilibrium_Model = true
        // }
        store_router_data_logic.clear_UserExperience_Model = true
        /////
        if (isElectron) {
          if (process.platform === 'win32') {
            store_server_user_model.model_select =
              '' + system_Configs_Read.app_Configs.value['model_select']
            if (store_server_user_model.model_select === 'server') {
              await store_server_user_model.switchToMode_Server()
            } else {
              await store_server_user_model.switchToMode_Local()
            }
          } else {
            await store_server_user_model.switchToMode_Server()
          }
        } else {
          await store_server_user_model.switchToMode_Server()
          store_server_user_model.model_select = 'server'
          store_server_user_model.model_server_type_of_web = true
        }
        //
        if (store_server_user_model.model_select === 'server') {
          store_server_users.percentage_of_nd = 100
          store_server_users.percentage_of_local = 0
          //
          if (store_server_user_model.model_server_type_of_local) {
            store_router_data_info.store_router_history_data_of_local = true
            store_router_data_info.store_router_history_data_of_web = false
          } else if (store_server_user_model.model_server_type_of_web) {
            store_router_data_info.store_router_history_data_of_local = false
            store_router_data_info.store_router_history_data_of_web = true
          }
        }
        console.log('1: app/app model：load complete')
      } catch (e) {
        console.error(e)
      }
      try {
        //
        if ('' + system_Configs_Read.app_Configs.value['theme'] === 'lightTheme') {
          store_system_configs_info.update_theme = false
          store_system_configs_info.theme = lightTheme
          store_system_configs_info.theme_app = lightTheme
        } else {
          store_system_configs_info.update_theme = true
          store_system_configs_info.theme = darkTheme
          store_system_configs_info.theme_app = darkTheme
        }
        store_system_configs_info.theme_name = '' + system_Configs_Read.app_Configs.value['theme']
        store_system_configs_info.theme_auto_system =
          '' + system_Configs_Read.app_Configs.value['theme_auto_system'] === 'true'
        store_system_configs_info.lang = '' + system_Configs_Read.app_Configs.value['lang']
        if (store_system_configs_info.lang === 'null') {
          store_system_configs_info.lang = 'en'
        }
        playerSettingStore.orderPanelWidath =
          playerSettingStore.langWidths[store_system_configs_info.lang.toString()]
        playerSettingStore.orderButonWidath = playerSettingStore.orderPanelWidath - 14
        // store_system_configs_info.app_view_left_menu_collapsed = '' + system_Configs_Read.app_Configs.value['app_view_left_menu_collapsed'] === 'true'
        store_system_configs_info.app_view_left_menu_collapsed = true
        store_system_configs_info.menuOptions_selectd_model_1 =
          '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_1'] === 'true'
        store_system_configs_info.menuOptions_selectd_model_2 =
          '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_2'] === 'true'
        store_system_configs_info.menuOptions_selectd_model_3 =
          '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_3'] === 'true'
        store_system_configs_info.menuOptions_selectd_model_4 =
          '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_4'] === 'true'
        if (
          '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_1'] != 'true' &&
          '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_1'] != 'false'
        ) {
          store_system_configs_info.menuOptions_selectd_model_1 = true
          store_system_configs_info.menuOptions_selectd_model_2 = true
          store_system_configs_info.menuOptions_selectd_model_3 = true
          store_system_configs_info.menuOptions_selectd_model_4 = true
        }
        /// library_Config
        store_server_user_model.library_path =
          '' + system_Configs_Read.library_Configs.value['library']
        if (
          store_server_user_model.library_path === undefined ||
          store_server_user_model.library_path === 'undefined' ||
          store_server_user_model.library_path.length === 0
        ) {
          store_local_db_info.local_config_of_all_user_of_sqlite =
            system_Configs_Read.library_Configs.value
          store_local_db_info.local_config_of_all_user_of_sqlite.forEach((config) => {
            store_local_db_info.local_config_of_all_user_of_select.push({
              label: config.config_key,
              value: config.config_value,
            })
          })
        }
        if (
          store_local_db_info.local_config_of_all_user_of_sqlite === null ||
          store_local_db_info.local_config_of_all_user_of_sqlite.length === 0
        ) {
          if (isElectron) {
            try {
              let rootPath = store_server_user_model.library_path
              if (rootPath != undefined && rootPath != 'undefined' && rootPath.length > 0) {
                const db = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
                db.pragma('journal_mode = WAL')
                db.exec('PRAGMA foreign_keys = OFF')
                try {
                  const stmt_paths = db.prepare(`SELECT config_value
                                                                   FROM system_library_config LIMIT 1`)
                  const row = stmt_paths.get() as { config_value: string } | undefined
                  if (row) {
                    rootPath = row.config_value
                  }
                } catch (error) {
                  console.error('Database error:', error)
                } finally {
                  db.close()
                }
                if (rootPath) {
                  const folderName = this.extractFolderName(rootPath)
                  if (rootPath && folderName) {
                    store_local_db_info.local_config_of_all_user_of_sqlite.push({
                      id: store_local_db_info.local_config_of_all_user_of_sqlite.length + 1, // 使用当前长度 + 1 作为 ID
                      config_key: folderName,
                      config_value: rootPath,
                    })
                    store_local_db_info.local_config_of_all_user_of_select.push({
                      label: `${folderName} - ${rootPath}`,
                      value: rootPath,
                    })
                    console.log(`添加根目录路径: ${rootPath} (文件夹名: ${folderName})`)
                    store_system_configs_save.save_system_library_config()
                  } else {
                    console.error('无法提取根目录路径或文件夹名称')
                  }
                }
              }
            } catch (e) {
              console.error(e)
            }
          }
        }
        console.log('2: app setting：load complete')
      } catch (e) {
        console.error(e)
      }

      try {
        /// player_Configs_For_UI
        playerAppearanceStore.player_collapsed_album =
          '' + system_Configs_Read.player_Configs_of_UI.value['player_collapsed_album'] === 'true'
        playerAppearanceStore.player_collapsed_skin =
          '' + system_Configs_Read.player_Configs_of_UI.value['player_collapsed_skin'] === 'true'
        playerAppearanceStore.player_lyric_fontSize =
          '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontSize']
        if (
          playerAppearanceStore.player_lyric_fontSize != undefined &&
          playerAppearanceStore.player_lyric_fontSize.length > 0
        ) {
          playerAppearanceStore.player_lyric_fontSize_Num = Number(
            playerAppearanceStore.player_lyric_fontSize.replace('px', '')
          )
        }
        playerAppearanceStore.player_lyric_fontWeight =
          '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontWeight']
        playerAppearanceStore.player_lyric_color =
          '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_color']
        playerAppearanceStore.player_theme_Styles_Selected = Number(
          '' + system_Configs_Read.player_Configs_of_UI.value['player_theme_Styles_Selected']
        )
        if (playerAppearanceStore.player_theme_Styles_Selected === 5) {
          playerAppearanceStore.player_theme_Styles_Selected = 0
        }
        playerAppearanceStore.player_background_model_num = Number(
          '' + system_Configs_Read.player_Configs_of_UI.value['player_background_model_num']
        )
        playerAppearanceStore.player_use_lottie_animation =
          '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lottie_animation'] ===
          'true'
        if (
          '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lyric_skip_forward'] ===
            'true' ||
          '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lyric_skip_forward'] ===
            'false'
        ) {
          playerAppearanceStore.player_use_lyric_skip_forward =
            '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lyric_skip_forward'] ===
            'true'
        } else {
          playerAppearanceStore.player_use_lyric_skip_forward = false
        }
        playerAppearanceStore.player_use_background_filter_blur =
          '' +
            system_Configs_Read.player_Configs_of_UI.value['player_use_background_filter_blur'] ===
          'true'
        playerAppearanceStore.player_use_background_automatic_rotation =
          '' +
            system_Configs_Read.player_Configs_of_UI.value[
              'player_use_background_automatic_rotation'
            ] ===
          'true'
        playerAppearanceStore.player_use_background_repeat_fill =
          '' +
            system_Configs_Read.player_Configs_of_UI.value['player_use_background_repeat_fill'] ===
          'true'
        playerAppearanceStore.player_use_playbar_auto_hide =
          '' + system_Configs_Read.player_Configs_of_UI.value['player_use_playbar_auto_hide'] ===
          'true'
            ? true
            : '' +
                system_Configs_Read.player_Configs_of_UI.value['player_use_playbar_auto_hide'] !==
              'false'
        /// player_Configs_of_Audio_Info
        // Golang // NineSong流媒体模块未完成开发前，不开放回放功能(恢复上次播放数据)
        if (isElectron) {
          playerAudioStore.this_audio_file_path =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_path']
          playerAudioStore.this_audio_file_medium_image_url = ''
          // playerAudioStore.this_audio_file_medium_image_url = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_medium_image_url']
          await playerAudioStore.set_lyric(
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_lyric']
          )
          playerAudioStore.this_audio_artist_id =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_artist_id']
          playerAudioStore.this_audio_artist_name =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_artist_name']
          playerAudioStore.this_audio_song_name =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_name']
          playerAudioStore.this_audio_song_id =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_id']
          playerAudioStore.this_audio_song_favorite =
            '' +
              system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_favorite'] ===
            'true'
          playerAudioStore.this_audio_song_rating = Number(
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_rating']
          )
          playerAudioStore.this_audio_album_name =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_name']
          playerAudioStore.this_audio_album_id =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_id']
          playerAudioStore.this_audio_album_favorite =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_favorite']
          //
          playerAudioStore.page_top_album_image_url =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_image_url']
          playerAudioStore.page_top_album_id =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_id']
          playerAudioStore.page_top_album_name =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_name']
          //
          store_general_fetch_player_list._artist_id =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['playlist_artist_id']
          store_general_fetch_player_list._album_id =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['playlist_album_id']
          store_general_fetch_player_list._album_artist_id =
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['playlist_album_artist_id']
          //
          playerSettingStore.slider_init_singleValue = Number(
            '' + system_Configs_Read.player_Configs_of_Audio_Info.value['slider_singleValue']
          )
        }
        //
        playerAppearanceStore.player_mode_of_lock_playlist =
          '' +
            system_Configs_Read.player_Configs_of_Audio_Info.value[
              'player_mode_of_lock_playlist'
            ] ===
          'true'
        playerAppearanceStore.player_mode_of_medialist_from_external_import =
          '' +
            system_Configs_Read.player_Configs_of_Audio_Info.value[
              'player_mode_of_medialist_from_external_import'
            ] ===
          'true'
        console.log('3: player info：load complete')
      } catch (e) {
        console.error(e)
      }

      try {
        /// app info
        store_server_users.server_config_of_all_user_of_sqlite =
          system_Configs_Read.server_Configs.value
        if (!isElectron) {
          let exists = false
          let itemIndex = -1
          store_server_users.server_config_of_all_user_of_sqlite.forEach(
            (item: any, index: number) => {
              if (item.type === 'ninesong') {
                exists = true
                itemIndex = index
              }
            }
          )
          if (!exists) {
            const new_item = {
              id: store_server_user_model.username,
              server_name: 'nsmusics',
              url: '/api',
              user_name: store_server_user_model.username,
              password: store_server_user_model.password,
              last_login_at: new Date().toISOString().split('.')[0] + 'Z',
              type: 'ninesong',
            }
            store_server_users.server_config_of_all_user_of_sqlite.unshift(new_item)
          } else {
            if (itemIndex !== -1) {
              store_server_users.server_config_of_all_user_of_sqlite[itemIndex].password =
                store_server_login_info.server_accessToken
            }
          }
        }
        /// app label
        store_server_users.server_config_of_all_user_of_select = []
        store_server_users.server_config_of_all_user_of_sqlite.forEach((item: any) => {
          store_server_users.server_config_of_all_user_of_select.push({
            label: item.type + ' - ' + item.server_name,
            value: item.id,
          })
        })
        /// init app
        store_server_users.server_config_of_current_user_of_sqlite =
          system_Configs_Read.server_Configs_Current.value
        const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(
          (item) => item.id === store_server_users.server_config_of_current_user_of_sqlite?.id
        )
        if (index >= 0) {
          store_server_users.server_config_of_current_user_of_sqlite =
            store_server_users.server_config_of_all_user_of_sqlite[index]
          store_server_users.server_config_of_current_user_of_select = {
            label:
              store_server_users.server_config_of_all_user_of_sqlite[index].type +
              ' - ' +
              store_server_users.server_config_of_all_user_of_sqlite[index].server_name,
            value: store_server_users.server_config_of_all_user_of_sqlite[index].id,
          }
          store_server_users.server_config_of_current_user_of_select_servername =
            store_server_users.server_config_of_all_user_of_sqlite[index].type +
            ' - ' +
            store_server_users.server_config_of_all_user_of_sqlite[index].server_name
        } else {
          if (store_system_configs_info.desktop_system_kind === 'docker') {
            if (store_server_users.server_config_of_all_user_of_sqlite.length > 0) {
              store_server_users.server_config_of_current_user_of_sqlite =
                store_server_users.server_config_of_all_user_of_sqlite[0]
            }
          }
        }
        ///
        store_system_configs_save.save_system_config_of_Servers_Config()
        /// app login
        if (store_server_user_model.model_server_type_of_web) {
          store_server_login_info.server_id =
            store_server_users.server_config_of_current_user_of_sqlite?.id
          store_server_login_info.server_name =
            store_server_users.server_config_of_current_user_of_sqlite?.server_name
          store_server_user_model.username =
            store_server_users.server_config_of_current_user_of_sqlite?.user_name
          store_server_user_model.password =
            store_server_users.server_config_of_current_user_of_sqlite?.password
          store_server_users.server_select_kind =
            store_server_users.server_config_of_current_user_of_sqlite?.type
          store_server_login_info.server_url =
            store_server_users.server_config_of_current_user_of_sqlite?.url
          if (store_server_users.server_config_of_current_user_of_sqlite != undefined) {
            if (store_system_configs_info.desktop_system_kind === 'docker') {
              if (store_server_users.server_select_kind != 'ninesong') {
                await store_server_auth_token.init_login_server()
              }
            } else {
              await store_server_auth_token.init_login_server()
            }
          }
        }

        /// view_router_history
        const pageMediaStore = usePageMediaStore()
        pageMediaStore.page_songlists_keywordFilter = ''
        pageMediaStore.page_songlists_selected =
          '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_songlists_selected']
        //
        store_router_history_data_of_media.router_select_history_date_of_Media =
          system_Configs_Read.view_Media_History_select_Configs.value
        store_router_history_data_of_album.router_select_history_date_of_Album =
          system_Configs_Read.view_Media_History_select_Configs.value
        store_router_history_data_of_artist.router_select_history_date_of_Artist =
          system_Configs_Read.view_Media_History_select_Configs.value
        //
        console.log('4: app login：load complete')
      } catch (e) {
        console.error(e)
      }

      try {
        /// playlist configs
        await playlistStore.reset_data()
        /// player
        playerSettingStore.play_order = '' + system_Configs_Read.app_Configs.value['play_order']
        playerSettingStore.play_volume = Number(
          '' + system_Configs_Read.app_Configs.value['play_volume']
        )
        if (playerSettingStore.play_volume === 0 || playerSettingStore.play_volume === undefined) {
          playerSettingStore.play_volume = 100
        }
      } catch (e) {
        console.error(e)
      }

      //
      playerSettingStore.player_select = ''
      if (isElectron) {
        try {
          if (
            '' + system_Configs_Read.app_Configs.value['player_select'] === null ||
            '' + system_Configs_Read.app_Configs.value['player_select'].length < 0
          ) {
            playerSettingStore.player_select = 'web'
            playerSettingStore.player_fade_value = 2000
          } else {
            if (process.platform != 'linux') {
              if ('' + system_Configs_Read.app_Configs.value['player_select'] === 'mpv') {
                playerSettingStore.player_select = 'mpv'
              } else if ('' + system_Configs_Read.app_Configs.value['player_select'] === 'web') {
                playerSettingStore.player_select = 'web'
              } else {
                playerSettingStore.player_select = 'web'
              }
            } else {
              playerSettingStore.player_select = 'web'
              playerSettingStore.player_fade_value = 2000
            }
          }
        } catch {
          playerSettingStore.player_select = 'web'
          playerSettingStore.player_fade_value = 2000
        }
      } else {
        playerSettingStore.player_select = 'web'
        playerSettingStore.player_fade_value = 2000
      }
      //
      playerSettingStore.player_fade_value = Number(
        '' + system_Configs_Read.app_Configs.value['player_fade_value']
      )
      if (playerSettingStore.player_fade_value === null) {
        playerSettingStore.player_fade_value = 2000
      }
      try {
        playerSettingStore.player_dolby =
          '' + system_Configs_Read.app_Configs.value['player_dolby'] === 'true'
        playerSettingStore.player_audio_channel =
          '' + system_Configs_Read.app_Configs.value['player_audio_channel']
        playerSettingStore.player_samp_value = Number(
          '' + system_Configs_Read.app_Configs.value['player_samp_value']
        )
        playerSettingStore.player_gaplessAudio =
          '' + system_Configs_Read.app_Configs.value['player_gaplessAudio']
        playerSettingStore.player_audioExclusiveMode =
          '' + system_Configs_Read.app_Configs.value['player_audioExclusiveMode'] === 'true'
        playerSettingStore.player_replayGainMode =
          '' + system_Configs_Read.app_Configs.value['player_replayGainMode']
        playerSettingStore.player_replayGainPreamp = Number(
          '' + system_Configs_Read.app_Configs.value['player_replayGainPreamp']
        )
        playerSettingStore.player_replayGainClip =
          '' + system_Configs_Read.app_Configs.value['player_replayGainClip'] === 'true'
        playerSettingStore.player_replayGainFallback = Number(
          '' + system_Configs_Read.app_Configs.value['player_replayGainFallback']
        )
        playerSettingStore.player_mpvExtraParameters =
          '' + system_Configs_Read.app_Configs.value['player_mpvExtraParameters']
        //
        let state_player_device_select = false
        playerSettingStore.player_device_select = ''
        const player_device_select =
          '' + system_Configs_Read.app_Configs.value['player_device_select']
        if (player_device_select != undefined && player_device_select != 'default') {
          if (player_device_select.trim().length > 0)
            playerSettingStore.player_device_select = player_device_select
          else state_player_device_select = true
        } else state_player_device_select = true
        if (state_player_device_select) {
          if (playerSettingStore.player === undefined) {
            playerSettingStore.player = new Audio_howler()
          }
          await playerSettingStore.player.getDevices()
          if (playerSettingStore.player_device_kind != undefined) {
            if (playerSettingStore.player_device_kind.length > 0) {
              playerSettingStore.player_device_select =
                playerSettingStore.player_device_kind[0].value
            }
          }
        }
      } catch {
        playerSettingStore.player_dolby = true
        playerSettingStore.player_audio_channel = '5.1'
        playerSettingStore.player_samp_value = 48000
        playerSettingStore.player_gaplessAudio = 'weak'
        playerSettingStore.player_audioExclusiveMode = false
        playerSettingStore.player_replayGainMode = 'no'
        playerSettingStore.player_replayGainPreamp = 0
        playerSettingStore.player_replayGainClip = false
        playerSettingStore.player_replayGainFallback = 0
        playerSettingStore.player_mpvExtraParameters = ''
      }
      if (playerSettingStore.player_audio_channel.length < 0) {
        playerSettingStore.player_audio_channel = '5.1'
      }

      /// playlist media_file_id_of_list
      try {
        // Golang // NineSong流媒体模块未完成开发前，不开放回放功能(恢复上次播放数据)
        if (isElectron) {
          playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds =
            system_Configs_Read.playlist_File_Configs.value
          const get_PlaylistInfo_From_LocalSqlite = new Get_LocalSqlite_PlaylistInfo()
          if (store_server_user_model.model_server_type_of_local) {
            playlistStore.playlist_MediaFiles_temporary =
              get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Media_File_Id_of_list(
                playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds
              )
          } else if (store_server_user_model.model_server_type_of_web) {
            playlistStore.playlist_MediaFiles_temporary =
              get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Media_File_of_list()
          }
          // Get Play_Id
          const media_file = playlistStore.playlist_MediaFiles_temporary.find(
            (row) => row.id === playerAudioStore.this_audio_song_id
          )
          if (media_file) {
            playerAudioStore.this_audio_play_id = media_file.play_id
            playerAudioStore.this_audio_file_medium_image_url = media_file.medium_image_url
          }
        }
        // init_server_token
        // replace apikey
        store_server_auth_token.test_init_server_token()
      } catch (e) {
        console.error(e)
      }
      playerAudioStore.this_audio_Index_of_play_list = Number(
        '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_Index_of_play_list']
      )

      /// close
      try {
        await store_server_model_statistics.get_page_top_info()
      } catch {}
      if (store_system_configs_info.desktop_system_kind != 'docker') {
        store_system_configs_info.app_view_left_menu_select_activeKey =
          '' + system_Configs_Read.app_Configs.value['app_view_left_menu_select_activeKey']
        store_router_data_info.router_name =
          '' + system_Configs_Read.app_Configs.value['router_name']
        if (
          store_router_data_info.router_name === '' ||
          store_router_data_info.router_name === 'app' ||
          store_router_data_info.router_name === 'null'
        ) {
          store_system_configs_info.app_view_left_menu_select_activeKey = 'setting'
          store_router_data_info.router_name = 'setting'
        } else {
          store_system_configs_info.app_view_left_menu_select_activeKey = 'home'
          store_router_data_info.router_name = 'home'
        }
        store_router_data_info.router.push(store_router_data_info.router_name)
      } else {
        const route = String(sessionStorage.getItem('jwt_route'))
        const route_path =
          route && route != '/login' && route != '/null' && route !== 'null' ? route : '/home'
        store_system_configs_info.app_view_left_menu_select_activeKey = route_path
        store_router_data_info.router_name = route_path

        // 修复：检查 router 是否为 null，如果为 null 则设置为 'home'
        if (store_router_data_info.router === null) {
          store_router_data_info.router_name = 'home'
          store_system_configs_info.app_view_left_menu_select_activeKey = 'home'
        }
        // 确保 router_name 和 app_view_left_menu_select_activeKey 不为 null 或 'null'
        if (!store_router_data_info.router_name || store_router_data_info.router_name === 'null') {
          store_router_data_info.router_name = 'home'
        }
        if (
          !store_system_configs_info.app_view_left_menu_select_activeKey ||
          store_system_configs_info.app_view_left_menu_select_activeKey === 'null'
        ) {
          store_system_configs_info.app_view_left_menu_select_activeKey = 'home'
        }
        // 特别处理 route_path 为 '/null' 的情况
        let final_route_path = route_path
        if (final_route_path === '/null' || final_route_path === 'null') {
          final_route_path = '/home'
        }

        store_router_data_info.router.push(store_router_data_info.router_name)
      }

      // init image
      playerSettingStore.player_back_ChevronDouble = shrink_up_arrow

      // await playerSettingStore.player.pause();
      if (store_server_user_model.model_server_type_of_web) {
        playerSettingStore.this_audio_initial_trigger = true
      }
    } catch (e) {
      console.error(e)
    }
    // end
    this.app_configs_loading = false
  },
  extractFolderName(fullPath: string): string | null {
    if (!fullPath) return null
    const parts = fullPath.split('\\')
    return parts[parts.length - 1]
  },
})
