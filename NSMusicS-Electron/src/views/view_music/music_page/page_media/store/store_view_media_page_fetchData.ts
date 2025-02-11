import {reactive, watch} from 'vue'
import {store_player_appearance} from "../../page_player/store/store_player_appearance";
import {store_router_data_logic} from "@/router/router_store/store_router_data_logic";
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {store_playlist_list_logic} from "../../../music_components/player_list/store/store_playlist_list_logic"
import {store_router_history_data_of_media} from "@/router/router_store/store_router_history_data_of_media";
import {store_view_media_page_logic} from "./store_view_media_page_logic";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_view_media_page_info} from "./store_view_media_page_info";
import {store_playlist_list_info} from "../../../music_components/player_list/store/store_playlist_list_info"
import {Get_Navidrome_Temp_Data_To_LocalSqlite} from "../../../../../data/data_access/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_view_album_page_fetchData} from "../../page_album/store/store_view_album_page_fetchData";
import {store_playlist_list_fetchData} from "../../../music_components/player_list/store/store_playlist_list_fetchData";
import error_album from '@/assets/img/error_album.jpg'
import { isElectron } from '@/utils/electron/isElectron';
import {
    Get_Jellyfin_Temp_Data_To_LocalSqlite
} from "../../../../../data/data_access/servers_configs/jellyfin_api/services_web_instant_access/class_Get_Jellyfin_Temp_Data_To_LocalSqlite";
import {store_playlist_appearance} from "../../../music_components/player_list/store/store_playlist_appearance";
/**
 * -> 歌单加载: LoadList、歌曲列表: PlayList -> 合并联合查询
 * local歌单加载：一次性全局加载
 * -> PlayList直接复制LoadList
 * web歌单加载：根据数标状态位 -> 触底加载
 * -> PlayList独立于LoadList -> 数标状态位随LoadList数标状态位刷新
 * -> 数标状态位：【_start、_end】【_album_id、_artist_id、_album_artist_id】
 */
export const store_view_media_page_fetchData = reactive({
    async fetchData_Media(){
        try {
            if (isElectron) {
                if (store_server_user_model.model_server_type_of_local) {
                    let db: any = null;
                    // clear RouterView of vue-virtual-scroller data
                    if (store_player_appearance.player_mode_of_medialist_from_external_import) {
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
                            if (store_view_media_page_logic.page_songlists_keywordFilter.length === 0) {
                                // 1. 处理 year 条件
                                store_view_media_page_logic.page_songlists_keywordFilter = this.removeCondition(
                                    store_view_media_page_logic.page_songlists_keywordFilter,
                                    'year'
                                );
                                if (store_view_media_page_logic.page_songlists_filter_year > 0) {
                                    store_view_media_page_logic.page_songlists_keywordFilter = this.addCondition(
                                        store_view_media_page_logic.page_songlists_keywordFilter,
                                        `year = ${store_view_media_page_logic.page_songlists_filter_year}`
                                    );
                                }
                                // 2. 处理 path 条件
                                store_view_media_page_logic.page_songlists_keywordFilter = this.removeCondition(
                                    store_view_media_page_logic.page_songlists_keywordFilter,
                                    'path'
                                );
                                if (store_view_media_page_logic.page_songlists_filter_path_folder.length > 0) {
                                    const pathFilter = `path LIKE '${store_view_media_page_logic.page_songlists_filter_path_folder}%'`;
                                    store_view_media_page_logic.page_songlists_keywordFilter = this.addCondition(
                                        store_view_media_page_logic.page_songlists_keywordFilter,
                                        pathFilter
                                    );
                                }
                            }
                            ///
                            try {
                                stmt_media_file_string =
                                    `SELECT *
                                     FROM ${store_server_user_model.media_file} ${store_view_media_page_logic.page_songlists_keywordFilter}
                                     ORDER BY ${sortKey} ${sortOrder}`;
                                stmt_media_file = db.prepare(stmt_media_file_string);
                            } catch (err: any) {
                                console.error(err);
                            }
                            //////
                            if (!store_view_media_page_logic.page_songlists_filter_model) {
                                if (store_router_history_data_of_media.router_select_history_date_of_Media && store_view_media_page_logic.page_songlists_keyword_reset) {
                                    store_router_history_data_of_media.remove_router_history_of_Media(store_router_history_data_of_media.router_select_history_date_of_Media.id);// 若存在新操作，则覆盖后续的路由
                                    store_view_media_page_logic.page_songlists_keyword_reset = false;
                                }
                                const routerDate: Interface_View_Router_Date = {
                                    id: 0,
                                    menu_select_active_key: 'song',
                                    router_name: 'song',
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
                                store_router_history_data_of_media.add_router_history_of_Media(routerDate); // 添加新记录
                            }
                            //////
                        } else {
                            if (store_router_history_data_of_media.router_select_history_date_of_Media) {
                                store_router_data_info.router.push('song')
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
                        store_view_media_page_info.media_Files_temporary = []
                        const rows = stmt_media_file.all();
                        rows.forEach((row: Media_File, index: number) => {
                            row.absoluteIndex = index;
                            row.selected = false;
                            row.duration_txt = store_view_media_page_logic.get_duration_formatTime(row.duration);
                            this.setMediumImageUrl(row);
                            store_view_media_page_info.media_Files_temporary.push(row);
                        });
                        ////// find favorite for media_Files_temporary
                        const stmt_media_Annotation_Starred_Items = db.prepare(`
                            SELECT item_id
                            FROM ${store_server_user_model.annotation}
                            WHERE starred = 1
                              AND item_type = 'media_file'
                        `);
                        const annotations = stmt_media_Annotation_Starred_Items.all();
                        for (let i = 0; i < store_view_media_page_info.media_Files_temporary.length; i++) {
                            store_view_media_page_info.media_Files_temporary[i].favorite = !!annotations.some((annotation: {
                                item_id: string
                            }) => annotation.item_id === store_view_media_page_info.media_Files_temporary[i].id);
                        }
                        ////// find rating for media_Files_temporary
                        const stmt_media_Annotation_Rating_Items = db.prepare(`
                            SELECT item_id, rating
                            FROM ${store_server_user_model.annotation}
                            WHERE rating > 0
                              AND item_type = 'media_file'
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
                            SELECT item_id, play_count, play_date
                            FROM ${store_server_user_model.annotation}
                            WHERE item_type = 'media_file'
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
                            } else
                                mediaFile.play_count = 0;
                        }
                        ////// filter selected_list for media_Files_temporary
                        let order_play_date: any[] = [];
                        if (store_view_media_page_logic.page_songlists_selected === 'song_list_recently') {
                            order_play_date = db.prepare(`
                                SELECT item_id
                                FROM ${store_server_user_model.annotation}
                                WHERE item_type = 'media_file'
                                  AND play_count > 0
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
                } else if (store_server_user_model.model_server_type_of_web) {
                    store_view_media_page_info.media_Files_temporary = [];
                    await this.fetchData_Media_of_server_web_start()
                }
            } else {
                // other
            }
        }catch (e) {
            console.error('fetchData_Media: ' + e)
        }
    },
    async fetchData_Media_Find_This_Album(id: string){
        if(isElectron) {
            if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
                if (store_server_user_model.model_server_type_of_local) {
                    let db: any = null;
                    db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
                    db.pragma('journal_mode = WAL');
                    db.exec('PRAGMA foreign_keys = OFF');
                    let stmt_media_file = null;
                    let stmt_media_file_string = '';
                    ///
                    stmt_media_file_string =
                        `SELECT * FROM ${store_server_user_model.media_file} WHERE album_id = ?`;
                    stmt_media_file =
                        db.prepare(stmt_media_file_string);
                    const rows = stmt_media_file.all(id);
                    rows.forEach((row: Media_File, index: number) => {
                        row.absoluteIndex = index;
                        row.selected = false;
                        row.duration_txt = store_view_media_page_logic.get_duration_formatTime(row.duration);
                        this.setMediumImageUrl(row);
                        store_view_media_page_info.media_Files_temporary.push(row);
                    });
                    store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
                        item.absoluteIndex = index + 1;
                    });
                }else if (store_server_user_model.model_server_type_of_web) {
                    this.fetchData_Media_of_server_web_clear_index()
                    this._album_id = id
                    await this.fetchData_Media_of_server_web(true)
                    this._album_id = ''
                }
            }else if(
                store_server_user_model.model_server_type_of_web && (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby')
            ) {
                this.fetchData_Media_of_server_web_clear_index()
                this._album_id = id
                await this.fetchData_Media_of_server_web(true)
                this._album_id = ''
            }
        }
        else {
            // other
        }
    },
    async fetchData_Media_Find_This_Artist(id: string){
        if(isElectron) {
            if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
                if (store_server_user_model.model_server_type_of_local) {
                    let db: any = null;
                    db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
                    db.pragma('journal_mode = WAL');
                    db.exec('PRAGMA foreign_keys = OFF');
                    let stmt_media_file = null;
                    let stmt_media_file_string = '';
                    stmt_media_file_string = `SELECT *
                                              FROM ${store_server_user_model.media_file}
                                              WHERE artist_id = '${id}'`;
                    stmt_media_file = db.prepare(stmt_media_file_string);
                    const rows = stmt_media_file.all();
                    rows.forEach((row: Media_File, index: number) => {
                        row.absoluteIndex = index;
                        row.selected = false;
                        row.duration_txt = store_view_media_page_logic.get_duration_formatTime(row.duration);
                        this.setMediumImageUrl(row);
                        store_view_media_page_info.media_Files_temporary.push(row);
                    });
                    store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
                        item.absoluteIndex = index + 1;
                    });
                }
                else if (store_server_user_model.model_server_type_of_web) {
                    this.fetchData_Media_of_server_web_clear_index()
                    this._artist_id = id
                    await this.fetchData_Media_of_server_web(true)
                    this._artist_id = ''
                }
            }
            else if (
                store_server_user_model.model_server_type_of_web && (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby')
            ) {
                this.fetchData_Media_of_server_web_clear_index()
                this._artist_id = id
                await this.fetchData_Media_of_server_web(true)
                this._artist_id = ''
            }
        }
        else {
            // other
        }
    },
    setMediumImageUrl(row: Media_File) {
        if (!row.medium_image_url?.trim()) {
            const path = row.path || row.medium_image_url;
            if (path) {
                const fileName = path.split(/[\\/]/).pop()!;
                const newFileName = fileName.replace(/\.(mp3|flac)$/i, '.jpg');
                row.medium_image_url = `${store_app_configs_info.driveTempPath}/${encodeURIComponent(newFileName)}`;
            } else {
                row.medium_image_url = error_album;
            }
        }
    },
    removeCondition(filter, condition) {
        if (filter.indexOf(`WHERE ${condition}`) >= 0) {
            filter = filter.substring(0, filter.indexOf(`WHERE ${condition}`)).trim();
            if (filter.endsWith('AND')) {
                filter = filter.substring(0, filter.lastIndexOf('AND')).trim();
            }
        }
        if (filter.indexOf(`AND ${condition}`) >= 0) {
            filter = filter.substring(0, filter.indexOf(`AND ${condition}`)).trim();
            if (filter.endsWith('AND')) {
                filter = filter.substring(0, filter.lastIndexOf('AND')).trim();
            }
        }
        return filter;
    },
    addCondition(filter, condition) {
        if (filter.length === 0) {
            return `WHERE ${condition}`;
        } else {
            return `${filter} AND ${condition}`;
        }
    },

    _start: 0,
    _end: 30,
    _album_id: '',
    set_album_id(id: string){
        store_view_media_page_fetchData._album_id = id
        store_playlist_list_fetchData._album_id = id
    },
    _artist_id: '',
    set_artist_id(id: string){
        store_view_media_page_fetchData._artist_id = id
        store_playlist_list_fetchData._artist_id = id
    },
    _album_artist_id: '', // Emby Home$Album
    set_album_artist_id(id: string){
        store_view_media_page_fetchData._album_artist_id = id
        store_playlist_list_fetchData._album_artist_id = id
    },
    fetchData_Media_of_server_web_clear_all_parms(){
        store_view_media_page_fetchData._album_id = ''
        store_view_media_page_fetchData._artist_id = ''
        store_view_album_page_fetchData._artist_id = ''
        store_view_media_page_fetchData._album_artist_id = ''
        store_view_media_page_fetchData._media_id = ''

        store_playlist_list_fetchData._album_id = ''
        store_playlist_list_fetchData._artist_id = ''
        store_playlist_list_fetchData._album_artist_id = ''
    },
    _media_id: '', // Jellyfin Home$Media
    _load_model: 'search', // 'search' and 'play'
    fetchData_Media_of_server_web_clear_search_parms(){
        store_view_media_page_fetchData._album_id = ''
        store_view_media_page_fetchData._artist_id = ''
        store_view_album_page_fetchData._artist_id = ''

        store_view_media_page_fetchData._album_artist_id = ''
        store_view_media_page_fetchData._media_id = ''
    },
    fetchData_Media_of_server_web_clear_index(){
        if(this._load_model === 'search') {
            this._start = 0;
            this._end = 30;
        }else{
            store_playlist_list_fetchData._start = 0;
            store_playlist_list_fetchData._end = 30;
        }
    },
    async fetchData_Media_of_server_web_start(){
        store_view_media_page_info.media_Files_temporary = [];
        this._start = 0;
        this._end = 30;
        store_playlist_list_fetchData._start = 0;
        store_playlist_list_fetchData._end = 30;
        await this.fetchData_Media_of_server_web(false)
        if(store_player_appearance.player_mode_of_medialist_from_external_import) {
            this.fetchData_Media_of_server_web_clear_search_parms()
        }
    },
    async fetchData_Media_of_server_web_end(){
        try {
            if (store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
                if (this._load_model === 'search') {
                    this._start += 30;
                    this._end += 30;
                } else {
                    store_playlist_list_fetchData._start += 30;
                    store_playlist_list_fetchData._end += 30;
                }
            } else if (
                store_server_user_model.model_server_type_of_web && (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby')
            ) {
                if (this._load_model === 'search') {
                    this._end += 30;
                    this._start = this._end - 30;
                } else {
                    store_playlist_list_fetchData._end += 30;
                    store_playlist_list_fetchData._start = store_playlist_list_fetchData._end - 30;
                }
            }
            await this.fetchData_Media_of_server_web(false)
        }catch (e) {
            console.error('fetchData_Media: ' + e)
        }
    },
    async fetchData_Media_of_server_web(
        find_model: boolean
    ){
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
            _starred = 'true'
        } else if (selected === 'song_list_recently') {
            _order = 'desc'
            _sort = 'playDate'
            if(store_server_users.server_select_kind === 'jellyfin') {
                _sort = 'DatePlayed'
            }else if(store_server_users.server_select_kind === 'emby') {
                _sort = 'DatePlayed,SortName'
            }
        } else if (selected != 'song_list_all') {
            if(!find_model) {
                playlist_id = selected
            }
        }
        const _artist_id = this._load_model === 'search' ?
            this._artist_id : store_playlist_list_fetchData._artist_id
        const _album_id = this._load_model === 'search' ?
            this._album_id : store_playlist_list_fetchData._album_id
        const _album_artist_id = this._load_model === 'search' ?
            this._album_artist_id : store_playlist_list_fetchData._album_artist_id
        if(store_server_user_model.model_server_type_of_local || (store_server_users.server_select_kind === 'navidrome' && store_server_user_model.model_server_type_of_web)) {
            const limit = this._load_model === 'search' ?
                String(this._end) :
                String(store_playlist_list_fetchData._end)
            const startIndex = this._load_model === 'search' ?
                String(this._start) :
                String(store_playlist_list_fetchData._start)
            let get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
            await get_Navidrome_Temp_Data_To_LocalSqlite.get_media_list(
                store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
                store_server_users.server_config_of_current_user_of_sqlite?.user_name,
                store_server_user_model.token,
                store_server_user_model.salt,
                limit, _order, _sort, startIndex,
                _search, _starred, playlist_id,
                _album_id, _artist_id,
                store_view_media_page_logic.page_songlists_filter_year > 0 ? store_view_media_page_logic.page_songlists_filter_year : ''
            )
        }else if(
            store_server_user_model.model_server_type_of_web && (store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby')
        ) {
            const sortBy = _sort === 'DatePlayed'
                ? 'DatePlayed,SortName' : (_sort != 'id' ? _sort : 'SortName');
            const sortOrder = _sort === 'DatePlayed'
                ? 'Descending' : (_order === 'desc' ? 'Descending' : 'Ascending');
            const filter = _starred === 'true' ? 'IsFavorite' : ''
            const limit = this._load_model === 'search' ?
                String(this._end - this._start) :
                String(store_playlist_list_fetchData._end - store_playlist_list_fetchData._start)
            const startIndex = this._load_model === 'search' ?
                String(this._start) :
                String(store_playlist_list_fetchData._start)
            // jellyfin not support search artist and album list of musicdata
            let get_Jellyfin_Temp_Data_To_LocalSqlite = new Get_Jellyfin_Temp_Data_To_LocalSqlite()
            if(this._media_id.length === 0) {
                // _album_id -> media_id -> Jellyfin+Emby
                if (_artist_id.length === 0) {
                    /// jellyfin+emby - all - action
                    if (_album_artist_id.length === 0) {
                        /// jellyfin+emby - all - action
                        const prarentId = _album_id.length === 0
                            ? store_server_user_model.parentid_of_Je_Music : _album_id
                        await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list(
                            playlist_id,
                            store_server_user_model.userid_of_Je, prarentId,
                            _search,
                            sortBy, sortOrder,
                            limit, startIndex,
                            'Audio',
                            'ParentId', 'Primary,Backdrop,Thumb', 'true', '1',
                            store_view_media_page_logic.page_songlists_filter_year > 0 ? store_view_media_page_logic.page_songlists_filter_year : '',
                            filter
                        )
                    } else { /// emby - home - action
                        await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list_of_home$album_of_Em(
                            _album_artist_id,
                            limit, startIndex,
                        )
                    }
                } else {
                    await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list_of_artist(
                        _artist_id,
                        limit, startIndex,
                    )
                }
            }
            else{
                await get_Jellyfin_Temp_Data_To_LocalSqlite.get_media_list_of_home$media_of_Je(
                    this._media_id,
                    limit, startIndex,
                )
            }
        }
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
    }
});
watch(() => store_playlist_appearance.playlist_show, async (newValue) => {
    if(newValue){
        store_view_media_page_fetchData._load_model = 'play'
    }else{
        store_view_media_page_fetchData._load_model = 'search'
    }
});
