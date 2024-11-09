import {reactive, watch} from 'vue'
import {store_server_user_model} from "@/store/server/store_server_user_model";

export const store_player_info_modify = reactive({
    player_show_info_modify: false,
    player_current_media_path: '',
    player_current_media_info: null,
});
watch(() => store_player_info_modify.player_show_info_modify, async (newValue) => {
    if(newValue) {
        if(store_server_user_model.model_server_type_of_local) {
            if(store_player_info_modify.player_current_media_path != undefined && store_player_info_modify.player_current_media_path.length > 0) {
                store_player_info_modify.player_current_media_info = undefined;
            }
        }
    }
});