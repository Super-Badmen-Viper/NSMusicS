import { ref } from 'vue'
import { App_Configs } from '@/data/data_models/app_models/app_Configs/class_App_Configs'
import { Player_Configs_of_Audio_Info } from '@/data/data_models/app_models/app_Configs/class_Player_Configs_of_Audio_Info'
import { Player_Configs_of_UI } from '@/data/data_models/app_models/app_Configs/class_Player_Configs_of_UI'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { isElectron } from '@/utils/electron/isElectron'
import axios from 'axios'
import { store_server_login_info } from '@/views/view_server/page_login/store/store_server_login_info'

export class Class_Get_System_Configs_Read {
  public app_Configs = ref(
    new App_Configs({
      theme: null,
      lang: '',
      router_name: '',
      menuOptions_selectd_model_1: null,
      menuOptions_selectd_model_2: null,
      menuOptions_selectd_model_3: null,
      menuOptions_selectd_model_4: null,
      app_view_left_menu_select_activeKey: '',
      app_view_left_menu_collapsed: null,
      model_select: '',
      server_select: '',
      server_select_kind: '',
      username: '',
      password: '',
      play_order: '',
      play_volume: 0,
      model_server_type_of_web: null,
      model_server_type_of_local: null,
      model_server_type_of_local_server_download: null,
      authorization_of_nd: '',
      client_unique_id: '',
      media_page_sizes: 0,
      album_page_sizes: 0,
      artist_page_sizes: 0,
      clear_Memory_Model: null,
      clear_Equilibrium_Model: null,
      clear_UserExperience_Model: null,
      theme_auto_system: null,
      page_songlists_filter_year: 0,
      player_select: null,
      player_fade_value: 0,
      player_dolby: null,
      player_samp_value: 0,
      player_gaplessAudio: '',
      player_audioExclusiveMode: null,
      player_replayGainMode: '',
      player_replayGainPreamp: 0,
      player_replayGainClip: null,
      player_replayGainFallback: 0,
      player_mpvExtraParameters: '',
      player_audio_channel: '',
      player_device_select: '',
    })
  )
  ///
  public library_Configs = ref<Local_Configs_Props[]>([])
  public server_Configs = ref<Server_Configs_Props[]>([])
  public server_Configs_Current = ref<Server_Configs_Props>()
  ///
  public player_Configs_of_UI = ref(
    new Player_Configs_of_UI({
      player_collapsed_album: null,
      player_collapsed_skin: null,
      player_lyric_fontSize: '',
      player_lyric_fontWeight: '',
      player_lyric_color: '',
      player_theme_Styles_Selected: null,
      player_background_model_num: null,
      player_use_lottie_animation: null,
      player_use_lyric_skip_forward: null,
      player_use_background_filter_blur: null,
      player_use_background_automatic_rotation: null,
      player_use_background_repeat_fill: null,
      player_use_playbar_auto_hide: null,
    })
  )
  public player_Configs_of_Audio_Info = ref(
    new Player_Configs_of_Audio_Info({
      this_audio_file_path: '',
      this_audio_file_medium_image_url: '',
      this_audio_file_lyric: '',
      this_audio_artist_name: '',
      this_audio_artist_id: '',
      this_audio_song_name: '',
      this_audio_song_id: '',
      this_audio_song_rating: '',
      this_audio_song_favorite: '',
      this_audio_album_name: '',
      this_audio_album_id: '',
      this_audio_Index_of_play_list: null,

      page_top_album_image_url: '',
      page_top_album_id: '',
      page_top_album_name: '',

      slider_singleValue: '',

      playlist_artist_id: '',
      playlist_album_id: '',
      playlist_album_artist_id: '',

      page_songlists_selected: '',

      player_mode_of_lock_playlist: null,
      player_mode_of_medialist_from_external_import: null,
    })
  )
  public playlist_File_Configs = ref<string[]>([])
  public view_Media_History_Configs = ref<Interface_View_Router_Date[]>([])
  public view_Album_History_Configs = ref<Interface_View_Router_Date[]>([])
  public view_Artist_History_Configs = ref<Interface_View_Router_Date[]>([])
  public view_Media_History_select_Configs = ref<Interface_View_Router_Date>()
  public view_Album_History_select_Configs = ref<Interface_View_Router_Date>()
  public view_Artist_History_select_Configs = ref<Interface_View_Router_Date>()

  public async init() {
    if (isElectron) {
      const os = require('os')
      const path = require('path')
      let db_navidrome: any = null
      let db: any = null
      try {
        store_system_configs_info.resourcesPath =
          process.env.NODE_ENV === 'development'
            ? path.resolve('resources')
            : path.join(process.resourcesPath)
        if (process.platform === 'win32') {
          store_system_configs_info.driveDbPath = 'C:\\Users\\Public\\Documents\\NSMusicS\\'
          store_system_configs_info.driveTempPath = 'C:\\Users\\Public\\Documents\\NSMusicS\\temp'
        } else if (process.platform === 'darwin') {
          // store_system_configs_info.driveDbPath = path.join(os.homedir(), 'Library', 'Application Scripts', 'NSMusicS');
          store_system_configs_info.driveDbPath = path.join(
            os.homedir(),
            'Applications',
            'NSMusicS'
          )
        } else {
          store_system_configs_info.driveDbPath = path.join(os.homedir(), '.NSMusicS')
        }
        //
        store_system_configs_info.navidrome_db = path.join(
          store_system_configs_info.driveDbPath,
          'navidrome.db'
        )
        store_system_configs_info.nsmusics_db = path.join(
          store_system_configs_info.driveDbPath,
          'nsmusics.db'
        )
        //
        db_navidrome = require('better-sqlite3')(store_system_configs_info.navidrome_db)
        db = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
      } catch {
        db_navidrome = require('better-sqlite3')(store_system_configs_info.navidrome_db)
        db = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
      }
      db_navidrome.pragma('journal_mode = WAL')
      db.pragma('journal_mode = WAL')

      try {
        db_navidrome.exec('BEGIN')
        const tableSchema = db_navidrome.prepare(`PRAGMA table_info(media_file)`).all()
        const hasMediumImageUrlColumn = tableSchema.some(
          (column) => column.name === 'medium_image_url'
        )
        if (!hasMediumImageUrlColumn) {
          db_navidrome.exec(`ALTER TABLE media_file
                        ADD COLUMN medium_image_url TEXT`)
        }
        db_navidrome.exec('COMMIT')
      } catch (error) {
        db_navidrome.exec('ROLLBACK')
        console.error('Error modifying media_file table:', error)
      } finally {
        db_navidrome.close()
        db_navidrome = null
      }

      /// Modify user configuration
      try {
        db.exec('BEGIN')
        db.exec(`CREATE TABLE IF NOT EXISTS system_playlist_file_id
                (
                    "media_file_id"
                    varchar
                         (
                    255
                         ) NOT NULL,
                    "order_index" INTEGER
                    )`)
        const hasData =
          db
            .prepare(
              `SELECT COUNT(*) AS count
                                            FROM system_playlist_file_id_config`
            )
            .get().count || 0
        if (hasData > 0) {
          db.exec(`INSERT INTO system_playlist_file_id
                             SELECT *
                             FROM system_playlist_file_id_config`)
          db.exec(`DELETE
                             FROM system_playlist_file_id_config`)
        }
        db.exec('COMMIT')
      } catch (error) {
        db.exec('ROLLBACK')
        console.error('Error modifying user configuration:', error)
      }
      ///
      db.prepare(
        `SELECT *
                        FROM system_app_config`
      )
        .all()
        .forEach((row: Config_Props, index: number) => {
          const propertyName = row.config_key
          if (this.app_Configs.value.hasOwnProperty(propertyName))
            this.app_Configs.value[propertyName] = row.config_value // If this line of code ide displays an error, please ignore error
        })
      ///
      db.prepare(
        `SELECT *
                        FROM system_library_config`
      )
        .all()
        .forEach((row: Local_Configs_Props, index: number) => {
          this.library_Configs.value.push(row)
        })
      db.prepare(
        `SELECT *
                        FROM system_servers_config`
      )
        .all()
        .forEach((row: Server_Configs_Props, index: number) => {
          this.server_Configs.value.push(row)
        })
      db.prepare(
        `SELECT *
                        FROM system_servers_config`
      )
        .all()
        .forEach((row: Server_Configs_Props) => {
          if (row.id === '' + this.app_Configs.value['server_select']) {
            this.server_Configs_Current.value = row
          }
        })
      ///
      db.prepare(
        `SELECT *
                        FROM system_player_config_of_audio`
      )
        .all()
        .forEach((row: Config_Props, index: number) => {
          const propertyName = row.config_key
          if (this.player_Configs_of_Audio_Info.value.hasOwnProperty(propertyName))
            this.player_Configs_of_Audio_Info.value[propertyName] = row.config_value // If this line of code ide displays an error, please ignore error
        })
      db.prepare(
        `SELECT *
                        FROM system_player_config_of_ui`
      )
        .all()
        .forEach((row: Config_Props, index: number) => {
          const propertyName = row.config_key
          if (this.player_Configs_of_UI.value.hasOwnProperty(propertyName))
            this.player_Configs_of_UI.value[propertyName] = row.config_value // If this line of code ide displays an error, please ignore error
        })
      /// play_list
      const stmt_playlist_tracks_media_file_id = db.prepare(`SELECT *
                                                                   FROM system_playlist_file_id`)
      this.playlist_File_Configs.value = stmt_playlist_tracks_media_file_id
        .all()
        .map((item) => item.media_file_id)

      /// view_router_hisotry
      db.prepare(
        `SELECT *
                        FROM system_view_media_history`
      )
        .all()
        .forEach((row: Interface_View_Router_Date) => {
          this.view_Media_History_Configs.value.push(row)
        })
      db.prepare(
        `SELECT *
                        FROM system_view_album_history`
      )
        .all()
        .forEach((row: Interface_View_Router_Date) => {
          this.view_Album_History_Configs.value.push(row)
        })
      db.prepare(
        `SELECT *
                        FROM system_view_artist_history`
      )
        .all()
        .forEach((row: Interface_View_Router_Date) => {
          this.view_Artist_History_Configs.value.push(row)
        })
      db.prepare(
        `SELECT *
                        FROM system_view_media_select_history`
      )
        .all()
        .forEach((row: Interface_View_Router_Date) => {
          this.view_Media_History_select_Configs.value = row
        })
      db.prepare(
        `SELECT *
                        FROM system_view_album_select_history`
      )
        .all()
        .forEach((row: Interface_View_Router_Date) => {
          this.view_Album_History_select_Configs.value = row
        })
      db.prepare(
        `SELECT *
                        FROM system_view_artist_select_history`
      )
        .all()
        .forEach((row: Interface_View_Router_Date) => {
          this.view_Artist_History_select_Configs.value = row
        })

      db.close()
      db = null
    } else {
      const response_app_Configs = await axios.get('/api/app/config', {
        headers: {
          Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
        },
      })
      response_app_Configs.data.forEach((row: any) => {
        const propertyName = row.ConfigKey
        const propertyValue = row.ConfigValue
        if (this.app_Configs.value.hasOwnProperty(propertyName)) {
          this.app_Configs.value[propertyName] = propertyValue
        }
      })
      //
      const response_library = await axios.get('/api/app/library', {
        headers: {
          Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
        },
      })
      response_library.data.forEach((row: any) => {
        this.library_Configs.value.push({
          id: row.ID,
          config_key: row.ConfigKey,
          config_value: row.ConfigValue,
        })
      })
      //
      this.server_Configs.value = []
      const response_server_Configs = await axios.get('/api/app/server', {
        headers: {
          Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
        },
      })
      if (response_server_Configs != undefined && response_server_Configs.data != undefined) {
        response_server_Configs.data.forEach((row: any) => {
          this.server_Configs.value.push({
            id: row.ID,
            server_name: row.ServerName,
            url: row.URL,
            user_name: row.UserName,
            password: row.Password,
            last_login_at: row.LastLoginAt,
            type: row.Type,
          })
          if (row.ID === '' + this.app_Configs.value['server_select']) {
            this.server_Configs_Current.value = {
              id: row.ID,
              server_name: row.ServerName,
              url: row.URL,
              user_name: row.UserName,
              password: row.Password,
              last_login_at: row.LastLoginAt,
              type: row.Type,
            }
          }
        })
      }
      //
      const response_player_Configs_of_Audio_Info = await axios.get('/api/app/audio', {
        headers: {
          Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
        },
      })
      response_player_Configs_of_Audio_Info.data.forEach((row: any) => {
        const propertyName = row.ConfigKey
        const propertyValue = row.ConfigValue
        if (this.player_Configs_of_Audio_Info.value.hasOwnProperty(propertyName)) {
          this.player_Configs_of_Audio_Info.value[propertyName] = propertyValue
        }
      })
      //
      const response_player_Configs_of_UI = await axios.get('/api/app/ui', {
        headers: {
          Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
        },
      })
      response_player_Configs_of_UI.data.forEach((row: any) => {
        const propertyName = row.ConfigKey
        const propertyValue = row.ConfigValue
        if (this.player_Configs_of_UI.value.hasOwnProperty(propertyName)) {
          this.player_Configs_of_UI.value[propertyName] = propertyValue
        }
      })
      //
      const response_playlist_File_Configs = await axios.get('/api/app/playlist', {
        headers: {
          Authorization: `Bearer ${store_server_login_info.server_accessToken}`,
        },
      })
      this.playlist_File_Configs.value = response_playlist_File_Configs.data.map(
        (item) => item.ConfigKey
      )
    }
  }
}
