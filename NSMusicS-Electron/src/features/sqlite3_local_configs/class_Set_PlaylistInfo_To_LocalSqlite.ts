import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
export class Set_PlaylistInfo_To_LocalSqlite {
    private getUniqueId(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM ${store_server_user_model.playlist} WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4();
        }
        return id;
    }
    private getUniqueId_Replace(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4().replace(/-/g, '');
        while (db.prepare(`SELECT COUNT(*) FROM ${store_server_user_model.playlist} WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4().replace(/-/g, '');
        }
        return id;
    }
    private getCurrentDateTime() {
        return new Date().toLocaleString(
            'zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }
        ).replace(/\//g, '-');
    }
    public Set_PlaylistInfo_To_Update_CreatePlaylist_of_ND(name: string,comment: string, duration: number,song_count: number, _public_: number,owner_id: string) {
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        ///
        let new_id = this.getUniqueId(db);
        let new_date = this.getCurrentDateTime();
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');

        // comment, duration, song_count, public,path, sync, size, rules, evaluated_at, owner_id
        db.prepare(`
          INSERT INTO ${store_server_user_model.playlist} (id, name, created_at, updated_at) 
          VALUES (?, ?, ?, ?)
        `).run(new_id, name, new_date, new_date);
        ///
        db.close();
        ///
        const data = {
            label: name,
            value: new_id,

            id: new_id,
            name: name,
            comment: comment,
            duration: duration,
            song_count: song_count,
            public: 0,
            created_at: new_date,
            updated_at: new_date,
            path: '',
            sync: 0,
            size: 0,
            rules: null,
            evaluated_at: '',
            owner_id: owner_id,
        };
        return data;
    }
    public Set_PlaylistInfo_To_Update_SetPlaylist_of_ND(id: string, name: string,comment: string, duration: number,song_count: number, _public_: number,owner_id: string) {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        ///
        let new_id = this.getUniqueId(db);
        let new_date = this.getCurrentDateTime();
        const existingRecord = db.prepare(`SELECT * FROM ${store_server_user_model.playlist} WHERE id = ?`).get(id);
        if (!existingRecord) {
            db.prepare(`
                INSERT INTO ${store_server_user_model.playlist} (id, name, comment, duration, song_count, public, created_at, updated_at, path, sync, size, rules, evaluated_at, owner_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
                .run(new_id, name, comment, duration, song_count, 0, new_date, new_date, '', false, 0, null, null, owner_id);
        } else {
            // , comment = ? , duration = ? , song_count = ? , public = ? ,
            db.prepare(`
                UPDATE ${store_server_user_model.playlist} 
                SET name = ?, updated_at = ?
                WHERE id = ?`)
                .run(name, new_date, id);
        }
        ///
        db.close();
        ///
        const data = {
            id: id,
            name: name,
            comment: comment,
            duration: duration,
            song_count: song_count,
            public: 0,
            created_at: new_date,
            updated_at: new_date,
            path: '',
            sync: 0,
            size: 0,
            rules: null,
            evaluated_at: '',
            owner_id: owner_id,
        };
        return data;
    }
    public Set_PlaylistInfo_To_Update_DeletePlaylist_of_ND(id:string) {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        ///
        const existingRecord = db.prepare(`SELECT * FROM ${store_server_user_model.playlist} WHERE id = ?`).get(id);
        if (existingRecord) {
            db.prepare(`DELETE FROM ${store_server_user_model.playlist} WHERE id = ?`).run(id);
            db.prepare(`DELETE FROM ${store_server_user_model.playlist_tracks} WHERE playlist_id = ?`).run(id);
        }
        ///
        db.close();
    }

    public Set_Selected_MediaInfo_Add_Selected_Playlist(ids: string[], playlist_id: string) {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const existingRecord = db.prepare(`SELECT * FROM ${store_server_user_model.playlist} WHERE id = ?`).get(playlist_id);
        if (existingRecord) {
            const existingTrackIds = db.prepare(`
                SELECT media_file_id 
                FROM ${store_server_user_model.playlist_tracks} 
                WHERE playlist_id = ?
            `).all(playlist_id).map((row:Play_list_Track) => row.media_file_id);
            const insertStmt = db.prepare(`
                INSERT INTO ${store_server_user_model.playlist_tracks} (id, playlist_id, media_file_id) 
                VALUES (?, ?, ?)
            `);
            const insertTransaction = db.transaction(() => {
                for (const id of ids) {
                    if (!existingTrackIds.includes(id)) {
                        insertStmt.run(this.getUniqueId(db), playlist_id, id);
                    }
                }
            });
            insertTransaction();
        }

        db.close();
    }
    public Set_Selected_MediaInfo_Delete_Selected_Playlist(ids: string[], playlist_id: string) {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const existingRecord = db.prepare(`SELECT * FROM ${store_server_user_model.playlist} WHERE id = ?`).get(playlist_id);
            if (existingRecord) {
                const deleteStmt = db.prepare(`
                    DELETE FROM ${store_server_user_model.playlist_tracks} 
                    WHERE playlist_id = ? AND media_file_id = ?
                `);
            const deleteTransaction = db.transaction(() => {
                for (const id of ids) {
                    deleteStmt.run(playlist_id, id);
                }
            });
            deleteTransaction();
        }

        db.close();
    }
}