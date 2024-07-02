import path from "path";
import {v4 as uuidv4} from "uuid";

export class Set_PlaylistInfo_From_LocalSqlite {
    private getUniqueId(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM system_servers_config WHERE id = ?`).pluck().get(id) > 0) {
            id = uuidv4();
        }
        return id;
    }
    private getUniqueId_Replace(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4().replace(/-/g, '');
        while (db.prepare(`SELECT COUNT(*) FROM system_servers_config WHERE id = ?`).pluck().get(id) > 0) {
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
    public Set_PlaylistInfo_To_Update_CreatePlaylist_of_ND(
        name: string,comment: string,
        duration: number,song_count: number,
        _public_: number,owner_id: string
    ) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        ///
        let new_id = this.getUniqueId(db);
        let new_date = this.getCurrentDateTime();
        db.pragma('journal_mode = WAL');
        db.prepare(`
          INSERT INTO playlist (id, name, comment, duration, song_count, public, created_at, updated_at, path, sync, size, rules, evaluated_at, owner_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
            .run(new_id, name, comment, duration, song_count, _public_, new_date, new_date, null, null, null, null, null, owner_id);
        ///
        db.close();
        ///
        const data:Play_List = {
            id: new_id,
            name: name,
            comment: comment,
            duration: duration,
            song_count: song_count,
            public: _public_,
            created_at: new_date,
            updated_at: new_date,
            path: null,
            sync: null,
            size: null,
            rules: null,
            evaluated_at: null,
            owner_id: owner_id,
        };
        return data;
    }
    public Set_PlaylistInfo_To_Update_SetPlaylist_of_ND(
        id: string,
        name: string,comment: string,
        duration: number,song_count: number,
        _public_: number,owner_id: string
    ) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');
        ///
        let new_date = this.getCurrentDateTime();
        const existingRecord = db.prepare(`SELECT * FROM playlist WHERE id = ?`).get(id);
        if (!existingRecord) {
            db.prepare(`
                INSERT INTO playlist (id, name, comment, duration, song_count, public, created_at, updated_at, path, sync, size, rules, evaluated_at, owner_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
                .run(new_id, name, comment, duration, song_count, _public_, new_date, new_date, null, null, null, null, null, owner_id);
        } else {
            db.prepare(`
                UPDATE playlist 
                SET name = ?, comment = ? , duration = ? , song_count = ? , public = ? , updated_at = ?
                WHERE id = ?`)
                .run(name, comment, duration, song_count, _public_, new_date, id,);
        }
        ///
        db.close();
        ///
        const data:Play_List = {
            id: id,
            name: name,
            comment: comment,
            duration: duration,
            song_count: song_count,
            public: _public_,
            created_at: new_date,
            updated_at: new_date,
            path: null,
            sync: null,
            size: null,
            rules: null,
            evaluated_at: null,
            owner_id: owner_id,
        };
        return data;
    }
    public Set_PlaylistInfo_To_Update_DeletePlaylist_of_ND(id:string) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');
        ///
        const existingRecord = db.prepare('SELECT * FROM playlist WHERE id = ?').get(id);
        if (existingRecord) {
            db.prepare('DELETE FROM playlist WHERE id = ?').run(id);
        }
        ///
        db.close();
    }
}