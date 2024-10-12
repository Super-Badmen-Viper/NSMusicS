import {reactive} from 'vue'
import {
    store_server_navidrome_userdata_logic
} from "@/store/server/server_data_select/server_navidrome_user_data/store_server_navidrome_userdata_logic";

export const store_server_data_select_logic = reactive({
    /// server add
    async update_server_addUser(
        server_set_of_addUser_of_servername: string ,
        server_set_of_addUser_of_url: string ,
        server_set_of_addUser_of_username: string ,
        server_set_of_addUser_of_password: string ,
    ) {
        return store_server_navidrome_userdata_logic.navidrome_update_server_addUser(
            server_set_of_addUser_of_servername,
            server_set_of_addUser_of_url,
            server_set_of_addUser_of_username,
            server_set_of_addUser_of_password,
        );
    },

    /// server delete
    async update_server_deleteUser(
        id: string
    ) {
        return store_server_navidrome_userdata_logic.navidrome_update_server_deleteUser(
            id
        );
    },

    /// server update
    async update_server_setUser(
        id:string, server_name:string, url:string,
        user_name:string, password:string
    ) {
        return store_server_navidrome_userdata_logic.navidrome_update_server_setUser(
            id,
            server_name, url,
            user_name, password
        );
    },

    /// server login and get token
    async update_server_config_of_current_user_of_sqlite(value: any){
        return store_server_navidrome_userdata_logic.navidrome_update_server_config_of_current_user_of_sqlite(
            value
        );
    },
});