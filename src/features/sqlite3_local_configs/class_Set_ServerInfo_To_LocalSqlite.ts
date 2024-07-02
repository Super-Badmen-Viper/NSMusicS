import {v4 as uuidv4} from "uuid";
import path from "path";

export class Set_ServerInfo_To_LocalSqlite {
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

    public Set_ServerInfo_To_Update_CreateUser_of_ND(server_name:string,url:string, user_name:string,password:string) {
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
        ///
        const data:Server_Configs_Props = {
            show: false,
            type: 'navidrome',
            id: new_id,
            server_name: server_name,
            url: url,
            user_name: user_name,
            password: password,
            last_login_at: new_date,
        };
        return data;
    }
    public Set_ServerInfo_To_Update_SetUser_of_ND(id:string,server_name:string,url:string, user_name:string,password:string) {
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
    public Set_ServerInfo_To_Update_DeleteUser_of_ND(id:string) {
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