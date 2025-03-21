import { reactive } from "vue";
import { store_router_data_info } from "@/router/router_store/store_router_data_info";
import axios from "axios";
import {store_server_login_info} from "./store_server_login_info";

export const store_server_login_logic = reactive({
    checkLoginStatus() {
        const currentTime = new Date().getTime();
        store_server_login_info.server_accessToken = sessionStorage.getItem("jwt_token");
        const expireTime = sessionStorage.getItem("jwt_expire_time");

        if (store_server_login_info.server_accessToken && expireTime) {
            const remainingTime = parseInt(expireTime) - currentTime;
            if (remainingTime > 0) {
                sessionStorage.setItem("jwt_expire_time", currentTime + 60 * 60 * 1000); // 1 小时
                store_router_data_info.router_select_model_server_login = false;
                store_router_data_info.router.push("/home");
                console.log("已登录: " + store_server_login_info.server_accessToken);
            } else {
                this.server_logout();
                console.log("Token 已过期，需要重新登录");
            }
        } else {
            store_router_data_info.router_select_model_server_login = true;
            store_router_data_info.router.push("/login");
        }

        store_router_data_info.store_router_history_data_of_local = false;
        store_router_data_info.store_router_history_data_of_web = true;
    },
    async server_login(email: string, name: string, password: string) {
        try {
            const response = await axios.post("/api/login", {
                email: email,
                password: password,
                name: name
            });
            store_server_login_info.server_accessToken = response.data.accessToken;
            store_server_login_info.server_refreshToken = response.data.refreshToken;
            console.log("登录成功:", name);

            const currentTime = new Date().getTime();
            const expireTime = currentTime + 60 * 60 * 1000; // 1 小时
            sessionStorage.setItem("jwt_token", store_server_login_info.server_accessToken);
            sessionStorage.setItem("jwt_expire_time", expireTime.toString());

            store_router_data_info.router_select_model_server_login = false;
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

        store_router_data_info.router.push("/login");
        console.log("已退出登录");
    }
});