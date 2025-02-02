import {reactive} from 'vue'
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {
    Media_Annotation_ApiService_of_ND
} from "../../../data_access/servers_configs/navidrome_api/services_normal/media_annotation/index_service";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {Playlists_ApiService_of_ND} from "../../../data_access/servers_configs/navidrome_api/services_normal/playlists/index_service";
import {
    store_server_data_set_playlistInfo
} from "@/data/data_stores/server/server_data_synchronization/store_server_data_set_playlistInfo";
import {
    UserPlayedItems_ApiService_of_Je
} from "../../../data_access/servers_configs/jellyfin_api/services_web/UserPlayedItems/index_service";
import {
    UserFavoriteItems_ApiService_of_Je
} from "../../../data_access/servers_configs/jellyfin_api/services_web/UserFavoriteItems/index_service";
import {
    Playlists_ApiService_of_Je
} from "../../../data_access/servers_configs/jellyfin_api/services_web/Playlists/index_service";

export const store_server_data_set_mediaInfo = reactive({
    async Set_MediaInfo_To_Favorite(id: string, value: Boolean){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            if(!value) {
                await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .set_star(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        id,'','');
            }else{
                await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .set_unstar(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        id,'','');
            }
        }else if(
            store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin' ||
            store_server_users.server_config_of_current_user_of_sqlite?.type === 'emby'
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
    async Set_MediaInfo_To_Rating(id: any, value: number){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_rating(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    id,
                    String(value));
        }else if(
            store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin' ||
            store_server_users.server_config_of_current_user_of_sqlite?.type === 'emby'
        ) {
            // Jellyfin does not support rating
        }
    },
    async Set_MediaInfo_To_PlayCount_of_Media_File(item_id: any){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            await new Media_Annotation_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .set_scrobble(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    item_id, '', '');
        }else if(
            store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin' ||
            store_server_users.server_config_of_current_user_of_sqlite?.type === 'emby'
        ) {
            await new UserPlayedItems_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).getUserPlayedItems_Quick(
                store_server_user_model.userid_of_Je,
                item_id,
                new Date(
                    new Date().getTime() - new Date().getTimezoneOffset() * 60000).
                        toISOString().replace(/\.\d{3}Z$/, '.' + String(
                            new Date().getMilliseconds()).padEnd(7, '0') + 'Z').replace(
                                /%3A/g, ':')
            )
        }
    },

    async Set_MediaInfo_Add_Selected_Playlist(media_file_id: any, playlist_id: any){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .updatePlaylist_songIdToAdd(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    playlist_id, media_file_id);
        }else if(
            store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin' ||
            store_server_users.server_config_of_current_user_of_sqlite?.type === 'emby'
        ) {
            await new Playlists_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).postPlaylists_Add(
                playlist_id,
                media_file_id,
                store_server_user_model.userid_of_Je
            )
        }
    },
    async Set_MediaInfo_Delete_Selected_Playlist(media_file_id: any, playlist_id: any){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            const index = await store_server_data_set_playlistInfo.Set_PlaylistInfo_To_Update_GetPlaylist_MediaIndex(
                playlist_id, [media_file_id]
            )
            await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .updatePlaylist_songIndexToRemove(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    playlist_id, index[0]);
        }else if(
            store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin' ||
            store_server_users.server_config_of_current_user_of_sqlite?.type === 'emby'
        ) {
            // Jellyfin does not support rating Delete Selected Playlist_item
            await new Playlists_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).delPlaylists_Remove(
                playlist_id,
                media_file_id
            )
        }
    }
});