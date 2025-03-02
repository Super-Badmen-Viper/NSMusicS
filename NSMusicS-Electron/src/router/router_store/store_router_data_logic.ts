import {reactive} from 'vue'
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import {store_view_home_page_info} from "../../views/view_app/page_metadata/page_folder/page_music/music_page/page_home/store/store_view_home_page_info";
import {store_view_media_page_info} from "../../views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_info";
import {store_view_album_page_info} from "../../views/view_app/page_metadata/page_folder/page_music/music_page/page_album/store/store_view_album_page_info";
import {store_view_artist_page_info} from "../../views/view_app/page_metadata/page_folder/page_music/music_page/page_artist/store/store_view_artist_page_info"
import {store_view_media_page_logic} from "../../views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_logic";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {store_view_album_page_logic} from "../../views/view_app/page_metadata/page_folder/page_music/music_page/page_album/store/store_view_album_page_logic"
import {store_view_artist_page_logic} from "../../views/view_app/page_metadata/page_folder/page_music/music_page/page_artist/store/store_view_artist_page_logic"
import {store_router_history_data_of_media} from "@/router/router_store/store_router_history_data_of_media";
import {store_router_history_data_of_album} from "@/router/router_store/store_router_history_data_of_album";
import {store_router_history_data_of_artist} from "@/router/router_store/store_router_history_data_of_artist";
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {
    Get_Navidrome_Temp_Data_To_LocalSqlite
} from "../../data/data_access/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import { isElectron } from '@/utils/electron/isElectron';
import {
    Get_Jellyfin_Temp_Data_To_LocalSqlite
} from "../../data/data_access/servers_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite";

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
        store_router_data_info.router.push('song')
        if(store_server_user_model.model_server_type_of_local) {
            store_view_media_page_logic.list_data_Hand_Search = true
            store_view_media_page_logic.list_selected_Hand_click = false
            // open media_files model，keywords set
            store_view_media_page_logic.page_songlists_keywordFilter = `WHERE album_id = '${value}'`
            store_view_media_page_logic.page_songlists_get_keyword_model_num = 3
            store_router_data_info.find_music_model = true
            console.log('get_media_list_of_album_model：' + value)
            store_view_media_page_logic.page_songlists_input_search_Value = value
        }
        store_view_media_page_logic.page_songlists_selected = 'song_list_all'
    },
    get_album_list_of_artist_id_by_artist_info(value: any) {
        store_router_data_info.router.push('album')
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

    async get_page_top_info(){
        if(isElectron) {
            if (store_server_user_model.model_server_type_of_local) {
                const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
                db.pragma('journal_mode = WAL');
                db.exec('PRAGMA foreign_keys = OFF');
                try {
                    // 1. 删除 annotation 表中无效的记录（item_id 不对应 media_file、album 或 artist 表中的 id）
                    db.prepare(`
                        DELETE FROM ${store_server_user_model.annotation}
                        WHERE (item_type = 'media_file' AND item_id NOT IN (SELECT id FROM ${store_server_user_model.media_file}))
                           OR (item_type = 'album' AND item_id NOT IN (SELECT id FROM ${store_server_user_model.album}))
                           OR (item_type = 'artist' AND item_id NOT IN (SELECT id FROM ${store_server_user_model.artist}))
                    `).run();
                    // 2. 查询 media_file、album 和 artist 表中有效的记录数量
                    const getCount = (query) => db.prepare(query).get().count;
                    // 2.1 查询 media_file 表中有效的标记记录数量
                    store_view_media_page_info.media_starred_count = getCount(`
                        SELECT COUNT(DISTINCT a.item_id) AS count
                        FROM ${store_server_user_model.annotation} AS a
                        JOIN ${store_server_user_model.media_file} AS m
                        ON a.item_id = m.id
                        WHERE a.starred = 1
                        AND a.item_type = 'media_file'
                        AND a.play_date IS NOT NULL
                    `);
                    // 2.2 查询 album 表中有效的标记记录数量
                    store_view_album_page_info.album_starred_count = getCount(`
                        SELECT COUNT(DISTINCT a.item_id) AS count
                        FROM ${store_server_user_model.annotation} AS a
                        JOIN ${store_server_user_model.album} AS al
                        ON a.item_id = al.id
                        WHERE a.starred = 1
                        AND a.item_type = 'album'
                        AND a.play_date IS NOT NULL
                    `);
                    // 2.3 查询 artist 表中有效的标记记录数量
                    store_view_artist_page_info.artist_starred_count = getCount(`
                        SELECT COUNT(DISTINCT a.item_id) AS count
                        FROM ${store_server_user_model.annotation} AS a
                        JOIN ${store_server_user_model.artist} AS ar
                        ON a.item_id = ar.id
                        WHERE a.starred = 1
                        AND a.item_type = 'artist'
                        AND a.play_date IS NOT NULL
                    `);
                    // 3. 查询 media_file、album 和 artist 表中的总记录数量
                    store_view_media_page_info.media_item_count = getCount(`
                        SELECT COUNT(*) AS count
                        FROM ${store_server_user_model.media_file}
                    `);
                    store_view_album_page_info.album_item_count = getCount(`
                        SELECT COUNT(*) AS count
                        FROM ${store_server_user_model.album}
                    `);
                    store_view_artist_page_info.artist_item_count = getCount(`
                        SELECT COUNT(*) AS count
                        FROM ${store_server_user_model.artist}
                    `);
                    // 4. 查询 media_file、album 和 artist 表中有效的播放记录数量
                    store_view_media_page_info.media_recently_count = getCount(`
                        SELECT COUNT(*) AS count
                        FROM ${store_server_user_model.annotation} AS a
                        JOIN ${store_server_user_model.media_file} AS m
                        ON a.item_id = m.id
                        WHERE a.item_type = 'media_file'
                        AND a.play_count > 0
                        AND a.play_date IS NOT NULL
                    `);
                    store_view_album_page_info.album_recently_count = getCount(`
                        SELECT COUNT(*) AS count
                        FROM ${store_server_user_model.annotation} AS a
                        JOIN ${store_server_user_model.album} AS al
                        ON a.item_id = al.id
                        WHERE a.item_type = 'album'
                        AND a.play_count > 0
                        AND a.play_date IS NOT NULL
                    `);
                    store_view_artist_page_info.artist_recently_count = getCount(`
                        SELECT COUNT(*) AS count
                        FROM ${store_server_user_model.annotation} AS a
                        JOIN ${store_server_user_model.artist} AS ar
                        ON a.item_id = ar.id
                        WHERE a.item_type = 'artist'
                        AND a.play_count > 0
                        AND a.play_date IS NOT NULL
                    `);
                    // 5. 查询 playlist 表中的总记录数量
                    store_view_media_page_info.media_playlist_count = getCount(`
                        SELECT COUNT(*) AS count
                        FROM ${store_server_user_model.playlist}
                    `);
                    db.exec('COMMIT');
                } catch (error) {
                    db.exec('ROLLBACK');
                    throw error;
                } finally {
                    db.exec('PRAGMA foreign_keys = ON');
                    db.close();
                }
            }
            else if (store_server_user_model.model_server_type_of_web) {
                if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
                    let get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
                    await get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_media_file(
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                        store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                        store_server_user_model.token,
                        store_server_user_model.salt,
                    )
                    await get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_artist_album(
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                        store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                        store_server_user_model.token,
                        store_server_user_model.salt,
                    )
                    await get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_starred(
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                        store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                        store_server_user_model.token,
                        store_server_user_model.salt,
                    )
                    await get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_playlist(
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                        store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                        store_server_user_model.token,
                        store_server_user_model.salt,
                    )
                }
                else if(
                    store_server_user_model.model_server_type_of_web && (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby')
                ){
                    let get_Jellyfin_Temp_Data_To_LocalSqlite = new Get_Jellyfin_Temp_Data_To_LocalSqlite()
                    await get_Jellyfin_Temp_Data_To_LocalSqlite.get_count_of_media_file()
                    await get_Jellyfin_Temp_Data_To_LocalSqlite.get_count_of_artist_album()
                    await get_Jellyfin_Temp_Data_To_LocalSqlite.get_count_of_starred()
                    await get_Jellyfin_Temp_Data_To_LocalSqlite.get_count_of_playlist()
                }
            }
        } else {
            // other
        }
    }
});