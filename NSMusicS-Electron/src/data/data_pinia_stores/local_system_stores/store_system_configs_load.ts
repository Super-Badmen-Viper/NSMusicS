import { defineStore } from 'pinia'
import { ref } from 'vue'
import { darkTheme, lightTheme } from 'naive-ui'
import { Read_LocalSqlite_System_Configs } from '@/data/data_repository/system_repository/Read_LocalSqlite_System_Configs'
import { Get_LocalSqlite_PlaylistInfo } from '@/data/data_repository/app_repository/LocalSqlite_Get_PlaylistInfo'
import { useSystemConfigsInfoStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_info'
import { usePlayerAppearanceStore } from '@/views/view_app/page/page_player/store/store_player_appearance'
import { usePlayerAudioInfoStore } from '@/views/view_app/page/page_player/store/store_player_audio_info'
import { usePlayerAudioLogicStore } from '@/views/view_app/page/page_player/store/store_player_audio_logic'
import { usePlaylistListInfoStore } from '@/views/view_app/components/player_list/store/store_playlist_list_info'
import { usePlaylistListLogicStore } from '@/views/view_app/components/player_list/store/store_playlist_list_logic'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { useViewMediaPageLogicStore } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { useViewMediaPageInfoStore } from '@/views/view_app/page/page_media/store/store_view_media_page_info'
import { useViewAlbumPageInfoStore } from '@/views/view_app/page/page_album/store/store_view_album_page_info'
import { useViewArtistPageInfoStore } from '@/views/view_app/page/page_artist/store/store_view_artist_page_info'
import { useRouterDataInfoStore } from '@/router/router_store/store_router_data_info'
import { useRouterDataLogicStore } from '@/router/router_store/store_router_data_logic'
import { useRouterHistoryDataOfMediaStore } from '@/router/router_store/store_router_history_data_of_media'
import { useRouterHistoryDataOfAlbumStore } from '@/router/router_store/store_router_history_data_of_album'
import { useRouterHistoryDataOfArtistStore } from '@/router/router_store/store_router_history_data_of_artist'
import { useSystemConfigsSaveStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_save'
import { useGeneralFetchPlayerListStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import shrink_up_arrow from '@/assets/svg/shrink_up_arrow.svg'
import { useLocalDbInfoStore } from '@/data/data_pinia_stores/local_app_stores/store_local_db_info'
import { isElectron } from '@/utils/electron/isElectron'
import { useServerLoginInfoStore } from '@/views/view_server/page_login/store/store_server_login_info'
import { useServerAuthTokenStore } from '@/data/data_pinia_stores/server_api_stores/server_api_auth/auth_token'
import { useServerModelStatisticsStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/model/model_statistics'
import { Audio_howler } from '@/data/data_models/app_models/song_Audio_Out/Audio_howler'

export const useSystemConfigsLoadStore = defineStore('systemConfigsLoad', () => {
  // 状态定义
  const app_configs_loading = ref(false)

  // 获取其他store的引用
  const systemConfigsInfoStore = useSystemConfigsInfoStore()
  const playerAppearanceStore = usePlayerAppearanceStore()
  const playerAudioInfoStore = usePlayerAudioInfoStore()
  const playerAudioLogicStore = usePlayerAudioLogicStore()
  const playlistListInfoStore = usePlaylistListInfoStore()
  const playlistListLogicStore = usePlaylistListLogicStore()
  const serverUsersStore = useServerUsersStore()
  const serverUserModelStore = useServerUserModelStore()
  const viewMediaPageLogicStore = useViewMediaPageLogicStore()
  const viewMediaPageInfoStore = useViewMediaPageInfoStore()
  const viewAlbumPageInfoStore = useViewAlbumPageInfoStore()
  const viewArtistPageInfoStore = useViewArtistPageInfoStore()
  const routerDataInfoStore = useRouterDataInfoStore()
  const routerDataLogicStore = useRouterDataLogicStore()
  const routerHistoryDataOfMediaStore = useRouterHistoryDataOfMediaStore()
  const routerHistoryDataOfAlbumStore = useRouterHistoryDataOfAlbumStore()
  const routerHistoryDataOfArtistStore = useRouterHistoryDataOfArtistStore()
  const systemConfigsSaveStore = useSystemConfigsSaveStore()
  const generalFetchPlayerListStore = useGeneralFetchPlayerListStore()
  const localDbInfoStore = useLocalDbInfoStore()
  const serverLoginInfoStore = useServerLoginInfoStore()
  const serverAuthTokenStore = useServerAuthTokenStore()
  const serverModelStatisticsStore = useServerModelStatisticsStore()

  // 方法定义
  async function load_app_config() {
    app_configs_loading.value = true
    try {
      /// system configs
      const system_Configs_Read = new Read_LocalSqlite_System_Configs()
      await system_Configs_Read.init()
      try {
        /// App_Configs load
        serverUserModelStore.server_select = '' + system_Configs_Read.app_Configs.value['server_select']
        serverUsersStore.server_select_kind = '' + system_Configs_Read.app_Configs.value['server_select_kind']
        serverUserModelStore.username = '' + system_Configs_Read.app_Configs.value['username']
        serverUserModelStore.password = '' + system_Configs_Read.app_Configs.value['password']
        serverUserModelStore.model_server_type_of_web = '' + system_Configs_Read.app_Configs.value['model_server_type_of_web'] === 'true'
        serverUserModelStore.model_server_type_of_local = '' + system_Configs_Read.app_Configs.value['model_server_type_of_local'] === 'true'
        serverUserModelStore.model_server_type_of_local_server_download = '' + system_Configs_Read.app_Configs.value['model_server_type_of_local_server_download'] === 'true'
        serverUserModelStore.authorization_of_nd = '' + system_Configs_Read.app_Configs.value['authorization_of_nd']
        serverUserModelStore.client_unique_id = '' + system_Configs_Read.app_Configs.value['client_unique_id']
        viewMediaPageInfoStore.media_page_sizes = Number('' + system_Configs_Read.app_Configs.value['media_page_sizes'])
        viewAlbumPageInfoStore.album_page_sizes = Number('' + system_Configs_Read.app_Configs.value['album_page_sizes'])
        viewArtistPageInfoStore.artist_page_sizes = Number('' + system_Configs_Read.app_Configs.value['artist_page_sizes'])
        
        routerDataLogicStore.clear_UserExperience_Model = true
        
        if (isElectron) {
          if (process.platform === 'win32') {
            serverUserModelStore.model_select = '' + system_Configs_Read.app_Configs.value['model_select']
            if (serverUserModelStore.model_select === 'server') {
              await serverUserModelStore.switchToMode_Server()
            } else {
              await serverUserModelStore.switchToMode_Local()
            }
          } else {
            await serverUserModelStore.switchToMode_Server()
          }
        } else {
          await serverUserModelStore.switchToMode_Server()
          serverUserModelStore.model_select = 'server'
          serverUserModelStore.model_server_type_of_web = true
        }
        
        if (serverUserModelStore.model_select === 'server') {
          serverUsersStore.percentage_of_nd = 100
          serverUsersStore.percentage_of_local = 0
          
          if (serverUserModelStore.model_server_type_of_local) {
            routerDataInfoStore.store_router_history_data_of_local = true
            routerDataInfoStore.store_router_history_data_of_web = false
          } else if (serverUserModelStore.model_server_type_of_web) {
            routerDataInfoStore.store_router_history_data_of_local = false
            routerDataInfoStore.store_router_history_data_of_web = true
          }
        }
        console.log('1: app/app model：load complete')
      } catch (e) {
        console.error(e)
      }
      try {
        if ('' + system_Configs_Read.app_Configs.value['theme'] === 'lightTheme') {
          systemConfigsInfoStore.update_theme = false
          systemConfigsInfoStore.theme = lightTheme
          systemConfigsInfoStore.theme_app = lightTheme
        } else {
          systemConfigsInfoStore.update_theme = true
          systemConfigsInfoStore.theme = darkTheme
          systemConfigsInfoStore.theme_app = darkTheme
        }
        systemConfigsInfoStore.theme_name = '' + system_Configs_Read.app_Configs.value['theme']
        systemConfigsInfoStore.theme_auto_system = '' + system_Configs_Read.app_Configs.value['theme_auto_system'] === 'true'
        systemConfigsInfoStore.lang = '' + system_Configs_Read.app_Configs.value['lang']
        if (systemConfigsInfoStore.lang === 'null') {
          systemConfigsInfoStore.lang = 'en'
        }
        playerAudioLogicStore.orderPanelWidath = playerAudioLogicStore.langWidths[systemConfigsInfoStore.lang.toString()]
        playerAudioLogicStore.orderButonWidath = playerAudioLogicStore.orderPanelWidath - 14
        
        systemConfigsInfoStore.app_view_left_menu_collapsed = true
        systemConfigsInfoStore.menuOptions_selectd_model_1 = '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_1'] === 'true'
        systemConfigsInfoStore.menuOptions_selectd_model_2 = '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_2'] === 'true'
        systemConfigsInfoStore.menuOptions_selectd_model_3 = '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_3'] === 'true'
        systemConfigsInfoStore.menuOptions_selectd_model_4 = '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_4'] === 'true'
        
        if (
          '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_1'] != 'true' &&
          '' + system_Configs_Read.app_Configs.value['menuOptions_selectd_model_1'] != 'false'
        ) {
          systemConfigsInfoStore.menuOptions_selectd_model_1 = true
          systemConfigsInfoStore.menuOptions_selectd_model_2 = true
          systemConfigsInfoStore.menuOptions_selectd_model_3 = true
          systemConfigsInfoStore.menuOptions_selectd_model_4 = true
        }
        
        serverUserModelStore.library_path = '' + system_Configs_Read.library_Configs.value['library']
        if (
          serverUserModelStore.library_path === undefined ||
          serverUserModelStore.library_path === 'undefined' ||
          serverUserModelStore.library_path.length === 0
        ) {
          localDbInfoStore.local_config_of_all_user_of_sqlite = system_Configs_Read.library_Configs.value
          localDbInfoStore.local_config_of_all_user_of_sqlite.forEach((config) => {
            localDbInfoStore.local_config_of_all_user_of_select.push({
              label: config.config_key,
              value: config.config_value,
            })
          })
        }
        
        if (
          localDbInfoStore.local_config_of_all_user_of_sqlite === null ||
          localDbInfoStore.local_config_of_all_user_of_sqlite.length === 0
        ) {
          if (isElectron) {
            try {
              let rootPath = serverUserModelStore.library_path
              if (rootPath != undefined && rootPath != 'undefined' && rootPath.length > 0) {
                const db = require('better-sqlite3')(systemConfigsInfoStore.nsmusics_db)
                db.pragma('journal_mode = WAL')
                db.exec('PRAGMA foreign_keys = OFF')
                try {
                  const stmt_paths = db.prepare(`SELECT config_value FROM system_library_config LIMIT 1`)
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
                  const folderName = extractFolderName(rootPath)
                  if (rootPath && folderName) {
                    localDbInfoStore.local_config_of_all_user_of_sqlite.push({
                      id: localDbInfoStore.local_config_of_all_user_of_sqlite.length + 1,
                      config_key: folderName,
                      config_value: rootPath,
                    })
                    localDbInfoStore.local_config_of_all_user_of_select.push({
                      label: `${folderName} - ${rootPath}`,
                      value: rootPath,
                    })
                    console.log(`添加根目录路径: ${rootPath} (文件夹名: ${folderName})`)
                    systemConfigsSaveStore.save_system_library_config()
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
        playerAppearanceStore.player_collapsed_album = '' + system_Configs_Read.player_Configs_of_UI.value['player_collapsed_album'] === 'true'
        playerAppearanceStore.player_collapsed_skin = '' + system_Configs_Read.player_Configs_of_UI.value['player_collapsed_skin'] === 'true'
        playerAppearanceStore.player_lyric_fontSize = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontSize']
        
        if (
          playerAppearanceStore.player_lyric_fontSize != undefined &&
          playerAppearanceStore.player_lyric_fontSize.length > 0
        ) {
          playerAppearanceStore.player_lyric_fontSize_Num = Number(
            playerAppearanceStore.player_lyric_fontSize.replace('px', '')
          )
        }
        
        playerAppearanceStore.player_lyric_fontWeight = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontWeight']
        playerAppearanceStore.player_lyric_color = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_color']
        playerAppearanceStore.player_theme_Styles_Selected = Number('' + system_Configs_Read.player_Configs_of_UI.value['player_theme_Styles_Selected'])
        
        if (playerAppearanceStore.player_theme_Styles_Selected === 5) {
          playerAppearanceStore.player_theme_Styles_Selected = 0
        }
        
        playerAppearanceStore.player_background_model_num = Number('' + system_Configs_Read.player_Configs_of_UI.value['player_background_model_num'])
        playerAppearanceStore.player_use_lottie_animation = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lottie_animation'] === 'true'
        
        if (
          '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lyric_skip_forward'] === 'true' ||
          '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lyric_skip_forward'] === 'false'
        ) {
          playerAppearanceStore.player_use_lyric_skip_forward = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lyric_skip_forward'] === 'true'
        } else {
          playerAppearanceStore.player_use_lyric_skip_forward = false
        }
        
        playerAppearanceStore.player_use_background_filter_blur = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_background_filter_blur'] === 'true'
        playerAppearanceStore.player_use_background_automatic_rotation = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_background_automatic_rotation'] === 'true'
        playerAppearanceStore.player_use_background_repeat_fill = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_background_repeat_fill'] === 'true'
        playerAppearanceStore.player_use_playbar_auto_hide = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_playbar_auto_hide'] === 'true'
        
        /// player_Configs_of_Audio_Info
        if (isElectron) {
          playerAudioInfoStore.this_audio_file_path = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_path']
          playerAudioInfoStore.this_audio_file_medium_image_url = ''
          
          await playerAudioInfoStore.set_lyric('' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_lyric'])
          playerAudioInfoStore.this_audio_artist_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_artist_id']
          playerAudioInfoStore.this_audio_artist_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_artist_name']
          playerAudioInfoStore.this_audio_song_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_name']
          playerAudioInfoStore.this_audio_song_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_id']
          playerAudioInfoStore.this_audio_song_favorite = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_favorite'] === 'true'
          playerAudioInfoStore.this_audio_song_rating = Number('' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_rating'])
          playerAudioInfoStore.this_audio_album_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_name']
          playerAudioInfoStore.this_audio_album_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_id']
          playerAudioInfoStore.this_audio_album_favorite = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_favorite']
          
          playerAudioInfoStore.page_top_album_image_url = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_image_url']
          playerAudioInfoStore.page_top_album_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_id']
          playerAudioInfoStore.page_top_album_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_name']
          
          generalFetchPlayerListStore._artist_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['playlist_artist_id']
          generalFetchPlayerListStore._album_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['playlist_album_id']
          generalFetchPlayerListStore._album_artist_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['playlist_album_artist_id']
          
          playerAudioLogicStore.slider_init_singleValue = Number('' + system_Configs_Read.player_Configs_of_Audio_Info.value['slider_singleValue'])
        }
        
        playerAppearanceStore.player_mode_of_lock_playlist = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['player_mode_of_lock_playlist'] === 'true'
        playerAppearanceStore.player_mode_of_medialist_from_external_import = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['player_mode_of_medialist_from_external_import'] === 'true'
        
        console.log('3: player info：load complete')
      } catch (e) {
        console.error(e)
      }

      try {
        /// app info
        serverUsersStore.server_config_of_all_user_of_sqlite = system_Configs_Read.server_Configs.value
        
        if (!isElectron) {
          let exists = false
          let itemIndex = -1
          serverUsersStore.server_config_of_all_user_of_sqlite.forEach((item: any, index: number) => {
            if (item.type === 'ninesong') {
              exists = true
              itemIndex = index
            }
          })
          
          if (!exists) {
            const new_item = {
              id: serverUserModelStore.username,
              server_name: 'nsmusics',
              url: '/api',
              user_name: serverUserModelStore.username,
              password: serverUserModelStore.password,
              last_login_at: new Date().toISOString().split('.')[0] + 'Z',
              type: 'ninesong',
            }
            serverUsersStore.server_config_of_all_user_of_sqlite.unshift(new_item)
          } else {
            if (itemIndex !== -1) {
              serverUsersStore.server_config_of_all_user_of_sqlite[itemIndex].password = serverLoginInfoStore.server_accessToken
            }
          }
        }
        
        /// app label
        serverUsersStore.server_config_of_all_user_of_select = []
        serverUsersStore.server_config_of_all_user_of_sqlite.forEach((item: any) => {
          serverUsersStore.server_config_of_all_user_of_select.push({
            label: item.type + ' - ' + item.server_name,
            value: item.id,
          })
        })
        
        /// init app
        serverUsersStore.server_config_of_current_user_of_sqlite = system_Configs_Read.server_Configs_Current.value
        
        const index = serverUsersStore.server_config_of_all_user_of_sqlite.findIndex(
          (item) => item.id === serverUsersStore.server_config_of_current_user_of_sqlite?.id
        )
        
        if (index >= 0) {
          serverUsersStore.server_config_of_current_user_of_sqlite = serverUsersStore.server_config_of_all_user_of_sqlite[index]
          serverUsersStore.server_config_of_current_user_of_select = {
            label: serverUsersStore.server_config_of_all_user_of_sqlite[index].type + ' - ' + serverUsersStore.server_config_of_all_user_of_sqlite[index].server_name,
            value: serverUsersStore.server_config_of_all_user_of_sqlite[index].id,
          }
          serverUsersStore.server_config_of_current_user_of_select_servername = serverUsersStore.server_config_of_all_user_of_sqlite[index].type + ' - ' + serverUsersStore.server_config_of_all_user_of_sqlite[index].server_name
        } else {
          if (systemConfigsInfoStore.desktop_system_kind === 'docker') {
            if (serverUsersStore.server_config_of_all_user_of_sqlite.length > 0) {
              serverUsersStore.server_config_of_current_user_of_sqlite = serverUsersStore.server_config_of_all_user_of_sqlite[0]
            }
          }
        }
        
        systemConfigsSaveStore.save_system_config_of_Servers_Config()
        
        /// app login
        if (serverUserModelStore.model_server_type_of_web) {
          serverLoginInfoStore.server_id = serverUsersStore.server_config_of_current_user_of_sqlite?.id
          serverLoginInfoStore.server_name = serverUsersStore.server_config_of_current_user_of_sqlite?.server_name
          serverUserModelStore.username = serverUsersStore.server_config_of_current_user_of_sqlite?.user_name
          serverUserModelStore.password = serverUsersStore.server_config_of_current_user_of_sqlite?.password
          serverUsersStore.server_select_kind = serverUsersStore.server_config_of_current_user_of_sqlite?.type
          serverLoginInfoStore.server_url = serverUsersStore.server_config_of_current_user_of_sqlite?.url
          
          if (serverUsersStore.server_config_of_current_user_of_sqlite != undefined) {
            if (systemConfigsInfoStore.desktop_system_kind === 'docker') {
              if (serverUsersStore.server_select_kind != 'ninesong') {
                await serverAuthTokenStore.init_login_server()
              }
            } else {
              await serverAuthTokenStore.init_login_server()
            }
          }
        }

        /// view_router_history
        viewMediaPageLogicStore.page_songlists_keywordFilter = ''
        viewMediaPageLogicStore.page_songlists_selected = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_songlists_selected']
        
        routerHistoryDataOfMediaStore.router_select_history_date_of_Media = system_Configs_Read.view_Media_History_select_Configs.value
        routerHistoryDataOfAlbumStore.router_select_history_date_of_Album = system_Configs_Read.view_Media_History_select_Configs.value
        routerHistoryDataOfArtistStore.router_select_history_date_of_Artist = system_Configs_Read.view_Media_History_select_Configs.value
        
        console.log('4: app login：load complete')
      } catch (e) {
        console.error(e)
      }

      try {
        /// playlist configs
        await playlistListLogicStore.reset_data()
        
        /// player
        playerAudioLogicStore.play_order = '' + system_Configs_Read.app_Configs.value['play_order']
        playerAudioLogicStore.play_volume = Number('' + system_Configs_Read.app_Configs.value['play_volume'])
        
        if (playerAudioLogicStore.play_volume === 0 || playerAudioLogicStore.play_volume === undefined) {
          playerAudioLogicStore.play_volume = 100
        }
      } catch (e) {
        console.error(e)
      }

      playerAudioLogicStore.player_select = ''
      if (isElectron) {
        try {
          if ('' + system_Configs_Read.app_Configs.value['player_select'] === null || '' + system_Configs_Read.app_Configs.value['player_select'].length < 0) {
            playerAudioLogicStore.player_select = 'web'
            playerAudioLogicStore.player_fade_value = 2000
          } else {
            if (process.platform != 'linux') {
              if ('' + system_Configs_Read.app_Configs.value['player_select'] === 'mpv') {
                playerAudioLogicStore.player_select = 'mpv'
              } else if ('' + system_Configs_Read.app_Configs.value['player_select'] === 'web') {
                playerAudioLogicStore.player_select = 'web'
              } else {
                playerAudioLogicStore.player_select = 'web'
              }
            } else {
              playerAudioLogicStore.player_select = 'web'
              playerAudioLogicStore.player_fade_value = 2000
            }
          }
        } catch {
          playerAudioLogicStore.player_select = 'web'
          playerAudioLogicStore.player_fade_value = 2000
        }
      } else {
        playerAudioLogicStore.player_select = 'web'
        playerAudioLogicStore.player_fade_value = 2000
      }
      
      playerAudioLogicStore.player_fade_value = Number('' + system_Configs_Read.app_Configs.value['player_fade_value'])
      
      if (playerAudioLogicStore.player_fade_value === null) {
        playerAudioLogicStore.player_fade_value = 2000
      }
      
      try {
        playerAudioLogicStore.player_dolby = '' + system_Configs_Read.app_Configs.value['player_dolby'] === 'true'
        playerAudioLogicStore.player_audio_channel = '' + system_Configs_Read.app_Configs.value['player_audio_channel']
        playerAudioLogicStore.player_samp_value = Number('' + system_Configs_Read.app_Configs.value['player_samp_value'])
        playerAudioLogicStore.player_gaplessAudio = '' + system_Configs_Read.app_Configs.value['player_gaplessAudio']
        playerAudioLogicStore.player_audioExclusiveMode = '' + system_Configs_Read.app_Configs.value['player_audioExclusiveMode'] === 'true'
        playerAudioLogicStore.player_replayGainMode = '' + system_Configs_Read.app_Configs.value['player_replayGainMode']
        playerAudioLogicStore.player_replayGainPreamp = Number('' + system_Configs_Read.app_Configs.value['player_replayGainPreamp'])
        playerAudioLogicStore.player_replayGainClip = '' + system_Configs_Read.app_Configs.value['player_replayGainClip'] === 'true'
        playerAudioLogicStore.player_replayGainFallback = Number('' + system_Configs_Read.app_Configs.value['player_replayGainFallback'])
        playerAudioLogicStore.player_mpvExtraParameters = '' + system_Configs_Read.app_Configs.value['player_mpvExtraParameters']
        
        let state_player_device_select = false
        playerAudioLogicStore.player_device_select = ''
        const player_device_select = '' + system_Configs_Read.app_Configs.value['player_device_select']
        
        if (player_device_select != undefined && player_device_select != 'default') {
          if (player_device_select.trim().length > 0)
            playerAudioLogicStore.player_device_select = player_device_select
          else state_player_device_select = true
        } else state_player_device_select = true
        
        if (state_player_device_select) {
          if (playerAudioLogicStore.player === undefined) {
            playerAudioLogicStore.player = new Audio_howler()
          }
          await playerAudioLogicStore.player.getDevices()
          if (playerAudioLogicStore.player_device_kind != undefined) {
            if (playerAudioLogicStore.player_device_kind.length > 0) {
              playerAudioLogicStore.player_device_select = playerAudioLogicStore.player_device_kind[0].value
            }
          }
        }
      } catch {
        playerAudioLogicStore.player_dolby = true
        playerAudioLogicStore.player_audio_channel = '5.1'
        playerAudioLogicStore.player_samp_value = 48000
        playerAudioLogicStore.player_gaplessAudio = 'weak'
        playerAudioLogicStore.player_audioExclusiveMode = false
        playerAudioLogicStore.player_replayGainMode = 'no'
        playerAudioLogicStore.player_replayGainPreamp = 0
        playerAudioLogicStore.player_replayGainClip = false
        playerAudioLogicStore.player_replayGainFallback = 0
        playerAudioLogicStore.player_mpvExtraParameters = ''
      }
      
      if (playerAudioLogicStore.player_audio_channel.length < 0) {
        playerAudioLogicStore.player_audio_channel = '5.1'
      }

      /// playlist media_file_id_of_list
      try {
        if (isElectron) {
          playlistListInfoStore.playlist_datas_CurrentPlayList_ALLMediaIds = system_Configs_Read.playlist_File_Configs.value
          const get_PlaylistInfo_From_LocalSqlite = new Get_LocalSqlite_PlaylistInfo()
          
          if (serverUserModelStore.model_server_type_of_local) {
            playlistListInfoStore.playlist_MediaFiles_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Media_File_Id_of_list(
              playlistListInfoStore.playlist_datas_CurrentPlayList_ALLMediaIds
            )
          } else if (serverUserModelStore.model_server_type_of_web) {
            playlistListInfoStore.playlist_MediaFiles_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Media_File_of_list()
          }
          
          const media_file = playlistListInfoStore.playlist_MediaFiles_temporary.find(
            (row) => row.id === playerAudioInfoStore.this_audio_song_id
          )
          
          if (media_file) {
            playerAudioInfoStore.this_audio_play_id = media_file.play_id
            playerAudioInfoStore.this_audio_file_medium_image_url = media_file.medium_image_url
          }
        }
        
        serverAuthTokenStore.test_init_server_token()
      } catch (e) {
        console.error(e)
      }
      
      playerAudioInfoStore.this_audio_Index_of_play_list = Number('' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_Index_of_play_list'])

      /// close
      try {
        await serverModelStatisticsStore.get_page_top_info()
      } catch {}
      
      if (systemConfigsInfoStore.desktop_system_kind != 'docker') {
        systemConfigsInfoStore.app_view_left_menu_select_activeKey = '' + system_Configs_Read.app_Configs.value['app_view_left_menu_select_activeKey']
        routerDataInfoStore.router_name = '' + system_Configs_Read.app_Configs.value['router_name']
        
        if (
          routerDataInfoStore.router_name === '' ||
          routerDataInfoStore.router_name === 'app' ||
          routerDataInfoStore.router_name === 'null'
        ) {
          systemConfigsInfoStore.app_view_left_menu_select_activeKey = 'setting'
          routerDataInfoStore.router_name = 'setting'
        } else {
          systemConfigsInfoStore.app_view_left_menu_select_activeKey = 'home'
          routerDataInfoStore.router_name = 'home'
        }
        
        routerDataInfoStore.router.push(routerDataInfoStore.router_name)
      } else {
        const route = String(sessionStorage.getItem('jwt_route'))
        const route_path = route && route != '/login' && route != '/null' && route !== 'null' ? route : '/home'
        
        systemConfigsInfoStore.app_view_left_menu_select_activeKey = route_path
        routerDataInfoStore.router_name = route_path

        if (routerDataInfoStore.router === null) {
          routerDataInfoStore.router_name = 'home'
          systemConfigsInfoStore.app_view_left_menu_select_activeKey = 'home'
        }
        
        if (!routerDataInfoStore.router_name || routerDataInfoStore.router_name === 'null') {
          routerDataInfoStore.router_name = 'home'
        }
        
        if (!systemConfigsInfoStore.app_view_left_menu_select_activeKey || systemConfigsInfoStore.app_view_left_menu_select_activeKey === 'null') {
          systemConfigsInfoStore.app_view_left_menu_select_activeKey = 'home'
        }
        
        let final_route_path = route_path
        if (final_route_path === '/null' || final_route_path === 'null') {
          final_route_path = '/home'
        }

        routerDataInfoStore.router.push(routerDataInfoStore.router_name)
      }

      playerAudioLogicStore.player_back_ChevronDouble = shrink_up_arrow

      if (serverUserModelStore.model_server_type_of_web) {
        playerAudioLogicStore.this_audio_initial_trigger = true
      }
    } catch (e) {
      console.error(e)
    }
    
    app_configs_loading.value = false
  }

  function extractFolderName(fullPath: string): string | null {
    if (!fullPath) return null
    const parts = fullPath.split('\\')
    return parts[parts.length - 1]
  }

  return {
    // 状态暴露
    app_configs_loading,
    // 方法暴露
    load_app_config,
    extractFolderName
  }
})