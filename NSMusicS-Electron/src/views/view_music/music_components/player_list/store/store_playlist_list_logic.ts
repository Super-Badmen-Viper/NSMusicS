import { reactive, ref } from 'vue'
import {store_playlist_list_info} from "./store_playlist_list_info"
import {
    Get_PlaylistInfo_From_LocalSqlite
} from "../../../../../data/data_access/local_configs/class_Get_PlaylistInfo_From_LocalSqlite";
import {
    store_local_data_set_playlistInfo
} from "@/data/data_stores/local/local_data_synchronization/store_local_data_set_playlistInfo";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import axios from "axios";

export const store_playlist_list_logic = reactive({
    async reset_data() {
        store_playlist_list_info.playlist_names_ALLLists = []
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists = []
        if (store_server_user_model.model_select === 'server') {
            await store_server_user_model.Get_UserData_Synchronize_PlayList()
        } else {
            try {
                let get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
                const playlist_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist()
                playlist_temporary.forEach((item: Play_List) => {
                    store_playlist_list_info.playlist_names_ALLLists.push({
                        label: item.name,
                        value: item.id
                    })
                    store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
                        playlist: item,
                        playlist_tracks: get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Tracks(item.id)
                    })
                });
            } catch (e) {
                console.error(e)
            }
        }
    },

    playlist_names_StartUpdate: false,
    media_page_handleItemDbClick: false,

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
        this.playlist_names_StartUpdate = true
    },
    get_playlist_tracks_temporary_update(value: any){
        store_local_data_set_playlistInfo.Set_PlaylistInfo_To_Update_SetPlaylist(
            value.id,value.name,
            'admin',0,0,0,'admin'
        )
        const index = store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.findIndex((list: any) => list.playlist.id === value.id);
        if (index >= 0) {
            store_playlist_list_info.playlist_tracks_temporary_of_ALLLists[index].playlist.name = value.name;
            this.playlist_names_StartUpdate = true
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
            this.playlist_names_StartUpdate = true
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
    async get_playlist_tracks_temporary_update_media_file(value: any){
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