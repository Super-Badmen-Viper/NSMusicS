import {reactive} from 'vue'
import {
    Set_PlaylistInfo_To_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Set_PlaylistInfo_To_LocalSqlite";
import {store_playlist_list_logic} from "@/store/playlist/store_playlist_list_logic";
import {
    Set_AnnotationInfo_To_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Set_AnnotationInfo_To_LocalSqlite";
import {
    Set_LibraryInfo_To_LocalSqlite
} from "@/features/sqlite3_local_configs/class_Set_LibraryInfo_To_LocalSqlite";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";

export const store_view_media_page_logic = reactive({
    list_data_StartUpdate: false,

    page_songlists_options: [],
    page_songlists_statistic: [],
    page_songlists: [],
    page_songlists_selected: 'song_list_all',
    page_songlists_keyword_reset: false,
    page_songlists_keyword: '',
    page_songlists_keywordFilter: '',
    page_songlists_get_keyword_model_num: 0,
    page_songlists_options_Sort_key: [],

    set_media_Files_selected(value: Media_File) {
        if (value.selected) {
            store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
                if (item.id === value.id) {
                    store_view_media_page_info.media_Files_temporary[index].selected = true;
                }
            });
            store_view_media_page_info.media_Files_selected.push(value)
            console.log('media_Files_selected：'+value.path+'  '+value.selected)
        } else {
            store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
                if (item.id === value.id) {
                    store_view_media_page_info.media_Files_temporary[index].selected = false;
                }
            });
            store_view_media_page_info.media_Files_selected = store_view_media_page_info.media_Files_selected.filter((item: any) => item.id !== value.id);
            console.log('media_Files_selected：'+value.path+'  '+value.selected)
        }
    },
    set_media_Files_selected_all(value: boolean) {
        store_view_media_page_info.media_Files_temporary.forEach((item: any, index: number) => {
            store_view_media_page_info.media_Files_temporary[index].selected = value;
        });
        if (value) {
            store_view_media_page_info.media_Files_selected = store_view_media_page_info.media_Files_temporary.slice();
        } else {
            store_view_media_page_info.media_Files_selected = [];
        }
        console.log('media_Files_selected：'+value)
    },
    get_selected_playlist_add_MediaFile(value: any){
        console.log('selected_playlist_addMediaFile',value)
        let set_PlaylistInfo_From_LocalSqlite = new Set_PlaylistInfo_To_LocalSqlite();
        set_PlaylistInfo_From_LocalSqlite.Set_Selected_MediaInfo_Add_Selected_Playlist(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
            value
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
    },
    get_selected_lovelist_add_MediaFile(value: any){
        console.log('selected_lovelist_addMediaFile',value)
        let set_AnnotationInfo_To_LocalSqlite = new Set_AnnotationInfo_To_LocalSqlite()
        set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_Add_Selected_Favorite(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
            true
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
    },
    get_selected_playlist_delete_MediaFile(value: any){
        console.log('selected_playlist_deleteMediaFile',value)
        let set_PlaylistInfo_From_LocalSqlite = new Set_PlaylistInfo_To_LocalSqlite();
        set_PlaylistInfo_From_LocalSqlite.Set_Selected_MediaInfo_Delete_Selected_Playlist(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
            value
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
    },
    get_selected_locallist_delete_MediaFile(value: any){
        console.log('selected_locallist_deleteMediaFile',value)
        let set_LibraryInfo_To_LocalSqlite = new Set_LibraryInfo_To_LocalSqlite();
        set_LibraryInfo_To_LocalSqlite.Set_LibraryInfo_Delete_Selected_Playlist(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id)
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
    },
    get_selected_lovelist_delete_MediaFile(value: any){
        console.log('selected_lovelist_deleteMediaFile',value)
        let set_AnnotationInfo_To_LocalSqlite = new Set_AnnotationInfo_To_LocalSqlite();
        set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_Delete_Selected_Favorite(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
            value
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
    },
    get_selected_recentlist_deletet_MediaFile(value: any){
        console.log('selected_recentlist_deletetMediaFile',value)
        let set_AnnotationInfo_To_LocalSqlite = new Set_AnnotationInfo_To_LocalSqlite();
        set_AnnotationInfo_To_LocalSqlite.Set_MediaInfo_To_Selected_PlayCount_of_Delete(
            store_view_media_page_info.media_Files_selected.map((file: any) => file.id),
            value
        )
        store_playlist_list_logic.get_playlist_tracks_temporary_update_media_file(true)
    },
});