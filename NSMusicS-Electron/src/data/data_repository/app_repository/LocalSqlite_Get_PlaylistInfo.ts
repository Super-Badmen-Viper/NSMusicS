import { store_server_user_model } from '@/data/data_stores/server_configs_stores/store_server_user_model'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import error_album from '@/assets/img/error_album.jpg'
import { isElectron } from '@/utils/electron/isElectron'
import { store_view_media_page_info } from '@/views/view_app/page/page_media/store/store_view_media_page_info'

export class Get_LocalSqlite_PlaylistInfo {
  public Get_Playlist_Count(): number {
    if (isElectron) {
      let db
      try {
        db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
        db.pragma('journal_mode = WAL')
        db.pragma('foreign_keys = OFF')
        const stmt_playlist = db.prepare(
          `SELECT COUNT(*) AS count FROM ${store_server_user_model.playlist}`
        )
        const result = stmt_playlist.get()
        return result?.count || 0
      } catch (error) {
        console.error('获取歌单数量时出错:', error)
        return 0
      } finally {
        db.close()
      }
    } else {
      // other
    }
    return 0
  }
  public Get_Playlist() {
    if (isElectron) {
      const db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
      db.pragma('journal_mode = WAL')
      db.exec('PRAGMA foreign_keys = OFF')

      const result: any[] = []
      const stmt_playlist = db.prepare(`SELECT *
                                              FROM ${store_server_user_model.playlist}`)
      const rows = stmt_playlist.all()
      rows.forEach((row: Play_List) => {
        result.push(row)
      })
      db.close()
      return result
    } else {
      // other
    }
    return undefined
  }
  public Get_Playlist_Tracks(playlist_id: string) {
    if (isElectron) {
      const db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
      db.pragma('journal_mode = WAL')
      db.exec('PRAGMA foreign_keys = OFF')

      const stmt_playlist_tracks = db.prepare(`SELECT *
                                                     FROM ${store_server_user_model.playlist_tracks}
                                                     WHERE playlist_id = ?`)
      const rows = stmt_playlist_tracks.all(playlist_id)
      const result: Play_list_Track[] = []
      rows.forEach((row: Play_list_Track) => {
        result.push(row)
      })
      db.close()
      return result
    } else {
      // other
    }
    return undefined
  }
  public Get_Playlist_Media_File_Id_of_list(list_of_media_file_id: string[]) {
    if (isElectron) {
      const db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
      db.pragma('journal_mode = WAL')
      db.exec('PRAGMA foreign_keys = OFF')

      db.exec(`ATTACH DATABASE '${store_system_configs_info.nsmusics_db}' AS nsmusics`)
      const placeholders = list_of_media_file_id.map(() => '?').join(',')
      const stmt = db.prepare(`
                SELECT mf.*
                FROM ${store_server_user_model.media_file} mf
                         JOIN nsmusics.system_playlist_file_id spfic ON mf.id = spfic.media_file_id
                WHERE mf.id IN (${placeholders})
                ORDER BY spfic.order_index
            `)
      const rows = stmt.all(...list_of_media_file_id)
      const result: Media_File[] = []
      rows.forEach((row: any, index: number) => {
        row.absoluteIndex = index
        row.selected = false
        row.duration_txt = this.formatTime(row.duration)
        if (row.medium_image_url == null || row.medium_image_url.length == 0) {
          if (row.path) {
            const fileName = row.path.split(/[\\/]/).pop() // 兼容 Windows 和 Unix 路径分隔符
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
        row.play_id = row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
        result.push(row)
      })
      //
      const stmt_media_Annotation_Starred_Items = db.prepare(`
                SELECT item_id
                FROM ${store_server_user_model.annotation}
                WHERE starred = 1
                  AND item_type = 'media_file'
            `)
      const annotations = stmt_media_Annotation_Starred_Items.all()
      for (let i = 0; i < result.length; i++) {
        result[i].favorite = !!annotations.some(
          (annotation: { item_id: string }) => annotation.item_id === result[i].id
        )
      }
      const stmt_media_Annotation_Rating_Items = db.prepare(`
                            SELECT item_id, rating
                            FROM ${store_server_user_model.annotation}
                            WHERE rating > 0
                              AND item_type = 'media_file'
                        `)
      const annotations_rating = stmt_media_Annotation_Rating_Items.all()
      for (let i = 0; i < result.length; i++) {
        const mediaFile = result[i]
        const matchingAnnotation = annotations_rating.find(
          (annotation: { item_id: string; rating: number }) => annotation.item_id === mediaFile.id
        )
        if (matchingAnnotation) mediaFile.rating = matchingAnnotation.rating
        else mediaFile.rating = 0
      }
      //
      //
      db.close()
      return result
    } else {
      // other
    }
    return undefined
  }
  public Get_Playlist_Media_File_of_list() {
    if (isElectron) {
      const db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
      db.pragma('journal_mode = WAL')
      db.exec('PRAGMA foreign_keys = OFF')

      const stmt = db.prepare(`SELECT *FROM ${store_server_user_model.media_file}`)
      const rows = stmt.all()
      const result: Media_File[] = []
      rows.forEach((row: any, index: number) => {
        row.absoluteIndex = index
        row.selected = false
        row.duration_txt = this.formatTime(row.duration)
        if (row.medium_image_url == null || row.medium_image_url.length == 0) {
          if (row.path) {
            const fileName = row.path.split(/[\\/]/).pop() // 兼容 Windows 和 Unix 路径分隔符
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
        row.play_id = row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
        result.push(row)
      })
      //
      const stmt_media_Annotation_Starred_Items = db.prepare(`
                SELECT item_id
                FROM ${store_server_user_model.annotation}
                WHERE starred = 1
                  AND item_type = 'media_file'
            `)
      const annotations = stmt_media_Annotation_Starred_Items.all()
      for (let i = 0; i < result.length; i++) {
        result[i].favorite = !!annotations.some(
          (annotation: { item_id: string }) => annotation.item_id === result[i].id
        )
      }
      //
      const stmt_media_Annotation_Rating_Items = db.prepare(`
                            SELECT item_id, rating
                            FROM ${store_server_user_model.annotation}
                            WHERE rating > 0
                              AND item_type = 'media_file'
                        `)
      const annotations_rating = stmt_media_Annotation_Rating_Items.all()
      for (let i = 0; i < result.length; i++) {
        const mediaFile = result[i]
        const matchingAnnotation = annotations_rating.find(
          (annotation: { item_id: string; rating: number }) => annotation.item_id === mediaFile.id
        )
        if (matchingAnnotation) mediaFile.rating = matchingAnnotation.rating
        else mediaFile.rating = 0
      }
      //
      db.close()
      return result
    } else {
      // Golang
    }
    return []
  }

  formatTime(currentTime: number): string {
    const minutes = Math.floor(currentTime / 60)
    const seconds = Math.floor(currentTime % 60)

    let formattedMinutes = String(minutes)
    let formattedSeconds = String(seconds)

    if (formattedMinutes.length == 1) formattedMinutes = '0' + formattedMinutes

    if (formattedSeconds.length == 1) formattedSeconds = '0' + formattedSeconds

    return `${formattedMinutes}:${formattedSeconds}`
  }
}
