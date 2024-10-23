import {reactive} from 'vue'
import {store_server_users} from "@/store/server/store_server_users";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {
    User_Authorization_ApiWebService_of_ND
} from "@/features/servers_configs/subsonic_api/services_web/user_authorization/index_service";
import {
    Set_Subsonic_ALL_Data_To_LocalSqlite
} from "@/features/servers_configs/subsonic_api/services_normal_middleware/class_Set_Subsonic_ALL_Data_To_LocalSqlite";
const crypto = require('crypto');
import { User_ApiService_of_ND } from "@/features/servers_configs/subsonic_api/services_normal/user_management/index_service";
import { Set_ServerInfo_To_LocalSqlite } from "@/features/sqlite3_local_configs/class_Set_ServerInfo_To_LocalSqlite";
const { ipcRenderer } = require('electron');

export const store_server_subsonic_userdata_logic = reactive({
    /// server add
    async subsonic_update_server_addUser(
        server_set_of_addUser_of_servername: string,
        server_set_of_addUser_of_url: string,
        server_set_of_addUser_of_username: string,
        server_set_of_addUser_of_password: string,
        type: string
    ) {
        try{
            const userService = new User_ApiService_of_ND(server_set_of_addUser_of_url +'/rest');
            const {salt, token} = this.subsonic_generateEncryptedPassword(server_set_of_addUser_of_password);
            const userData = await userService.getUser(server_set_of_addUser_of_username, token, salt);
            if (userData["subsonic-response"]["status"] === 'ok'){
                let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite();
                const data:Server_Configs_Props = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_CreateUser(
                    server_set_of_addUser_of_servername,
                    server_set_of_addUser_of_url,
                    server_set_of_addUser_of_username,
                    server_set_of_addUser_of_password,
                    type
                );
                const new_data: Server_Configs_Props[] = store_server_users.server_config_of_all_user_of_sqlite;
                new_data.push(data)
                store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
                return true;
            }
        }catch {  }
        return false;
    },

    /// server update
    async subsonic_update_server_setUser(
        id:string, server_name:string, url:string,
        user_name:string, password:string,
        type: string
    ) {
        const userService = new User_ApiService_of_ND(url+'/rest');
        const {salt, token} = this.subsonic_generateEncryptedPassword(password);
        const userData = await userService.getUser(user_name, token, salt);
        if (userData["subsonic-response"]["status"] === 'ok'){
            let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite();
            const data:Server_Configs_Props = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_SetUser(
                id,
                server_name, url,
                user_name, password,
                type
            );
            const new_data: Server_Configs_Props[] = store_server_users.server_config_of_all_user_of_sqlite;
            const index = new_data.findIndex(item => item.id === data.id);
            if (index !== -1) {
                new_data[index] = data;
            } else {
                new_data.push(data);
            }
            store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
            return true
        }
        return false
    },

    /// server select login
    async subsonic_update_server_config_of_current_user_of_sqlite(value: any){
        try {
            const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(item => item.id === value);
            await this.subsonic_update_server_setUser(
                store_server_users.server_config_of_all_user_of_sqlite[index].id,
                store_server_users.server_config_of_all_user_of_sqlite[index].server_name,
                store_server_users.server_config_of_all_user_of_sqlite[index].url,
                store_server_users.server_config_of_all_user_of_sqlite[index].user_name,
                store_server_users.server_config_of_all_user_of_sqlite[index].password,
                store_server_users.server_config_of_all_user_of_sqlite[index].type
            )
            await this.subsonic_get_server_config_of_current_user_of_sqlite(
                store_server_users.server_config_of_all_user_of_sqlite[index]
            )
            if(store_server_user_model.model_server_type_of_web){
                console.log('store_server_user_model.model_server_type_of_web')
                let user_Authorization_ApiWebService_of_ND = new User_Authorization_ApiWebService_of_ND(
                    store_server_users.server_config_of_current_user_of_sqlite?.url
                )
                await user_Authorization_ApiWebService_of_ND.get_token()
                store_app_configs_logic_save.save_system_config_of_App_Configs()
                store_app_configs_logic_save.save_system_config_of_Servers_Config()
            }
            return true;
        }catch { }
        return false;
    },
    /// server start login
    async subsonic_get_server_config_of_current_user_of_sqlite(value: Server_Configs_Props) {
        store_server_users.server_config_of_current_user_of_sqlite = value
        store_server_users.server_config_of_current_user_of_select =
            {
                label: value.type + ' - ' + value.server_name,
                value: value.id
            };
        store_server_users.server_config_of_current_user_of_select_servername = value.type + ' - ' + value.server_name
        store_server_user_model.server_select = value.id
        store_server_user_model.username = value.user_name
        store_server_user_model.password = value.password
        store_app_configs_logic_save.save_system_config_of_Servers_Config()

        const {salt, token} = store_server_users.subsonic_get_EncryptedPassword(
            store_server_users.server_config_of_current_user_of_sqlite?.password
        );
        store_server_user_model.salt = salt
        store_server_user_model.token = token

        if(store_server_user_model.model_server_type_of_local) {
            let set_Subsonic_Data_To_LocalSqlite = new Set_Subsonic_ALL_Data_To_LocalSqlite()
            await set_Subsonic_Data_To_LocalSqlite.Set_Read_Subsonic_Api_BasicInfo_Add_LocalSqlite(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                store_server_user_model.token,
                store_server_user_model.salt,
            )
            /// reset app data
            ipcRenderer.send('window-reset-data');
        }
    },
    /// server get token
    subsonic_generateEncryptedPassword(password: string): { salt: string, token: string } {
        const saltLength = 6;
        const salt = this.subsonic_generateRandomString(saltLength);
        const token = crypto.createHash('md5').update(password + salt, 'utf8').digest('hex');
        return { salt, token };
    },
    subsonic_generateRandomString(length: number): string {
        const characters = 'dfeVYUY9iu239iBUYHuji46h39BHUJ8u42nmrfhDD3r4ouj123890fvn48u95h';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters[randomIndex];
        }
        return randomString;
    },

    fixUrlFormat(url: string): string {
        const match = url.match(/^(https?:\/\/[^:/]+):(\d+)(.*)?$/);
        if (match) {
            const host = match[1];
            const port = match[2];
            return `${host}:${port}`;
        } else {
            return url;
        }
    }
});