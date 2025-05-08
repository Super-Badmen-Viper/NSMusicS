import { reactive } from "vue";
import { store_router_data_info } from "@/router/router_store/store_router_data_info";
import axios from "axios";
import {store_server_login_info} from "./store_server_login_info";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {
    store_general_fetch_home_list
} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_home/store_general_fetch_home_list";

export const store_server_login_logic = reactive({
    jwt_expire_time: 24 * 60 * 60 * 1000,// 24小时
    async checkLoginStatus() {
        store_router_data_info.store_router_history_data_of_local = false;
        store_router_data_info.store_router_history_data_of_web = true;

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
                            store_general_fetch_home_list.fetchData_Home();
                            console.log("已登录: " + store_server_login_info.server_accessToken);
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
            const response = await axios.post("/api/user/login", {
                email: email,
                password: password
            });
            store_server_login_info.server_accessToken = String(response.data.accessToken);
            store_server_login_info.server_refreshToken = String(response.data.refreshToken);
            console.log("登录成功:", response.data.accessToken);

            const currentTime = new Date().getTime();
            const expireTime = currentTime + this.jwt_expire_time
            sessionStorage.setItem("jwt_token", store_server_login_info.server_accessToken);
            sessionStorage.setItem("jwt_expire_time", expireTime.toString());

            store_router_data_info.router_select_model_server_login = false;
            await store_app_configs_info.load_app();
            store_router_data_info.router.push("/home");
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
        store_router_data_info.router_select_model_server_login = true;
        store_router_data_info.router.push("/login");

        return false
    }
});