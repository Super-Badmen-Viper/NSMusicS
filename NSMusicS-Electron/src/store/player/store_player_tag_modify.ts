import {reactive, watch} from 'vue'
const { ipcRenderer } = require('electron');
import {store_server_user_model} from "@/store/server/store_server_user_model";

export const store_player_tag_modify = reactive({
    player_show_tag_modify: false,
    player_current_media_path: '',
    player_current_media_tag: null,
});
watch(() => store_player_tag_modify.player_show_tag_modify, async (newValue) => {
    if(newValue) {
        if(store_server_user_model.model_server_type_of_local) {
            if(store_player_tag_modify.player_current_media_path != undefined && store_player_tag_modify.player_current_media_path.length > 0) {
                store_player_tag_modify.player_current_media_tag = await ipcRenderer.invoke('node-taglib-sharp-get-media-tag',
                    store_player_tag_modify.player_current_media_path
                );
            }
        }else{
            store_player_tag_modify.player_current_media_tag = '目前仅能在本地模式浏览|修改tag信息'
        }
    }
});