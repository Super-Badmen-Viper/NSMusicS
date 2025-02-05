import {reactive} from 'vue'

import {store_server_users} from "@/data/data_stores/server/store_server_users";

import {
    Media_Annotation_ApiService_of_ND
} from "../../../data_access/servers_configs/navidrome_api/services_normal/media_annotation/index_service";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {
    UserFavoriteItems_ApiService_of_Je
} from "../../../data_access/servers_configs/jellyfin_api/services_web/UserFavoriteItems/index_service";

export const store_server_data_set_artistInfo = reactive({
    async Set_ArtistInfo_To_Favorite_Server(id: string, value: Boolean) {
        if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
            if (!value) {
                await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .set_star(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        '', '', id);
            } else {
                await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .set_unstar(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        '', '', id);
            }
        }else if(
            store_server_user_model.model_server_type_of_web && (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby')
        ) {
            if (!value) {
                await new UserFavoriteItems_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).getUserFavoriteItems_Quick(
                    store_server_user_model.userid_of_Je,
                    id,
                )
            } else {
                await new UserFavoriteItems_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).delUserFavoriteItems_Quick(
                    store_server_user_model.userid_of_Je,
                    id,
                )
            }
        }
    },
    async Set_ArtistInfo_To_Rating_Server(id: any, value: number) {
        if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_rating(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    id,
                    String(value));
        }else if(
            store_server_user_model.model_server_type_of_web && (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby')
        ) {
            // Jellyfin does not support rating
        }
    },
    async Set_ArtistInfo_To_PlayCount_of_Artist_Server(item_id: any) {
        await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .set_scrobble(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                item_id, '', '');
    }
});