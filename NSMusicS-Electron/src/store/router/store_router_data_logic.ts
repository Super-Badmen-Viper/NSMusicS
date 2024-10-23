import {reactive, watch} from 'vue'
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_view_home_page_info} from "@/store/view/home/store_view_home_page_info";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_view_album_page_info} from "@/store/view/album/store_view_album_page_info";
import {store_view_artist_page_info} from "@/store/view/artist/store_view_artist_page_info";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_view_album_page_logic} from "@/store/view/album/store_view_album_page_logic";
import {store_view_artist_page_logic} from "@/store/view/artist/store_view_artist_page_logic";
import {store_router_history_data_of_media} from "@/store/router/store_router_history_data_of_media";
import {store_router_history_data_of_album} from "@/store/router/store_router_history_data_of_album";
import {store_router_history_data_of_artist} from "@/store/router/store_router_history_data_of_artist";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {
    Get_Navidrome_Temp_Data_To_LocalSqlite
} from "@/features/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite";
import {store_server_users} from "@/store/server/store_server_users";
import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";

export const store_router_data_logic = reactive({
    reset_data(){
        store_view_media_page_logic.page_songlists_keywordFilter = ""
        store_view_media_page_logic.page_songlists_selected = 'song_list_all'
        store_view_album_page_logic.page_albumlists_keyword = ''
        store_view_album_page_logic.page_albumlists_selected = 'album_list_all'
        store_view_artist_page_logic.page_artistlists_keyword = ''
        store_view_artist_page_logic.page_artistlists_selected = 'artist_list_all'
        store_router_history_data_of_media.router_history_datas_of_Media = []
        store_router_history_data_of_album.router_history_datas_of_Album = []
        store_router_history_data_of_artist.router_history_datas_of_Artist = []
        store_router_history_data_of_media.router_select_history_date_of_Media = 'song_list_all'
        store_router_history_data_of_album.router_select_history_date_of_Album = 'album_list_all'
        store_router_history_data_of_artist.router_select_history_date_of_Artist = 'artist_list_all'
    },

    clear_Memory_Model: false,
    get_clear_Memory_Model(value: any){
        if(value) {
            store_router_data_logic.clear_Equilibrium_Model = false;
            store_router_data_logic.clear_UserExperience_Model = false;
        }else{
            store_router_data_logic.clear_Equilibrium_Model = false;
            store_router_data_logic.clear_UserExperience_Model = true;
        }
        store_app_configs_logic_save.save_system_config_of_App_Configs()
    },
    clear_Equilibrium_Model: false,
    get_clear_Equilibrium_Model(value: any){
        if(value) {
            store_router_data_logic.clear_Memory_Model = false;
            store_router_data_logic.clear_UserExperience_Model = false;
        }else{
            store_router_data_logic.clear_Memory_Model = true;
            store_router_data_logic.clear_UserExperience_Model = false;
        }
        store_app_configs_logic_save.save_system_config_of_App_Configs()
    },
    clear_UserExperience_Model: true,
    get_clear_UserExperience_Model(value: any){
        if(value) {
            store_router_data_logic.clear_Memory_Model = false;
            store_router_data_logic.clear_Equilibrium_Model = false;
        }else{
            store_router_data_logic.clear_Memory_Model = true;
            store_router_data_logic.clear_Equilibrium_Model = false;
        }
        store_app_configs_logic_save.save_system_config_of_App_Configs()
    },

    clear_Files_temporary() {
        store_router_data_info.router_select_model_menu = false
        store_router_data_info.router_select_model_home = false
        store_router_data_info.router_select_model_updateing = false
        store_router_data_info.router_select_model_media = false
        store_router_data_info.router_select_model_album = false
        store_router_data_info.router_select_model_artist = false
        store_view_home_page_info.home_Files_temporary_maximum_playback = []
        store_view_home_page_info.home_Files_temporary_random_search = []
        store_view_home_page_info.home_Files_temporary_recently_added = []
        store_view_home_page_info.home_Files_temporary_recently_played = []
        store_view_media_page_info.media_Files_temporary = [];
        store_view_album_page_info.album_Files_temporary = [];
        store_view_artist_page_info.artist_Files_temporary = [];
    },
    clear_Files_temporary_except_home() {
        store_router_data_info.router_select_model_menu = false
        store_router_data_info.router_select_model_updateing = false
        store_router_data_info.router_select_model_media = false
        store_router_data_info.router_select_model_album = false
        store_router_data_info.router_select_model_artist = false
        store_view_media_page_info.media_Files_temporary = [];
        store_view_album_page_info.album_Files_temporary = [];
        store_view_artist_page_info.artist_Files_temporary = [];
    },
    clear_Files_temporary_except_album() {
        store_router_data_info.router_select_model_menu = false
        store_router_data_info.router_select_model_home = false
        store_router_data_info.router_select_model_updateing = false
        store_router_data_info.router_select_model_media = false
        store_router_data_info.router_select_model_artist = false
        store_view_home_page_info.home_Files_temporary_maximum_playback = []
        store_view_home_page_info.home_Files_temporary_random_search = []
        store_view_home_page_info.home_Files_temporary_recently_added = []
        store_view_home_page_info.home_Files_temporary_recently_played = []
        store_view_media_page_info.media_Files_temporary = [];
        store_view_artist_page_info.artist_Files_temporary = [];
    },
    clear_Files_temporary_except_media() {
        store_router_data_info.router_select_model_menu = false
        store_router_data_info.router_select_model_home = false
        store_router_data_info.router_select_model_updateing = false
        store_router_data_info.router_select_model_album = false
        store_router_data_info.router_select_model_artist = false
        store_view_home_page_info.home_Files_temporary_maximum_playback = []
        store_view_home_page_info.home_Files_temporary_random_search = []
        store_view_home_page_info.home_Files_temporary_recently_added = []
        store_view_home_page_info.home_Files_temporary_recently_played = []
        store_view_album_page_info.album_Files_temporary = [];
        store_view_artist_page_info.artist_Files_temporary = [];
    },
    clear_Files_temporary_except_artist() {
        store_router_data_info.router_select_model_menu = false
        store_router_data_info.router_select_model_home = false
        store_router_data_info.router_select_model_updateing = false
        store_router_data_info.router_select_model_media = false
        store_router_data_info.router_select_model_album = false
        store_view_home_page_info.home_Files_temporary_maximum_playback = []
        store_view_home_page_info.home_Files_temporary_random_search = []
        store_view_home_page_info.home_Files_temporary_recently_added = []
        store_view_home_page_info.home_Files_temporary_recently_played = []
        store_view_media_page_info.media_Files_temporary = [];
        store_view_album_page_info.album_Files_temporary = [];
    },

    get_media_list_of_album_id_by_album_info(value: any) {
        store_router_data_info.router.push('View_Song_List_ALL')
        store_view_media_page_logic.list_data_Hand_Search = true
        store_view_media_page_logic.list_selected_Hand_click = false
        store_view_media_page_logic.page_songlists_selected = 'song_list_all'
        // open media_files model，keywords set
        store_view_media_page_logic.page_songlists_keywordFilter = `WHERE album_id = '${value}'`
        store_view_media_page_logic.page_songlists_get_keyword_model_num = 3
        store_router_data_info.find_music_model = true
        console.log('get_media_list_of_album_model：'+value)
        store_view_media_page_logic.page_songlists_input_search_Value = value
    },
    get_album_list_of_artist_id_by_artist_info(value: any) {
        store_router_data_info.router.push('View_Album_List_ALL')
        // open album_files model，keywords set
        store_router_data_info.find_album_model = true
        if(store_server_user_model.model_server_type_of_local) {
            store_view_album_page_logic.page_albumlists_keyword = value
        }else if(store_server_user_model.model_server_type_of_web){
            store_view_album_page_logic.page_albumlists_keyword = ''
        }
        store_view_album_page_logic.page_albumlists_get_keyword_model_num = 2
        store_router_data_info.find_artist_model = false
        console.log('get_album_list_of_artist_model：'+value)
        store_view_album_page_logic.page_albumlists_input_search_Value = value
    },

    get_page_top_info(){
        if(store_server_user_model.model_server_type_of_local){
            const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
            db.pragma('journal_mode = WAL');
            db.exec('PRAGMA foreign_keys = OFF');
            store_view_media_page_info.media_item_count = this.getCount(
                db,
                `SELECT COUNT(*) AS count FROM ${store_server_user_model.media_file}`);
            store_view_media_page_info.media_starred_count = this.getCount(
                db,
                `SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation} WHERE starred = 1 AND item_type='media_file'`);
            store_view_media_page_info.media_recently_count = this.getCount(
                db,
                `SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation} WHERE item_type='media_file' AND play_count > 0`);
            ///
            store_view_album_page_info.album_item_count = this.getCount(
                db,
                `SELECT COUNT(*) AS count FROM ${store_server_user_model.album}`);
            store_view_album_page_info.album_starred_count = this.getCount(
                db,
                `SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation} WHERE starred = 1 AND item_type='album'`);
            store_view_album_page_info.album_recently_count = this.getCount(
                db,
                `SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation} WHERE item_type='album' AND play_count > 0`);
            ///
            store_view_artist_page_info.artist_item_count = this.getCount(
                db,
                `SELECT COUNT(*) AS count FROM ${store_server_user_model.artist}`);
            store_view_artist_page_info.artist_starred_count = this.getCount(
                db,
                `SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation} WHERE starred = 1 AND item_type='artist'`);
            store_view_artist_page_info.artist_recently_count = this.getCount(
                db,
                `SELECT COUNT(*) AS count FROM ${store_server_user_model.annotation} WHERE item_type='artist' AND play_count > 0`);
            ///
            store_view_media_page_info.media_playlist_count = this.getCount(
                db,
                `SELECT COUNT(*) AS count FROM ${store_server_user_model.playlist}`);
            ///
            db.close()
        }else if(store_server_user_model.model_server_type_of_web){
            let get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
            get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_media_file(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                store_server_user_model.token,
                store_server_user_model.salt,
            )
            get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_artist_album(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                store_server_user_model.token,
                store_server_user_model.salt,
            )
            get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_starred(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                store_server_user_model.token,
                store_server_user_model.salt,
            )
            get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_playlist(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                store_server_user_model.token,
                store_server_user_model.salt,
            )
        }
    },
    getCount(db:any, query:any) {
        const stmt = db.prepare(query);
        return stmt.get().count;
    }
});