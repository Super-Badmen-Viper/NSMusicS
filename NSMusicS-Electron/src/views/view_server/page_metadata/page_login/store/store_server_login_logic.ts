import { reactive } from "vue";
import { store_router_data_info } from "@/router/router_store/store_router_data_info";
import axios from "axios";
import {store_server_login_info} from "./store_server_login_info";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {
    store_general_fetch_home_list
} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_home/store_general_fetch_home_list";
import {
    Auth_Token_ApiService_of_NineSong
} from "@/data/data_access/servers_configs/ninesong_api/services_web/Auth/Auth_Token/index_service";
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";

export const store_server_login_logic = reactive({
    jwt_expire_time: 24 * 60 * 60 * 1000,// 24小时
    async checkLoginStatus() {
        store_router_data_info.store_router_history_data_of_local = false;
        store_router_data_info.store_router_history_data_of_web = true;
        store_app_configs_info.desktop_system_kind = 'docker';
        if(store_server_users.server_select_kind === '') {
            store_server_users.server_select_kind = 'ninesong'
        }

        const currentTime = new Date().getTime();
        store_server_login_info.server_accessToken = String(sessionStorage.getItem("jwt_token"));
        const expireTime = sessionStorage.getItem("jwt_expire_time");

        try {
            if (store_server_login_info.server_accessToken) {
                const response = await axios.get("/api/user/profile", {
                    headers: {
                        'Authorization': `Bearer ${store_server_login_info.server_accessToken}`
                    }
                });
                if (response.data && response.data.name) {
                    if (store_server_login_info.server_accessToken && expireTime) {
                        const remainingTime = parseInt(expireTime) - currentTime;
                        if (remainingTime > 0) {
                            sessionStorage.setItem("jwt_expire_time", String(currentTime + this.jwt_expire_time)); // 1 小时

                            store_router_data_info.router_select_model_server_login = false;
                            await store_app_configs_info.load_app();
                            await store_general_fetch_home_list.fetchData_Home();
                            console.log("已登录: " + store_server_login_info.server_accessToken);

                            store_server_user_model.token = store_server_login_info.server_accessToken;

                            if (store_server_users.server_select_kind === 'ninesong') {
                                store_server_user_model.username = store_server_login_info.server_input_email;
                                store_server_user_model.password = store_server_login_info.server_input_password;
                            }
                            await store_app_configs_logic_save.save_system_config_of_App_Configs()

                            await store_server_user_model.init_server_info();

                            return true;
                        } else {
                            return this.server_logout();
                        }
                    } else {
                        return this.server_logout();
                    }
                } else {
                    return this.server_logout();
                }
            } else {
                return this.server_logout();
            }
        } catch (error) {
            console.error("验证登录状态失败:", error);
            return this.server_logout();
        }
    },
    async server_login(email: string, password: string) {
        try {
            const url =
                store_app_configs_info.desktop_system_kind === 'docker' ?
                    '/api' : store_server_login_info.server_url;
            const response = new Auth_Token_ApiService_of_NineSong(
                url
            );
            const data = await response.getAuth_Token(
                email,
                password,
            )
            store_server_login_info.server_accessToken = String(data.accessToken);
            store_server_login_info.server_refreshToken = String(data.refreshToken);
            store_server_login_info.server_url = url;
            console.log("登录成功:", data.accessToken);

            // 由于Electron初始化调用此方法，检测是否为docker，防止调用load_app陷入无限循环
            if(store_app_configs_info.desktop_system_kind === 'docker') {
                store_router_data_info.router_select_model_server_login = false;
                const expireTime = new Date().getTime() + this.jwt_expire_time
                sessionStorage.setItem("jwt_token", store_server_login_info.server_accessToken);
                sessionStorage.setItem("jwt_expire_time", expireTime.toString());
                sessionStorage.setItem("email", email);
                await store_app_configs_info.load_app();
                store_router_data_info.router.push("/home");
            }
            return true;
        } catch (error) {
            console.error("登录失败:", error);
        }
        return false;
    },
    server_logout() {
        sessionStorage.removeItem("jwt_token");
        sessionStorage.removeItem("jwt_expire_time");

        store_server_login_info.server_accessToken = '';
        store_router_data_info.router.push("/login");

        return false
    }
});