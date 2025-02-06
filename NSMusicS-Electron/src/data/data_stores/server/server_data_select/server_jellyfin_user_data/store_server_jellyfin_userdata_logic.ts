import {reactive} from 'vue'
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {
    User_Authorization_ApiWebService_of_ND
} from "../../../../data_access/servers_configs/navidrome_api/services_web/user_authorization/index_service";
import {
    Set_Navidrome_ALL_Data_To_LocalSqlite
} from "../../../../data_access/servers_configs/navidrome_api/services_normal_middleware/class_Set_Navidrome_ALL_Data_To_LocalSqlite";
import { User_ApiService_of_ND } from "../../../../data_access/servers_configs/navidrome_api/services_normal/user_management/index_service";
import { Set_ServerInfo_To_LocalSqlite } from "../../../../data_access/local_configs/class_Set_ServerInfo_To_LocalSqlite";
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';
import {
    Users_ApiService_of_Je
} from "../../../../data_access/servers_configs/jellyfin_api/services_web/Users/index_service";
import {
    Library_ApiService_of_Je
} from "../../../../data_access/servers_configs/jellyfin_api/services_web/Library/index_service";

export const store_server_jellyfin_userdata_logic = reactive({
    /// server add
    async jellyfin_update_server_addUser(
        server_set_of_addUser_of_servername: string,
        server_set_of_addUser_of_url: string,
        server_set_of_addUser_of_username$apikey: string,
        server_set_of_addUser_of_password$userid: string,
        type: string
    ) {
        try{
            let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite();
            const data = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_CreateUser(
                server_set_of_addUser_of_servername,
                server_set_of_addUser_of_url,
                server_set_of_addUser_of_username$apikey,
                server_set_of_addUser_of_password$userid,
                type
            );
            const new_data: Server_Configs_Props[] = store_server_users.server_config_of_all_user_of_sqlite;
            new_data.push(data)
            store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
            store_app_configs_logic_save.save_system_config_of_Servers_Config()
            return true;
        }catch {  }
        return false;
    },

    /// server update
    async jellyfin_update_server_setUser(
        id:string, server_name:string, url:string,
        user_name:string, password:string,
        type: string
    ) {
        try{
            await this.jellyfin_get_server_config_of_current_user_of_sqlite({
                id, server_name, url,
                user_name, password,
                type
            })
            const userService = new Users_ApiService_of_Je(
                url
            )
            const result = await userService.getUsers_id(
                store_server_user_model.userid_of_Je
            )
            if(result.status != undefined && result.status === '400'){
                return false;
            }
            let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite();
            const data = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_SetUser(
                id,
                server_name, url,
                user_name, password,
                type
            );
            const new_data: any[] = store_server_users.server_config_of_all_user_of_sqlite;
            const index = new_data.findIndex(item => item.id === data.id);
            if (index !== -1) {
                new_data[index] = data;
            } else {
                new_data.push(data);
            }
            store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
            store_app_configs_logic_save.save_system_config_of_Servers_Config()
            return true
        } catch {}
        return false
    },

    /// server select login
    async jellyfin_update_server_config_of_current_user_of_sqlite(value: any){
        try {
            const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(item => item.id === value);
            await this.jellyfin_update_server_setUser(
                store_server_users.server_config_of_all_user_of_sqlite[index].id,
                store_server_users.server_config_of_all_user_of_sqlite[index].server_name,
                store_server_users.server_config_of_all_user_of_sqlite[index].url,
                store_server_users.server_config_of_all_user_of_sqlite[index].user_name,
                store_server_users.server_config_of_all_user_of_sqlite[index].password,
                store_server_users.server_config_of_all_user_of_sqlite[index].type
            )
            await this.jellyfin_get_server_config_of_current_user_of_sqlite(
                store_server_users.server_config_of_all_user_of_sqlite[index]
            )
            const userService = new Users_ApiService_of_Je(
                store_server_users.server_config_of_all_user_of_sqlite[index].url
            )
            const result = await userService.getUsers_id(
                store_server_user_model.userid_of_Je
            )
            if(result.status != undefined && result.status === '400'){
                return false;
            }
            return true;
        }catch { }
        return false;
    },
    /// server start login
    async jellyfin_get_server_config_of_current_user_of_sqlite(value: Server_Configs_Props) {
        store_server_users.server_config_of_current_user_of_sqlite = value
        store_server_users.server_config_of_current_user_of_select =
            {
                label: value.type + ' - ' + value.server_name,
                value: value.id
            };
        store_server_users.server_config_of_current_user_of_select_servername = value.type + ' - ' + value.server_name
        store_server_user_model.server_select = value.id
        if(store_server_user_model.server_login_model_of_apikey) {
            store_server_user_model.authorization_of_Je = value.user_name
            store_server_user_model.userid_of_Je = value.password
        }else {
            store_server_user_model.username =
                store_server_users.server_config_of_current_user_of_sqlite?.user_name
            store_server_user_model.password =
                store_server_users.server_config_of_current_user_of_sqlite?.password
            const data = await new Users_ApiService_of_Je(
                store_server_users.server_config_of_current_user_of_sqlite?.url
            ).authenticateUserByName(
                store_server_users.server_config_of_current_user_of_sqlite?.url,
                store_server_user_model.username,
                store_server_user_model.password
            )
            store_server_user_model.authorization_of_Je = data.AccessToken
            store_server_user_model.userid_of_Je = data.User.Id
        }
        ///
        const result_parentIds = await new Library_ApiService_of_Je(
            store_server_users.server_config_of_current_user_of_sqlite?.url
        ).getLibrary_MediaFolders_ALL()
        store_server_user_model.parentid_of_Je = []
        if(result_parentIds.Items){
            if(Array.isArray(result_parentIds.Items) && result_parentIds.Items.length > 0) {
                result_parentIds.Items.forEach((row: any, index: number) => {
                    store_server_user_model.parentid_of_Je.push({
                        label: row.Name,
                        value: row.Id
                    });
                    if(row.CollectionType === 'music'){
                        store_server_user_model.parentid_of_Je_Music = row.Id
                    }
                });
            }
        }
        ///
        store_app_configs_logic_save.save_system_config_of_Servers_Config()
    },
});