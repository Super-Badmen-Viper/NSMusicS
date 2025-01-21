import {reactive, watch} from 'vue'
import {store_view_home_page_fetchData} from "@/store/view/home/store_view_home_page_fetchData";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";

export const store_view_home_page_logic = reactive({
    list_data_StartUpdate: false,

});

watch(() => store_view_home_page_logic.list_data_StartUpdate, (newValue) => {
    if(newValue) {
        store_view_home_page_fetchData.fetchData_Home()
        store_view_media_page_logic.list_selected_Hand_click = true
        console.log("store_view_home_page_logic.list_data_StartUpdate")

        store_view_home_page_logic.list_data_StartUpdate = false
    }
});