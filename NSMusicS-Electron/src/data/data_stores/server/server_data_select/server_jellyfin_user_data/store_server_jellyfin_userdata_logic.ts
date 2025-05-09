import {reactive} from 'vue'
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import { Set_ServerInfo_To_LocalSqlite } from "@/data/data_access/local_configs/class_Set_ServerInfo_To_LocalSqlite";
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';
import {
    Users_ApiService_of_Je
} from "@/data/data_access/servers_configs/jellyfin_api/services_web/Users/index_service";
import {
    Library_ApiService_of_Je
} from "@/data/data_access/servers_configs/jellyfin_api/services_web/Library/index_service";
import {store_router_data_logic} from "@/router/router_store/store_router_data_logic";
import {store_server_ninesong_userdata_logic} from "../server_ninesong_user_data/store_server_ninesong_userdata_logic";
import {store_server_model_statistics} from "../../server_api_abstract/music_scene/model/model_statistics";

export const store_server_jellyfin_userdata_logic = reactive({
    // server add
    async jellyfin_update_server_addUser(server_name: string, url: string, username: string, password: string, type: string) {
        try {
            let data = null;
            if (isElectron) {
                let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite()
                data = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_CreateUser(server_name, url, username, password, type)
            } else {
                // Golang
                data = await store_server_ninesong_userdata_logic.update_app_configs_server(
                    store_app_configs_logic_save.generateMockObjectId(),
                    server_name,
                    url,
                    username,
                    password,
                    type
                )
            }
            if (data != null) {
                const new_data: Server_Configs_Props[] = [...store_server_users.server_config_of_all_user_of_sqlite, data]
                store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
                await store_app_configs_logic_save.save_system_config_of_Servers_Config()
                return true
            }
        } catch (error) {
            console.error(error)
        }
        return false
    },

    // server update
    async jellyfin_update_server_setUser(id: string, server_name: string, url: string, user_name: string, password: string, type: string) {
        try {
            await this.jellyfin_get_server_config_of_current_user_of_sqlite({
                id,
                server_name,
                url,
                user_name,
                password,
                type
            })
            const userService = new Users_ApiService_of_Je(url)
            const result = await userService.getUsers_id(store_server_user_model.userid_of_Je)
            if (result.status !== undefined && result.status === '400') {
                return false
            }
            let data = null;
            if (isElectron) {
                let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite()
                data = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_SetUser(id, server_name, url, user_name, password, type)
            } else {
                // Golang
                data = store_server_ninesong_userdata_logic.update_app_configs_server(id, server_name, url, user_name, password, type)
            }
            if (data != null) {
                const new_data: Server_Configs_Props[] = [...store_server_users.server_config_of_all_user_of_sqlite]
                const index = new_data.findIndex(item => item.id === data.id)
                if (index !== -1) {
                    new_data[index] = data
                }
                store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
                await store_app_configs_logic_save.save_system_config_of_Servers_Config()
                return true
            }
        } catch (error) {
            console.error(error)
        }
        return false
    },

    // server select login
    async jellyfin_update_server_config_of_current_user_of_sqlite(value: Server_Configs_Props) {
        try {
            const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(item => item.id === value)
            if (index !== -1) {
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
                const result = await userService.getUsers_id(store_server_user_model.userid_of_Je)
                return !(result.status !== undefined && result.status === '400');
            }
        } catch (error) {
            console.error(error)
        }
        return false
    },

    // server start login
    async jellyfin_get_server_config_of_current_user_of_sqlite(value: Server_Configs_Props) {
        store_server_users.server_config_of_current_user_of_sqlite = value
        store_server_users.server_config_of_current_user_of_select = {
            label: value.type + ' - ' + value.server_name,
            value: value.id
        }
        store_server_users.server_config_of_current_user_of_select_servername = value.type + ' - ' + value.server_name
        store_server_user_model.server_select = value.id
        if (store_server_user_model.server_login_model_of_apikey) {
            store_server_user_model.authorization_of_Je = value.user_name
            store_server_user_model.userid_of_Je = value.password
        } else {
            store_server_user_model.username = value.user_name
            store_server_user_model.password = value.password
            const data = await new Users_ApiService_of_Je(value.url).authenticateUserByName(value.url, value.user_name, value.password)
            store_server_user_model.authorization_of_Je = data.AccessToken
            store_server_user_model.userid_of_Je = data.User.Id
            await store_server_model_statistics.get_page_top_info()
        }
        const library_ApiService = new Library_ApiService_of_Je(value.url)
        let result_parentIds = await library_ApiService.getLibrary_MediaFolders_ALL()
        store_server_user_model.parentid_of_Je = []
        let Library_Find = false
        if (result_parentIds && result_parentIds.Items) {
            Library_Find = true
        } else {
            if (store_server_user_model.userid_of_Je !== undefined) {
                result_parentIds = await library_ApiService.getLibrary_MediaFolders_ALL_Other(store_server_user_model.userid_of_Je)
                if (result_parentIds && result_parentIds.Items) {
                    Library_Find = true
                }
            } else {
                Library_Find = false
            }
        }
        if (Library_Find) {
            if (Array.isArray(result_parentIds.Items) && result_parentIds.Items.length > 0) {
                result_parentIds.Items.forEach((row: any, index: number) => {
                    store_server_user_model.parentid_of_Je.push({
                        label: row.Name,
                        value: row.Id
                    })
                    if (row.CollectionType === 'music') {
                        store_server_user_model.parentid_of_Je_Music = row.Id
                    }
                })
            }
        } else {
            store_server_user_model.parentid_of_Je_Music = undefined
        }
        await store_app_configs_logic_save.save_system_config_of_Servers_Config()
    }
})