import {reactive} from 'vue'
import {store_router_data_logic} from "@/store/router/store_router_data_logic";
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_view_artist_page_fetchData} from "@/store/view/artist/store_view_artist_page_fetchData";

export const store_router_history_data_of_artist = reactive({
    router_history_model_of_Artist_scroll: false,
    router_history_model_of_Artist_scroller_value: 0,

    router_history_datas_of_Artist: [] as Interface_View_Router_Date[],
    router_select_history_date_of_Artist: null as Interface_View_Router_Date | null,
    router_history_model_of_Artist: 0,

    get_router_history_model_of_Artist(value: any) {
        if (value !== 0) {
            this.router_history_model_of_Artist = value;
            const currentIndex = this.router_history_datas_of_Artist.findIndex(item => item.id === (this.router_select_history_date_of_Artist?.id ?? ''));
            if (currentIndex !== -1) {
                const newIndex = currentIndex + value;
                if (newIndex >= 0 && newIndex < this.router_history_datas_of_Artist.length) {
                    this.fix_router_history_of_Artist_scroller_value(this.router_history_model_of_Artist_scroller_value) // 保留此滚轮值(上次浏览位置)
                    this.router_select_history_date_of_Artist = this.router_history_datas_of_Artist[newIndex];
                    store_router_data_logic.clear_Files_temporary();
                    const selectedRouterName = this.router_select_history_date_of_Artist.router_name;
                    if (selectedRouterName === 'View_Artist_List_ALL') {
                        store_router_data_info.router_select_model_artist = true;
                        store_view_artist_page_fetchData.fetchData_Artist();
                        this.router_history_model_of_Artist_scroll = true;
                    }
                }
            }
        }
    },

    add_router_history_of_Artist(new_Router_date: Interface_View_Router_Date){
        for (let i = 0; i < this.router_history_datas_of_Artist.length; i++) {
            if (this.router_history_datas_of_Artist[i].stmt_string === new_Router_date.stmt_string) {
                if (this.router_history_datas_of_Artist[i].page_lists_keyword === new_Router_date.page_lists_keyword) {
                    if (this.router_history_datas_of_Artist[i].page_lists_selected === new_Router_date.page_lists_selected) {
                        if(this.router_history_datas_of_Artist[i].columnKey === new_Router_date.columnKey) {
                            if(this.router_history_datas_of_Artist[i].order === new_Router_date.order) {
                                new_Router_date.id = this.router_history_datas_of_Artist[i].id;
                                this.router_history_datas_of_Artist[i] = new_Router_date;
                                this.router_select_history_date_of_Artist = new_Router_date;
                                return;
                            }
                        }
                    }
                }
            }
        }
        if (this.router_history_datas_of_Artist.length >= 36)
            this.router_history_datas_of_Artist.shift();
        this.router_history_datas_of_Artist.push(new_Router_date);
        this.router_select_history_date_of_Artist = new_Router_date;
    },
    remove_router_history_of_Artist(id: number){
        const index = this.router_history_datas_of_Artist.findIndex(item => item.id === id);
        if (index !== -1) {
            this.router_history_datas_of_Artist.splice(index + 1);
        }
    },
    fix_router_history_of_Artist_scroller_value(value: number){
        const index = this.router_history_datas_of_Artist.findIndex(item => item.id === (this.router_select_history_date_of_Artist?.id ?? ''));
        if (index !== -1) {
            this.router_history_datas_of_Artist[index].page_lists_scrollindex = value;
        }
    },
});