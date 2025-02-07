import {reactive, watch} from 'vue'
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import { isElectron } from '@/utils/electron/isElectron';
import {Users_ApiService_of_Je} from "../../data_access/servers_configs/jellyfin_api/services_web/Users/index_service";
import {
    Library_ApiService_of_Je
} from "../../data_access/servers_configs/jellyfin_api/services_web/Library/index_service";
import {store_router_data_logic} from "@/router/router_store/store_router_data_logic";

export const store_server_users = reactive({
    percentage_of_local: 0,
    percentage_of_nd: 0,

    server_select_kind: '',
    
    server_config_of_current_user_of_sqlite: undefined as Server_Configs_Props | undefined,
    server_config_of_all_user_of_sqlite: [] as Server_Configs_Props[],
    
    server_config_of_current_user_of_select_servername: '',
    server_config_of_current_user_of_select: undefined as { label: string; value: string } | undefined,
    server_config_of_all_user_of_select: [] as { label: string; value: string }[],

    get_server_config_of_all_user_of_sqlite(value: Server_Configs_Props[]) {
        store_server_users.server_config_of_all_user_of_sqlite = value;
        store_server_users.server_config_of_all_user_of_select = [];
        value.forEach((item: any) => {
            store_server_users.server_config_of_all_user_of_select.push({
                label: item.type + ' - ' + item.server_name,
                value: item.id
            });
        });

        const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(item => item.id === store_server_users.server_config_of_current_user_of_select?.value);
        if (index < 0) {
            store_server_users.server_config_of_current_user_of_sqlite = undefined;
            store_server_users.server_config_of_current_user_of_select = undefined;
            store_server_users.server_config_of_current_user_of_select_servername = '';
        }else{
            store_server_users.server_config_of_current_user_of_sqlite = store_server_users.server_config_of_all_user_of_sqlite[index]
            store_server_users.server_config_of_current_user_of_select = {
                label: store_server_users.server_config_of_all_user_of_sqlite[index].type + ' - ' + store_server_users.server_config_of_all_user_of_sqlite[index].server_name,
                value: store_server_users.server_config_of_all_user_of_sqlite[index].id
            };
            store_server_users.server_config_of_current_user_of_select_servername =
                store_server_users.server_config_of_all_user_of_sqlite[index].type + ' - ' + store_server_users.server_config_of_all_user_of_sqlite[index].server_name
        }
    },

    async get_init_login_parms_of_Nd(){
        if(store_server_users.server_select_kind === 'navidrome') {
            const {salt, token} = store_server_users.navidrome_get_EncryptedPassword(
                store_server_user_model.password
            );
            store_server_user_model.salt = salt
            store_server_user_model.token = token
        }else if(
            store_server_user_model.model_server_type_of_web && (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby')
        ) {
            if(store_server_user_model.server_login_model_of_apikey) {
                store_server_user_model.authorization_of_Je =
                    store_server_users.server_config_of_current_user_of_sqlite?.user_name
                // load User
                const userService = new Users_ApiService_of_Je(
                    store_server_users.server_config_of_current_user_of_sqlite?.url
                )
                const result = await userService.getUsers_ALL()
                let server_set_of_addUser_of_apikey_user_option = []
                store_server_user_model.userid_of_Je = ''
                if (result) {
                    if (Array.isArray(result) && result.length > 0) {
                        result.forEach((row: any, index: number) => {
                            server_set_of_addUser_of_apikey_user_option.push({
                                label: row.Name,
                                value: row.Id
                            });
                        });
                        store_server_user_model.userid_of_Je = server_set_of_addUser_of_apikey_user_option[0].value
                        // load Library parentid_of_Je
                        const library_ApiService_of_Je = new Library_ApiService_of_Je(
                            store_server_users.server_config_of_current_user_of_sqlite?.url
                        )
                        const result_parentIds = await library_ApiService_of_Je.getLibrary_MediaFolders_ALL()
                        store_server_user_model.parentid_of_Je = []
                        if (result_parentIds.Items) {
                            if (Array.isArray(result_parentIds.Items) && result_parentIds.Items.length > 0) {
                                result_parentIds.Items.forEach((row: any, index: number) => {
                                    store_server_user_model.parentid_of_Je.push({
                                        label: row.Name,
                                        value: row.Id
                                    });
                                    if (row.CollectionType === 'music') {
                                        store_server_user_model.parentid_of_Je_Music = row.Id
                                    }
                                });
                            }
                        }
                    }
                }
            }
            else {
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
                await store_router_data_logic.get_page_top_info()
                // load Library parentid_of_Je
                const library_ApiService_of_Je = new Library_ApiService_of_Je(
                    store_server_users.server_config_of_current_user_of_sqlite?.url
                )
                const result_parentIds = await library_ApiService_of_Je.getLibrary_MediaFolders_ALL()
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
            }
        }
    },
    navidrome_get_EncryptedPassword(password: string): { salt: string, token: string } {
        if(isElectron) {
            const saltLength = 6;
            const characters = 'dfeVYUY9iu239iBUYHuji46h39BHUJ8u42nmrfhDD3r4ouj123890fvn48u95h';
            let randomString = '';
            for (let i = 0; i < saltLength; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomString += characters[randomIndex];
            }
            const salt = randomString;
            const crypto = require('crypto');
            const token = crypto.createHash('md5').update(password + salt, 'utf8').digest('hex');
            return {salt, token};
        } else {
            // other
        }
        return undefined
    }
});
