import { App_Configs } from '@/models/app_Configs_For_Sqlite/class_App_Configs';
import { Player_Configs_of_Audio_Info } from '@/models/app_Configs_For_Sqlite/class_Player_Configs_of_Audio_Info';
import { Player_Configs_of_UI } from '@/models/app_Configs_For_Sqlite/class_Player_Configs_of_UI';
import { ref, type Ref } from 'vue'
import path from "path";

export class System_Configs_Write {
    constructor(
        app_Configs: App_Configs,
        player_Configs_of_UI: Player_Configs_of_UI,
        player_Configs_of_Audio_Info: Player_Configs_of_Audio_Info,
        playlist_File_Configs: Media_File[]
    ) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/nsmusics.db'));
        db.pragma('journal_mode = WAL');

        /// system_app_config
        db.exec("DELETE FROM system_app_config");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_app_config'");
        const appConfigStmt = db.prepare(`INSERT INTO system_app_config (config_key, config_value) VALUES (?, ?)`);
        Object.entries(app_Configs).forEach(([propertyName, value]) => {
            appConfigStmt.run(propertyName, value);
        });

        /// system_player_config_of_ui
        db.exec("DELETE FROM system_player_config_of_ui");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_player_config_of_ui'");
        const uiConfigStmt = db.prepare(`INSERT INTO system_player_config_of_ui (config_key, config_value) VALUES (?, ?)`);
        Object.entries(player_Configs_of_UI).forEach(([propertyName, value]) => {
            uiConfigStmt.run(propertyName, value);
        });

        /// system_player_config_of_audio
        db.exec("DELETE FROM system_player_config_of_audio");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_player_config_of_audio'");
        const audioConfigStmt = db.prepare(`INSERT INTO system_player_config_of_audio (config_key, config_value) VALUES (?, ?)`);
        Object.entries(player_Configs_of_Audio_Info).forEach(([propertyName, value]) => {
            audioConfigStmt.run(propertyName, value);
        });

        /// system_player_config_of_audio
        db.exec("DELETE FROM system_playlist_file_config");
        db.exec("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'system_playlist_file_config'");
        const playlistConfigStmt = db.prepare(`
            INSERT INTO system_playlist_file_config 
            (id,path,title,album,artist,artist_id,album_artist,album_id,has_cover_art,track_number,disc_number,year,size,suffix,duration,bit_rate,genre,compilation,
            created_at,
            updated_at,
            full_text,
            album_artist_id,
            order_album_name,
            order_album_artist_name,
            order_artist_name,
            sort_album_name,
            sort_artist_name,
            sort_album_artist_name,
            sort_title,
            disc_subtitle,
            mbz_track_id,
            mbz_album_id,
            mbz_artist_id,mbz_album_artist_id,mbz_album_type,mbz_album_comment,
            catalog_num,
            comment,
            lyrics,
            bpm,
            channels,
            order_title,
            mbz_release_track_id,
            rg_album_gain,
            rg_album_peak,
            rg_track_gain,
            rg_track_peak)
            VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?) 
        `);
        playlist_File_Configs.forEach((mediaFile) => {
            playlistConfigStmt.run(
                mediaFile.id,
                mediaFile.path,
                mediaFile.title,
                mediaFile.album,
                mediaFile.artist,
                mediaFile.artist_id,
                mediaFile.album_artist,
                mediaFile.album_id,
                mediaFile.has_cover_art,
                mediaFile.track_number,
                mediaFile.disc_number,
                mediaFile.year,
                mediaFile.size,
                mediaFile.suffix,
                mediaFile.duration,
                mediaFile.bit_rate,
                mediaFile.genre,
                mediaFile.compilation,
                mediaFile.created_at,
                mediaFile.updated_at,
                mediaFile.full_text,
                mediaFile.album_artist_id,
                mediaFile.order_album_name,
                mediaFile.order_album_artist_name,
                mediaFile.order_artist_name,
                mediaFile.sort_album_name,
                mediaFile.sort_artist_name,
                mediaFile.sort_album_artist_name,
                mediaFile.sort_title,
                mediaFile.disc_subtitle,
                mediaFile.mbz_track_id,
                mediaFile.mbz_album_id,
                mediaFile.mbz_artist_id,
                mediaFile.mbz_album_artist_id,
                mediaFile.mbz_album_type,
                mediaFile.mbz_album_comment,
                mediaFile.catalog_num,
                mediaFile.comment,
                mediaFile.lyrics,
                mediaFile.bpm,
                mediaFile.channels,
                mediaFile.order_title,
                mediaFile.mbz_release_track_id,
                mediaFile.rg_album_gain,
                mediaFile.rg_album_peak,
                mediaFile.rg_track_gain,
                mediaFile.rg_track_peak,
            );
        });
    
        db.close();
    }
}