import { App_Configs } from '@/data/data_models/app_models/app_Configs/class_App_Configs'
import { Player_Configs_of_Audio_Info } from '@/data/data_models/app_models/app_Configs/class_Player_Configs_of_Audio_Info'
import { Player_Configs_of_UI } from '@/data/data_models/app_models/app_Configs/class_Player_Configs_of_UI'

export class Class_Set_System_Configs_Write {
  system_app_config(db: any, app_Configs: App_Configs) {
    /// system_app_config
    db.exec('DELETE FROM system_app_config')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_app_config'")
    const appConfigStmt = db.prepare(
      `INSERT INTO system_app_config (config_key, config_value) VALUES (?, ?)`
    )
    Object.entries(app_Configs).forEach(([propertyName, value]) => {
      appConfigStmt.run(propertyName, value)
    })
  }

  system_library_config(db: any, local_Configs: Local_Configs_Props[]) {
    /// system_library_config
    db.exec('DELETE FROM system_library_config')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_library_config'")
    const local_library_config = db.prepare(`
            INSERT INTO system_library_config
                (id,config_key,config_value)
            VALUES (?, ?, ?)
        `)
    local_Configs.forEach((local_Configs_Props) => {
      local_library_config.run(
        local_Configs_Props.id,
        local_Configs_Props.config_key,
        local_Configs_Props.config_value
      )
    })
  }
  system_servers_config(db: any, server_Configs: Server_Configs_Props[]) {
    /// system_servers_config
    db.exec('DELETE FROM system_servers_config')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_servers_config'")
    const server_ConfigsStmt = db.prepare(`
            INSERT INTO system_servers_config 
            (id,server_name,url,user_name,password,last_login_at,type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
    server_Configs.forEach((server_Configs_Props) => {
      server_ConfigsStmt.run(
        server_Configs_Props.id,
        server_Configs_Props.server_name,
        server_Configs_Props.url,
        server_Configs_Props.user_name,
        server_Configs_Props.password,
        server_Configs_Props.last_login_at,
        server_Configs_Props.type
      )
    })
  }

  system_player_config_of_ui(db: any, player_Configs_of_UI: Player_Configs_of_UI) {
    /// system_player_config_of_ui
    db.exec('DELETE FROM system_player_config_of_ui')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_player_config_of_ui'")
    const uiConfigStmt = db.prepare(
      `INSERT INTO system_player_config_of_ui (config_key, config_value) VALUES (?, ?)`
    )
    Object.entries(player_Configs_of_UI).forEach(([propertyName, value]) => {
      uiConfigStmt.run(propertyName, value)
    })
  }

  system_player_config_of_audio(
    db: any,
    player_Configs_of_Audio_Info: Player_Configs_of_Audio_Info
  ) {
    /// system_player_config_of_audio
    db.exec('DELETE FROM system_player_config_of_audio')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_player_config_of_audio'")
    const audioConfigStmt = db.prepare(
      `INSERT INTO system_player_config_of_audio (config_key, config_value) VALUES (?, ?)`
    )
    Object.entries(player_Configs_of_Audio_Info).forEach(([propertyName, value]) => {
      audioConfigStmt.run(propertyName, value)
    })
  }

  public system_playlist_item_id_config(db: any, media_file_id_of_list: string[]) {
    db.exec('DELETE FROM system_playlist_file_id')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_playlist_file_id'")

    let order_index = 1
    media_file_id_of_list.forEach((mediaFileId) => {
      db.prepare(
        `
            INSERT INTO system_playlist_file_id (media_file_id, order_index)
            VALUES (?, ?)
        `
      ).run(mediaFileId, order_index++)
    })
  }

  public system_playlist_item_config(
    db: any,
    media_file_of_list: Record<string, any>[] // 假设 media_file_of_list 是对象数组
  ) {
    db.exec('DELETE FROM server_media_file')

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
    const filteredData = media_file_of_list.map((item) => {
      return Object.keys(item)
        .filter((key) => !excludedFields.has(key))
        .reduce((obj: Record<string, any>, key) => {
          obj[key] = item[key]
          return obj
        }, {})
    })
    if (filteredData.length === 0) {
      return
    }
    const columns = Object.keys(filteredData[0]).join(', ')
    const placeholders = filteredData
      .map(() => `(${Array(Object.keys(filteredData[0]).length).fill('?').join(', ')})`)
      .join(', ')
    const values = filteredData.flatMap((item) =>
      Object.values(item).map((value) => {
        // 如果值是对象且有 id 字段，提取 id
        if (typeof value === 'object' && value !== null && 'id' in value) {
          return value.id
        }
        return String(value)
      })
    )
    const sql = `
            INSERT INTO server_media_file (${columns})
            VALUES ${placeholders}
        `
    try {
      const stmt = db.prepare(sql)
      stmt.run(...values) // 展开一维数组作为参数
    } catch (error) {
      console.error('Error inserting data:', error)
    }
  }

  system_view_history(
    db: any,
    view_Media_History_select_Configs: any,
    view_Media_History_Configs: Interface_View_Router_Date[],
    view_Album_History_select_Configs: any,
    view_Album_History_Configs: Interface_View_Router_Date[],
    view_Artist_History_select_Configs: any,
    view_Artist_History_Configs: Interface_View_Router_Date[]
  ) {
    /// view_Media_History_select_Configs
    db.exec('DELETE FROM system_view_media_select_history')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_media_select_history'")
    const viewHistoryConfigStmt_01 = db.prepare(`
            INSERT INTO system_view_media_select_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
    if (view_Media_History_select_Configs != null)
      viewHistoryConfigStmt_01.run(
        view_Media_History_select_Configs.id,
        view_Media_History_select_Configs.menu_select_active_key,
        view_Media_History_select_Configs.router_name,
        String(view_Media_History_select_Configs.router_select_model_media),
        String(view_Media_History_select_Configs.router_select_model_album),
        String(view_Media_History_select_Configs.router_select_model_artist),
        view_Media_History_select_Configs.page_lists_keyword,
        view_Media_History_select_Configs.stmt_string,
        view_Media_History_select_Configs.page_lists_selected,
        view_Media_History_select_Configs.columnKey,
        view_Media_History_select_Configs.order,
        view_Media_History_select_Configs.page_lists_scrollindex
      )
    //
    db.exec('DELETE FROM system_view_media_history')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_media_history'")
    const viewHistoryConfigStmt_1 = db.prepare(`
            INSERT INTO system_view_media_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
    view_Media_History_Configs.forEach((router_date) => {
      viewHistoryConfigStmt_1.run(
        router_date.id,
        router_date.menu_select_active_key,
        router_date.router_name,
        String(router_date.router_select_model_media),
        String(router_date.router_select_model_album),
        String(router_date.router_select_model_artist),
        router_date.page_lists_keyword,
        router_date.stmt_string,
        router_date.page_lists_selected,
        router_date.columnKey,
        router_date.order,
        router_date.page_lists_scrollindex
      )
    })
    /// system_view_album_history
    db.exec('DELETE FROM system_view_album_select_history')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_album_select_history'")
    const viewHistoryConfigStmt_02 = db.prepare(`
            INSERT INTO system_view_album_select_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
    if (view_Album_History_select_Configs != null)
      viewHistoryConfigStmt_02.run(
        view_Album_History_select_Configs.id,
        view_Album_History_select_Configs.menu_select_active_key,
        view_Album_History_select_Configs.router_name,
        String(view_Album_History_select_Configs.router_select_model_media),
        String(view_Album_History_select_Configs.router_select_model_album),
        String(view_Album_History_select_Configs.router_select_model_artist),
        view_Album_History_select_Configs.page_lists_keyword,
        view_Album_History_select_Configs.stmt_string,
        view_Album_History_select_Configs.page_lists_selected,
        view_Album_History_select_Configs.columnKey,
        view_Album_History_select_Configs.order,
        view_Album_History_select_Configs.page_lists_scrollindex
      )
    //
    db.exec('DELETE FROM system_view_album_history')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_album_history'")
    const viewHistoryConfigStmt_2 = db.prepare(`
            INSERT INTO system_view_album_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
    view_Album_History_Configs.forEach((router_date) => {
      viewHistoryConfigStmt_2.run(
        router_date.id,
        router_date.menu_select_active_key,
        router_date.router_name,
        String(router_date.router_select_model_media),
        String(router_date.router_select_model_album),
        String(router_date.router_select_model_artist),
        router_date.page_lists_keyword,
        router_date.stmt_string,
        router_date.page_lists_selected,
        router_date.columnKey,
        router_date.order,
        router_date.page_lists_scrollindex
      )
    })
    /// system_view_artist_history
    db.exec('DELETE FROM system_view_artist_select_history')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_artist_select_history'")
    const viewHistoryConfigStmt_03 = db.prepare(`
            INSERT INTO system_view_artist_select_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
    if (view_Artist_History_select_Configs != null)
      viewHistoryConfigStmt_03.run(
        view_Artist_History_select_Configs.id,
        view_Artist_History_select_Configs.menu_select_active_key,
        view_Artist_History_select_Configs.router_name,
        String(view_Artist_History_select_Configs.router_select_model_media),
        String(view_Artist_History_select_Configs.router_select_model_album),
        String(view_Artist_History_select_Configs.router_select_model_artist),
        view_Artist_History_select_Configs.page_lists_keyword,
        view_Artist_History_select_Configs.stmt_string,
        view_Artist_History_select_Configs.page_lists_selected,
        view_Artist_History_select_Configs.columnKey,
        view_Artist_History_select_Configs.order,
        view_Artist_History_select_Configs.page_lists_scrollindex
      )
    //
    db.exec('DELETE FROM system_view_artist_history')
    db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_view_artist_history'")
    const viewHistoryConfigStmt_3 = db.prepare(`
            INSERT INTO system_view_artist_history 
            (id, menu_select_active_key, router_name, router_select_model_media, router_select_model_album, router_select_model_artist, 
            page_lists_keyword, 
            stmt_string, page_lists_selected, columnKey, _order_, page_lists_scrollindex) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `)
    view_Artist_History_Configs.forEach((router_date) => {
      viewHistoryConfigStmt_3.run(
        router_date.id,
        router_date.menu_select_active_key,
        router_date.router_name,
        String(router_date.router_select_model_media),
        String(router_date.router_select_model_album),
        String(router_date.router_select_model_artist),
        router_date.page_lists_keyword,
        router_date.stmt_string,
        router_date.page_lists_selected,
        router_date.columnKey,
        router_date.order,
        router_date.page_lists_scrollindex
      )
    })
  }
}
