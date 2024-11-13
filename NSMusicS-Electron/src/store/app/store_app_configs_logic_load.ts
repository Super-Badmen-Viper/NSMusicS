import {reactive} from 'vue'
import {darkTheme, lightTheme} from 'naive-ui'
import { useI18n } from 'vue-i18n';
import {Class_Get_System_Configs_Read} from '@/features/system_configs/class_Get_System_Configs_Read'
import {Get_PlaylistInfo_From_LocalSqlite} from "@/features/sqlite3_local_configs/class_Get_PlaylistInfo_From_LocalSqlite";
import {store_app_configs_info} from '@/store/app/store_app_configs_info'
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
import {store_player_sound_effects} from "@/store/player/store_player_sound_effects";
import {store_player_sound_speed} from "@/store/player/store_player_sound_speed";
import {store_player_sound_more} from "@/store/player/store_player_sound_more";
import {store_playlist_appearance} from '@/store/view/playlist/store_playlist_appearance'
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info"
import {store_playlist_list_logic} from "@/store/view/playlist/store_playlist_list_logic"
import {store_server_users} from '@/store/server/store_server_users'
import {store_server_user_model} from '@/store/server/store_server_user_model'
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_view_home_page_info} from "@/store/view/home/store_view_home_page_info"
import {store_view_home_page_logic} from "@/store/view/home/store_view_home_page_logic"
import {store_view_album_page_info} from "@/store/view/album/store_view_album_page_info"
import {store_view_album_page_logic} from "@/store/view/album/store_view_album_page_logic"
import {store_view_artist_page_info} from "@/store/view/artist/store_view_artist_page_info"
import {store_view_artist_page_logic} from "@/store/view/artist/store_view_artist_page_logic"
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_router_data_logic} from "@/store/router/store_router_data_logic";
import {store_router_history_data_of_media} from "@/store/router/store_router_history_data_of_media";
import {store_router_history_data_of_album} from "@/store/router/store_router_history_data_of_album";
import {store_router_history_data_of_artist} from "@/store/router/store_router_history_data_of_artist";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {store_view_media_page_fetchData} from "@/store/view/media/store_view_media_page_fetchData";

export const store_app_configs_logic_load = reactive({
    app_configs_loading: false,
    async load_app_config() {
        /// system configs
        let system_Configs_Read = new Class_Get_System_Configs_Read();
        try {
            /// App_Configs load
            this.app_configs_loading = true
            store_server_user_model.server_select = '' + system_Configs_Read.app_Configs.value['server_select']
            store_server_user_model.server_select_kind = '' + system_Configs_Read.app_Configs.value['server_select_kind']
            store_server_user_model.username = '' + system_Configs_Read.app_Configs.value['username']
            store_server_user_model.password = '' + system_Configs_Read.app_Configs.value['password']
            store_server_user_model.model_server_type_of_web = '' + system_Configs_Read.app_Configs.value['model_server_type_of_web'] === 'true'
            store_server_user_model.model_server_type_of_local = '' + system_Configs_Read.app_Configs.value['model_server_type_of_local'] === 'true'
            store_server_user_model.model_server_type_of_local_server_download = '' + system_Configs_Read.app_Configs.value['model_server_type_of_local_server_download'] === 'true'
            store_server_user_model.authorization = '' + system_Configs_Read.app_Configs.value['authorization']
            store_server_user_model.client_unique_id = '' + system_Configs_Read.app_Configs.value['client_unique_id']
            store_view_media_page_info.media_page_sizes = Number('' + system_Configs_Read.app_Configs.value['media_page_sizes'])
            store_view_album_page_info.album_page_sizes = Number('' + system_Configs_Read.app_Configs.value['album_page_sizes'])
            store_view_artist_page_info.artist_page_sizes = Number('' + system_Configs_Read.app_Configs.value['artist_page_sizes'])
            ////// clear_UserExperience_Model
            const configKeys = ['clear_Memory_Model', 'clear_Equilibrium_Model', 'clear_UserExperience_Model'];
            let foundTrue = false;
            configKeys.forEach(key => {
                const value = '' + system_Configs_Read.app_Configs.value[key] === 'true';
                if (value && !foundTrue) {
                    foundTrue = true;
                    store_router_data_logic[key] = true;
                } else {
                    store_router_data_logic[key] = false;
                }
            });
            if(
                store_router_data_logic.clear_Memory_Model === false &&
                store_router_data_logic.clear_UserExperience_Model === false &&
                store_router_data_logic.clear_Equilibrium_Model === false
            ) {
                store_router_data_logic.clear_Equilibrium_Model = true
            }
            /////
            store_server_user_model.model_select = '' + system_Configs_Read.app_Configs.value['model_select']
            if(store_server_user_model.model_select === 'navidrome'){
                store_server_user_model.model_select = 'server';
            }
            if(store_server_user_model.model_select === 'server'){
                store_server_user_model.switchToMode_Server()
            }else{
                store_server_user_model.switchToMode_Local()
            }
            if (store_server_user_model.model_select === 'server') {
                store_server_users.percentage_of_nd = 100
                store_server_users.percentage_of_local = 0
                //
                if(store_server_user_model.model_server_type_of_local){
                    store_router_data_info.store_router_history_data_of_local = true
                    store_router_data_info.store_router_history_data_of_web = false
                }else if(store_server_user_model.model_server_type_of_web){
                    store_router_data_info.store_router_history_data_of_local = false
                    store_router_data_info.store_router_history_data_of_web = true
                }
            }
            //
            if (('' + system_Configs_Read.app_Configs.value['theme']) === 'lightTheme') {
                store_app_configs_info.update_theme = false;
                store_app_configs_info.theme = lightTheme;
                store_app_configs_info.theme_app = lightTheme;
            } else {
                store_app_configs_info.update_theme = true;
                store_app_configs_info.theme = darkTheme;
                store_app_configs_info.theme_app = darkTheme;
            }
            store_app_configs_info.theme_name = '' + system_Configs_Read.app_Configs.value['theme']
            store_app_configs_info.theme_auto_system = '' + system_Configs_Read.app_Configs.value['theme_auto_system'] === 'true'
            store_app_configs_info.lang = '' + system_Configs_Read.app_Configs.value['lang']
            // store_app_configs_info.app_left_menu_collapsed = '' + system_Configs_Read.app_Configs.value['app_left_menu_collapsed'] === 'true'
            store_app_configs_info.app_left_menu_collapsed = true
            store_app_configs_info.selectd_props_app_sidebar = JSON.parse('' + system_Configs_Read.app_Configs.value['selectd_props_app_sidebar'])
            this.handleUpdate_selectd_props_app_sidebar_Value(store_app_configs_info.selectd_props_app_sidebar)
            store_view_media_page_logic.page_songlists_filter_year = Number('' + system_Configs_Read.app_Configs.value['page_songlists_filter_year'])
            /// library_Config
            store_server_user_model.library_path = '' + system_Configs_Read.library_Configs.value['library']
            console.log(store_server_user_model.library_path)
            /// player_Configs_For_UI
            store_player_appearance.player_collapsed_album = '' + system_Configs_Read.player_Configs_of_UI.value['player_collapsed_album'] === 'true'
            store_player_appearance.player_collapsed_skin = '' + system_Configs_Read.player_Configs_of_UI.value['player_collapsed_skin'] === 'true'
            store_player_appearance.player_lyric_fontSize = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontSize']
            store_player_appearance.player_lyric_fontWeight = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_fontWeight']
            store_player_appearance.player_lyric_color = '' + system_Configs_Read.player_Configs_of_UI.value['player_lyric_color']
            store_player_appearance.player_theme_Styles_Selected = Number('' + system_Configs_Read.player_Configs_of_UI.value['player_theme_Styles_Selected'])
            store_player_appearance.player_background_model_num = Number('' + system_Configs_Read.player_Configs_of_UI.value['player_background_model_num'])
            store_player_appearance.player_use_lottie_animation = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_lottie_animation'] === 'true'
            store_player_appearance.player_use_background_filter_blur = '' + system_Configs_Read.player_Configs_of_UI.value['player_use_background_filter_blur'] === 'true'
            store_player_appearance.player_use_playbar_auto_hide =
                '' + system_Configs_Read.player_Configs_of_UI.value['player_use_playbar_auto_hide'] === 'true' ? true :
                    '' + system_Configs_Read.player_Configs_of_UI.value['player_use_playbar_auto_hide'] !== 'false';
            /// player_Configs_of_Audio_Info
            store_player_audio_info.this_audio_file_path = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_path']
            store_player_audio_info.this_audio_file_medium_image_url = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_medium_image_url']
            store_player_audio_info.this_audio_lyrics_string = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_file_lyric']
            store_player_audio_info.this_audio_artist_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_artist_id']
            store_player_audio_info.this_audio_artist_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_artist_name']
            store_player_audio_info.this_audio_song_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_name']
            store_player_audio_info.this_audio_song_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_id']
            store_player_audio_info.this_audio_song_favorite = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_favorite'] === 'true'
            store_player_audio_info.this_audio_song_rating = Number('' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_song_rating'])
            store_player_audio_info.this_audio_album_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_name']
            store_player_audio_info.this_audio_album_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_id']
            store_player_audio_info.this_audio_album_favorite = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_album_favorite']
            store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list = Number('' + system_Configs_Read.player_Configs_of_Audio_Info.value['this_audio_Index_of_absolute_positioning_in_list'])
            //
            store_player_audio_info.page_top_album_image_url = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_image_url']
            store_player_audio_info.page_top_album_id = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_id']
            store_player_audio_info.page_top_album_name = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_top_album_name']
            //
            store_player_appearance.player_mode_of_lock_playlist = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['player_mode_of_lock_playlist'] === 'true'
            store_player_appearance.player_mode_of_medialist_from_external_import = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['player_mode_of_medialist_from_external_import'] === 'true'


            /// view_router_history
            // init media page router histtory
            store_view_media_page_logic.page_songlists_keywordFilter = ""
            await store_view_media_page_fetchData.fetchData_Media()
            store_view_media_page_logic.page_songlists_selected = '' + system_Configs_Read.player_Configs_of_Audio_Info.value['page_songlists_selected']
            //
            store_router_history_data_of_media.router_select_history_date_of_Media = system_Configs_Read.view_Media_History_select_Configs.value
            store_router_history_data_of_album.router_select_history_date_of_Album = system_Configs_Read.view_Media_History_select_Configs.value
            store_router_history_data_of_artist.router_select_history_date_of_Artist = system_Configs_Read.view_Media_History_select_Configs.value

            /// server
            store_server_users.server_config_of_all_user_of_sqlite = system_Configs_Read.server_Configs.value
            store_server_users.server_config_of_all_user_of_select = [];
            store_server_users.server_config_of_all_user_of_sqlite.forEach((item: any) => {
                store_server_users.server_config_of_all_user_of_select.push({
                    label: item.type + ' - ' + item.server_name,
                    value: item.id
                });
            });
            /// init server
            store_server_users.server_config_of_current_user_of_sqlite = system_Configs_Read.server_Configs_Current.value
            const index = store_server_users.server_config_of_all_user_of_sqlite.findIndex(
                item =>
                    item.id === store_server_users.server_config_of_current_user_of_sqlite?.id);
            if (index >= 0) {
                store_server_users.server_config_of_current_user_of_sqlite = store_server_users.server_config_of_all_user_of_sqlite[index]
                store_server_users.server_config_of_current_user_of_select = {
                    label: store_server_users.server_config_of_all_user_of_sqlite[index].type + ' - ' + store_server_users.server_config_of_all_user_of_sqlite[index].server_name,
                    value: store_server_users.server_config_of_all_user_of_sqlite[index].id
                };
                store_server_users.server_config_of_current_user_of_select_servername =
                    store_server_users.server_config_of_all_user_of_sqlite[index].type + ' - ' + store_server_users.server_config_of_all_user_of_sqlite[index].server_name
            }
            ///
            store_app_configs_logic_save.save_system_config_of_Servers_Config()
            const {username, salt, token} = store_server_users.get_init_login_parms();
            store_server_user_model.username = username
            store_server_user_model.salt = salt
            store_server_user_model.token = token

            /// playlist media_file_id_of_list
            if(store_server_user_model.model_server_type_of_local) {
                store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds = system_Configs_Read.playlist_File_Configs.value
                let get_PlaylistInfo_From_LocalSqlite = new Get_PlaylistInfo_From_LocalSqlite()
                store_playlist_list_info.playlist_MediaFiles_temporary = get_PlaylistInfo_From_LocalSqlite.Get_Playlist_Media_File_Id_of_list(
                    store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds
                )
                // Get Play_Id
                const media_file = store_playlist_list_info.playlist_MediaFiles_temporary.find(
                    (row) => row.id === store_player_audio_info.this_audio_song_id
                );
                if (media_file) {
                    store_player_audio_info.this_audio_play_id = media_file.play_id;
                }
            }else if(store_server_user_model.model_server_type_of_web){

            }
        } catch (e) {
            console.error(e)
        }

        /// playlist configs
        await store_playlist_list_logic.reset_data()

        /// player
        store_player_audio_logic.play_order = '' + system_Configs_Read.app_Configs.value['play_order']
        store_player_audio_logic.play_volume = Number('' + system_Configs_Read.app_Configs.value['play_volume'])
        try {
            if ('' + system_Configs_Read.app_Configs.value['player_select'] === null || '' + system_Configs_Read.app_Configs.value['player_select'].length < 0) {
                store_player_audio_logic.player_select = 'mpv'
            } else {
                if('' + system_Configs_Read.app_Configs.value['player_select'] === 'mpv'){
                    store_player_audio_logic.player_select = 'mpv'
                }else if('' + system_Configs_Read.app_Configs.value['player_select'] === 'web'){
                    store_player_audio_logic.player_select = 'web'
                }else{
                    store_player_audio_logic.player_select = 'mpv'
                }
            }
        }catch {
            store_player_audio_logic.player_select = 'mpv'
            store_player_audio_logic.player_fade_value = 2000;
        }
        store_player_audio_logic.player_fade_value = Number('' + system_Configs_Read.app_Configs.value['player_fade_value'])
        if (store_player_audio_logic.player_fade_value === null) {
            store_player_audio_logic.player_fade_value = 2000;
        }
        try {
            store_player_audio_logic.player_dolby = '' + system_Configs_Read.app_Configs.value['player_dolby'] === 'true'
            store_player_audio_logic.player_audio_channel =  '' + system_Configs_Read.app_Configs.value['player_audio_channel']
            store_player_audio_logic.player_samp_value = Number('' + system_Configs_Read.app_Configs.value['player_samp_value'])
            store_player_audio_logic.player_gaplessAudio = '' + system_Configs_Read.app_Configs.value['player_gaplessAudio']
            store_player_audio_logic.player_audioExclusiveMode = '' + system_Configs_Read.app_Configs.value['player_audioExclusiveMode'] === 'true'
            store_player_audio_logic.player_replayGainMode = '' + system_Configs_Read.app_Configs.value['player_replayGainMode']
            store_player_audio_logic.player_replayGainPreamp = Number('' + system_Configs_Read.app_Configs.value['player_replayGainPreamp'])
            store_player_audio_logic.player_replayGainClip = '' + system_Configs_Read.app_Configs.value['player_replayGainClip'] === 'true'
            store_player_audio_logic.player_replayGainFallback = Number('' + system_Configs_Read.app_Configs.value['player_replayGainFallback'])
            store_player_audio_logic.player_mpvExtraParameters = '' + system_Configs_Read.app_Configs.value['player_mpvExtraParameters']
        }catch{
            store_player_audio_logic.player_dolby = true;
            store_player_audio_logic.player_audio_channel = '5.1';
            store_player_audio_logic.player_samp_value = 48000;
            store_player_audio_logic.player_gaplessAudio = 'weak';
            store_player_audio_logic.player_audioExclusiveMode = false;
            store_player_audio_logic.player_replayGainMode = 'no';
            store_player_audio_logic.player_replayGainPreamp = 0;
            store_player_audio_logic.player_replayGainClip = false;
            store_player_audio_logic.player_replayGainFallback = 0;
            store_player_audio_logic.player_mpvExtraParameters = ''
        }
        if(store_player_audio_logic.player_audio_channel.length < 0){
            store_player_audio_logic.player_audio_channel = '5.1';
        }

        /// close
        store_router_data_logic.get_page_top_info()
        store_app_configs_info.app_left_menu_select_activeKey = '' + system_Configs_Read.app_Configs.value['app_left_menu_select_activeKey']
        store_router_data_info.router_name = '' + system_Configs_Read.app_Configs.value['router_name']
        if(store_router_data_info.router_name === ''){
            store_app_configs_info.app_left_menu_select_activeKey = 'View_Menu_AppSetting'
            store_router_data_info.router_name = 'View_Menu_AppSetting'
        }
        store_router_data_info.router.push(store_router_data_info.router_name)
        this.app_configs_loading = false

        // await store_player_audio_logic.player.pause();
        if(store_server_user_model.model_server_type_of_web){
            store_player_audio_logic.this_audio_initial_trigger = true
        }
    },
    handleUpdate_selectd_props_app_sidebar_Value(value: number[]){
        let allMenuOptions = store_app_configs_info.menuOptions_appBar;
        let removeFlags = new Array(allMenuOptions.length).fill(true);
        value.forEach(index => {
            if (index < allMenuOptions.length) {
                removeFlags[index] = false;
            }
        });
        removeFlags[0] = false;
        removeFlags[1] = false;
        removeFlags[3] = removeFlags[2];
        if(removeFlags[4] && removeFlags[5] && removeFlags[6] && removeFlags[7])
            removeFlags[8] = true;
        else
            removeFlags[8] = false;
        let menuOptions_appBar = allMenuOptions.filter((option, index) => {
            return !removeFlags[index];
        });
        store_app_configs_info.menuOptions_appBar = menuOptions_appBar
    }
});