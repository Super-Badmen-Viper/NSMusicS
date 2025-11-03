import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { store_system_configs_info } from '@/data/data_stores/local_system_stores/store_system_configs_info'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'

export class Set_LocalSqlite_LibraryInfo {
  public Set_LibraryInfo_Update_Folder(id: string, local_name: string, local_url: string): boolean {
    if (isElectron) {
      const db = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
      db.pragma('journal_mode = WAL')
      db.exec('PRAGMA foreign_keys = OFF')
      db.exec('BEGIN TRANSACTION')
      try {
        const checkQuery = db.prepare(`SELECT id FROM system_library_config WHERE id = ?`)
        const existingRecord = checkQuery.get(id)
        if (existingRecord) {
          const updateQuery = db.prepare(`
                        UPDATE system_library_config
                        SET config_key = ?, config_value = ?
                        WHERE id = ?
                    `)
          updateQuery.run(local_name, local_url, id)
        } else {
          const insertQuery = db.prepare(`
                        INSERT INTO system_library_config (config_key, config_value)
                        VALUES (?, ?)
                    `)
          insertQuery.run(local_name, local_url)
        }
        db.exec('COMMIT')
        return true
      } catch (error) {
        db.exec('ROLLBACK')
        throw error
      } finally {
        db.exec('PRAGMA foreign_keys = ON')
        db.close()
      }
    } else {
      // other
    }
    return false
  }
  public Set_LibraryInfo_Delete_Folder(id: string): boolean {
    if (isElectron) {
      const db_nsmusics = require('better-sqlite3')(store_system_configs_info.nsmusics_db)
      db_nsmusics.pragma('journal_mode = WAL')
      db_nsmusics.exec('PRAGMA foreign_keys = OFF')
      db_nsmusics.exec('BEGIN TRANSACTION')
      try {
        // 从 system_library_config 表中获取与 id 对应的 config_value
        const configQuery = db_nsmusics.prepare(
          'SELECT config_value FROM system_library_config WHERE id = ?'
        )
        const configResult = configQuery.get(id) // 假设 id 是已知的
        const rootPath = configResult ? configResult.config_value : null
        if (!rootPath) {
          throw new Error('未找到与 id 对应的 config_value，无法确定根目录路径')
        }
        // 删除 system_library_config 表中与 id 对应的记录
        const deleteQuery = db_nsmusics.prepare('DELETE FROM system_library_config WHERE id = ?')
        deleteQuery.run(id)
        db_nsmusics.exec('COMMIT')

        // 接下来处理 navidrome 数据库的删除逻辑
        const db_navidrome = require('better-sqlite3')(store_system_configs_info.navidrome_db)
        db_navidrome.pragma('journal_mode = WAL')
        db_navidrome.exec('PRAGMA foreign_keys = OFF')
        db_navidrome.exec('BEGIN TRANSACTION')
        try {
          // 1. 根据根目录路径，找出要删除的 media_file 表对应的所有 id
          const mediaFileIdsToDelete = db_navidrome
            .prepare('SELECT id FROM media_file WHERE path LIKE ?')
            .all(`%${rootPath}%`) // 使用 % 前后包裹，实现相似匹配
            .map((row: any) => row.id)
          // 2. 用这些 id 数组，先删除 playlist_tracks 表中对应相同 media_file_id 的记录
          if (mediaFileIdsToDelete.length > 0) {
            const deletePlaylistTracks = db_navidrome.prepare(
              'DELETE FROM playlist_tracks WHERE media_file_id = ?'
            )
            mediaFileIdsToDelete.forEach((id: any) => deletePlaylistTracks.run(id))
          }
          // 3. 用这些 id 数组，删除 annotation 表中对应相同 item_id 的记录
          if (mediaFileIdsToDelete.length > 0) {
            const deleteAnnotations = db_navidrome.prepare(
              'DELETE FROM annotation WHERE item_id = ?'
            )
            mediaFileIdsToDelete.forEach((id: any) => deleteAnnotations.run(id))
          }
          // 4. 根据根目录路径，找出要删除的 media_file 表对应的所有 artist_id
          const artistIdsToDelete = db_navidrome
            .prepare(
              'SELECT DISTINCT artist_id FROM media_file WHERE id IN (' +
                mediaFileIdsToDelete.map(() => '?').join(',') +
                ')'
            )
            .all(...mediaFileIdsToDelete)
            .map((row: any) => row.artist_id)
          // 5. 判断 media_file 表中要删除的 media_file 表中对应的所有 id 除外的数据中，是否有相同的 artist_id，如果没有，删除 artist 表中与 media_file:artist_id 对应的 artist:id 的项
          if (artistIdsToDelete.length > 0) {
            const deleteArtists = db_navidrome.prepare(
              'DELETE FROM artist WHERE id = ? AND NOT EXISTS (SELECT 1 FROM media_file WHERE artist_id = ? AND id NOT IN (' +
                mediaFileIdsToDelete.map(() => '?').join(',') +
                '))'
            )
            artistIdsToDelete.forEach((id: any) =>
              deleteArtists.run(id, id, ...mediaFileIdsToDelete)
            )
          }
          // 6. 判断 media_file 表中要删除的 media_file 表中对应的所有 id 除外的数据中，是否有相同的 album_id，如果没有，删除 album 表中与 media_file:album_id 对应的 album:id 的项
          const albumIdsToDelete = db_navidrome
            .prepare(
              'SELECT DISTINCT album_id FROM media_file WHERE id IN (' +
                mediaFileIdsToDelete.map(() => '?').join(',') +
                ')'
            )
            .all(...mediaFileIdsToDelete)
            .map((row: any) => row.album_id)
          if (albumIdsToDelete.length > 0) {
            const deleteAlbums = db_navidrome.prepare(
              'DELETE FROM album WHERE id = ? AND NOT EXISTS (SELECT 1 FROM media_file WHERE album_id = ? AND id NOT IN (' +
                mediaFileIdsToDelete.map(() => '?').join(',') +
                '))'
            )
            albumIdsToDelete.forEach((id: any) => deleteAlbums.run(id, id, ...mediaFileIdsToDelete))
          }
          // 7. 用这些 id 数组，删除 media_file 表中对应 id 的记录
          if (mediaFileIdsToDelete.length > 0) {
            const deleteMediaFiles = db_navidrome.prepare('DELETE FROM media_file WHERE id = ?')
            mediaFileIdsToDelete.forEach((id: any) => deleteMediaFiles.run(id))
          }
          db_navidrome.exec('COMMIT')
        } catch (error) {
          db_navidrome.exec('ROLLBACK')
          throw error
        } finally {
          db_navidrome.exec('PRAGMA foreign_keys = ON')
          db_navidrome.close()
        }

        return true
      } catch (error) {
        db_nsmusics.exec('ROLLBACK')
        throw error
      } finally {
        db_nsmusics.exec('PRAGMA foreign_keys = ON')
        db_nsmusics.close()
      }
    } else {
      // other
    }
    return false
  }
  public Set_LibraryInfo_Delete_Selected_Playlist(media_file_id: any[]) {
    if (isElectron) {
      const db = require('better-sqlite3')(store_system_configs_info.navidrome_db)
      db.pragma('journal_mode = WAL')
      db.exec('PRAGMA foreign_keys = OFF')

      try {
        db.exec('BEGIN TRANSACTION')

        const deleteMediaStmt = db.prepare(`DELETE
                                                    FROM ${store_server_user_model.media_file}
                                                    WHERE id = ?`)
        const updateAlbumMediaCountStmt = db.prepare(`UPDATE ${store_server_user_model.album}
                                                             SET song_count = song_count - 1
                                                             WHERE id = (SELECT album_id FROM ${store_server_user_model.media_file} WHERE id = ?)`)
        const updateArtistMediaCountStmt = db.prepare(`UPDATE ${store_server_user_model.artist}
                                                              SET song_count = song_count - 1
                                                              WHERE id = (SELECT artist_id FROM ${store_server_user_model.media_file} WHERE id = ?)`)
        const checkAndDeleteAlbumStmt = db.prepare(`SELECT song_count
                                                            FROM ${store_server_user_model.album}
                                                            WHERE id = ?`)
        const deleteAlbumStmt = db.prepare(`DELETE
                                                    FROM ${store_server_user_model.album}
                                                    WHERE id = ?`)
        const updateArtistAlbumCountStmt = db.prepare(`UPDATE ${store_server_user_model.artist}
                                                               SET album_count = album_count - 1
                                                               WHERE id = (SELECT artist_id FROM ${store_server_user_model.album} WHERE id = ?)`)
        const checkAndDeleteArtistStmt_album_count = db.prepare(`SELECT album_count
                                                                         FROM ${store_server_user_model.artist}
                                                                         WHERE id = ?`)
        const checkAndDeleteArtistStmt_song_count = db.prepare(`SELECT song_count
                                                                        FROM ${store_server_user_model.artist}
                                                                        WHERE id = ?`)
        const deleteArtistStmt = db.prepare(`DELETE
                                                     FROM ${store_server_user_model.artist}
                                                     WHERE id = ?`)
        const deleteAnnotationStmt = db.prepare(`DELETE
                                                         FROM ${store_server_user_model.annotation}
                                                         WHERE item_id = ?`)
        const deletePlaylistTracksStmt = db.prepare(`DELETE
                                                             FROM ${store_server_user_model.playlist_tracks}
                                                             WHERE media_file_id = ?`)

        media_file_id.forEach((id) => {
          const mediaInfo = db
            .prepare(
              `SELECT album_id, artist_id
                                                  FROM ${store_server_user_model.media_file}
                                                  WHERE id = ?`
            )
            .get(id)
          const album_id = mediaInfo.album_id
          const artist_id = mediaInfo.artist_id

          deleteAnnotationStmt.run(id)
          deletePlaylistTracksStmt.run(id)
          updateAlbumMediaCountStmt.run(id)
          updateArtistMediaCountStmt.run(id)

          deleteMediaStmt.run(id)
          const albumMediaCount = checkAndDeleteAlbumStmt.get(album_id).song_count
          if (albumMediaCount === 0) {
            deleteAlbumStmt.run(album_id)
            updateArtistAlbumCountStmt.run(album_id)
          }
          const artistAlbumCount = checkAndDeleteArtistStmt_album_count.get(artist_id).album_count
          const artistMediaCount = checkAndDeleteArtistStmt_song_count.get(artist_id).song_count
          if (artistAlbumCount === 0 || artistMediaCount === 0) {
            deleteArtistStmt.run(artist_id)
          }
        })
        db.exec('COMMIT')
      } catch (error) {
        db.exec('ROLLBACK')
        console.error('Error deleting media files:', error)
        throw error // 重新抛出错误，确保错误不会被忽略
      } finally {
        db.close()
      }
    } else {
      // other
    }
  }
}
