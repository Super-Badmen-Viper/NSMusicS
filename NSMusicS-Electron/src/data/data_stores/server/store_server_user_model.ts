import {reactive, watch} from 'vue'
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_playlist_list_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_info"
import {store_player_audio_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_info";
import {store_router_data_logic} from "@/router/router_store/store_router_data_logic";
import {store_playlist_list_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_components/player_list/store/store_playlist_list_logic"
import {store_app_configs_logic_load} from "@/data/data_stores/app/store_app_configs_logic_load";
import {
    User_Authorization_ApiWebService_of_ND
} from "@/data/data_access/servers_configs/navidrome_api/services_web/user_authorization/index_service";
import {store_player_audio_logic} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_logic";
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';
import {
    store_view_media_page_logic
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_logic";
import {
    store_view_album_page_logic
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_album/store/store_view_album_page_logic";
import {
    store_view_artist_page_logic
} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_artist/store/store_view_artist_page_logic";

export const store_server_user_model = reactive({
    model_select: 'server',
    server_select: '',
    server_select_kind: '',

    username: '',
    salt: '',
    token: '',
    password: '',
    authorization_of_nd: '',

    server_login_model_of_apikey: false,
    userid_of_Je: '',
    authorization_of_Je: '',
    parentid_of_Je: [],
    parentid_of_Je_Music: '',

    model_server_type_of_web: true,
    model_server_type_of_local: false,
    model_server_type_of_local_server_download: false,
    client_unique_id: '',
    server_get_count: 15,

    album: 'album',
    annotation: 'annotation',
    artist: 'artist',
    media_file: 'media_file',
    playlist: 'playlist',
    playlist_tracks: 'playlist_tracks',

    library_path: '',

    random_play_model: false,
    random_play_model_add: false,

    async switchToMode_Local(){
        this.album = 'album'
        this.annotation = 'annotation'
        this.artist = 'artist'
        this.media_file = 'media_file'
        this.playlist = 'playlist'
        this.playlist_tracks = 'playlist_tracks'

        store_server_user_model.model_server_type_of_local_server_download = false

        store_server_user_model.model_select = 'local'
        await this.switchToMode()
    },
    async switchToMode_Server(){
        this.album = 'server_album'
        this.annotation = 'server_annotation'
        this.artist = 'server_artist'
        this.media_file = 'server_media_file'
        this.playlist = 'server_playlist'
        this.playlist_tracks = 'server_playlist_tracks'

        store_server_user_model.model_select = 'server'
        await this.switchToMode()
    },
    async switchToMode(){
        if(!store_app_configs_logic_load.app_configs_loading) {
            store_server_user_model.random_play_model = false;
            // Refresh Current AudioInfo
            await store_player_audio_info.reset_data();
            store_view_media_page_logic.page_songlists_selected = 'song_list_all'
            store_view_album_page_logic.page_albumlists_selected = 'album_list_all'
            store_view_artist_page_logic.page_artistlists_selected = 'artist_list_all'
            if(store_player_audio_logic.player_select === 'mpv') {
                if(isElectron) {
                    await ipcRenderer.invoke('mpv-stopped');
                } else {
                    // other
                }
            }
            //
            if (store_server_user_model.model_select === 'server') {
                store_server_users.percentage_of_nd = 100
                store_server_users.percentage_of_local = 0
                // auto model_server_type_of_web
                store_server_user_model.model_server_type_of_web = true
                store_router_data_info.store_router_history_data_of_local = false
                store_router_data_info.store_router_history_data_of_web = true
            } else {
                store_server_users.percentage_of_nd = 0
                store_server_users.percentage_of_local = 100
                //
                store_server_user_model.model_server_type_of_local = true
                store_server_user_model.model_server_type_of_web = false
                //
                store_router_data_info.store_router_history_data_of_local = true
                store_router_data_info.store_router_history_data_of_web = false
            }
            //
            try {
                await store_player_audio_logic.init_player()
            } catch {}
            // Refresh Playlist(Local / Server)
            await store_playlist_list_logic.reset_data()
            store_playlist_list_info.playlist_MediaFiles_temporary = []
            // Refresh Router Data
            store_router_data_logic.reset_data()
            //
            store_app_configs_logic_save.save_system_config_of_App_Configs()
        }
    },
    
    async refresh_model_server_type_of_web(){
        let user_Authorization_ApiWebService_of_ND =
            new User_Authorization_ApiWebService_of_ND(store_server_users.server_config_of_current_user_of_sqlite?.url)
        await user_Authorization_ApiWebService_of_ND.get_token()
        store_app_configs_logic_save.save_system_config_of_App_Configs()
    },
})
watch(() => store_server_user_model.model_server_type_of_web, (newValue) => {
    store_server_user_model.model_server_type_of_local = !newValue
    if(store_server_user_model.model_server_type_of_web) {
        store_router_data_info.store_router_history_data_of_local = false
        store_router_data_info.store_router_history_data_of_web = true
    }else{
        store_router_data_info.store_router_history_data_of_local = true
        store_router_data_info.store_router_history_data_of_web = false
    }
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_server_user_model.model_server_type_of_local, (newValue) => {
    store_server_user_model.model_server_type_of_web = !newValue
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});