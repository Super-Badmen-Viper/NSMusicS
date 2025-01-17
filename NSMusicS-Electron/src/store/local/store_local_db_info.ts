import {reactive, watch} from 'vue'
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {Set_ALL_LocalData} from "@/data_access/sqlite3_local_configs/class_Set_ALL_LocalData";

export const store_local_db_info = reactive({
    local_config_of_all_user_of_sqlite: [] as Local_Configs_Props[],
    local_config_of_all_user_of_select: [] as { label: string; value: string }[],

    result_local: true,
    set_clear_all_local_data(){
        let set_ALL_LocalData = new Set_ALL_LocalData()
        set_ALL_LocalData.Set_ALL_LocalData_To_Delete()
    }
});
watch(() => store_local_db_info.local_config_of_all_user_of_sqlite, (newValue) => {
    store_app_configs_logic_save.save_system_library_config()
    store_router_data_info.router_name = 'song';
    store_app_configs_logic_save.save_system_config_of_View_Router_History()
});