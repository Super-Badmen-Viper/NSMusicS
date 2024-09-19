import {reactive} from 'vue'

import {store_server_users} from "@/store/server/store_server_users";

import {
    Media_Annotation_ApiService_of_ND
} from "@/features/servers_configs/navidrome_api/services_normal/media_annotation/index_service";
import {store_server_user_model} from "@/store/server/store_server_user_model";

export const store_server_data_set_albumInfo = reactive({
    async Set_AlbumInfo_To_Favorite(id: string, value: Boolean) {
        if(!value) {
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_star(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    '',id,'');
        }else{
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_unstar(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    '',id,'');
        }
    },
    async Set_AlbumInfo_To_Rating(id: any, value: any) {
        await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .set_rating(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                id,
                String(value));
    },
    async Set_AlbumInfo_To_PlayCount_of_Album(item_id: any) {
        await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .set_scrobble(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                item_id, '', '');
    }
});