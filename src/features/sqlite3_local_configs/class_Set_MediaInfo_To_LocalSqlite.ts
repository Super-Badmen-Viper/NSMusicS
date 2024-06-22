export class Set_MediaInfo_To_LocalSqlite {
    private getUniqueId(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let ann_id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM annotation WHERE ann_id = ?`).pluck().get(ann_id) > 0) {
            ann_id = uuidv4();
        }
        return ann_id;
    }
    private getUniqueId_Replace(db: any) {
        const { v4: uuidv4 } = require('uuid');
        let ann_id = uuidv4().replace(/-/g, '');
        while (db.prepare(`SELECT COUNT(*) FROM annotation WHERE ann_id = ?`).pluck().get(ann_id) > 0) {
            ann_id = uuidv4().replace(/-/g, '');
        }
        return ann_id;
    }
    private getCurrentDateTime() {
        return new Date().toLocaleString(
            'zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }
        ).replace(/\//g, '-');
    }

    public Set_MediaInfo_To_Favorite(id: string, value: Boolean) {
        let ann_id = null;
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/navidrome.db'));
        db.pragma('journal_mode = WAL');
        
        const existingRecord = db.prepare(`SELECT * FROM annotation WHERE item_id = ?`).get(id);
        if (!existingRecord) {
            db.prepare(`
                INSERT INTO annotation (ann_id, item_id, item_type, starred, starred_at) 
                VALUES (?, ?, ?, ?, ?)`)
            .run(
                this.getUniqueId(db), id, 'media_file', value ? 0 : 1, 
                this.getCurrentDateTime(),);
        } else {
            db.prepare(`
                UPDATE annotation 
                SET starred = ?, starred_at = ? 
                WHERE item_id = ? AND item_type = 'media_file'`)
            .run(
                value ? 0 : 1, 
                this.getCurrentDateTime(),
                id,); 
        }

        db.close();
        console.log('handleItemClick_Favorite_id：'+id+'  _favorite:'+!value + '\n: '+ann_id)
    }
    public Set_MediaInfo_To_Rating(id: any, value: number) {
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