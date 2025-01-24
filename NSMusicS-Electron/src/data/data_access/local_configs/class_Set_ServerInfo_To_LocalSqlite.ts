import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import { isElectron } from '@/utils/electron/isElectron';

export class Set_ServerInfo_To_LocalSqlite {
    private getUniqueId(db: any) {
        if(isElectron) {
            const {v4: uuidv4} = require('uuid');
            let id = uuidv4();
            while (db.prepare(`SELECT COUNT(*)
                               FROM system_servers_config
                               WHERE id = ?`).pluck().get(id) > 0) {
                id = uuidv4();
            }
            return id;
        } else {
            // other
        }
        return undefined
    }
    private getCurrentDateTime() {
        return new Date().toLocaleString(
            'zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }
        ).replace(/\//g, '-');
    }

    public Set_ServerInfo_To_Update_CreateUser(
        server_name:string,url:string,
        user_name:string,password:string,
        type: string
    ) {
        if(isElectron) {
            const db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
            ///
            let new_id = this.getUniqueId(db);
            let new_date = this.getCurrentDateTime();
            db.pragma('journal_mode = WAL');
            db.exec('PRAGMA foreign_keys = OFF');
            db.prepare(`
                INSERT INTO system_servers_config (id, server_name, url, user_name, password, last_login_at, type)
                VALUES (?, ?, ?, ?, ?, ?, ?)`)
                .run(new_id, server_name, url, user_name, password, new_date, type);
            ///
            db.close();
            ///
            const data: Server_Configs_Props = {
                show: false,
                type: type,
                id: new_id,
                server_name: server_name,
                url: url,
                user_name: user_name,
                password: password,
                last_login_at: new_date,
            };
            return data;
        } else {
            // other
        }
        return undefined
    }
    public Set_ServerInfo_To_Update_SetUser(
        id:string,
        server_name:string,url:string,
        user_name:string,password:string,
        type: string
    ) {
        if(isElectron) {
            const db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
            db.pragma('journal_mode = WAL');
            db.exec('PRAGMA foreign_keys = OFF');
            ///
            let new_date = this.getCurrentDateTime();
            const existingRecord = db.prepare(`SELECT *
                                               FROM system_servers_config
                                               WHERE id = ?`).get(id);
            if (!existingRecord) {
                db.prepare(`
                    INSERT INTO system_servers_config (id, server_name, url, user_name, password, last_login_at, type)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`)
                    .run(this.getUniqueId(db), server_name, url, user_name, password, new_date, type);
            } else {
                db.prepare(`
                    UPDATE system_servers_config
                    SET server_name   = ?,
                        url           = ?,
                        user_name     = ?,
                        password      = ?,
                        last_login_at = ?
                    WHERE id = ?
                      AND type = type`)
                    .run(server_name, url, user_name, password, new_date, id,);
            }
            ///
            db.close();
            ///
            const data: Server_Configs_Props = {
                show: false,
                type: type,
                id: id,
                server_name: server_name,
                url: url,
                user_name: user_name,
                password: password,
                last_login_at: new_date,
            };
            return data;
        } else {
            // other
        }
        return undefined
    }
    public Set_ServerInfo_To_Update_DeleteUser(id:string) {
        if(isElectron) {
            const db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
            db.pragma('journal_mode = WAL');
            db.exec('PRAGMA foreign_keys = OFF');
            ///
            const existingRecord = db.prepare('SELECT * FROM system_servers_config WHERE id = ?').get(id);
            if (existingRecord) {
                db.prepare('DELETE FROM system_servers_config WHERE id = ?').run(id);
            }
            ///
            db.close();
        } else {
            // other
        }
    }
}