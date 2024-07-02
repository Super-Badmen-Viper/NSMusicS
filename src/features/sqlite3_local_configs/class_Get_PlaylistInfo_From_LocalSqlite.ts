import path from "path";
import moment from "moment";

export class Get_PlaylistInfo_From_LocalSqlite {
    public Get_Playlist() {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');
        const result = []
        const stmt_playlist = db.prepare(`SELECT * FROM playlist`);
        const rows = stmt_playlist.all();
        rows.forEach((row: Play_List) => {
            result.push(row)
        });
        db.close();
        return result
    }
    public Get_Playlist_Tracks(playlist_id: string) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');
        const stmt_playlist_tracks = db.prepare(`SELECT * FROM playlist_tracks WHERE playlist_id = ?`);
        const rows = stmt_playlist_tracks.all(playlist_id);
        const result: PlaylistTrack[] = [];
        rows.forEach((row: PlaylistTrack) => {
            result.push(row);
        });
        db.close();
        return result;
    }
    public Get_Playlist_Media_File_Id_of_list(list_of_media_file_id: string[]){
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');
        const placeholders = list_of_media_file_id.map(() => '?').join(',');
        const stmt = db.prepare(`SELECT * FROM media_file WHERE id IN (${placeholders})`);
        const rows = stmt.all(...list_of_media_file_id);
        const result:Media_File[] = []
        rows.forEach((row: Media_File, index: number) => {
            row.absoluteIndex = index;
            row.selected = false;
            row.duration_txt = this.formatTime(row.duration);
            if (row.path.indexOf('mp3') > 0)
                row.medium_image_url = row.path.replace('mp3', 'jpg');
            else if (row.path.indexOf('flac') > 0)
                row.medium_image_url = row.path.replace('flac', 'jpg');
            else
                row.medium_image_url = '../../../resources/img/error_album.jpg';
            result.push(row);
        });
        db.close();
        return result;
    }
    formatTime(currentTime: number): string {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;

        let formattedMinutes = String(minutes);
        let formattedSeconds = String(seconds);

        if(formattedMinutes.length == 1)
            formattedMinutes = '0' + formattedMinutes;
        formattedMinutes = formattedMinutes.replace('.','');
        formattedMinutes = formattedMinutes.substring(0, 2);

        formattedSeconds = formattedSeconds.substring(0,formattedSeconds.indexOf('.'));
        if(formattedSeconds.length == 1)
            formattedSeconds = '0' + formattedSeconds;
        formattedSeconds = formattedSeconds.substring(0, 2);

        return `${formattedMinutes}:${formattedSeconds}`;
    }
}