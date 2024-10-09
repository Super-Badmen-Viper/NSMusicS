import {reactive, ref, watch} from 'vue'
import {store_router_history_data_of_album} from "@/store/router/store_router_history_data_of_album";
import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_router_data_logic} from "@/store/router/store_router_data_logic";

export const store_view_album_page_logic = reactive({
    list_data_StartUpdate: false,

    page_albumlists_options: [],
    page_albumlists_statistic: [],
    page_albumlists: [],
    page_albumlists_selected: 'album_list_all',
    page_albumlists_keyword_reset: false,
    page_albumlists_keyword: '',
    page_albumlists_get_keyword_model_num: 0,
    page_albumlists_options_Sort_key: [],

    page_albumlists_input_search_Value: ''
});
watch(() => store_view_album_page_logic.page_albumlists_options_Sort_key, async (newValue) => {
    if (newValue != null) {
        if(store_view_album_page_logic.page_albumlists_options_Sort_key === undefined || store_view_album_page_logic.page_albumlists_options_Sort_key.length === 0) {
            store_view_album_page_logic.page_albumlists_keyword = '';
        }
        store_router_history_data_of_album.fix_router_history_of_Album_scroller_value(store_router_history_data_of_album.router_history_model_of_Album_scroller_value) // 保留此滚轮值(上次浏览位置)
        await store_view_album_page_fetchData.fetchData_Album()
    }
});
watch(() => store_view_album_page_logic.page_albumlists_keyword, (newValue) => {
    if(newValue.indexOf('accurate_search') > 0){
        newValue = newValue.replace('accurate_search','');
        if(newValue.indexOf('__title__') > 0){
            newValue = newValue.replace('__title__','');
            store_view_album_page_logic.page_albumlists_get_keyword_model_num = 1;
        }else if(newValue.indexOf('__artist__') > 0){
            newValue = newValue.replace('__artist__','');
            store_view_album_page_logic.page_albumlists_get_keyword_model_num = 2;
        }else if(newValue.indexOf('__album__') > 0){
            newValue = newValue.replace('__album__','');
            store_view_album_page_logic.page_albumlists_get_keyword_model_num = 3;
        }
        store_router_data_info.find_album_model = true;
    }else{
        store_view_album_page_logic.page_albumlists_get_keyword_model_num = 0;
    }
    store_view_album_page_logic.page_albumlists_keyword_reset = true;
    console.log('page_albumlists_keyword:' + newValue)

    store_view_album_page_fetchData.fetchData_Album()
});
watch(() => store_view_album_page_logic.page_albumlists_selected, (newValue) => {
    console.log('page_albumlists_selected：'+newValue)
    store_view_album_page_fetchData.fetchData_Album()
});
watch(() => store_view_album_page_logic.list_data_StartUpdate, (newValue) => {
    if(newValue) {
        store_view_album_page_logic.page_albumlists_keyword = '';
        store_view_album_page_fetchData.fetchData_Album()

        store_router_history_data_of_album.router_history_datas_of_Album = [];
        if (store_router_history_data_of_album.router_select_history_date_of_Album) {
            store_router_history_data_of_album.router_select_history_date_of_Album.id = 1;
            store_router_history_data_of_album.router_history_datas_of_Album.push(store_router_history_data_of_album.router_select_history_date_of_Album);
        }

        store_view_album_page_logic.list_data_StartUpdate = false
        console.log('page_albumlists_reset_data?:' + newValue)
    }
});