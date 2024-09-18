
export class Get_Navidrome_Temp_Data_To_LocalSqlite{
    private getUniqueId(db: any,table: any,id_name: any) {
        const { v4: uuidv4 } = require('uuid');
        let id = uuidv4();
        while (db.prepare(`SELECT COUNT(*) FROM ${table} WHERE ${id_name} = ?`).pluck().get(id) > 0) {
            id = uuidv4();
        }
        return id;
    }
    private convertToLRC(lyrics: {start: number;value: string}[]): string {
        let lrcContent = '';
        for (const line of lyrics) {
            const minutes = Math.floor(line.start / 60000);
            const seconds = Math.floor((line.start % 60000) / 1000);
            const milliseconds = (line.start % 1000).toString().padStart(3, '0').slice(0, 2);
            const timeTag = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds}]`;
            lrcContent += `${timeTag}${line.value}\n`;
        }
        return lrcContent;
    }
    private insertData(db:any, table:any, data_old:any) {
        if (Object.keys(data_old).length === 0) return;
        let data = { ...data_old };
        if (table === 'server_artist' && data.hasOwnProperty('albums'))
            delete data.albums;
        if (table === 'server_album' && data.hasOwnProperty('media'))
            delete data.media;
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data).map(value => {
            if (typeof value === 'object' && value !== null && 'id' in value) {
                return value.id;
            }
            return String(value);
        });
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${columns.split(', ').map(() => '?').join(', ')})`;
        const stmt = db.prepare(sql);
        try {
            stmt.run(values);
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }


}