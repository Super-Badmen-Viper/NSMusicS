import {reactive, watch} from 'vue'
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_server_user_model} from "@/store/server/store_server_user_model";

export const store_playlist_list_info = reactive({
    playlist_names_ALLLists: [],
    playlist_datas_CurrentPlayList_ALLMediaIds: [],
    playlist_tracks_temporary_of_ALLLists: [],

    playlist_MediaFiles_temporary: [],
});
watch(() => store_playlist_list_info.playlist_MediaFiles_temporary, async (newValue) => {
    store_app_configs_logic_save.save_system_playlist_item_id_config();
});
