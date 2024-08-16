import { reactive } from 'vue'
import {
    Set_PlaylistInfo_To_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Set_PlaylistInfo_To_LocalSqlite";
import {store_playlist_list_info} from "@/store/playlist/store_playlist_list_info";
import {
    Get_PlaylistInfo_From_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Get_PlaylistInfo_From_LocalSqlite";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {
    store_local_data_set_playlistInfo
} from "@/store/local/local_data_synchronization/store_local_data_set_playlistInfo";

export const store_playlist_list_logic = reactive({
    playlist_names_StartUpdate: false,

    get_playlist_tracks_temporary_add(value: any){
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
            playlist: store_local_data_set_playlistInfo.Set_PlaylistInfo_To_Update_CreatePlaylist_of_ND(
                value,
                'admin',0,0,0,'admin'
            ),
            playlist_tracks: []
        })
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
    },
    get_playlist_tracks_temporary_update(value: any){
        store_local_data_set_playlistInfo.Set_PlaylistInfo_To_Update_SetPlaylist_of_ND(
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
        store_local_data_set_playlistInfo.Set_PlaylistInfo_To_Update_DeletePlaylist_of_ND(value)
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
    get_playlist_tracks_temporary_update_media_file(value: any){
        store_playlist_list_info.playlist_names_ALLLists = []
        store_playlist_list_info.playlist_tracks_temporary_of_ALLLists = []
        let get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
        get_PlaylistInfo_From_LocalSqlite.Get_Playlist().forEach((item:Play_List) =>{
            store_playlist_list_info.playlist_names_ALLLists.push({
                label: item.name,
                value: item.id
            })
            store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.push({
                playlist: item,
                playlist_tracks: get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Tracks(item.id)
            })
        });
        store_view_media_page_logic.list_data_StartUpdate = true
    },
});