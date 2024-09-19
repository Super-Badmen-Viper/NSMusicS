import { reactive } from 'vue'
import crypto from "crypto";
import {
    Media_Annotation_ApiService_of_ND
} from "@/features/servers_configs/navidrome_api/services_normal/media_annotation/index_service";
import {store_server_user_model} from "@/store/server/store_server_user_model";

export const store_server_users = reactive({
    percentage_of_local: 0,
    percentage_of_nd: 0,
    
    server_config_of_current_user_of_sqlite: undefined as Server_Configs_Props | undefined,
    server_config_of_all_user_of_sqlite: [] as Server_Configs_Props[],
    
    server_config_of_current_user_of_select_servername: '',
    server_config_of_current_user_of_select: undefined as { label: string; value: string } | undefined,
    server_config_of_all_user_of_select: [] as { label: string; value: string }[],

    get_generateEncryptedPassword(password: string): { salt: string, token: string } {
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
        return { salt, token };
    },

    get_server_config_of_all_user_of_sqlite(value: Server_Configs_Props[]) {
        this.server_config_of_all_user_of_sqlite = value;
        this.server_config_of_all_user_of_select = [];
        value.forEach((item: any) => {
            this.server_config_of_all_user_of_select.push({
                label: item.server_name,
                value: item.id
            });
        });

        const index = this.server_config_of_all_user_of_sqlite.findIndex(item => item.id === this.server_config_of_current_user_of_select?.value);
        if (index === 0) {
            this.server_config_of_current_user_of_sqlite = undefined;
            this.server_config_of_current_user_of_select = undefined;
            this.server_config_of_current_user_of_select_servername = '';
        }
    },

    get_login_parms(){
        const username = store_server_user_model.server_select
        const {salt, token} = store_server_users.get_generateEncryptedPassword(
            store_server_user_model.password
        );
        return {username, salt, token}
    },
});