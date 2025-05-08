import {reactive} from 'vue'
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import {
    store_server_login_info
} from "@/views/view_server/page_metadata/page_login/store/store_server_login_info";
import axios from "axios";

export const store_server_ninesong_userdata_logic = reactive({
    /// server add
    async update_app_configs_server(
        id: string,
        server_name: string,
        url: string,
        user_name: string,
        password: string,
        type: string
    ): Promise<Server_Configs_Props | null> {
        if (!store_router_data_info.router_select_model_server_login && store_server_login_info.server_accessToken.length > 0) {
            try {
                const new_date = new Date().toISOString().split('.')[0] + 'Z';
                await axios.put("/api/app/server",
                    JSON.stringify({
                        ID: id,
                        ServerName: server_name,
                        URL: url,
                        UserName: user_name,
                        Password: password,
                        LastLoginAt: new_date,
                        Type: type
                    }),
                    {
                        headers: {
                            "Content-Type": 'application/json',
                            Authorization: `Bearer ${store_server_login_info.server_accessToken}`
                        }
                    }
                );

                return {
                    show: false,
                    type: type,
                    id: id,
                    server_name: server_name,
                    url: url,
                    user_name: user_name,
                    password: password,
                    last_login_at: new_date,
                };
            } catch (error) {
                console.error("Request failed:", error.response ? error.response.data : error.message);
            }
        }
        return null;
    },
    async delete_app_configs_server(id: string) {
        if (
            !store_router_data_info.router_select_model_server_login &&
            store_server_login_info.server_accessToken.length > 0
        ) {
            try {
                await axios.delete("/api/app/server", {
                    params: { id },
                    headers: {
                        Authorization: `Bearer ${store_server_login_info.server_accessToken}`
                    }
                });
            } catch (error) {
                console.error("请求失败:", error.response?.data ?? error.message);
                if (error.response?.status === 404) {
                    console.warn("指定的配置项不存在");
                }
            }
        }
        return true;
    }
});