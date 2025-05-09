import {reactive} from 'vue'
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import {
    store_server_login_info
} from "@/views/view_server/page_metadata/page_login/store/store_server_login_info";
import axios from "axios";

export const store_server_ninesong_userdata_logic = reactive({
    /// docker server manage
    async update_app_configs_server(
        id: string,
        server_name: string,
        url: string,
        user_name: string,
        password: string,
        type: string
    ): Promise<Server_Configs_Props | null> {
        if (!store_router_data_info.router_select_model_server_login && store_server_login_info.server_accessToken.length > 0) {
            try {
                const new_date = new Date().toISOString().split('.')[0] + 'Z';
                await axios.put("/api/app/server",
                    JSON.stringify({
                        ID: id,
                        ServerName: server_name,
                        URL: url,
                        UserName: user_name,
                        Password: password,
                        LastLoginAt: new_date,
                        Type: type
                    }),
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: `Bearer ${store_server_login_info.server_accessToken}`
                        }
                    }
                );

                return {
                    show: false,
                    type: type,
                    id: id,
                    server_name: server_name,
                    url: url,
                    user_name: user_name,
                    password: password,
                    last_login_at: new_date,
                };
            } catch (error) {
                console.error("Request failed:", error.response ? error.response.data : error.message);
            }
        }
        return null;
    },
    async delete_app_configs_server(id: string) {
        if (
            !store_router_data_info.router_select_model_server_login &&
            store_server_login_info.server_accessToken.length > 0
        ) {
            try {
                await axios.delete("/api/app/server", {
                    params: { id },
                    headers: {
                        Authorization: `Bearer ${store_server_login_info.server_accessToken}`
                    }
                });
            } catch (error) {
                console.error("请求失败:", error.response?.data ?? error.message);
                if (error.response?.status === 404) {
                    console.warn("指定的配置项不存在");
                }
            }
        }
        return true;
    },

    /// app server manage
    /// server add
    async ninesong_update_server_addUser(
        server_name: string,
        url: string,
        user_name: string,
        password: string,
        type: string
    ) {
        try {
            const userService = new User_ApiService_of_ND(url + '/rest');
            const { salt, token } = this.ninesong_get_EncryptedPassword(password);
            const userData = await userService.getUser(user_name, token, salt);

            if (userData && userData["subsonic-response"] && userData["subsonic-response"]["status"] === 'ok') {
                let data: Server_Configs_Props = null;

                if (isElectron) {
                    let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite();
                    data = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_CreateUser(
                        server_name,
                        url,
                        user_name,
                        password,
                        type
                    );
                } else {
                    // Golang
                    data = await store_server_ninesong_userdata_logic.update_app_configs_server(
                        store_app_configs_logic_save.generateMockObjectId(),
                        server_name,
                        url,
                        user_name,
                        password,
                        type
                    );
                }

                if (data != null) {
                    const new_data: Server_Configs_Props[] = [...store_server_users.server_config_of_all_user_of_sqlite, data];
                    store_server_users.get_server_config_of_all_user_of_sqlite(new_data);
                    return true;
                }
            }
        } catch (error) {
            console.error("Error during ninesong_update_server_addUser:", error);
        }
        return false;
    },

    /// server update
    async ninesong_update_server_setUser(
        id:string, server_name:string, url:string,
        user_name:string, password:string,
        type: string
    ) {
        const userService = new User_ApiService_of_ND(url+'/rest');
        const {salt, token} = this.ninesong_get_EncryptedPassword(password);
        const userData = await userService.getUser(user_name, token, salt);
        if (userData["subsonic-response"]["status"] === 'ok'){
            let data: Server_Configs_Props = null
            if(isElectron) {
                let set_ServerInfo_To_LocalSqlite = new Set_ServerInfo_To_LocalSqlite();
                data = set_ServerInfo_To_LocalSqlite.Set_ServerInfo_To_Update_SetUser(
                    id,
                    server_name, url,
                    user_name, password,
                    type
                );
            }else{
                // Golang
                data = await store_server_ninesong_userdata_logic.update_app_configs_server(
                    id,
                    server_name,
                    url,
                    user_name,
                    password,
                    type
                )
            }
            if(data != null) {
                const new_data: Server_Configs_Props[] = store_server_users.server_config_of_all_user_of_sqlite;
                const index = new_data.findIndex(item => item.id === data.id);
                if (index !== -1) {
                    new_data[index] = data;
                }
                store_server_users.get_server_config_of_all_user_of_sqlite(new_data)
                return true
            }
        }
        return false
    },

    /// server select login
    async ninesong_update_server_config_of_current_user_of_sqlite(value: any){
        try {
            const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(item => item.id === value);
            await this.ninesong_update_server_setUser(
                store_server_users.server_config_of_all_user_of_sqlite[index].id,
                store_server_users.server_config_of_all_user_of_sqlite[index].server_name,
                store_server_users.server_config_of_all_user_of_sqlite[index].url,
                store_server_users.server_config_of_all_user_of_sqlite[index].user_name,
                store_server_users.server_config_of_all_user_of_sqlite[index].password,
                store_server_users.server_config_of_all_user_of_sqlite[index].type
            )
            await this.ninesong_get_server_config(
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
    async ninesong_get_server_config(value: Server_Configs_Props) {
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

        const {salt, token} = this.ninesong_get_EncryptedPassword(store_server_users.server_config_of_current_user_of_sqlite?.password);
        store_server_user_model.salt = salt
        store_server_user_model.token = token

        if(store_server_user_model.model_server_type_of_local) {
            let set_Navidrome_Data_To_LocalSqlite = new Set_Navidrome_ALL_Data_To_LocalSqlite()
            await set_Navidrome_Data_To_LocalSqlite.Set_Read_Navidrome_Api_BasicInfo_Add_LocalSqlite(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                store_server_user_model.token,
                store_server_user_model.salt,
            )
            /// reset app data
            if(isElectron) {
                ipcRenderer.send('window-reset-data');
            }
        }
    },
    /// server get token
    ninesong_get_EncryptedPassword(password: string): { salt: string, token: string } {
        const saltLength = 6;
        const characters = 'dfeVYUY9iu239iBUYHuji46h39BHUJ8u42nmrfhDD3r4ouj123890fvn48u95h';
        let randomString = '';
        for (let i = 0; i < saltLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters[randomIndex];
        }
        const salt = randomString;
        const token = hash(password + salt);
        return { salt, token };
    },
});