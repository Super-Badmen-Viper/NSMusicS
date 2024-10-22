import { reactive } from 'vue'
import {store_server_user_model} from "@/store/server/store_server_user_model";
const crypto = require('crypto');

export const store_server_users = reactive({
    percentage_of_local: 0,
    percentage_of_nd: 0,
    
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

    get_init_login_parms(){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            const username = store_server_user_model.username
            const {salt, token} = store_server_users.navidrome_get_EncryptedPassword(
                store_server_user_model.password
            );
            return {username, salt, token}
        }
        return false
    },
    navidrome_get_EncryptedPassword(password: string): { salt: string, token: string } {
        const saltLength = 6;
        const characters = 'dfeVYUY9iu239iBUYHuji46h39BHUJ8u42nmrfhDD3r4ouj123890fvn48u95h';
        let randomString = '';
        for (let i = 0; i < saltLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters[randomIndex];
        }
        const salt = randomString;
        const token = crypto.createHash('md5').update(password + salt, 'utf8').digest('hex');
        return { salt, token };
    },
    subsonic_get_EncryptedPassword(password: string): { salt: string, token: string } {
        const saltLength = 6;
        const characters = 'dfeVYUY9iu239iBUYHuji46h39BHUJ8u42nmrfhDD3r4ouj123890fvn48u95h';
        let randomString = '';
        for (let i = 0; i < saltLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters[randomIndex];
        }
        const salt = randomString;
        const token = crypto.createHash('md5').update(password + salt, 'utf8').digest('hex');
        return { salt, token };
    },
});