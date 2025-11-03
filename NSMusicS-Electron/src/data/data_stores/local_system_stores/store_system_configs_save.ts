import { reactive, ref } from 'vue'
import { App_Configs } from '@/data/data_models/app_models/app_Configs/class_App_Configs'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { usePlayerSettingStore } from '@/data/data_status/comment_status/player_store/usePlayerSettingStore'
import { Write_LocalSqlite_System_Configs } from '@/data/data_repository/system_repository/Write_LocalSqlite_System_Configs'
import { Player_Configs_of_UI } from '@/data/data_models/app_models/app_Configs/class_Player_Configs_of_UI'
import { usePlayerAppearanceStore } from '@/data/data_status/comment_status/player_store/usePlayerAppearanceStore'
import { Player_Configs_of_Audio_Info } from '@/data/data_models/app_models/app_Configs/class_Player_Configs_of_Audio_Info'
import { usePlayerAudioStore } from '@/data/data_status/comment_status/player_store/usePlayerAudioStore'
import { usePlaylistStore } from '@/data/data_status/comment_status/playlist_store/usePlaylistStore'
import { store_server_users } from '@/server/server_management/store_server_users'
import { store_router_data_info } from '@/router/router_store/store_router_data_info'
import { store_router_history_data_of_media } from '@/router/router_store/store_router_history_data_of_media'
import { usePageMediaStore } from '@/data/data_status/page_status/media_store/usePageMediaStore'
import { usePageAlbumStore } from '@/data/data_status/page_status/album_store/usePageAlbumStore'
import { usePageArtistStore } from '@/data/data_status/page_status/artist_store/usePageArtistStore'
import { store_general_fetch_player_list } from '@/server/server_api_store/server_api_core/components/player_list/store_general_fetch_player_list'
import { store_router_data_logic } from '@/router/router_store/store_router_data_logic'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_local_db_info } from '@/data/data_stores/local_app_stores/store_local_db_info'
import axios from 'axios'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'
import { store_system_configs_load } from '@/data/data_stores/local_system_stores/store_system_configs_load'

export const store_system_configs_save = reactive({
  generateMockObjectId() {
    const hexChars = '0123456789abcdef'
    let id = ''
    for (let i = 0; i < 24; i++) {
      id += hexChars[Math.floor(Math.random() * 16)]
    }
    return id
  },
  async save_system_config_of_App_Configs() {
    const pageMediaStore = usePageMediaStore()
    const playerSettingStore = usePlayerSettingStore()
    const pageAlbumStore = usePageAlbumStore()
    const pageArtistStore = usePageArtistStore()
    if (!store_system_configs_load.app_configs_loading) {
      const app_Configs = ref(
        new App_Configs({
          theme: store_system_configs_info.theme_name,
          lang: store_system_configs_info.lang,
          router_name: String(store_router_data_info.router_name),
          menuOptions_selectd_model_1: String(
            store_system_configs_info.menuOptions_selectd_model_1
          ),
          menuOptions_selectd_model_2: String(
            store_system_configs_info.menuOptions_selectd_model_2
          ),
          menuOptions_selectd_model_3: String(
            store_system_configs_info.menuOptions_selectd_model_3
          ),
          menuOptions_selectd_model_4: String(
            store_system_configs_info.menuOptions_selectd_model_4
          ),
          app_view_left_menu_select_activeKey: String(
            store_system_configs_info.app_view_left_menu_select_activeKey
          ),
          app_view_left_menu_collapsed: String(
            store_system_configs_info.app_view_left_menu_collapsed
          ),
          model_select: String(store_server_user_model.model_select),
          server_select: String(store_server_user_model.server_select),
          server_select_kind: String(store_server_users.server_select_kind),
          username: String(store_server_user_model.username),
          password: String(store_server_user_model.password),
          play_order: String(playerSettingStore.play_order),
          play_volume: String(playerSettingStore.play_volume),
          model_server_type_of_web: String(store_server_user_model.model_server_type_of_web),
          model_server_type_of_local: String(store_server_user_model.model_server_type_of_local),
          model_server_type_of_local_server_download: String(
            store_server_user_model.model_server_type_of_local_server_download
          ),
          authorization_of_nd: String(store_server_user_model.authorization_of_nd),
          client_unique_id: String(store_server_user_model.client_unique_id),
          media_page_sizes: String(pageMediaStore.media_page_sizes),
          album_page_sizes: String(pageAlbumStore.album_page_sizes),
          artist_page_sizes: String(pageArtistStore.artist_page_sizes),
          clear_Memory_Model: String(store_router_data_logic.clear_Memory_Model),
          clear_Equilibrium_Model: String(store_router_data_logic.clear_Equilibrium_Model),
          clear_UserExperience_Model: String(store_router_data_logic.clear_UserExperience_Model),
          theme_auto_system: String(store_system_configs_info.theme_auto_system),
          page_songlists_filter_year: String(pageMediaStore.page_songlists_filter_year),
          player_select: String(playerSettingStore.player_select),
          player_fade_value: String(playerSettingStore.player_fade_value),
          player_dolby: String(playerSettingStore.player_dolby),
          player_samp_value: String(playerSettingStore.player_samp_value),
          player_gaplessAudio: String(playerSettingStore.player_gaplessAudio),
          player_audioExclusiveMode: String(playerSettingStore.player_audioExclusiveMode),
          player_replayGainMode: String(playerSettingStore.player_replayGainMode),
          player_replayGainPreamp: String(playerSettingStore.player_replayGainPreamp),
          player_replayGainClip: String(playerSettingStore.player_replayGainClip),
          player_replayGainFallback: String(playerSettingStore.player_replayGainFallback),
          player_mpvExtraParameters: String(playerSettingStore.player_mpvExtraParameters),
          player_audio_channel: String(playerSettingStore.player_audio_channel),
          player_device_select: String(playerSettingStore.player_device_select),
        })
      )
      if (isElectron) {
        try {
          let db: any = null
          db = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
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
          !store_router_data_info.router_select_model_server_login &&
          store_server_login_info.server_accessToken.length > 0
        ) {
          const data = Object.entries(app_Configs.value).map(([key, value]) => ({
            ID: this.generateMockObjectId(),
            ConfigKey: String(key),
            ConfigValue: String(value),
          }))
          try {
            await axios.put('/api/app/config', JSON.stringify(data), {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
              },
            })
          } catch (error) {
            console.error('请求失败:', error.response ? error.response.data : error.message)
          }
        }
      }
    }
  },
  async save_system_library_config() {
    if (isElectron) {
      try {
        let db: any = null
        db = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
        db.pragma('journal_mode = WAL')
        db.exec('PRAGMA foreign_keys = OFF')

        const system_Configs_Write = new Write_LocalSqlite_System_Configs()
        system_Configs_Write.system_library_config(
          db,
          store_local_db_info.local_config_of_all_user_of_sqlite
        )
        this.save_system_config_of_App_Configs()
        db.close()
        db = null
      } catch (e) {
        console.error(e)
      }
    } else {
      if (
        !store_router_data_info.router_select_model_server_login &&
        store_server_login_info.server_accessToken.length > 0
      ) {
        const data = Object.entries(store_local_db_info.local_config_of_all_user_of_sqlite).map(
          ([key, value]) => ({
            ID: this.generateMockObjectId(),
            ConfigKey: String(key),
            ConfigValue: String(value),
          })
        )
        try {
          await axios.put('/api/app/library', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
            },
          })
        } catch (error) {
          console.error('请求失败:', error.response ? error.response.data : error.message)
        }
      }
    }
  },
  async save_system_config_of_Player_Configs_of_UI() {
    const playerAppearanceStore = usePlayerAppearanceStore()
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
        player_use_lyric_skip_forward: String(playerAppearanceStore.player_use_lyric_skip_forward),
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
        db = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
        db.pragma('journal_mode = WAL')
        db.exec('PRAGMA foreign_keys = OFF')
        system_Configs_Write.system_player_config_of_ui(db, player_Configs_of_UI.value)
        this.save_system_config_of_App_Configs()
        db.close()
        db = null
      } catch (e) {
        console.error(e)
      }
    } else {
      if (
        !store_router_data_info.router_select_model_server_login &&
        store_server_login_info.server_accessToken.length > 0
      ) {
        const data = Object.entries(player_Configs_of_UI.value).map(([key, value]) => ({
          ID: this.generateMockObjectId(),
          ConfigKey: String(key),
          ConfigValue: String(value),
        }))
        try {
          await axios.put('/api/app/ui', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
            },
          })
        } catch (error) {
          console.error('请求失败:', error.response ? error.response.data : error.message)
        }
      }
    }
  },
  async save_system_config_of_Player_Configs_of_Audio_Info() {
    const playerSettingStore = usePlayerSettingStore()
    const playerAppearanceStore = usePlayerAppearanceStore()
    const playerAudioStore = usePlayerAudioStore()
    const pageMediaStore = usePageMediaStore()
    let player_Configs_of_Audio_Info = null
    player_Configs_of_Audio_Info = ref(
      new Player_Configs_of_Audio_Info({
        this_audio_file_path: String(playerAudioStore.this_audio_file_path),
        this_audio_file_medium_image_url: String(playerAudioStore.this_audio_file_medium_image_url),
        this_audio_file_lyric: String(playerAudioStore.this_audio_lyrics_string),
        this_audio_artist_name: String(playerAudioStore.this_audio_artist_name),
        this_audio_artist_id: String(playerAudioStore.this_audio_artist_id),
        this_audio_song_name: String(playerAudioStore.this_audio_song_name),
        this_audio_song_id: String(playerAudioStore.this_audio_song_id),
        this_audio_song_rating: String(playerAudioStore.this_audio_song_rating),
        this_audio_song_favorite: String(playerAudioStore.this_audio_song_favorite),
        this_audio_album_name: String(playerAudioStore.this_audio_album_name),
        this_audio_album_id: String(playerAudioStore.this_audio_album_id),
        this_audio_Index_of_play_list: String(playerAudioStore.this_audio_Index_of_play_list),

        page_top_album_image_url: String(playerAudioStore.page_top_album_image_url),
        page_top_album_id: String(playerAudioStore.page_top_album_id),
        page_top_album_name: String(playerAudioStore.page_top_album_name),

        slider_singleValue: String(playerSettingStore.slider_singleValue),

        playlist_artist_id: String(store_general_fetch_player_list._artist_id),
        playlist_album_id: String(store_general_fetch_player_list._album_id),
        playlist_album_artist_id: String(store_general_fetch_player_list._album_artist_id),

        page_songlists_selected: String(pageMediaStore.page_songlists_selected),

        player_mode_of_lock_playlist: String(playerAppearanceStore.player_mode_of_lock_playlist),
        player_mode_of_medialist_from_external_import: String(
          playerAppearanceStore.player_mode_of_medialist_from_external_import
        ),
      })
    )
    if (isElectron) {
      try {
        let db: any = null
        db = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
        db.pragma('journal_mode = WAL')
        db.exec('PRAGMA foreign_keys = OFF')
        const system_Configs_Write = new Write_LocalSqlite_System_Configs()
        system_Configs_Write.system_player_config_of_audio(db, player_Configs_of_Audio_Info.value)
        this.save_system_config_of_App_Configs()
        db.close()
        db = null
      } catch (e) {
        console.error(e)
      }
    } else {
      if (
        !store_router_data_info.router_select_model_server_login &&
        store_server_login_info.server_accessToken.length > 0
      ) {
        const data = Object.entries(player_Configs_of_Audio_Info.value).map(([key, value]) => ({
          ID: this.generateMockObjectId(),
          ConfigKey: String(key),
          ConfigValue: String(value),
        }))
        try {
          await axios.put('/api/app/audio', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
            },
          })
        } catch (error) {
          console.error('请求失败:', error.response ? error.response.data : error.message)
        }
      }
    }
  },
  async save_system_playlist_item_id_config() {
    const playlistStore = usePlaylistStore()
    if (isElectron) {
      try {
        let db: any = null
        if (store_server_user_model.model_server_type_of_local) {
          db = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')

          const system_Configs_Write = new Write_LocalSqlite_System_Configs()
          system_Configs_Write.system_playlist_item_id_config(
            db,
            playlistStore.playlist_datas_CurrentPlayList_ALLMediaIds
          )
        } else {
          db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
          db.pragma('journal_mode = WAL')
          db.exec('PRAGMA foreign_keys = OFF')

          const system_Configs_Write = new Write_LocalSqlite_System_Configs()
          system_Configs_Write.system_playlist_item_config(
            db,
            playlistStore.playlist_MediaFiles_temporary
          )
        }
        await this.save_system_config_of_App_Configs()
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
      const data = playlistStore.playlist_MediaFiles_temporary
        .filter((item) => item.id && !excludedFields.has('id'))
        .map((item, index) => ({
          ID: this.generateMockObjectId(),
          ConfigKey: item.id,
          ConfigValue: String(index + 1),
        }))
      if (
        !store_router_data_info.router_select_model_server_login &&
        store_server_login_info.server_accessToken.length > 0
      ) {
        try {
          await axios.put('/api/app/playlist', JSON.stringify(data), {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
            },
          })
        } catch (error) {
          console.error('请求失败:', error.response ? error.response.data : error.message)
        }
      }
    }
  },
  async save_system_config_of_Servers_Config() {
    if (isElectron) {
      try {
        let db: any = null
        db = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
        db.pragma('journal_mode = WAL')
        db.exec('PRAGMA foreign_keys = OFF')
        const system_Configs_Write = new Write_LocalSqlite_System_Configs()
        system_Configs_Write.system_servers_config(
          db,
          store_server_users.server_config_of_all_user_of_sqlite
        )
        await this.save_system_config_of_App_Configs()
        db.close()
        db = null
      } catch (e) {
        console.error(e)
      }
    } else {
      // 不提供服务端配置整体写入
      // NineSong app app config 仅支持get查询所有、put单项创建：新ID值、put单项更新：已有ID值
    }
  },
})
