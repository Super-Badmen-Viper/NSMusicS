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

    clear_Memory_Model: true,
    clear_UserExperience_Model: false,
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
    },
    get_album_list_of_artist_id_by_album_info(value: any) {
        // open album_files model，keywords set
        store_view_album_page_logic.page_albumlists_keyword = value
        store_view_album_page_logic.page_albumlists_get_keyword_model_num = 2
        store_router_data_info.find_album_model = true
        console.log('get_album_list_of_artist_model：'+value)
    },
    get_album_list_of_artist_id_by_artist_info(value: any) {
        store_router_data_info.router.push('View_Album_List_ALL')
        // open album_files model，keywords set
        store_router_data_info.find_album_model = true
        store_view_album_page_logic.page_albumlists_keyword = value
        store_view_album_page_logic.page_albumlists_get_keyword_model_num = 2
        store_router_data_info.find_artist_model = false
        console.log('get_album_list_of_artist_model：'+value)
    },
});
watch(() => store_router_data_logic.clear_Memory_Model, (newValue) => {
    store_router_data_logic.clear_UserExperience_Model = !newValue
    store_app_configs_logic_save.save_system_library_config()
});
watch(() => store_router_data_logic.clear_UserExperience_Model, (newValue) => {
    store_router_data_logic.clear_Memory_Model = !newValue
    store_app_configs_logic_save.save_system_library_config()
});