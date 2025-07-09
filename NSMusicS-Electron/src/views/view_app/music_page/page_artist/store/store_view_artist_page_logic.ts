import {reactive, watch} from 'vue'
import {store_router_history_data_of_artist} from "@/router/router_store/store_router_history_data_of_artist";
import {store_general_fetch_artist_list} from "@/data/data_stores/server/server_api_abstract/music_scene/page/page_artist/store_general_fetch_artist_list";

export const store_view_artist_page_logic = reactive({
    list_data_StartUpdate: false,

    page_artistlists_options: [],
    page_artistlists_statistic: [],
    page_artistlists: [],
    page_artistlists_selected: 'artist_list_all',
    page_artistlists_keyword_reset: false,
    page_artistlists_keyword: '',
    page_artistlists_get_keyword_model_num: 0,
    page_artistlists_options_Sort_key: [],
    page_artistlists_multi_sort: ''
});
watch(() => store_view_artist_page_logic.page_artistlists_options_Sort_key, (newValue) => {
    if (newValue != null) {
        store_view_artist_page_logic.page_artistlists_keyword = '';
        store_router_history_data_of_artist.fix_router_history_of_Artist_scroller_value(store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value) // 保留此滚轮值(上次浏览位置)
        store_general_fetch_artist_list.fetchData_Artist()
    }
});
watch(() => store_view_artist_page_logic.page_artistlists_keyword, (newValue) => {
    if(newValue.indexOf('accurate_search') > 0){
        newValue = newValue.replace('accurate_search','');
        if(newValue.indexOf('__title__') > 0){
            newValue = newValue.replace('__title__','');
            store_view_artist_page_logic.page_artistlists_get_keyword_model_num = 1;
        }else if(newValue.indexOf('__artist__') > 0){
            newValue = newValue.replace('__artist__','');
            store_view_artist_page_logic.page_artistlists_get_keyword_model_num = 2;
        }else if(newValue.indexOf('__album__') > 0){
            newValue = newValue.replace('__album__','');
            store_view_artist_page_logic.page_artistlists_get_keyword_model_num = 3;
        }
    }else{
        store_view_artist_page_logic.page_artistlists_get_keyword_model_num = 0;
    }
    store_view_artist_page_logic.page_artistlists_keyword_reset = true;
    console.log('page_artistlists_keyword:' + newValue)

    store_general_fetch_artist_list.fetchData_Artist()
});
watch(() => store_view_artist_page_logic.page_artistlists_selected, (newValue) => {
    console.log('page_artistlists_selected：'+newValue)
    store_general_fetch_artist_list.fetchData_Artist()
});
watch(() => store_view_artist_page_logic.list_data_StartUpdate, (newValue) => {
    if(newValue) {
        store_view_artist_page_logic.page_artistlists_keyword = '';
        store_general_fetch_artist_list.fetchData_Artist()

        store_router_history_data_of_artist.router_history_datas_of_Artist = [];
        if (store_router_history_data_of_artist.router_select_history_date_of_Artist) {
            store_router_history_data_of_artist.router_select_history_date_of_Artist.id = 1;
            store_router_history_data_of_artist.router_history_datas_of_Artist.push(store_router_history_data_of_artist.router_select_history_date_of_Artist);
        }

        store_view_artist_page_logic.list_data_StartUpdate = false
        console.log('page_artistlists_reset_data?:' + newValue)
    }
});