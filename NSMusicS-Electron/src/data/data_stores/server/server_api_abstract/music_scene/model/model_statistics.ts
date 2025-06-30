import { reactive } from 'vue';
import { store_view_media_page_info } from '@/views/view_app/page_metadata/page_folder/page_music/music_page/page_media/store/store_view_media_page_info';
import { store_view_album_page_info } from '@/views/view_app/page_metadata/page_folder/page_music/music_page/page_album/store/store_view_album_page_info';
import { store_view_artist_page_info } from '@/views/view_app/page_metadata/page_folder/page_music/music_page/page_artist/store/store_view_artist_page_info';
import { store_app_configs_info } from '@/data/data_stores/app/store_app_configs_info';
import { store_server_user_model } from '@/data/data_stores/server/store_server_user_model';
import { Get_Navidrome_Temp_Data_To_LocalSqlite } from '@/data/data_access/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite';
import { store_server_users } from '@/data/data_stores/server/store_server_users';
import { isElectron } from '@/utils/electron/isElectron';
import { Get_Jellyfin_Temp_Data_To_LocalSqlite } from '@/data/data_access/servers_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite';
import {
    Get_NineSong_Temp_Data_To_LocalSqlite
} from "@/data/data_access/servers_configs/ninesong_api/services_web_instant_access/class_Get_NineSong_Temp_Data_To_LocalSqlite";

export const store_server_model_statistics = reactive({
    async get_page_top_info() {
        try {
            if (store_server_user_model.model_server_type_of_local) {
                if (isElectron) {
                    const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
                    db.pragma('journal_mode = WAL');
                    db.exec('PRAGMA foreign_keys = OFF');
                    db.exec('BEGIN TRANSACTION');  // 显式开始事务

                    try {
                        // 1. 删除无效记录（带错误标签）
                        try {
                            const deleteQuery = `
                                DELETE FROM ${store_server_user_model.annotation}
                                WHERE (item_type = 'media_file' AND item_id NOT IN (SELECT id FROM ${store_server_user_model.media_file}))
                                    OR (item_type = 'album' AND item_id NOT IN (SELECT id FROM ${store_server_user_model.album}))
                                    OR (item_type = 'artist' AND item_id NOT IN ( SELECT id FROM ${store_server_user_model.artist}))
                            `;
                            db.prepare(deleteQuery).run();
                        } catch (e) {
                            throw new Error(`[DELETE_INVALID_ANNOTATIONS] 删除无效记录失败: ${e}`);
                        }

                        const getCount = (query: any) => db.prepare(query).get().count;

                        // 2. 查询有效的标记记录（每个查询都有唯一错误标签）
                        // 2.1 媒体收藏统计
                        try {
                            store_view_media_page_info.media_starred_count = getCount(`
                                SELECT COUNT(DISTINCT a.item_id) AS count
                                FROM ${store_server_user_model.annotation} AS a
                                    JOIN ${store_server_user_model.media_file} AS m
                                ON a.item_id = m.id
                                WHERE a.starred = 1
                                  AND a.item_type = 'media_file'
                                  AND a.play_date IS NOT NULL
                            `);
                        } catch (e) { throw e; }

                        // 2.2 专辑收藏统计
                        try {
                            store_view_album_page_info.album_starred_count = getCount(`
                                SELECT COUNT(DISTINCT a.item_id) AS count
                                FROM ${store_server_user_model.annotation} AS a
                                    JOIN ${store_server_user_model.media_file} AS m
                                ON a.item_id = m.id
                                WHERE a.starred = 1
                                  AND a.item_type = 'media_file'
                                  AND a.play_date IS NOT NULL
                            `);
                        } catch (e) { throw e; }

                        // 2.3 艺术家收藏统计
                        try {
                            store_view_artist_page_info.artist_starred_count = getCount(`
                                SELECT COUNT(DISTINCT a.item_id) AS count
                                FROM ${store_server_user_model.annotation} AS a
                                    JOIN ${store_server_user_model.artist} AS ar
                                ON a.item_id = ar.id
                                WHERE a.starred = 1
                                  AND a.item_type = 'artist'
                                  AND a.play_date IS NOT NULL
                            `);
                        } catch (e) { throw e; }

                        // 2.4 媒体总数统计
                        try {
                            store_view_media_page_info.media_item_count = getCount(`
                                SELECT COUNT(*) AS count
                                FROM ${store_server_user_model.media_file}
                            `);
                        } catch (e) { throw e; }

                        // 2.5 专辑总数统计
                        try {
                            store_view_album_page_info.album_item_count = getCount(`
                                SELECT COUNT(*) AS count
                                FROM ${store_server_user_model.album}
                            `);
                        } catch (e) { throw e; }

                        // 2.6 艺术家总数统计
                        try {
                            store_view_artist_page_info.artist_item_count = getCount(`
                                SELECT COUNT(*) AS count
                                FROM ${store_server_user_model.artist}
                            `);
                        } catch (e) { throw e; }

                        // 2.7 媒体播放记录统计
                        try {
                            store_view_media_page_info.media_recently_count = getCount(`
                                SELECT COUNT(*) AS count
                                FROM ${store_server_user_model.annotation} AS a
                                JOIN ${store_server_user_model.media_file} AS m ON a.item_id = m.id
                                WHERE a.item_type = 'media_file'
                                    AND a.play_count > 0
                                    AND a.play_date IS NOT NULL
                            `);
                        } catch (e) { throw e; }

                        // 2.8 专辑播放记录统计
                        try {
                            store_view_album_page_info.album_recently_count = getCount(`
                                SELECT COUNT(*) AS count
                                FROM ${store_server_user_model.annotation} AS a
                                JOIN ${store_server_user_model.album} AS al ON a.item_id = al.id
                                WHERE a.item_type = 'album'
                                    AND a.play_count > 0
                                    AND a.play_date IS NOT NULL
                            `);
                        } catch (e) { throw e; }

                        // 2.9 艺术家播放记录统计
                        try {
                            store_view_artist_page_info.artist_recently_count = getCount(`
                                SELECT COUNT(*) AS count
                                FROM ${store_server_user_model.annotation} AS a
                                JOIN ${store_server_user_model.artist} AS ar ON a.item_id = ar.id
                                WHERE a.item_type = 'artist'
                                    AND a.play_count > 0
                                    AND a.play_date IS NOT NULL
                            `);
                        } catch (e) { throw e; }

                        // 2.10 播放列表统计
                        try {
                            store_view_media_page_info.media_playlist_count = getCount(`
                                SELECT COUNT(*) AS count
                                FROM ${store_server_user_model.playlist}
                            `);
                        } catch (e) { throw e; }

                        // 3. 提交事务（独立错误处理）
                        try {
                            db.exec('COMMIT');
                        } catch (e) {
                            throw new Error(`[COMMIT_TRANSACTION] 提交事务失败: ${e}`);
                        }

                    } catch (error) {
                        try {
                            db.exec('ROLLBACK');
                        } catch (rollbackError) {
                            console.error(`[ROLLBACK_ERROR] 回滚失败: ${rollbackError}`);
                        }
                        throw error; // 抛出带有具体错误标签的异常
                    } finally {
                        try {
                            db.exec('PRAGMA foreign_keys = ON');
                        } catch (fkError) {
                            console.error(`[FOREIGN_KEYS_ERROR] 恢复外键约束失败: ${fkError}`);
                        } finally {
                            db.close();
                        }
                    }
                }
            }
            else if (store_server_user_model.model_server_type_of_web) {
                if (store_server_users.server_select_kind === 'ninesong') {
                    const get_NineSong_Temp_Data_To_LocalSqlite = new Get_NineSong_Temp_Data_To_LocalSqlite()
                    await get_NineSong_Temp_Data_To_LocalSqlite.get_count_of_media_file(
                        '','','','',''
                    )
                    await get_NineSong_Temp_Data_To_LocalSqlite.get_count_of_album(
                        '','','','',''
                    )
                    await get_NineSong_Temp_Data_To_LocalSqlite.get_count_of_artist(
                        '','',
                    )
                    await get_NineSong_Temp_Data_To_LocalSqlite.get_count_of_playlist()
                }else if (store_server_users.server_select_kind === 'navidrome') {
                    const get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite();
                    await get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_media_file(
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt
                    );
                    await get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_artist_album(
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt
                    );
                    await get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_starred(
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt
                    );
                    await get_Navidrome_Temp_Data_To_LocalSqlite.get_count_of_playlist(
                        store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                        store_server_user_model.username, store_server_user_model.token, store_server_user_model.salt
                    );
                } else if (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby') {
                    const get_Jellyfin_Temp_Data_To_LocalSqlite = new Get_Jellyfin_Temp_Data_To_LocalSqlite();
                    await get_Jellyfin_Temp_Data_To_LocalSqlite.get_count_of_media_file();
                    await get_Jellyfin_Temp_Data_To_LocalSqlite.get_count_of_artist_album();
                    await get_Jellyfin_Temp_Data_To_LocalSqlite.get_count_of_starred();
                    await get_Jellyfin_Temp_Data_To_LocalSqlite.get_count_of_playlist();
                }
            }
        } catch (error) {
            console.error('Failed to get page top info:', error);
        }
    }
});