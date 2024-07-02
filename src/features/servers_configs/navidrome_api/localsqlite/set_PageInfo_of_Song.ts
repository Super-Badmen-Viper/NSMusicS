import {Browsing_ApiService_of_ND} from "@/features/servers_configs/navidrome_api/services/browsing/index_service";
import path from "path";

export class Set_PageInfo_of_Song_of_ND{
    public Set_ServerInfo_To_Update_CreateMedia_of_ND(username: string,token: string,salt: string) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/nsmusics.db'));
        ///
        let new_id = this.getUniqueId(db);
        let new_date = this.getCurrentDateTime();
        db.pragma('journal_mode = WAL');
        db.prepare(`
            INSERT INTO system_servers_config (id, server_name, url, user_name, password, last_login_at, type) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`)
            .run(new_id, server_name, url,user_name,password, new_date,'navidrome');
        ///
        db.close();
    }
    public Set_ServerInfo_To_Update_SetMedia_of_ND(id:string,server_name:string,url:string, user_name:string,password:string) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/nsmusics.db'));
        db.pragma('journal_mode = WAL');
        ///
        let new_date = this.getCurrentDateTime();
        const existingRecord = db.prepare(`SELECT * FROM system_servers_config WHERE id = ?`).get(id);
        if (!existingRecord) {
            db.prepare(`
                INSERT INTO system_servers_config (id, server_name, url, user_name, password, last_login_at, type) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`)
                .run(this.getUniqueId(db), server_name, url,user_name,password, new_date,'navidrome');
        } else {
            db.prepare(`
                UPDATE system_servers_config 
                SET server_name = ?, url = ? , user_name = ? , password = ? , last_login_at = ? 
                WHERE id = ? AND type = 'navidrome'`)
                .run(server_name, url, user_name, password, new_date, id,);
        }
        ///
        db.close();
        ///
        const data:Server_Configs_Props = {
            show: false,
            type: 'navidrome',
            id: id,
            server_name: server_name,
            url: url,
            user_name: user_name,
            password: password,
            last_login_at: new_date,
        };
        return data;
    }
    public Set_ServerInfo_To_Update_DeleteMedia_of_ND(id:string) {
        const path = require('path');
        const db = require('better-sqlite3')(path.resolve('resources/nsmusics.db'));
        db.pragma('journal_mode = WAL');
        ///
        const existingRecord = db.prepare('SELECT * FROM system_servers_config WHERE id = ?').get(id);
        if (existingRecord) {
            db.prepare('DELETE FROM system_servers_config WHERE id = ?').run(id);
        }
        ///
        db.close();
    }
}