import { store_server_user_model } from '@/store/server/store_server_user_model'
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
export class Get_PlaylistInfo_From_LocalSqlite {
    public Get_Playlist() {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const result: any[] = []
        const stmt_playlist = db.prepare(`SELECT * FROM ${store_server_user_model.playlist}`);
        const rows = stmt_playlist.all();
        rows.forEach((row: Play_List) => {
            result.push(row)
        });
        db.close();
        return result
    }
    public Get_Playlist_Tracks(playlist_id: string) {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const stmt_playlist_tracks = db.prepare(`SELECT * FROM ${store_server_user_model.playlist_tracks} WHERE playlist_id = ?`);
        const rows = stmt_playlist_tracks.all(playlist_id);
        const result: Play_list_Track[] = [];
        rows.forEach((row: Play_list_Track) => {
            result.push(row);
        });
        db.close();
        return result;
    }
    public Get_Playlist_Media_File_Id_of_list(list_of_media_file_id: string[]){
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');

        db.exec(`ATTACH DATABASE '${store_app_configs_info.nsmusics_db}' AS nsmusics`);
        const placeholders = list_of_media_file_id.map(() => '?').join(',');
        const stmt = db.prepare(`
            SELECT mf.*
            FROM ${store_server_user_model.media_file} mf
            JOIN nsmusics.system_playlist_file_id spfic ON mf.id = spfic.media_file_id
            WHERE mf.id IN (${placeholders})
            ORDER BY spfic.order_index
        `);
        const rows = stmt.all(...list_of_media_file_id);
        const result: Media_File[] = [];
        rows.forEach((row: any, index: number) => {
            row.absoluteIndex = index;
            row.selected = false;
            row.duration_txt = this.formatTime(row.duration);
            if (row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
                if (row.path.indexOf('mp3') > 0)
                    row.medium_image_url = row.path.replace('mp3', 'jpg');
                else if (row.path.indexOf('flac') > 0)
                    row.medium_image_url = row.path.replace('flac', 'jpg');
                else
                    row.medium_image_url = '../../../resources/img/error_album.jpg';
            }
            row.play_id = row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000;
            result.push(row);
        });
        db.close();
        return result;
    }
    formatTime(currentTime: number): string {
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);

        let formattedMinutes = String(minutes);
        let formattedSeconds = String(seconds);

        if (formattedMinutes.length == 1)
            formattedMinutes = '0' + formattedMinutes;

        if (formattedSeconds.length == 1)
            formattedSeconds = '0' + formattedSeconds;

        return `${formattedMinutes}:${formattedSeconds}`;
    }
}