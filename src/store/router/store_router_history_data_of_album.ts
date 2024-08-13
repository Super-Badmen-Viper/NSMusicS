import {reactive} from 'vue'
import {store_router_data_logic} from "@/store/router/store_router_data_logic";
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";

export const store_router_history_data_of_album = reactive({
    router_history_model_of_Album_scroll: false,
    router_history_model_of_Album_scroller_value: 0,

    router_history_datas_of_Album: [] as Interface_View_Router_Date[],
    router_select_history_date_of_Album: null as Interface_View_Router_Date | null,
    router_history_model_of_Album: 0,

    get_router_history_model_of_Album(value: any) {
        if (value !== 0) {
            this.router_history_model_of_Album = value;
            const currentIndex = this.router_history_datas_of_Album.findIndex(item => item.id === (this.router_select_history_date_of_Album?.id ?? ''));
            if (currentIndex !== -1) {
                const newIndex = currentIndex + value;
                if (newIndex >= 0 && newIndex < this.router_history_datas_of_Album.length) {
                    this.fix_router_history_of_Album_scroller_value(this.router_history_model_of_Album_scroller_value) // 保留此滚轮值(上次浏览位置)
                    this.router_select_history_date_of_Album = this.router_history_datas_of_Album[newIndex];
                    store_router_data_logic.clear_Files_temporary();
                    const selectedRouterName = this.router_select_history_date_of_Album.router_name;
                    if (selectedRouterName === 'View_Album_List_ALL') {
                        store_router_data_info.router_select_model_album = true;
                        store_view_album_page_fetchData.fetchData_Album();
                        this.router_history_model_of_Album_scroll = true;
                    }
                }
            }
        }
    },

    add_router_history_of_Album(new_Router_date: Interface_View_Router_Date){
        for (let i = 0; i < this.router_history_datas_of_Album.length; i++) {
            if (this.router_history_datas_of_Album[i].stmt_string === new_Router_date.stmt_string) {
                if (this.router_history_datas_of_Album[i].page_lists_keyword === new_Router_date.page_lists_keyword) {
                    if (this.router_history_datas_of_Album[i].page_lists_selected === new_Router_date.page_lists_selected) {
                        if(this.router_history_datas_of_Album[i].columnKey === new_Router_date.columnKey) {
                            if(this.router_history_datas_of_Album[i].order === new_Router_date.order) {
                                new_Router_date.id = this.router_history_datas_of_Album[i].id;
                                this.router_history_datas_of_Album[i] = new_Router_date;
                                this.router_select_history_date_of_Album = new_Router_date;
                                return;
                            }
                        }
                    }
                }
            }
        }
        if (this.router_history_datas_of_Album.length >= 36)
            this.router_history_datas_of_Album.shift();
        this.router_history_datas_of_Album.push(new_Router_date);
        this.router_select_history_date_of_Album = new_Router_date;
    },
    remove_router_history_of_Album(id: number){
        const index = this.router_history_datas_of_Album.findIndex(item => item.id === id);
        if (index !== -1) {
            this.router_history_datas_of_Album.splice(index + 1);
        }
    },
    fix_router_history_of_Album_scroller_value(value: number){
        const index = this.router_history_datas_of_Album.findIndex(item => item.id === (this.router_select_history_date_of_Album?.id ?? ''));
        if (index !== -1) {
            this.router_history_datas_of_Album[index].page_lists_scrollindex = value;
        }
    },
});