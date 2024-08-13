import {reactive, watch} from 'vue'
import {store_view_home_page_fetchData} from "@/store/view/home/store_view_home_page_fetchData";

export const store_view_home_page_logic = reactive({
    list_data_StartUpdate: false,

});

watch(() => store_view_home_page_logic.list_data_StartUpdate, (newValue) => {
    if(newValue) {
        store_view_home_page_fetchData.fetchData_Home()
        store_view_home_page_logic.list_data_StartUpdate = false
        console.log("store_view_home_page_logic.list_data_StartUpdate")
    }
});