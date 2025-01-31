import {reactive} from 'vue'

import {store_server_users} from "@/data/data_stores/server/store_server_users";

import {
    Media_Annotation_ApiService_of_ND
} from "../../../data_access/servers_configs/navidrome_api/services_normal/media_annotation/index_service";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {
    UserFavoriteItems_ApiService_of_Je
} from "../../../data_access/servers_configs/jellyfin_api/services_web/UserFavoriteItems/index_service";

export const store_server_data_set_albumInfo = reactive({
    async Set_AlbumInfo_To_Favorite(id: string, value: Boolean) {
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            if (!value) {
                await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .set_star(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        '', id, '');
            } else {
                await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .set_unstar(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        '', id, '');
            }
        }else if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin') {
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
    async Set_AlbumInfo_To_Rating(id: any, value: any) {
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_rating(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    id,
                    String(value));
        }else if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin') {
            // Jellyfin does not support rating
        }
    },
    async Set_AlbumInfo_To_PlayCount_of_Album(item_id: any) {
        await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .set_scrobble(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                item_id, '', '');
    }
});