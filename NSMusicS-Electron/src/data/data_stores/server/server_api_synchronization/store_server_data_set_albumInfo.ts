import {reactive} from 'vue'

import {store_server_users} from "@/data/data_stores/server/store_server_users";

import {
    Media_Annotation_ApiService_of_ND
} from "@/data/data_access/servers_configs/navidrome_api/services_normal/media_annotation/index_service";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {
    UserFavoriteItems_ApiService_of_Je
} from "@/data/data_access/servers_configs/jellyfin_api/services_web/UserFavoriteItems/index_service";
import {
    Annotation_ApiService_of_NineSong
} from "@/data/data_access/servers_configs/ninesong_api/services_web/Scene/Music/Annotation/index_service";
import {
    store_server_login_info
} from "@/views/view_server/page_metadata/page_login/store/store_server_login_info";

export const store_server_data_set_albumInfo = reactive({
    async Set_AlbumInfo_To_Favorite_Server(item_id: string, value: Boolean) {
        if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
            if (!value) {
                await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .set_star(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        '', item_id, '');
            } else {
                await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .set_unstar(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        '', item_id, '');
            }
        }else if(store_server_user_model.model_server_type_of_web) {
            if(store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby') {
                if (!value) {
                    await new UserFavoriteItems_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).getUserFavoriteItems_Quick(
                        store_server_user_model.userid_of_Je,
                        item_id,
                    )
                } else {
                    await new UserFavoriteItems_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).delUserFavoriteItems_Quick(
                        store_server_user_model.userid_of_Je,
                        item_id,
                    )
                }
            }else if(store_server_users.server_select_kind === 'ninesong') {
                if (!value) {
                    await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url)
                        .setStar(item_id, 'album');
                } else {
                    await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url)
                        .setUnStar(item_id, 'album');
                }
            }
        }
    },
    async Set_AlbumInfo_To_Rating_Server(item_id: any, value: any) {
        if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_rating(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    item_id,
                    String(value));
        }else if(
            store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong'
        ) {
            await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url)
                .setRating(item_id, 'album', String(value));
        }
    },
    async Set_AlbumInfo_To_PlayCount_of_Album_Server(item_id: any) {
        if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_scrobble(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    item_id, '', '');
        }else if(
            store_server_user_model.model_server_type_of_web && store_server_users.server_select_kind === 'ninesong'
        ) {
            await new Annotation_ApiService_of_NineSong(store_server_login_info.server_url)
                .setScrobble(item_id, 'album');
        }
    }
});