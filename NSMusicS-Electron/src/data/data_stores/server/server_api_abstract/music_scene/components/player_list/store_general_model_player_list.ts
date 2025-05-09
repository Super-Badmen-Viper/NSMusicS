import { reactive } from 'vue'
import {store_playlist_list_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_info"
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_playlist_list_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_logic"
import {
    Get_PlaylistInfo_From_LocalSqlite
} from "@/data/data_access/local_configs/class_Get_PlaylistInfo_From_LocalSqlite";
import {
    Set_Navidrome_ALL_Data_To_LocalSqlite
} from "@/data/data_access/servers_configs/navidrome_api/services_normal_middleware/class_Set_Navidrome_ALL_Data_To_LocalSqlite";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {
    Get_Jellyfin_Temp_Data_To_LocalSqlite
} from "@/data/data_access/servers_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite";

export const store_general_model_player_list = reactive({
    async get_playlists_info() {
        const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(item => item.id === store_server_users.server_config_of_current_user_of_sqlite?.id);
        const user_config = store_server_users.server_config_of_all_user_of_sqlite[index]
        if(user_config?.type === 'navidrome'){
            let set_Navidrome_Data_To_LocalSqlite = new Set_Navidrome_ALL_Data_To_LocalSqlite();
            await set_Navidrome_Data_To_LocalSqlite.Set_Read_Navidrome_Api_PlayListInfo_Add_LocalSqlite(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
            );
        }else if(user_config?.type === 'jellyfin' || user_config?.type === 'emby'){
            let get_Jellyfin_Temp_Data_To_LocalSqlite = new Get_Jellyfin_Temp_Data_To_LocalSqlite()
            await get_Jellyfin_Temp_Data_To_LocalSqlite.get_playlist_je()
        }
    },
    get_playlist_tracks_temporary_add(value: any){
        const playlist = store_local_data_set_playlistInfo.Set_PlaylistInfo_To_Update_CreatePlaylist(
            value,
            'admin',0,0,0,'admin'
        )
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
            playlist: playlist,
            playlist_tracks: []
        })
        store_playlist_list_info.playlist_names_ALLLists = []
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.forEach((item: any) => {
            if (item.playlist && item.playlist.name && item.playlist.id) {
                store_playlist_list_info.playlist_names_ALLLists.push({
                    label: item.playlist.name,
                    value: item.playlist.id
                });
            }
        });
        store_playlist_list_logic.playlist_names_StartUpdate = true
    },
    get_playlist_tracks_temporary_update(value: any){
        store_local_data_set_playlistInfo.Set_PlaylistInfo_To_Update_SetPlaylist(
            value.id,value.name,
            'admin',0,0,0,'admin'
        )
        const index = store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.findIndex((list: any) => list.playlist.id === value.id);
        if (index >= 0) {
            store_playlist_list_info.playlist_tracks_temporary_of_ALLLists[index].playlist.name = value.name;
            store_playlist_list_logic.playlist_names_StartUpdate = true
            store_playlist_list_info.playlist_names_ALLLists = []
            store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.forEach((item: any) => {
                if (item.playlist && item.playlist.name && item.playlist.id) {
                    store_playlist_list_info.playlist_names_ALLLists.push({
                        label: item.playlist.name,
                        value: item.playlist.id
                    });
                }
            });
        }
    },
    get_playlist_tracks_temporary_delete(value: any){
        store_local_data_set_playlistInfo.Set_PlaylistInfo_To_Update_DeletePlaylist(value)
        const index = store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.findIndex((list: any) => list.playlist.id === value);
        if (index >= 0) {
            store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.splice(index,1)
            store_playlist_list_logic.playlist_names_StartUpdate = true
            store_playlist_list_info.playlist_names_ALLLists = []
            store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.forEach((item: any) => {
                if (item.playlist && item.playlist.name && item.playlist.id) {
                    store_playlist_list_info.playlist_names_ALLLists.push({
                        label: item.playlist.name,
                        value: item.playlist.id
                    });
                }
            });
        }
    },
    async get_playlist_tracks_temporary_update_media_file(){
        store_playlist_list_info.playlist_names_ALLLists = []
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists = []
        if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
            let get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
            get_PlaylistInfo_From_LocalSqlite.Get_Playlist().forEach((item: Play_List) => {
                store_playlist_list_info.playlist_names_ALLLists.push({
                    label: item.name,
                    value: item.id
                })
                store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
                    playlist: item,
                    playlist_tracks: get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Tracks(item.id)
                })
            });
        }else if(
            store_server_user_model.model_server_type_of_web && (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby')
        ) {
            const response_playlists = await axios(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/Users/' +
                store_server_user_model.userid_of_Je + '/Items?IncludeItemTypes=Playlist&Recursive=true&api_key=' +
                store_server_user_model.authorization_of_Je
            );
            const playlists = response_playlists.data.Items;
            if (playlists != null) {
                for (const playlist of playlists) {
                    store_playlist_list_info.playlist_names_ALLLists.push({
                        label: playlist.Name,
                        value: playlist.Id
                    })
                    store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
                        playlist: {
                            label: playlist.Name,
                            value: playlist.Id,
                            id: playlist.Id,
                            name: playlist.Name,
                            comment: '',
                            duration: playlist.RunTimeTicks || 0,
                            song_count: playlist.ChildCount || 0,
                            public: 0,
                            created_at: '',
                            updated_at: '',
                            path: '',
                            sync: 0,
                            size: 0,
                            rules: null,
                            evaluated_at: '',
                            owner_id: store_server_user_model.username,
                        },
                        playlist_tracks: []
                    });
                }
            }
        }
        // store_view_media_page_logic.list_data_StartUpdate = true
    },
});