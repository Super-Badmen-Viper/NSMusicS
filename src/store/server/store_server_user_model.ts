import {reactive, ref, watch} from 'vue'
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";

export const store_server_user_model = reactive({
    model_select: 'local',
    library_path: '',

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
    }
})
watch(() => store_server_user_model.library_path, (newValue) => {
    store_server_user_model.library_path = newValue
    store_app_configs_logic_save.save_system_library_config()
    store_router_data_info.router_name = 'View_Song_List_ALL';
    store_app_configs_info.app_left_menu_select_activeKey = 'go_songs_list';
    store_app_configs_logic_save.save_system_config_of_View_Router_History()
});