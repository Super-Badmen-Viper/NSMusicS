import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
export class Set_LibraryInfo_To_LocalSqlite{
    public Set_LibraryInfo_Delete_Selected_Playlist(media_file_id: any[]) {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');

        try {
            db.exec('BEGIN TRANSACTION');

            const deleteMediaStmt = db.prepare(`DELETE FROM ${store_server_user_model.media_file} WHERE id = ?`);
            const updateAlbumSongCountStmt = db.prepare(`UPDATE ${store_server_user_model.album} SET song_count = song_count - 1 WHERE id = (SELECT album_id FROM ${store_server_user_model.media_file} WHERE id = ?)`);
            const updateArtistSongCountStmt = db.prepare(`UPDATE ${store_server_user_model.artist} SET song_count = song_count - 1 WHERE id = (SELECT artist_id FROM ${store_server_user_model.media_file} WHERE id = ?)`);
            const checkAndDeleteAlbumStmt = db.prepare(`SELECT song_count FROM ${store_server_user_model.album} WHERE id = ?`);
            const deleteAlbumStmt = db.prepare(`DELETE FROM ${store_server_user_model.album} WHERE id = ?`);
            const updateArtistAlbumCountStmt = db.prepare(`UPDATE ${store_server_user_model.artist} SET album_count = album_count - 1 WHERE id = (SELECT artist_id FROM ${store_server_user_model.album} WHERE id = ?)`);
            const checkAndDeleteArtistStmt_album_count = db.prepare(`SELECT album_count FROM ${store_server_user_model.artist} WHERE id = ?`);
            const checkAndDeleteArtistStmt_song_count = db.prepare(`SELECT song_count FROM ${store_server_user_model.artist} WHERE id = ?`);
            const deleteArtistStmt = db.prepare(`DELETE FROM ${store_server_user_model.artist} WHERE id = ?`);
            const deleteAnnotationStmt = db.prepare(`DELETE FROM ${store_server_user_model.annotation} WHERE item_id = ?`);
            const deletePlaylistTracksStmt = db.prepare(`DELETE FROM ${store_server_user_model.playlist_tracks} WHERE media_file_id = ?`);

            media_file_id.forEach(id => {
                const mediaInfo = db.prepare(`SELECT album_id, artist_id FROM ${store_server_user_model.media_file} WHERE id = ?`).get(id);
                const album_id = mediaInfo.album_id;
                const artist_id = mediaInfo.artist_id;

                deleteAnnotationStmt.run(id);
                deletePlaylistTracksStmt.run(id);
                updateAlbumSongCountStmt.run(id);
                updateArtistSongCountStmt.run(id);

                deleteMediaStmt.run(id);
                const albumSongCount = checkAndDeleteAlbumStmt.get(album_id).song_count;
                if (albumSongCount === 0) {
                    deleteAlbumStmt.run(album_id);
                    updateArtistAlbumCountStmt.run(album_id);
                }
                const artistAlbumCount = checkAndDeleteArtistStmt_album_count.get(artist_id).album_count;
                const artistSongCount = checkAndDeleteArtistStmt_song_count.get(artist_id).song_count;
                if (artistAlbumCount === 0 || artistSongCount === 0) {
                    deleteArtistStmt.run(artist_id);
                }
            });
            db.exec('COMMIT');
        } catch (error) {
            db.exec('ROLLBACK');
            console.error('Error deleting media files:', error);
            throw error; // 重新抛出错误，确保错误不会被忽略
        } finally {
            db.close();
        }
    }
}