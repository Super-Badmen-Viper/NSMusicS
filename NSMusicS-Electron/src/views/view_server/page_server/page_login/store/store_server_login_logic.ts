import { reactive } from "vue";
import { store_router_data_info } from "@/router/router_store/store_router_data_info";
import axios from "axios";

export const store_server_login_logic = reactive({
    checkLoginStatus() {
        const currentTime = new Date().getTime();
        const token = sessionStorage.getItem("jwt_token");
        const expireTime = sessionStorage.getItem("jwt_expire_time");

        if (token && expireTime) {
            const remainingTime = parseInt(expireTime) - currentTime;
            if (remainingTime > 0) {
                sessionStorage.setItem("jwt_expire_time", currentTime + 60 * 60 * 1000); // 1 小时
                store_router_data_info.router_select_model_server_login = false;
                store_router_data_info.router.push("/home");
                console.log("已登录: " + token);
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
            const token = response.data.accessToken;
            console.log("登录成功:", token);

            const currentTime = new Date().getTime();
            const expireTime = currentTime + 60 * 60 * 1000; // 1 小时
            sessionStorage.setItem("jwt_token", token);
            sessionStorage.setItem("jwt_expire_time", expireTime.toString());

            document.cookie = `jwt_token=${token}; path=/; HttpOnly; Secure; SameSite=Strict; max-age=60`;

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
        document.cookie = `jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`;
        store_router_data_info.router.push("/login");
        console.log("已退出登录");
    }
});