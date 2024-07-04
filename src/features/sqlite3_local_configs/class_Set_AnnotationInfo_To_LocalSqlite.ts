import {v4 as uuidv4} from "uuid";
import path from "path";

export class Set_AnnotationInfo_To_LocalSqlite {
    private getUniqueId(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM playlist_tracks WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4();
        }
        return id;
    }
    private getUniqueId_Replace(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4().replace(/-/g, '');
        while (db.prepare(`SELECT COUNT(*) FROM playlist_tracks WHERE id = ?`).pluck().get(id) > 0) {
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
    public Set_MediaInfo_To_Selected_Favorite(ids: string[], value: Boolean) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');

        for (const id of ids) {
            const existingRecord = db.prepare(`SELECT * FROM annotation WHERE item_id = ?`).get(id);
            if (!existingRecord) {
                db.prepare(`
                INSERT INTO annotation (ann_id, item_id, item_type, starred, starred_at) 
                VALUES (?, ?, ?, ?, ?)
            `).run(
                    this.getUniqueId(db), id, 'media_file', value ? 0 : 1,
                    this.getCurrentDateTime()
                );
            } else {
                db.prepare(`
                UPDATE annotation 
                SET starred = ?, starred_at = ? 
                WHERE item_id = ? AND item_type = 'media_file'
            `).run(
                    value ? 0 : 1,
                    this.getCurrentDateTime(),
                    id
                );
            }
        }

        db.close();
    }
    public Set_MediaInfo_To_Selected_PlayCount_of_Delete(ids: string[], value: Boolean) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');

        db.close();
    }
}