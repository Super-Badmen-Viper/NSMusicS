import { defineStore } from 'pinia'
import { ref } from 'vue'
import { App_Configs } from '@/data/data_models/app_models/app_Configs/class_App_Configs'
import { useSystemConfigsInfoStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_info'
import { useServerUserModelStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_user_model'
import { usePlayerAudioLogicStore } from '@/views/view_app/page/page_player/store/store_player_audio_logic'
import { Write_LocalSqlite_System_Configs } from '@/data/data_repository/system_repository/Write_LocalSqlite_System_Configs'
import { Player_Configs_of_UI } from '@/data/data_models/app_models/app_Configs/class_Player_Configs_of_UI'
import { usePlayerAppearanceStore } from '@/views/view_app/page/page_player/store/store_player_appearance'
import { Player_Configs_of_Audio_Info } from '@/data/data_models/app_models/app_Configs/class_Player_Configs_of_Audio_Info'
import { usePlayerAudioInfoStore } from '@/views/view_app/page/page_player/store/store_player_audio_info'
import { useViewMediaPageLogicStore } from '@/views/view_app/page/page_media/store/store_view_media_page_logic'
import { usePlaylistListInfoStore } from '@/views/view_app/components/player_list/store/store_playlist_list_info'
import { useServerUsersStore } from '@/data/data_pinia_stores/server_configs_stores/store_server_users'
import { useRouterDataInfoStore } from '@/router/router_store/store_router_data_info'
import { useRouterHistoryDataOfMediaStore } from '@/router/router_store/store_router_history_data_of_media'
import { useViewMediaPageInfoStore } from '@/views/view_app/page/page_media/store/store_view_media_page_info'
import { useViewAlbumPageInfoStore } from '@/views/view_app/page/page_album/store/store_view_album_page_info'
import { useViewArtistPageInfoStore } from '@/views/view_app/page/page_artist/store/store_view_artist_page_info'
import { useGeneralFetchPlayerListStore } from '@/data/data_pinia_stores/server_api_stores/server_api_core/components/player_list/store_general_fetch_player_list'
import { useRouterDataLogicStore } from '@/router/router_store/store_router_data_logic'
import { isElectron } from '@/utils/electron/isElectron'
import { useLocalDbInfoStore } from '@/data/data_pinia_stores/local_app_stores/store_local_db_info'
import axios from 'axios'
import { useServerLoginInfoStore } from '@/views/view_server/page_login/store/store_server_login_info'
import { useSystemConfigsLoadStore } from '@/data/data_pinia_stores/local_system_stores/store_system_configs_load'

export const useSystemConfigsSaveStore = defineStore('systemConfigsSave', () => {
  // 获取其他store的引用
  const systemConfigsInfoStore = useSystemConfigsInfoStore()
  const serverUserModelStore = useServerUserModelStore()
  const playerAudioLogicStore = usePlayerAudioLogicStore()
  const playerAppearanceStore = usePlayerAppearanceStore()
  const playerAudioInfoStore = usePlayerAudioInfoStore()
  const viewMediaPageLogicStore = useViewMediaPageLogicStore()
  const playlistListInfoStore = usePlaylistListInfoStore()
  const serverUsersStore = useServerUsersStore()
  const routerDataInfoStore = useRouterDataInfoStore()
  const viewMediaPageInfoStore = useViewMediaPageInfoStore()
  const viewAlbumPageInfoStore = useViewAlbumPageInfoStore()
  const viewArtistPageInfoStore = useViewArtistPageInfoStore()
  const generalFetchPlayerListStore = useGeneralFetchPlayerListStore()
  const routerDataLogicStore = useRouterDataLogicStore()
  const localDbInfoStore = useLocalDbInfoStore()
  const serverLoginInfoStore = useServerLoginInfoStore()
  const systemConfigsLoadStore = useSystemConfigsLoadStore()

  // 方法定义
  function generateMockObjectId() {
    const hexChars = '0123456789abcdef'
    let id = ''
    for (let i = 0; i < 24; i++) {
      id += hexChars[Math.floor(Math.random() * 16)]
    }
    return id
  }

  async function save_system_config_of_App_Configs() {
    if (!systemConfigsLoadStore.app_configs_loading) {
      const app_Configs = ref(
        new App_Configs({
          theme: systemConfigsInfoStore.theme_name,
          lang: systemConfigsInfoStore.lang,
          router_name: String(routerDataInfoStore.router_name),
          menuOptions_selectd_model_1: String(
            systemConfigsInfoStore.menuOptions_selectd_model_1
          ),
          menuOptions_selectd_model_2: String(
            systemConfigsInfoStore.menuOptions_selectd_model_2
          ),
          menuOptions_selectd_model_3: String(
            systemConfigsInfoStore.menuOptions_selectd_model_3
          ),
          menuOptions_selectd_model_4: String(
            systemConfigsInfoStore.menuOptions_selectd_model_4
          ),
          app_view_left_menu_select_activeKey: String(
            systemConfigsInfoStore.app_view_left_menu_select_activeKey
          ),
          app_view_left_menu_collapsed: String(
            systemConfigsInfoStore.app_view_left_menu_collapsed
          ),
          model_select: String(serverUserModelStore.model_select),
          server_select: String(serverUserModelStore.server_select),
          server_select_kind: String(serverUsersStore.server_select_kind),
          username: String(serverUserModelStore.username),
          password: String(serverUserModelStore.password),
          play_order: String(playerAudioLogicStore.play_order),
          play_volume: String(playerAudioLogicStore.play_volume),
          model_server_type_of_web: String(serverUserModelStore.model_server_type_of_web),
          model_server_type_of_local: String(serverUserModelStore.model_server_type_of_local),
          model_server_type_of_local_server_download: String(
            serverUserModelStore.model_server_type_of_local_server_download
          ),
          authorization_of_nd: String(serverUserModelStore.authorization_of_nd),
          client_unique_id: String(serverUserModelStore.client_unique_id),
          media_page_sizes: String(viewMediaPageInfoStore.media_page_sizes),
          album_page_sizes: String(viewAlbumPageInfoStore.album_page_sizes),
          artist_page_sizes: String(viewArtistPageInfoStore.artist_page_sizes),
          clear_Memory_Model: String(routerDataLogicStore.clear_Memory_Model),
          clear_Equilibrium_Model: String(routerDataLogicStore.clear_Equilibrium_Model),
          clear_UserExperience_Model: String(routerDataLogicStore.clear_UserExperience_Model),
          theme_auto_system: String(systemConfigsInfoStore.theme_auto_system),
          page_songlists_filter_year: String(
            viewMediaPageLogicStore.page_songlists_filter_year
          ),
          player_select: String(playerAudioLogicStore.player_select),
          player_fade_value: String(playerAudioLogicStore.player_fade_value),
          player_dolby: String(playerAudioLogicStore.player_dolby),
          player_samp_value: String(playerAudioLogicStore.player_samp_value),
          player_gaplessAudio: String(playerAudioLogicStore.player_gaplessAudio),
          player_audioExclusiveMode: String(playerAudioLogicStore.player_audioExclusiveMode),
          player_replayGainMode: String(playerAudioLogicStore.player_replayGainMode),
          player_replayGainPreamp: String(playerAudioLogicStore.player_replayGainPreamp),
          player_replayGainClip: String(playerAudioLogicStore.player_replayGainClip),
          player_replayGainFallback: String(playerAudioLogicStore.player_replayGainFallback),
          player_mpvExtraParameters: String(playerAudioLogicStore.player_mpvExtraParameters),
          player_audio_channel: String(playerAudioLogicStore.player_audio_channel),
          player_device_select: String(playerAudioLogicStore.player_device_select),
        })
      )
      if (isElectron) {
        try {
          let db: any = null
          db = require('better-sqlite3')(systemConfigsInfoStore.nsmusics_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')
          const system_Configs_Write = new Write_LocalSqlite_System_Configs()
          system_Configs_Write.system_app_config(db, app_Configs.value)
          console.log('save config succuessful')
          db.close()
          db = null
        } catch (e) {
          console.error(e)
        }
      } else {
        if (
          !routerDataInfoStore.router_select_model_server_login &&
          serverLoginInfoStore.server_accessToken.length > 0
        ) {
          const data = Object.entries(app_Configs.value).map(([key, value]) => ({
            ID: generateMockObjectId(),
            ConfigKey: String(key),
            ConfigValue: String(value),
          }))
          try {
            await axios.put('/api/app/config', JSON.stringify(data), {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${serverLoginInfoStore.server_accessToken}`,
              },
            })
          } catch (error) {
            console.error('请求失败:', error.response ? error.response.data : error.message)
          }
        }
      }
    }
  }

  async function save_system_library_config() {
    if (isElectron) {
      try {
        let db: any = null
        db = require('better-sqlite3')(systemConfigsInfoStore.nsmusics_db)
        db.pragma('journal_mode = WAL')
        db.exec('PRAGMA foreign_keys = OFF')

        const system_Configs_Write = new Write_LocalSqlite_System_Configs()
        system_Configs_Write.system_library_config(
          db,
          localDbInfoStore.local_config_of_all_user_of_sqlite
        )
        save_system_config_of_App_Configs()
        db.close()
        db = null
      } catch (e) {
        console.error(e)
      }
    } else {
      if (
        !routerDataInfoStore.router_select_model_server_login &&
        serverLoginInfoStore.server_accessToken.length > 0
      ) {
        const data = Object.entries(localDbInfoStore.local_config_of_all_user_of_sqlite).map(
          ([key, value]) => ({
            ID: generateMockObjectId(),
            ConfigKey: String(key),
            ConfigValue: String(value),
          })
        )
        try {
          await axios.put('/api/app/library', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${serverLoginInfoStore.server_accessToken}`,
            },
          })
        } catch (error) {
          console.error('请求失败:', error.response ? error.response.data : error.message)
        }
      }
    }
  }

  async function save_system_config_of_Player_Configs_of_UI() {
    const player_Configs_of_UI = ref(
      new Player_Configs_of_UI({
        player_collapsed_album: String(playerAppearanceStore.player_collapsed_album),
        player_collapsed_skin: String(playerAppearanceStore.player_collapsed_skin),
        player_lyric_fontSize: String(playerAppearanceStore.player_lyric_fontSize),
        player_lyric_fontWeight: String(playerAppearanceStore.player_lyric_fontWeight),
        player_lyric_color: String(playerAppearanceStore.player_lyric_color),
        player_theme_Styles_Selected: String(playerAppearanceStore.player_theme_Styles_Selected),
        player_background_model_num: String(playerAppearanceStore.player_background_model_num),
        player_use_lottie_animation: String(playerAppearanceStore.player_use_lottie_animation),
        player_use_lyric_skip_forward: String(
          playerAppearanceStore.player_use_lyric_skip_forward
        ),
        player_use_background_filter_blur: String(
          playerAppearanceStore.player_use_background_filter_blur
        ),
        player_use_background_automatic_rotation: String(
          playerAppearanceStore.player_use_background_automatic_rotation
        ),
        player_use_background_repeat_fill: String(
          playerAppearanceStore.player_use_background_repeat_fill
        ),
        player_use_playbar_auto_hide: String(playerAppearanceStore.player_use_playbar_auto_hide),
      })
    )
    const system_Configs_Write = new Write_LocalSqlite_System_Configs()
    if (isElectron) {
      try {
        let db: any = null
        db = require('better-sqlite3')(systemConfigsInfoStore.nsmusics_db)
        db.pragma('journal_mode = WAL')
        db.exec('PRAGMA foreign_keys = OFF')
        system_Configs_Write.system_player_config_of_ui(db, player_Configs_of_UI.value)
        save_system_config_of_App_Configs()
        db.close()
        db = null
      } catch (e) {
        console.error(e)
      }
    } else {
      if (
        !routerDataInfoStore.router_select_model_server_login &&
        serverLoginInfoStore.server_accessToken.length > 0
      ) {
        const data = Object.entries(player_Configs_of_UI.value).map(([key, value]) => ({
          ID: generateMockObjectId(),
          ConfigKey: String(key),
          ConfigValue: String(value),
        }))
        try {
          await axios.put('/api/app/ui', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${serverLoginInfoStore.server_accessToken}`,
            },
          })
        } catch (error) {
          console.error('请求失败:', error.response ? error.response.data : error.message)
        }
      }
    }
  }

  async function save_system_config_of_Player_Configs_of_Audio_Info() {
    let player_Configs_of_Audio_Info = null
    player_Configs_of_Audio_Info = ref(
      new Player_Configs_of_Audio_Info({
        this_audio_file_path: String(playerAudioInfoStore.this_audio_file_path),
        this_audio_file_medium_image_url: String(
          playerAudioInfoStore.this_audio_file_medium_image_url
        ),
        this_audio_file_lyric: String(playerAudioInfoStore.this_audio_lyrics_string),
        this_audio_artist_name: String(playerAudioInfoStore.this_audio_artist_name),
        this_audio_artist_id: String(playerAudioInfoStore.this_audio_artist_id),
        this_audio_song_name: String(playerAudioInfoStore.this_audio_song_name),
        this_audio_song_id: String(playerAudioInfoStore.this_audio_song_id),
        this_audio_song_rating: String(playerAudioInfoStore.this_audio_song_rating),
        this_audio_song_favorite: String(playerAudioInfoStore.this_audio_song_favorite),
        this_audio_album_name: String(playerAudioInfoStore.this_audio_album_name),
        this_audio_album_id: String(playerAudioInfoStore.this_audio_album_id),
        this_audio_Index_of_play_list: String(
          playerAudioInfoStore.this_audio_Index_of_play_list
        ),

        page_top_album_image_url: String(playerAudioInfoStore.page_top_album_image_url),
        page_top_album_id: String(playerAudioInfoStore.page_top_album_id),
        page_top_album_name: String(playerAudioInfoStore.page_top_album_name),

        slider_singleValue: String(playerAudioLogicStore.slider_singleValue),

        playlist_artist_id: String(generalFetchPlayerListStore._artist_id),
        playlist_album_id: String(generalFetchPlayerListStore._album_id),
        playlist_album_artist_id: String(generalFetchPlayerListStore._album_artist_id),

        page_songlists_selected: String(viewMediaPageLogicStore.page_songlists_selected),

        player_mode_of_lock_playlist: String(playerAppearanceStore.player_mode_of_lock_playlist),
        player_mode_of_medialist_from_external_import: String(
          playerAppearanceStore.player_mode_of_medialist_from_external_import
        ),
      })
    )
    if (isElectron) {
      try {
        let db: any = null
        db = require('better-sqlite3')(systemConfigsInfoStore.nsmusics_db)
        db.pragma('journal_mode = WAL')
        db.exec('PRAGMA foreign_keys = OFF')
        const system_Configs_Write = new Write_LocalSqlite_System_Configs()
        system_Configs_Write.system_player_config_of_audio(db, player_Configs_of_Audio_Info.value)
        save_system_config_of_App_Configs()
        db.close()
        db = null
      } catch (e) {
        console.error(e)
      }
    } else {
      if (
        !routerDataInfoStore.router_select_model_server_login &&
        serverLoginInfoStore.server_accessToken.length > 0
      ) {
        const data = Object.entries(player_Configs_of_Audio_Info.value).map(([key, value]) => ({
          ID: generateMockObjectId(),
          ConfigKey: String(key),
          ConfigValue: String(value),
        }))
        try {
          await axios.put('/api/app/audio', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${serverLoginInfoStore.server_accessToken}`,
            },
          })
        } catch (error) {
          console.error('请求失败:', error.response ? error.response.data : error.message)
        }
      }
    }
  }

  async function save_system_playlist_item_id_config() {
    if (isElectron) {
      try {
        let db: any = null
        if (serverUserModelStore.model_server_type_of_local) {
          db = require('better-sqlite3')(systemConfigsInfoStore.nsmusics_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')

          const system_Configs_Write = new Write_LocalSqlite_System_Configs()
          system_Configs_Write.system_playlist_item_id_config(
            db,
            playlistListInfoStore.playlist_datas_CurrentPlayList_ALLMediaIds
          )
        } else {
          db = require('better-sqlite3')(systemConfigsInfoStore.navidrome_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')

          const system_Configs_Write = new Write_LocalSqlite_System_Configs()
          system_Configs_Write.system_playlist_item_config(
            db,
            playlistListInfoStore.playlist_MediaFiles_temporary
          )
        }
        await save_system_config_of_App_Configs()
        db.close()
        db = null
      } catch (e) {
        console.error(e)
      }
    } else {
      const excludedFields = new Set([
        'play_id',
        'favorite',
        'rating',
        'play_count',
        'play_date',
        'play_complete_count',
        'duration_txt',
        'absoluteIndex',
        'selected',
        'playing',
        'all_artist_ids',
        'all_album_artist_ids',
        'cue_count',
        'guest_cue_count',
        'encoding_format',
        'cue_tracks',
        'cue_track_count',
        'cue_track_show',
      ])
      const data = playlistListInfoStore.playlist_MediaFiles_temporary
        .filter((item) => item.id && !excludedFields.has('id'))
        .map((item, index) => ({
          ID: generateMockObjectId(),
          ConfigKey: item.id,
          ConfigValue: String(index + 1),
        }))
      if (
        !routerDataInfoStore.router_select_model_server_login &&
        serverLoginInfoStore.server_accessToken.length > 0
      ) {
        try {
          await axios.put('/api/app/playlist', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${serverLoginInfoStore.server_accessToken}`,
            },
          })
        } catch (error) {
          console.error('请求失败:', error.response ? error.response.data : error.message)
        }
      }
    }
  }

  async function save_system_config_of_Servers_Config() {
    if (isElectron) {
      try {
        let db: any = null
        db = require('better-sqlite3')(systemConfigsInfoStore.nsmusics_db)
        db.pragma('journal_mode = WAL')
        db.exec('PRAGMA foreign_keys = OFF')
        const system_Configs_Write = new Write_LocalSqlite_System_Configs()
        system_Configs_Write.system_servers_config(
          db,
          serverUsersStore.server_config_of_all_user_of_sqlite
        )
        await save_system_config_of_App_Configs()
        db.close()
        db = null
      } catch (e) {
        console.error(e)
      }
    } else {
      // 不提供服务端配置整体写入
      // NineSong app app config 仅支持get查询所有、put单项创建：新ID值、put单项更新：已有ID值
    }
  }

  // 暴露方法
  return {
    generateMockObjectId,
    save_system_config_of_App_Configs,
    save_system_library_config,
    save_system_config_of_Player_Configs_of_UI,
    save_system_config_of_Player_Configs_of_Audio_Info,
    save_system_playlist_item_id_config,
    save_system_config_of_Servers_Config
  }
})