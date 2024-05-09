export class Set_AlbumInfo_To_LocalSqlite {
    public Set_MediaInfo_To_Favorite(id: string, value: boolean) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');
        
        let ann_id = null;
        const { v4: uuidv4 } = require('uuid');
        const existingRecord = db.prepare(`SELECT * FROM annotation WHERE item_id = ?`).get(id);
        if (!existingRecord) {
            ann_id = uuidv4();
            while (db.prepare(`SELECT COUNT(*) FROM annotation WHERE ann_id = ?`).pluck().get(ann_id) > 0) {
                ann_id = uuidv4();
            }
            const insertStmt = db.prepare(`INSERT INTO annotation (ann_id, item_id, item_type, starred) VALUES (?, ?, ?, ?)`);
            insertStmt.run(ann_id, id, 'media_file', value ? 0 : 1);
        } else {
            const updateStmt = db.prepare(`UPDATE annotation SET starred = ? WHERE item_id = ? AND item_type = 'album'`);
            updateStmt.run(value ? 0 : 1, id);
        }
        db.close();

        console.log('handleItemClick_Favorite_id：'+id+'  _favorite:'+!value + '\n: '+ann_id)
    }
    public Set_MediaInfo_To_Rating(id: any, value: number) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');
        
        let ann_id = null;
        const { v4: uuidv4 } = require('uuid');
        const existingRecord = db.prepare(`SELECT * FROM annotation WHERE item_id = ?`).get(id);
        if (!existingRecord) {
            ann_id = uuidv4();
            while (db.prepare(`SELECT COUNT(*) FROM annotation WHERE ann_id = ?`).pluck().get(ann_id) > 0) {
                ann_id = uuidv4();
            }
            const insertStmt = db.prepare(`INSERT INTO annotation (ann_id, item_id, item_type, rating) VALUES (?, ?, ?, ?)`);
            insertStmt.run(ann_id, id, 'media_file', value);
        } else {
            const updateStmt = db.prepare(`UPDATE annotation SET rating = ? WHERE item_id = ? AND item_type = 'album'`);
            updateStmt.run(value, id);
        }
        db.close();

        console.log('handleItemClick_Favorite_id：'+id+'  _favorite:'+!value + '\n: '+ann_id)
    }    
}