import {reactive, ref, watch} from 'vue'
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {
    Set_Navidrome_Data_To_LocalSqlite
} from "@/features/servers_configs/navidrome_api/middleware/class_Set_Navidrome_Data_To_LocalSqlite";
import {store_server_users} from "@/store/server/store_server_users";
import {
    Get_PlaylistInfo_From_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Get_PlaylistInfo_From_LocalSqlite";
import {store_playlist_list_info} from "@/store/playlist/store_playlist_list_info";

export const store_server_user_model = reactive({
    model_select: 'local',
    server_select: '',
    library_path: '',

    username: '',
    salt: '',
    token: '',
    password: '',

    album: 'album',
    annotation: 'annotation',
    artist: 'artist',
    media_file: 'media_file',
    playlist: 'playlist',
    playlist_tracks: 'playlist_tracks',

    switchToMode_Local(){
        this.album = 'album'
        this.annotation = 'annotation'
        this.artist = 'artist'
        this.media_file = 'media_file'
        this.playlist = 'playlist'
        this.playlist_tracks = 'playlist_tracks'
    },
    switchToMode_Navidrome_Api(){
        this.album = 'server_album'
        this.annotation = 'server_annotation'
        this.artist = 'server_artist'
        this.media_file = 'server_media_file'
        this.playlist = 'server_playlist'
        this.playlist_tracks = 'server_playlist_tracks'
    },

    async Get_UserData_Synchronize_ToLocal_of_ND() {
        let set_Navidrome_Data_To_LocalSqlite = new Set_Navidrome_Data_To_LocalSqlite();
        await set_Navidrome_Data_To_LocalSqlite.Set_Read_Navidrome_Api_PlayListInfo_Add_LocalSqlite(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt,
        );
    },
})
watch(() => store_server_user_model.library_path, (newValue) => {
    store_app_configs_logic_save.save_system_library_config()
    store_router_data_info.router_name = 'View_Song_List_ALL';
    store_app_configs_logic_save.save_system_config_of_View_Router_History()
});
watch(() => store_server_user_model.model_select, async (newValue) => {
    // Refresh Playlist(Local / Server)
    store_playlist_list_info.playlist_names_ALLLists = []
    store_playlist_list_info.playlist_tracks_temporary_of_ALLLists = []
    if (store_server_user_model.model_select === 'navidrome') {
        await store_server_user_model.Get_UserData_Synchronize_ToLocal_of_ND()
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
});