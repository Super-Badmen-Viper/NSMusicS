import {store_app_configs_info} from "@/store/app/store_app_configs_info";

export class Set_ALL_LocalData {
    public Set_ALL_LocalData_To_Delete() {
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');
        db.exec('BEGIN TRANSACTION');
        try {
            db.exec("DELETE FROM album");
            db.exec("DELETE FROM annotation");
            db.exec("DELETE FROM artist");
            db.exec("DELETE FROM media_file");
            db.exec("DELETE FROM playlist");
            db.exec("DELETE FROM playlist_tracks");
            db.exec('COMMIT');
        } catch (error) {
            db.exec('ROLLBACK');
            throw error;
        } finally {
            db.exec('PRAGMA foreign_keys = ON');
            db.close();
        }
    }
}