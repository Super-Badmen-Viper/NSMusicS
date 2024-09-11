import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
export class Set_AnnotationInfo_To_LocalSqlite {
    private getUniqueId(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM ${store_server_user_model.playlist_tracks} WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4();
        }
        return id;
    }
    private getUniqueId_Replace(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4().replace(/-/g, '');
        while (db.prepare(`SELECT COUNT(*) FROM ${store_server_user_model.playlist_tracks} WHERE id = ?`).pluck().get(id) > 0) {
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
    public Set_MediaInfo_Add_Selected_Favorite(ids: string[], value: Boolean) {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const insertStmt = db.prepare(`
            INSERT INTO ${store_server_user_model.annotation} (ann_id, item_id, item_type, starred, starred_at) 
            VALUES (?, ?, ?, ?, ?)
        `);
        const updateStmt = db.prepare(`
            UPDATE ${store_server_user_model.annotation} 
            SET starred = ?, starred_at = ? 
            WHERE item_id = ? AND item_type = 'media_file'
        `);
        const transaction = db.transaction(() => {
            for (const id of ids) {
                const existingRecord = db.prepare(`SELECT * FROM ${store_server_user_model.annotation} WHERE item_id = ?`).get(id);
                const starredValue = value ? 1 : 0;
                if (!existingRecord) {
                    insertStmt.run(
                        this.getUniqueId(db), id, 'media_file', starredValue,
                        this.getCurrentDateTime()
                    );
                } else {
                    updateStmt.run(
                        starredValue,
                        this.getCurrentDateTime(),
                        id
                    );
                }
            }
        });

        transaction();
        db.close();
    }
    public Set_MediaInfo_Delete_Selected_Favorite(ids: string[], value: Boolean) {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const updateStmt = db.prepare(`
            UPDATE ${store_server_user_model.annotation} 
            SET starred = 0, starred_at = ? 
            WHERE item_id = ? AND item_type = 'media_file'
        `);
        const transaction = db.transaction(() => {
            for (const id of ids) {
                updateStmt.run(
                    this.getCurrentDateTime(),
                    id
                );
            }
        });

        transaction();
        db.close();
    }
    public Set_MediaInfo_To_Selected_PlayCount_of_Delete(ids: string[], value: Boolean) {
        const path = require('path');
        const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const updateStmt = db.prepare(`
            UPDATE ${store_server_user_model.annotation} 
            SET starred = 0, starred_at = ? 
            WHERE item_id = ? AND item_type = 'media_file'
        `);
        const transaction = db.transaction(() => {
            for (const id of ids) {
                updateStmt.run(
                    this.getCurrentDateTime(),
                    id
                );
            }
        });

        transaction();
        db.close();
    }
}