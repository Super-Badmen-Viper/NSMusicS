import {
    Navidrome_Api_Services_Web
} from "@/features/servers_configs/navidrome_api/services_web/Navidrome_Api_Services_Web";
import {store_server_users} from "@/store/server/store_server_users";
import axios from "axios";
import {store_server_user_model} from "@/store/server/store_server_user_model";

export class User_Authorization_ApiWebService_of_ND extends Navidrome_Api_Services_Web {
    public async get_token() {
        const url = store_server_users.server_config_of_current_user_of_sqlite?.url + '/auth/login';
        const data = {
            username: store_server_users.server_config_of_current_user_of_sqlite?.user_name,
            password: store_server_users.server_config_of_current_user_of_sqlite?.password
        };
        const headers = {
            'content-type': 'application/json'
        };
        try {
            const response = await axios.post(url, data, { headers });
            store_server_user_model.authorization = response.data.token
            store_server_user_model.client_unique_id = response.data.id
        } catch (error: any) {
            console.error('Error inserting data:', error);
        }
    }
}