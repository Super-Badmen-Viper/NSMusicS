import {reactive} from 'vue'
import {Playlists_ApiService_of_ND} from "../../../data_access/servers_configs/navidrome_api/services_normal/playlists/index_service";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {
    Playlists_ApiService_of_Je
} from "../../../data_access/servers_configs/jellyfin_api/services_web/Playlists/index_service";
import {
    Items_ApiService_of_Je
} from "../../../data_access/servers_configs/jellyfin_api/services_web/Items/index_service";

export const store_server_data_set_playlistInfo = reactive({
    async Set_PlaylistInfo_To_Update_CreatePlaylist(name: string, _public_: boolean){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            const getCreatePlaylist_set_id = await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .createPlaylist_set(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    name
                );
            try {
                return getCreatePlaylist_set_id["subsonic-response"]["playlist"]["id"]
            } catch {
                return ''
            }
        }else if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin') {
            return await new Playlists_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).postPlaylists_Create(
                name, '', 'Audio',
                store_server_user_model.userid_of_Je
            )
        }
    },
    async Set_PlaylistInfo_To_Update_SetPlaylist(id: string, name: string,comment: string, _public_: boolean,){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .updatePlaylist_infoUpdate(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    id, name, comment, String(_public_)
                );
        }else if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin') {
            // Jellyfin-api does not support updating playlist information
            // await new Playlists_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).postPlaylists_Update(
            //     id, _public_, name
            // )
        }
    },
    async Set_PlaylistInfo_To_Update_DeletePlaylist(id:string){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .deletePlaylist_set(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    id
                );
        }else if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin') {
            await new Items_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).delItems_List_Quick(
                id
            )
        }
    },

    async Set_Selected_MediaInfo_Add_Selected_Playlist(ids: string[], playlist_id: string){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            for (const id of ids) {
                await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .updatePlaylist_songIdToAdd(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        playlist_id, id);
            }
        }else if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin') {
            await new Playlists_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).postPlaylists_Add(
                playlist_id,
                ids.join(','),
                store_server_user_model.userid_of_Je
            )
        }
    },
    async Set_Selected_MediaInfo_Delete_Selected_Playlist(ids: string[], playlist_id: string){
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            const indexs = await this.Set_PlaylistInfo_To_Update_GetPlaylist_MediaIndex(
                playlist_id, ids
            );
            for (let i = 0; i < indexs.length; i++) {
                const index = indexs[i];
                await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                    .updatePlaylist_songIndexToRemove(
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                        playlist_id, index
                    );
                /// navidrome delete logic bug, Delete based on song number, but cannot support simultaneous deletion of multiple numbers
                for (let j = i + 1; j < indexs.length; j++) {
                    indexs[j] -= 1;
                }
            }
        }else if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin') {
            // Jellyfin does not support rating Delete Selected Playlist_item
            // await new Playlists_ApiService_of_Je(store_server_users.server_config_of_current_user_of_sqlite?.url).delPlaylists_Remove(
            //     playlist_id,
            //     ids.join(',')
            // )
        }
        // for (const id of ids) {
        //     const indexs = await this.Set_PlaylistInfo_To_Update_GetPlaylist_MediaIndex(
        //         playlist_id, [id]
        //     )
        //     await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
        //         .updatePlaylist_songIndexToRemove(
        //             store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
        //             playlist_id, indexs[0]);
        // }
    },

    async Set_PlaylistInfo_To_Update_GetPlaylist_MediaIndex(playlist_id: string, ids: string[]) {
        if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'navidrome') {
            const getPlaylist_id = await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .getPlaylist_id(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    playlist_id
                );
            try {
                const songlist = getPlaylist_id["subsonic-response"]["playlist"]["entry"];
                const result = [];
                for (const id of ids) {
                    const index = songlist.findIndex((song: any) => song.id === id);
                    if (index !== -1) {
                        result.push(index);
                    }
                }
                return result;
            } catch {
                return [];
            }
        }else if(store_server_users.server_config_of_current_user_of_sqlite?.type === 'jellyfin') {

        }
    }
});