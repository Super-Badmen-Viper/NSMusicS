import {reactive, watch} from 'vue'
import {store_router_history_data_of_genre} from "@/router/router_store/store_router_history_data_of_genre";
import {store_view_genre_page_fetchData} from "./store_view_genre_page_fetchData";
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";

export const store_view_genre_page_logic = reactive({
    list_data_StartUpdate: false,
});
watch(() => store_view_genre_page_logic.list_data_StartUpdate, (newValue) => {
    if(newValue) {
        store_view_genre_page_fetchData.fetchData_Album()

        store_view_genre_page_logic.list_data_StartUpdate = false
        console.log('page_genrelists_reset_data?:' + newValue)
    }
});