import {reactive} from 'vue'
import {store_router_data_logic} from "@/store/router/store_router_data_logic";
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";

export const store_router_history_data_of_media = reactive({
    router_history_model_of_Media_scroll: false,
    router_history_model_of_Media_scroller_value: 0,

    router_history_datas_of_Media: [] as Interface_View_Router_Date[],
    router_select_history_date_of_Media: null as Interface_View_Router_Date | null,
    router_history_model_of_Media: 0,

    async get_router_history_model_of_Media(value: any) {
        if (value !== 0) {
            this.router_history_model_of_Media = value;
            const currentIndex = this.router_history_datas_of_Media.findIndex(item => item.id === (this.router_select_history_date_of_Media?.id ?? ''));
            if (currentIndex !== -1) {
                const newIndex = currentIndex + value;
                if (newIndex >= 0 && newIndex < this.router_history_datas_of_Media.length) {
                    this.fix_router_history_of_Media_scroller_value(this.router_history_model_of_Media_scroller_value) // 保留此滚轮值(上次浏览位置)
                    this.router_select_history_date_of_Media = this.router_history_datas_of_Media[newIndex];
                    store_router_data_logic.clear_Files_temporary();
                    const selectedRouterName = this.router_select_history_date_of_Media.router_name;
                    if (selectedRouterName === 'View_Song_List_ALL') {
                        store_router_data_info.router_select_model_media = true;
                        await store_view_media_page_fetchData.fetchData_Media();
                        this.router_history_model_of_Media_scroll = true;
                    }
                }
            }
        }
    },

    add_router_history_of_Media(new_Router_date: Interface_View_Router_Date) {
        for (let i = 0; i < this.router_history_datas_of_Media.length; i++) {
            if (this.router_history_datas_of_Media[i].stmt_string === new_Router_date.stmt_string) {
                if (this.router_history_datas_of_Media[i].page_lists_keyword === new_Router_date.page_lists_keyword) {
                    if(this.router_history_datas_of_Media[i].page_songlists_keywordFilter === new_Router_date.page_songlists_keywordFilter) {
                        if (this.router_history_datas_of_Media[i].page_lists_selected === new_Router_date.page_lists_selected) {
                            if (this.router_history_datas_of_Media[i].columnKey === new_Router_date.columnKey) {
                                if (this.router_history_datas_of_Media[i].order === new_Router_date.order) {
                                    new_Router_date.id = this.router_history_datas_of_Media[i].id;
                                    this.router_history_datas_of_Media[i] = new_Router_date;
                                    this.router_select_history_date_of_Media = new_Router_date;
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (this.router_history_datas_of_Media.length >= 18)
            this.router_history_datas_of_Media.shift();
        this.router_history_datas_of_Media.push(new_Router_date);
        this.router_select_history_date_of_Media = new_Router_date;
    },
    remove_router_history_of_Media(id: number){
        const index = this.router_history_datas_of_Media.findIndex(item => item.id === id);
        if (index !== -1) {
            this.router_history_datas_of_Media.splice(index + 1);
        }
    },
    fix_router_history_of_Media_scroller_value(value: number){
        const index = this.router_history_datas_of_Media.findIndex(item => item.id === (this.router_select_history_date_of_Media?.id ?? ''));
        if (index !== -1) {
            this.router_history_datas_of_Media[index].page_lists_scrollindex = value;
        }
    },
});