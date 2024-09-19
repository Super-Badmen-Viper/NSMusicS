import {reactive} from 'vue'
import {Playlists_ApiService_of_ND} from "@/features/servers_configs/navidrome_api/services_normal/playlists/index_service";
import {store_server_users} from "@/store/server/store_server_users";
import {store_server_user_model} from "@/store/server/store_server_user_model";

export const store_server_data_set_playlistInfo = reactive({
    async Set_PlaylistInfo_To_Update_CreatePlaylist_of_ND(name: string, _public_: boolean){
        const getCreatePlaylist_set_id = await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .createPlaylist_set(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                name
            );
        try {
            return getCreatePlaylist_set_id["subsonic-response"]["playlist"]["id"]
        }catch{
            return ''
        }
    },
    async Set_PlaylistInfo_To_Update_SetPlaylist_of_ND(id: string, name: string,comment: string, _public_: boolean,){
        await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .updatePlaylist_infoUpdate(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                id, name, comment, String(_public_)
            );
    },
    async Set_PlaylistInfo_To_Update_DeletePlaylist_of_ND(id:string){
        await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
            .deletePlaylist_set(
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                id
            );
    },

    async Set_Selected_MediaInfo_Add_Selected_Playlist(ids: string[], playlist_id: string){
        for (const id of ids) {
            await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
                .updatePlaylist_songIdToAdd(
                    store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
                    playlist_id, id);
        }
    },
    async Set_Selected_MediaInfo_Delete_Selected_Playlist(ids: string[], playlist_id: string){
        const indexs = await this.Set_PlaylistInfo_To_Update_GetPlaylist_SongIndex_of_ND(
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
        // for (const id of ids) {
        //     const indexs = await this.Set_PlaylistInfo_To_Update_GetPlaylist_SongIndex_of_ND(
        //         playlist_id, [id]
        //     )
        //     await new Playlists_ApiService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest')
        //         .updatePlaylist_songIndexToRemove(
        //             store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
        //             playlist_id, indexs[0]);
        // }
    },

    async Set_PlaylistInfo_To_Update_GetPlaylist_SongIndex_of_ND(playlist_id: string, ids: string[]) {
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
    }
});