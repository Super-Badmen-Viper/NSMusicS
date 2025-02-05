import { reactive } from 'vue'
import {store_view_media_page_info} from "../../../music_page/page_media/store/store_view_media_page_info";
import {store_view_media_page_logic} from "../../../music_page/page_media/store/store_view_media_page_logic";
import {
    Get_Navidrome_Temp_Data_To_LocalSqlite
} from "../../../../../data/data_access/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_view_media_page_fetchData} from "../../../music_page/page_media/store/store_view_media_page_fetchData";
import {store_playlist_list_info} from "./store_playlist_list_info"
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {store_player_audio_info} from "../../../music_page/page_player/store/store_player_audio_info";
import {
    Get_Jellyfin_Temp_Data_To_LocalSqlite
} from "../../../../../data/data_access/servers_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite";

export const store_playlist_list_fetchData = reactive({
    async fetchData_PlayList(){
        store_playlist_list_info.playlist_MediaFiles_temporary =
            store_view_media_page_info.media_Files_temporary.map(
                (row) => {
                    row.play_id = row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000;
                    return row;
                });
        const media_file = store_playlist_list_info.playlist_MediaFiles_temporary.find(
            (row) => row.id === store_player_audio_info.this_audio_song_id
        );
        if (media_file) {
            store_player_audio_info.this_audio_play_id = media_file.play_id;
        }
        store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds =
            store_view_media_page_info.media_Files_temporary.map(
                item => item.id
            );
        store_app_configs_logic_save.save_system_playlist_item_id_config();
    },

    _totalCount: 0,

    _start: 0,
    _end: 30,

    _album_id: '',
    _artist_id: '',
    _album_artist_id: '', // Emby Home$Album
});