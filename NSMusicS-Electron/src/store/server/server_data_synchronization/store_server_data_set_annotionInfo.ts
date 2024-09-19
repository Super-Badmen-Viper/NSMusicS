import {reactive} from 'vue'
import {
    Media_Annotation_ApiService_of_ND
} from "@/features/servers_configs/navidrome_api/services_normal/media_annotation/index_service";
import {store_server_users} from "@/store/server/store_server_users";
import {store_server_user_model} from "@/store/server/store_server_user_model";

export const store_server_data_set_annotionInfo = reactive({
    async Set_MediaInfo_Add_Selected_Favorite(ids: string[], value: Boolean) {
        for (const id of ids) {
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_star(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    id,'','');
        }
    },
    async Set_MediaInfo_Delete_Selected_Favorite(ids: string[], value: Boolean) {
        for (const id of ids) {
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_unstar(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    id,'','');
        }
    },
});