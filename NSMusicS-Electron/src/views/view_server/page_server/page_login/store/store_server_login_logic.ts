import {reactive} from "vue";
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import axios from "axios";

export const store_server_login_logic = reactive({
    checkLoginStatus() {
        // init login status
        const token = sessionStorage.getItem('jwt_token');
        if (token) {
            store_router_data_info.router_select_model_server_login = false;
            store_router_data_info.router.push('/home');
            console.log('已登录: ' + token);
        } else {
            store_router_data_info.router_select_model_server_login = true;
            store_router_data_info.router.push('/login');
        }
        // server model
        store_router_data_info.store_router_history_data_of_local = false;
        store_router_data_info.store_router_history_data_of_web = true;
    },
    async server_login(email: string, name: string, password: string) {
        try {
            const response = await axios.post('/api/login', {
                email: email,
                password: password,
                name: name
            });
            const token = response.data.token;
            sessionStorage.setItem('jwt_token', token);
            document.cookie = `jwt_token=${token}; path=/; HttpOnly; Secure; SameSite=Strict; max-age=86400`;
            store_router_data_info.router_select_model_server_login = false;
            store_router_data_info.router.push('/home');
            return true;
        } catch (error) {
            console.error('登录失败:', error);
        }
        return false;
    },
    server_logout() {
        sessionStorage.removeItem('jwt_token');
        document.cookie = `jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`;
        store_router_data_info.router.push('/login');
        console.log('已退出登录');
    }
});