import {reactive, ref} from 'vue'
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_router_data_logic} from "@/store/router/store_router_data_logic";
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_playlist_list_logic} from "@/store/view/playlist/store_playlist_list_logic";
import {store_router_history_data_of_media} from "@/store/router/store_router_history_data_of_media";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info";
import {
    Get_Navidrome_Temp_Data_To_LocalSqlite
} from "@/features/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite";
import {store_server_users} from "@/store/server/store_server_users";
import {
    Playlists_ApiService_of_ND
} from "@/features/servers_configs/navidrome_api/services_normal/playlists/index_service";
import {store_view_album_page_fetchData} from "@/store/view/album/store_view_album_page_fetchData";
import {store_playlist_list_fetchData} from "@/store/view/playlist/store_playlist_list_fetchData";

export const store_view_media_page_fetchData = reactive({
    async fetchData_Media(){
        if(store_server_user_model.model_server_type_of_local) {
            let db: any = null;
            // clear RouterView of vue-virtual-scroller data
            if (store_player_appearance.player_mode_of_medialist_from_external_import === true) {
                // store_player_appearance.player_mode_of_medialist_from_external_import = false;
            } else {
                store_router_data_logic.clear_Files_temporary()
                store_router_data_info.router_select_model_media = true;
            }
            try {
                db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
                db.pragma('journal_mode = WAL');
                db.exec('PRAGMA foreign_keys = OFF');

                let stmt_media_file = null;
                let stmt_media_file_string = '';

                // Init media_model data
                store_playlist_list_logic.playlist_names_StartUpdate = true

                // load media_Files_temporary data
                if (store_router_history_data_of_media.router_history_model_of_Media === 0) {
                    const sortKey = store_view_media_page_logic.page_songlists_options_Sort_key.length > 0 && store_view_media_page_logic.page_songlists_options_Sort_key[0].order !== 'default' ?
                        store_view_media_page_logic.page_songlists_options_Sort_key[0].columnKey : 'id';
                    const sortOrder = store_view_media_page_logic.page_songlists_options_Sort_key.length > 0 && store_view_media_page_logic.page_songlists_options_Sort_key[0].order !== 'default' ?
                        store_view_media_page_logic.page_songlists_options_Sort_key[0].order.replace('end', '') : '';
                    /// year
                    if(store_view_media_page_logic.page_songlists_keywordFilter.indexOf('WHERE year') >= 0) {
                        store_view_media_page_logic.page_songlists_keywordFilter =
                            store_view_media_page_logic.page_songlists_keywordFilter.substring(
                                0,
                                store_view_media_page_logic.page_songlists_keywordFilter.indexOf('WHERE year')
                            )
                    }
                    if(store_view_media_page_logic.page_songlists_keywordFilter.indexOf('AND year') >= 0) {
                        store_view_media_page_logic.page_songlists_keywordFilter =
                            store_view_media_page_logic.page_songlists_keywordFilter.substring(
                                0,
                                store_view_media_page_logic.page_songlists_keywordFilter.indexOf('AND year')
                            )
                    }
                    if(store_view_media_page_logic.page_songlists_filter_year > 0) {
                        if (store_view_media_page_logic.page_songlists_keywordFilter.length === 0) {
                            store_view_media_page_logic.page_songlists_keywordFilter = `WHERE year = ${store_view_media_page_logic.page_songlists_filter_year}`
                        } else {
                            store_view_media_page_logic.page_songlists_keywordFilter += `AND year = ${store_view_media_page_logic.page_songlists_filter_year}`
                        }
                    }
                    ///
                    try {
                        stmt_media_file_string =
                            `SELECT * FROM
                        ${store_server_user_model.media_file}
                        ${store_view_media_page_logic.page_songlists_keywordFilter}
                        ORDER BY ${sortKey} ${sortOrder}`;
                        stmt_media_file = db.prepare(stmt_media_file_string);
                    } catch (err: any) {
                        console.error(err);
                    }
                    //////
                    if (store_router_history_data_of_media.router_select_history_date_of_Media && store_view_media_page_logic.page_songlists_keyword_reset === true) {
                        store_router_history_data_of_media.remove_router_history_of_Media(store_router_history_data_of_media.router_select_history_date_of_Media.id);// 若存在新操作，则覆盖后续的路由
                        store_view_media_page_logic.page_songlists_keyword_reset = false;
                    }
                    const routerDate: Interface_View_Router_Date = {
                        id: store_router_history_data_of_media.router_history_datas_of_Media ? store_router_history_data_of_media.router_history_datas_of_Media.length + 1 : 1,
                        menu_select_active_key: 'go_songs_list',
                        router_name: 'View_Song_List_ALL',
                        router_select_model_media: true,
                        router_select_model_album: false,
                        router_select_model_artist: false,
                        page_lists_keyword: store_view_media_page_logic.page_songlists_keyword,
                        page_songlists_keywordFilter: store_view_media_page_logic.page_songlists_keywordFilter,
                        stmt_string: stmt_media_file_string,
                        page_lists_selected: store_view_media_page_logic.page_songlists_selected,
                        columnKey: store_view_media_page_logic.page_songlists_options_Sort_key.length > 0 && store_view_media_page_logic.page_songlists_options_Sort_key[0].order !== 'default' ?
                            store_view_media_page_logic.page_songlists_options_Sort_key[0].columnKey : 'id',
                        order: store_view_media_page_logic.page_songlists_options_Sort_key.length > 0 && store_view_media_page_logic.page_songlists_options_Sort_key[0].order !== 'default' ?
                            store_view_media_page_logic.page_songlists_options_Sort_key[0].order.replace('end', '') : '',
                        page_lists_scrollindex: store_router_history_data_of_media.router_history_model_of_Media_scroller_value,
                    };
                    store_router_history_data_of_media.add_router_history_of_Media(routerDate);// 重复路由不添加
                    //////
                }
                else {
                    if (store_router_history_data_of_media.router_select_history_date_of_Media) {
                        store_router_data_info.router.push('View_Song_List_ALL')
                        store_router_data_info.router_select_model_media = true;
                        store_view_media_page_logic.page_songlists_keyword = store_router_history_data_of_media.router_select_history_date_of_Media.page_lists_keyword;
                        store_view_media_page_logic.page_songlists_keywordFilter = store_router_history_data_of_media.router_select_history_date_of_Media.page_songlists_keywordFilter;
                        store_view_media_page_logic.page_songlists_selected = store_router_history_data_of_media.router_select_history_date_of_Media.page_lists_selected;
                        store_view_media_page_logic.list_options_Hand_Sort = false;
                        store_view_media_page_logic.page_songlists_options_Sort_key = [
                            {
                                columnKey: store_router_history_data_of_media.router_select_history_date_of_Media.columnKey,
                                order: store_router_history_data_of_media.router_select_history_date_of_Media.order
                            }
                        ];
                        store_router_history_data_of_media.router_history_model_of_Media_scroller_value = store_router_history_data_of_media.router_select_history_date_of_Media.page_lists_scrollindex;
                        stmt_media_file = db.prepare(store_router_history_data_of_media.router_select_history_date_of_Media.stmt_string);
                    }
                    store_router_history_data_of_media.router_history_model_of_Media = 0;
                }
                const rows = stmt_media_file.all();
                rows.forEach((row: Media_File, index: number) => {
                    row.absoluteIndex = index;
                    row.selected = false;
                    row.duration_txt = store_view_media_page_logic.get_duration_formatTime(row.duration);
                    if (row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
                        if (row.path.indexOf('mp3') > 0)
                            row.medium_image_url = row.path.replace('mp3', 'jpg');
                        else if (row.path.indexOf('flac') > 0)
                            row.medium_image_url = row.path.replace('flac', 'jpg');
                        else
                            row.medium_image_url = '../../../resources/img/error_album.jpg';
                    }
                    store_view_media_page_info.media_Files_temporary.push(row);
                });
                ////// find favorite for media_Files_temporary
                const stmt_media_Annotation_Starred_Items = db.prepare(`
                    SELECT item_id FROM ${store_server_user_model.annotation}
                    WHERE starred = 1 AND item_type='media_file'
                `);
                const annotations = stmt_media_Annotation_Starred_Items.all();
                for (let i = 0; i < store_view_media_page_info.media_Files_temporary.length; i++) {
                    store_view_media_page_info.media_Files_temporary[i].favorite = !!annotations.some((annotation: {
                        item_id: string
                    }) => annotation.item_id === store_view_media_page_info.media_Files_temporary[i].id);
                }
                ////// find rating for media_Files_temporary
                const stmt_media_Annotation_Rating_Items = db.prepare(`
                    SELECT item_id, rating FROM ${store_server_user_model.annotation}
                    WHERE rating > 0 AND item_type='media_file'
                `);
                const annotations_rating = stmt_media_Annotation_Rating_Items.all();
                for (let i = 0; i < store_view_media_page_info.media_Files_temporary.length; i++) {
                    const mediaFile = store_view_media_page_info.media_Files_temporary[i];
                    const matchingAnnotation = annotations_rating.find((annotation: {
                        item_id: string,
                        rating: number
                    }) => annotation.item_id === mediaFile.id);
                    if (matchingAnnotation)
                        mediaFile.rating = matchingAnnotation.rating;
                    else
                        mediaFile.rating = 0;
                }
                ////// find playCount for media_Files_temporary
                const stmt_media_Annotation_playCount_Items = db.prepare(`
                    SELECT item_id, play_count, play_date FROM ${store_server_user_model.annotation}
                    WHERE item_type='media_file'
                `);
                const annotations_play_count = stmt_media_Annotation_playCount_Items.all();
                for (let i = 0; i < store_view_media_page_info.media_Files_temporary.length; i++) {
                    const mediaFile = store_view_media_page_info.media_Files_temporary[i];
                    const matchingAnnotation = annotations_play_count.find((annotation: {
                        item_id: string,
                        play_count: number
                    }) => annotation.item_id === mediaFile.id);
                    if (matchingAnnotation) {
                        mediaFile.play_count = matchingAnnotation.play_count;
                        mediaFile.play_date = matchingAnnotation.play_date;
                    }
                    else
                        mediaFile.play_count = 0;
                }
                ////// filter selected_list for media_Files_temporary
                let order_play_date: any[] = [];
                if (store_view_media_page_logic.page_songlists_selected === 'song_list_recently') {
                    order_play_date = db.prepare(`
                        SELECT item_id FROM ${store_server_user_model.annotation}
                        WHERE item_type='media_file' AND play_count>0
                        ORDER BY play_date DESC
                    `).all().map((annotation: any) => annotation.item_id);
                }
                store_view_media_page_info.media_Files_temporary = store_view_media_page_info.media_Files_temporary.filter((item: any) => {
                    if (store_view_media_page_logic.list_data_Hand_Search) {
                        return true;
                    } else if (store_view_media_page_logic.page_songlists_selected === 'song_list_all') {
                        return true;
                    } else if (store_view_media_page_logic.page_songlists_selected === 'song_list_love') {
                        return annotations.some((annotation: any) => annotation.item_id === item.id);
                    } else if (store_view_media_page_logic.page_songlists_selected === 'song_list_recently') {
                        return order_play_date.includes(item.id);
                    } else {
                        const index = store_playlist_list_info.playlist_tracks_temporary_of_ALLLists.findIndex(
                            (list: any) => list.playlist.id === store_view_media_page_logic.page_songlists_selected
                        );
                        let playlistTracks: any[] = [];
                        if (index >= 0) {
                            playlistTracks = store_playlist_list_info.playlist_tracks_temporary_of_ALLLists[index].playlist_tracks.map(
                                track => track.media_file_id
                            );
                        }
                        return playlistTracks.includes(item.id);
                    }
                });
                store_view_media_page_logic.list_data_Hand_Search = false;
                if (store_view_media_page_logic.page_songlists_selected === 'song_list_recently') {
                    let new_sort: Media_File[] = store_view_media_page_info.media_Files_temporary.slice();
                    store_view_media_page_info.media_Files_temporary = [];
                    order_play_date.forEach((id) => {
                        const index = new_sort.findIndex(item => item.id === id);
                        if (index !== -1) {
                            store_view_media_page_info.media_Files_temporary.push(new_sort[index]);
                            new_sort.splice(index, 1);
                        }
                    });
                }
                store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
                    item.absoluteIndex = index + 1;
                });
            } catch (err: any) {
                console.error(err);
            } finally {
                db.close();
                console.log('db.close().......');
                db = null;
            }
        }
        else if(store_server_user_model.model_server_type_of_web){
            await this.fetchData_Media_of_server_web_start()
        }
    },
    async fetchData_Media_Find_This_Album(id: string){
        let db:any = null;
        db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');
        let stmt_media_file = null;
        let stmt_media_file_string = '';
        stmt_media_file_string = `SELECT * FROM ${store_server_user_model.media_file} WHERE album_id = '${id}'`;
        stmt_media_file = db.prepare(stmt_media_file_string);
        const rows = stmt_media_file.all();
        rows.forEach((row: Media_File, index: number) => {
            row.absoluteIndex = index;
            row.selected = false;
            row.duration_txt = store_view_media_page_logic.get_duration_formatTime(row.duration);
            if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
                if (row.path.indexOf('mp3') > 0)
                    row.medium_image_url = row.path.replace('mp3', 'jpg');
                else if (row.path.indexOf('flac') > 0)
                    row.medium_image_url = row.path.replace('flac', 'jpg');
                else
                    row.medium_image_url = '../../../resources/img/error_album.jpg';
            }
            store_view_media_page_info.media_Files_temporary.push(row);
        });
        store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
            item.absoluteIndex = index + 1;
        });
    },
    async fetchData_Media_Find_This_Artist(id: string){
        let db:any = null;
        db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');
        let stmt_media_file = null;
        let stmt_media_file_string = '';
        stmt_media_file_string = `SELECT * FROM ${store_server_user_model.media_file} WHERE artist_id = '${id}'`;
        stmt_media_file = db.prepare(stmt_media_file_string);
        const rows = stmt_media_file.all();
        rows.forEach((row: Media_File, index: number) => {
            row.absoluteIndex = index;
            row.selected = false;
            row.duration_txt = store_view_media_page_logic.get_duration_formatTime(row.duration);
            if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
                if (row.path.indexOf('mp3') > 0)
                    row.medium_image_url = row.path.replace('mp3', 'jpg');
                else if (row.path.indexOf('flac') > 0)
                    row.medium_image_url = row.path.replace('flac', 'jpg');
                else
                    row.medium_image_url = '../../../resources/img/error_album.jpg';
            }
            store_view_media_page_info.media_Files_temporary.push(row);
        });
        store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
            item.absoluteIndex = index + 1;
        });
    },

    _start: 0,
    _end: 100,
    _album_id: '',
    _artist_id: '',
    async fetchData_Media_of_server_web_start(){
        store_view_media_page_info.media_Files_temporary = [];
        this._start = 0;
        this._end = 100;
        await this.fetchData_Media_of_server_web()

        if(store_player_appearance.player_mode_of_medialist_from_external_import) {
            store_view_media_page_fetchData._album_id = ''
            store_view_media_page_fetchData._artist_id = ''
            store_view_album_page_fetchData._artist_id = ''
        }
    },
    async fetchData_Media_of_server_web_end(){
        this._start += 100;
        this._end += 100;
        await this.fetchData_Media_of_server_web()
    },
    async fetchData_Media_of_server_web(){
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
        await get_Navidrome_Temp_Data_To_LocalSqlite.get_media_list(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_users.server_config_of_current_user_of_sqlite?.user_name,
            store_server_user_model.token,
            store_server_user_model.salt,
            String(this._end), _order, _sort, String(this._start),
            _search, _starred, playlist_id,
            this._album_id, this._artist_id,
            store_view_media_page_logic.page_songlists_filter_year > 0 ? store_view_media_page_logic.page_songlists_filter_year : ''
        )
    },
    fetchData_Media_of_data_synchronization_to_playlist(){
        store_view_media_page_info.media_Files_temporary.forEach((row) => {
            const existingIndex = store_playlist_list_info.playlist_MediaFiles_temporary.findIndex(
                (item) => item.id === row.id
            );
            if (existingIndex === -1) {
                const newRow = {
                    ...row,
                    play_id: row.id + 'copy&' + Math.floor(Math.random() * 90000) + 10000
                };
                store_playlist_list_info.playlist_MediaFiles_temporary.push(newRow);
            }
        });
        store_playlist_list_fetchData._start = store_view_media_page_fetchData._start
        store_playlist_list_fetchData._end = store_view_media_page_fetchData._end
        store_playlist_list_fetchData._album_id = store_view_media_page_fetchData._album_id
        store_playlist_list_fetchData._artist_id = store_view_media_page_fetchData._artist_id
        store_playlist_list_fetchData._start = store_view_media_page_fetchData._start
        store_playlist_list_fetchData._end = store_view_media_page_fetchData._end
        store_playlist_list_fetchData._album_id = store_view_media_page_fetchData._album_id
        store_playlist_list_fetchData._artist_id = store_view_media_page_fetchData._artist_id
    }
});