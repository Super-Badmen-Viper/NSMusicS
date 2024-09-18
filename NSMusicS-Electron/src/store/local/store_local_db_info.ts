import { reactive } from 'vue'
import {Set_ALL_LocalData} from "@/features/sqlite3_local_configs/class_Set_ALL_LocalData";

export const store_local_db_info = reactive({
    result_local: true,
    set_clear_all_local_data(){
        let set_ALL_LocalData = new Set_ALL_LocalData()
        set_ALL_LocalData.Set_ALL_LocalData_To_Delete()
    }
});