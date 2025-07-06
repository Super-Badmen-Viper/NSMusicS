import {reactive} from 'vue'
import {
    Media_Annotation_ApiService_of_ND
} from "@/data/data_access/servers_configs/navidrome_api/services_normal/media_annotation/index_service";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {
    store_server_login_info
} from "@/views/view_server/page_login/store/store_server_login_info";
import {
    Annotation_ApiService_of_NineSong
} from "@/data/data_access/servers_configs/ninesong_api/services_web/Scene/Music/Annotation/index_service";

export const store_server_data_set_annotionInfo = reactive({
    async Set_MediaInfo_Add_Selected_Favorite_Server(ids: string[], value: Boolean) {
        if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
            for (const id of ids) {
                await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .set_star(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        id, '', '');
            }
        }else if(
            store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong'
        ) {
            await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url)
                .setStar(ids.join(','), 'media')
        }
    },
    async Set_MediaInfo_Delete_Selected_Favorite_Server(ids: string[], value: Boolean) {
        if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
            for (const id of ids) {
                await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .set_unstar(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        id, '', '');
            }
        }else if(
            store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong'
        ) {
            await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url)
                .setUnStar(ids.join(','), 'media')
        }
    },
});