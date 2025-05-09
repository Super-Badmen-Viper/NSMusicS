import {reactive} from 'vue'
import {store_view_media_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_info";
import {store_view_album_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_album/store/store_view_album_page_info";
import {store_view_artist_page_info} from "@/views/view_app/page_metadata/page_folder/page_music/music_page/page_artist/store/store_view_artist_page_info"
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {
    Get_Navidrome_Temp_Data_To_LocalSqlite
} from "@/data/data_access/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import { isElectron } from '@/utils/electron/isElectron';
import {
    Get_Jellyfin_Temp_Data_To_LocalSqlite
} from "@/data/data_access/servers_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite";

export const store_server_model_statistics = reactive({
    async get_page_top_info(){
        if (store_server_user_model.model_server_type_of_local) {
            if(isElectron) {
                const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
                db.pragma('journal_mode = WAL');
                db.exec('PRAGMA foreign_keys = OFF');
                try {
                    // 1. 删除 annotation 表中无效的记录（item_id 不对应 media_file、album 或 artist 表中的 id）
                    db.prepare(`
                        DELETE
                        FROM ${store_server_user_model.annotation}
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
                          AND a.play_count
                            > 0
                          AND a.play_date IS NOT NULL
                    `);
                    store_view_album_page_info.album_recently_count = getCount(`
                        SELECT COUNT(*) AS count
                        FROM ${store_server_user_model.annotation} AS a
                            JOIN ${store_server_user_model.album} AS al
                        ON a.item_id = al.id
                        WHERE a.item_type = 'album'
                          AND a.play_count
                            > 0
                          AND a.play_date IS NOT NULL
                    `);
                    store_view_artist_page_info.artist_recently_count = getCount(`
                        SELECT COUNT(*) AS count
                        FROM ${store_server_user_model.annotation} AS a
                            JOIN ${store_server_user_model.artist} AS ar
                        ON a.item_id = ar.id
                        WHERE a.item_type = 'artist'
                          AND a.play_count
                            > 0
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
    }
});