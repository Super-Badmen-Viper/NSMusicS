import { reactive } from 'vue'
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {
    Get_Navidrome_Temp_Data_To_LocalSqlite
} from "@/features/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite";
import {store_server_users} from "@/store/server/store_server_users";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";

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
        store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds = store_view_media_page_info.media_Files_temporary.map(item => item.id);
        store_app_configs_logic_save.save_system_playlist_item_id_config();
    },

    _totalCount: 0,
    _start: 0,
    _end: 100,
    _album_id: '',
    _artist_id: '',
    async fetchData_PlayList_of_server_web_end(){
        this._start += 100;
        this._end += 100;
        await this.fetchData_PlayList_of_server_web()
    },
    async fetchData_PlayList_of_server_web(){
        const _search = (store_view_media_page_logic.page_songlists_keywordFilter || '').match(/%([^%]+)%/)?.[1] || '';
        const selected = store_view_media_page_logic.page_songlists_selected;
        ///
        let _sort = store_view_media_page_logic.page_songlists_options_Sort_key.length > 0 && store_view_media_page_logic.page_songlists_options_Sort_key[0].order !== 'default' ?
            store_view_media_page_logic.page_songlists_options_Sort_key[0].columnKey : 'id';
        let _order = store_view_media_page_logic.page_songlists_options_Sort_key.length > 0 && store_view_media_page_logic.page_songlists_options_Sort_key[0].order !== 'default' ?
            store_view_media_page_logic.page_songlists_options_Sort_key[0].order.replace('end', '') : 'ASC';
        ///
        let _starred = '';
        let playlist_id = '';
        if (selected === 'song_list_love') {
            _starred = true
        } else if (selected === 'song_list_recently') {
            _order = 'DESC'
            _sort = 'playDate'
        } else if (selected != 'song_list_all') {
            playlist_id = selected
        }
        let get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
        await get_Navidrome_Temp_Data_To_LocalSqlite.get_play_list(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_users.server_config_of_current_user_of_sqlite?.user_name,
            store_server_user_model.token,
            store_server_user_model.salt,
            String(this._end),_order,_sort,String(this._start),
            _search,_starred,playlist_id,
            this._album_id,this._artist_id
        )
    },
    fetchData_PlayList_of_data_synchronization_to_Media(){
        store_playlist_list_info.playlist_MediaFiles_temporary.forEach((row) => {
            const existingIndex = store_view_media_page_info.media_Files_temporary.findIndex(
                (item) => item.id === row.id
            );
            if (existingIndex === -1) {
                const newRow = { ...row };
                delete newRow.play_id;
                store_view_media_page_info.media_Files_temporary.push(newRow);
            }
        });
        store_view_media_page_fetchData._start = store_playlist_list_fetchData._start
        store_view_media_page_fetchData._end = store_playlist_list_fetchData._end
        store_view_media_page_fetchData._album_id = store_playlist_list_fetchData._album_id
        store_view_media_page_fetchData._artist_id = store_playlist_list_fetchData._artist_id
    }
});