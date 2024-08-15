import { reactive } from 'vue'
import {store_router_data_logic} from "@/store/router/store_router_data_logic";
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_router_history_data_of_artist} from "@/store/router/store_router_history_data_of_artist";
import {store_view_artist_page_logic} from "@/store/view/artist/store_view_artist_page_logic";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_view_artist_page_info} from "@/store/view/artist/store_view_artist_page_info";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";
import {store_playlist_list_info} from "@/store/playlist/store_playlist_list_info";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {Set_ArtistInfo_To_LocalSqlite} from "@/features/sqlite3_local_configs/class_Set_ArtistInfo_To_LocalSqlite";
import {
    store_local_data_set_artistInfo
} from "@/store/local/local_data_synchronization/store_local_data_set_artistInfo";

export const store_view_artist_page_fetchData = reactive({
    async fetchData_Artist(){
        let db: any = null;
        // clear RouterView of vue-virtual-scroller data
        store_router_data_logic.clear_Files_temporary()
        store_router_data_info.router_select_model_artist = true;

        try {
            db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
            db.pragma('journal_mode = WAL');
            let stmt_artist = null;
            let stmt_artist_string = '';

            // load artist_Files_temporary data
            if (store_router_history_data_of_artist.router_history_model_of_Artist === 0) {
                const sortKey = store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 && store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default' ?
                    store_view_artist_page_logic.page_artistlists_options_Sort_key[0].columnKey : 'id';
                const sortOrder = store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 && store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default' ?
                    store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order.replace('end', '') : '';
                let keywordFilter = store_view_artist_page_logic.page_artistlists_keyword.length > 0 ?
                    `WHERE name LIKE '%${store_view_artist_page_logic.page_artistlists_keyword}%' 
                    OR external_info_updated_at LIKE '%${store_view_artist_page_logic.page_artistlists_keyword}%'` :
                    '';
                stmt_artist_string = `SELECT * FROM ${store_server_user_model.artist} ${keywordFilter} ORDER BY ${sortKey} ${sortOrder}`;
                stmt_artist = db.prepare(stmt_artist_string);
                //////
                if (store_router_history_data_of_artist.router_select_history_date_of_Artist && store_view_artist_page_info.page_artistlists_keyword_reset === true) {
                    store_router_history_data_of_artist.remove_router_history_of_Artist(store_router_history_data_of_artist.router_select_history_date_of_Artist.id);// 若存在新操作，则覆盖后续的路由
                    store_view_artist_page_info.page_artistlists_keyword_reset = false;
                }
                const routerDate: Interface_View_Router_Date = {
                    id: store_router_history_data_of_artist.router_history_datas_of_Artist ? store_router_history_data_of_artist.router_history_datas_of_Artist.length + 1 : 1,
                    menu_select_active_key: 'go_artist_list',
                    router_name: 'View_Artist_List_ALL',
                    router_select_model_media: false,
                    router_select_model_album: false,
                    router_select_model_artist: true,
                    page_lists_keyword: store_view_artist_page_logic.page_artistlists_keyword,
                    stmt_string: stmt_artist_string,
                    page_lists_selected: store_view_artist_page_logic.page_artistlists_selected,
                    columnKey: store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 && store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default' ?
                        store_view_artist_page_logic.page_artistlists_options_Sort_key[0].columnKey : 'id',
                    order: store_view_artist_page_logic.page_artistlists_options_Sort_key.length > 0 && store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order !== 'default' ?
                        store_view_artist_page_logic.page_artistlists_options_Sort_key[0].order.replace('end', '') : '',
                    page_lists_scrollindex: store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value,
                };
                store_router_history_data_of_artist.add_router_history_of_Artist(routerDate);// 重复路由不添加
                //////
            } else {
                if (store_router_history_data_of_artist.router_select_history_date_of_Artist) {
                    store_router_data_info.router.push('View_Artist_List_ALL')
                    store_router_data_info.router_select_model_artist = true;
                    store_view_artist_page_logic.page_artistlists_keyword = store_router_history_data_of_artist.router_select_history_date_of_Artist.page_lists_keyword;
                    store_view_artist_page_logic.page_artistlists_selected = store_router_history_data_of_artist.router_select_history_date_of_Artist.page_lists_selected;
                    store_view_artist_page_logic.page_artistlists_options_Sort_key = [
                        {
                            columnKey: store_router_history_data_of_artist.router_select_history_date_of_Artist.columnKey,
                            order: store_router_history_data_of_artist.router_select_history_date_of_Artist.order
                        }
                    ];
                    store_router_history_data_of_artist.router_history_model_of_Artist_scroller_value = store_router_history_data_of_artist.router_select_history_date_of_Artist.page_lists_scrollindex;
                    stmt_artist = db.prepare(store_router_history_data_of_artist.router_select_history_date_of_Artist.stmt_string);
                }
                store_router_history_data_of_artist.router_history_model_of_Artist = 0;
            }
            const stmt_media_file = db.prepare(`SELECT * FROM ${store_server_user_model.media_file}`);
            const pathfiles = stmt_media_file.all();
            let rows = stmt_artist.all();
            rows.forEach((row: Artist) => {
                for (let j = 0; j < pathfiles.length; j++) {
                    if (pathfiles[j].artist_id === row.id) {
                        if(row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
                            if (pathfiles[j].path.indexOf('mp3') > 0)
                                row.medium_image_url = pathfiles[j].path.replace('mp3', 'jpg');
                            else if (pathfiles[j].path.indexOf('flac') > 0)
                                row.medium_image_url = pathfiles[j].path.replace('flac', 'jpg');
                            else
                                row.medium_image_url = '../../../resources/img/error_album.jpg';
                        }
                        break;
                    }
                    if (j === pathfiles.length - 1) {
                        row.medium_image_url = '../../../resources/img/error_album.jpg';
                    }
                }
                store_view_artist_page_info.artist_Files_temporary.push(row);
            });
            rows.length = 0
            ////// find favorite for artist_Files_temporary
            const stmt_artist_Annotation_Starred_Items = db.prepare(`
      SELECT item_id FROM ${store_server_user_model.annotation}
      WHERE starred = 1 AND item_type='artist'
    `);
            const annotations = stmt_artist_Annotation_Starred_Items.all();
            for (let i = 0; i < store_view_artist_page_info.artist_Files_temporary.length; i++) {
                store_view_artist_page_info.artist_Files_temporary[i].favorite = !!annotations.some((annotation: {
                    item_id: string
                }) => annotation.item_id === store_view_artist_page_info.artist_Files_temporary[i].id);
            }
            ////// find rating for artist_Files_temporary
            const stmt_artist_Annotation_Rating_Items = db.prepare(`
        SELECT item_id, rating FROM ${store_server_user_model.annotation}
        WHERE rating > 0 AND item_type='artist'
    `);
            const annotations_rating = stmt_artist_Annotation_Rating_Items.all();
            for (let i = 0; i < store_view_artist_page_info.artist_Files_temporary.length; i++) {
                const artistFile = store_view_artist_page_info.artist_Files_temporary[i];
                const matchingAnnotation = annotations_rating.find((annotation: {
                    item_id: string,
                    rating: number
                }) => annotation.item_id === artistFile.id);
                if (matchingAnnotation)
                    artistFile.rating = matchingAnnotation.rating;
                else
                    artistFile.rating = 0;
            }
            ////// filter selected_list for artist_Files_temporary
            let order_play_date:any[] = [];
            store_view_artist_page_info.artist_Files_temporary = store_view_artist_page_info.artist_Files_temporary.filter((item: any) => {
                if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_all') {
                    return true;
                } else if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_love') {
                    return annotations.some((annotation: { item_id: string }) => annotation.item_id === item.id);
                } else if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_recently') {
                    const stmt_artist_Annotation_Recently_Items = db.prepare(`
                      SELECT item_id FROM ${store_server_user_model.annotation}
                      WHERE item_type='artist' AND play_count>0
                      ORDER BY play_date DESC
                    `);
                    const annotations = stmt_artist_Annotation_Recently_Items.all().map((annotation: any) => annotation.item_id);
                    order_play_date = annotations;
                    return annotations.includes(item.id);
                } else if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_all_PlayList') {
                    return true;
                }
            });
            if (store_view_artist_page_logic.page_artistlists_selected === 'artist_list_recently') {
                let new_sort: Artist[] = store_view_artist_page_info.artist_Files_temporary.slice();
                store_view_artist_page_info.artist_Files_temporary = [];
                order_play_date.forEach((id) => {
                    const index = new_sort.findIndex(item => item.id === id);
                    if (index !== -1) {
                        store_view_artist_page_info.artist_Files_temporary.push(new_sort[index]);
                        new_sort.splice(index, 1);
                    }
                });
            }
            // store_view_artist_page_info.artist_Files_temporary.forEach((item: any, index: number) => {
            //   item.absoluteIndex = index + 1;
            // });
        } catch (err: any) {
            console.error(err);
        } finally {
            db.close();
            console.log('db.close().......');
            db = null;
        }
    },
    async fetchData_This_Artist_SongList(artist_id:any){
        store_player_appearance.player_mode_of_medialist_from_external_import = true;

        store_view_media_page_logic.page_songlists_keywordFilter = `WHERE artist_id = '${artist_id}'`
        store_view_media_page_logic.page_songlists_selected = 'song_list_all'
        store_view_media_page_info.media_Files_temporary = [];

        store_router_data_info.find_music_model = false;
        store_router_data_info.find_album_model = false;
        store_router_data_info.find_artist_model = true;
        store_view_media_page_fetchData.fetchData_Media()
        store_router_data_info.find_artist_model = false;

        store_playlist_list_info.playlist_MediaFiles_temporary = [...store_view_media_page_info.media_Files_temporary];
        store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds = store_view_media_page_info.media_Files_temporary.map(item => item.id);
        store_app_configs_logic_save.save_system_playlist_item_id_config();

        store_router_data_info.router_select_model_artist = true

        if(store_playlist_list_info.playlist_MediaFiles_temporary.length > 0){
            store_player_appearance.player_mode_of_lock_playlist = false
            store_player_audio_info.this_audio_file_path = store_playlist_list_info.playlist_MediaFiles_temporary[0].path
            store_player_audio_info.this_audio_lyrics_string = store_playlist_list_info.playlist_MediaFiles_temporary[0].lyrics
            store_player_audio_info.this_audio_file_medium_image_url = store_playlist_list_info.playlist_MediaFiles_temporary[0].medium_image_url
            store_player_audio_info.this_audio_singer_name = store_playlist_list_info.playlist_MediaFiles_temporary[0].artist
            store_player_audio_info.this_audio_song_name = store_playlist_list_info.playlist_MediaFiles_temporary[0].title
            store_player_audio_info.this_audio_album_id = store_playlist_list_info.playlist_MediaFiles_temporary[0].album_id
            store_player_audio_info.this_audio_album_favorite = store_playlist_list_info.playlist_MediaFiles_temporary[0].favorite
            store_player_audio_info.this_audio_album_name = store_playlist_list_info.playlist_MediaFiles_temporary[0].album
            store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list = store_playlist_list_info.playlist_MediaFiles_temporary[0].absoluteIndex
            ///
            store_player_audio_info.this_audio_song_id = store_playlist_list_info.playlist_MediaFiles_temporary[0].id
            store_player_audio_info.this_audio_song_rating = store_playlist_list_info.playlist_MediaFiles_temporary[0].rating
            store_player_audio_info.this_audio_song_favorite = store_playlist_list_info.playlist_MediaFiles_temporary[0].favorite
        }

        store_local_data_set_artistInfo.Set_ArtistInfo_To_PlayCount_of_Artist(store_playlist_list_info.playlist_MediaFiles_temporary[0].artist_id)
    },
});