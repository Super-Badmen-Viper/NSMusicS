import path from "path";

export class Get_Annotation_Infos_From_LocalSqlite {
    public Get_Annotation_Maximum_Playback(id: any, value: number) {
        let ann_id = null;
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');

        const existingRecord = db.prepare(`SELECT * FROM annotation WHERE item_id = ?`).get(id);
        if (!existingRecord) {
            db.prepare(`INSERT INTO annotation (ann_id, item_id, item_type, rating) VALUES (?, ?, ?, ?)`)
                .run(this.getUniqueId(db), id, 'media_file', value);
        } else {
            db.prepare(`UPDATE annotation SET rating = ? WHERE item_id = ? AND item_type = 'media_file'`)
                .run(value, id);
        }

        db.close();
        console.log('handleItemClick_rating_id：'+id+'  _rating:'+!value + '\n: '+ann_id)
    }
    public Get_Album_Random_Search(id: any, value: number) {
        let ann_id = null;
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');

        const existingRecord = db.prepare(`SELECT * FROM annotation WHERE item_id = ?`).get(id);
        if (!existingRecord) {
            db.prepare(`INSERT INTO annotation (ann_id, item_id, item_type, rating) VALUES (?, ?, ?, ?)`)
                .run(this.getUniqueId(db), id, 'media_file', value);
        } else {
            db.prepare(`UPDATE annotation SET rating = ? WHERE item_id = ? AND item_type = 'media_file'`)
                .run(value, id);
        }

        db.close();
        console.log('handleItemClick_rating_id：'+id+'  _rating:'+!value + '\n: '+ann_id)
    }
}