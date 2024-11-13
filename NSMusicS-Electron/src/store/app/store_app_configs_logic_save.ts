import {reactive, ref} from "vue";
import {App_Configs} from "@/models/app_Configs/class_App_Configs";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_server_user_model} from "@/store/server/store_server_user_model";
import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
import {Class_Set_System_Configs_Write} from "@/features/system_configs/class_Set_System_Configs_Write";
import {Library_Configs} from "@/models/app_Configs/class_Library_Configs";
import {Player_Configs_of_UI} from "@/models/app_Configs/class_Player_Configs_of_UI";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {Player_Configs_of_Audio_Info} from "@/models/app_Configs/class_Player_Configs_of_Audio_Info";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
import {store_view_media_page_logic} from "@/store/view/media/store_view_media_page_logic";
import {store_playlist_list_info} from "@/store/view/playlist/store_playlist_list_info";
import {store_server_users} from "@/store/server/store_server_users";
import {store_router_data_info} from "@/store/router/store_router_data_info";
import {store_router_history_data_of_media} from "@/store/router/store_router_history_data_of_media"
import {store_view_media_page_info} from "@/store/view/media/store_view_media_page_info";
import {store_view_album_page_info} from "@/store/view/album/store_view_album_page_info";
import {store_view_artist_page_info} from "@/store/view/artist/store_view_artist_page_info";
import {store_router_data_logic} from "@/store/router/store_router_data_logic";

export const store_app_configs_logic_save = reactive({
    save_system_config_of_App_Configs(){
        let db:any = null;
        db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const app_Configs = ref(
            new App_Configs({
                theme: store_app_configs_info.theme_name,
                lang: store_app_configs_info.lang,
                router_name: String(store_router_data_info.router_name),
                app_left_menu_select_activeKey: String(store_app_configs_info.app_left_menu_select_activeKey),
                app_left_menu_collapsed: String(store_app_configs_info.app_left_menu_collapsed),
                model_select: String(store_server_user_model.model_select),
                server_select: String(store_server_user_model.server_select),
                server_select_kind: String(store_server_user_model.server_select_kind),
                username: String(store_server_user_model.username),
                password: String(store_server_user_model.password),
                play_order: String(store_player_audio_logic.play_order),
                play_volume: String(store_player_audio_logic.play_volume),
                selectd_props_app_sidebar: JSON.stringify(store_app_configs_info.selectd_props_app_sidebar),
                model_server_type_of_web: String(store_server_user_model.model_server_type_of_web),
                model_server_type_of_local: String(store_server_user_model.model_server_type_of_local),
                model_server_type_of_local_server_download: String(store_server_user_model.model_server_type_of_local_server_download),
                authorization: String(store_server_user_model.authorization),
                client_unique_id: String(store_server_user_model.client_unique_id),
                media_page_sizes: String(store_view_media_page_info.media_page_sizes),
                album_page_sizes: String(store_view_album_page_info.album_page_sizes),
                artist_page_sizes: String(store_view_artist_page_info.artist_page_sizes),
                clear_Memory_Model: String(store_router_data_logic.clear_Memory_Model),
                clear_Equilibrium_Model: String(store_router_data_logic.clear_Equilibrium_Model),
                clear_UserExperience_Model: String(store_router_data_logic.clear_UserExperience_Model),
                theme_auto_system: String(store_app_configs_info.theme_auto_system),
                page_songlists_filter_year: String(store_view_media_page_logic.page_songlists_filter_year),
                player_select: String(store_player_audio_logic.player_select),
                player_fade_value: String(store_player_audio_logic.player_fade_value),
                player_dolby: String(store_player_audio_logic.player_dolby),
                player_samp_value: String(store_player_audio_logic.player_samp_value),
                player_gaplessAudio: String(store_player_audio_logic.player_gaplessAudio),
                player_audioExclusiveMode: String(store_player_audio_logic.player_audioExclusiveMode),
                player_replayGainMode: String(store_player_audio_logic.player_replayGainMode),
                player_replayGainPreamp: String(store_player_audio_logic.player_replayGainPreamp),
                player_replayGainClip: String(store_player_audio_logic.player_replayGainClip),
                player_replayGainFallback: String(store_player_audio_logic.player_replayGainFallback),
                player_mpvExtraParameters: String(store_player_audio_logic.player_mpvExtraParameters),
                player_audio_channel: String(store_player_audio_logic.player_audio_channel)
            }));
        let system_Configs_Write = new Class_Set_System_Configs_Write()
        system_Configs_Write.system_app_config(
            db,
            app_Configs.value)
        console.log('save config succuessful')
        db.close();db = null;
    },
    save_system_library_config(){
        let db:any = null;
        db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');

        const library_Configs = ref(
            new Library_Configs({
                library: String(store_server_user_model.library_path)
            }))
        let system_Configs_Write = new Class_Set_System_Configs_Write()
        system_Configs_Write.system_library_config(
            db,
            library_Configs.value)
        this.save_system_config_of_App_Configs()
        db.close();db = null;
    },
    save_system_config_of_Player_Configs_of_UI(){
        let db:any = null;
        db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        const player_Configs_of_UI = ref(
            new Player_Configs_of_UI({
                player_collapsed_album: String(store_player_appearance.player_collapsed_album),
                player_collapsed_skin: String(store_player_appearance.player_collapsed_skin),
                player_lyric_fontSize: String(store_player_appearance.player_lyric_fontSize),
                player_lyric_fontWeight: String(store_player_appearance.player_lyric_fontWeight),
                player_lyric_color: String(store_player_appearance.player_lyric_color),
                player_theme_Styles_Selected: String(store_player_appearance.player_theme_Styles_Selected),
                player_background_model_num: String(store_player_appearance.player_background_model_num),
                player_use_lottie_animation: String(store_player_appearance.player_use_lottie_animation),
                player_use_background_filter_blur: String(store_player_appearance.player_use_background_filter_blur),
                player_use_playbar_auto_hide: String(store_player_appearance.player_use_playbar_auto_hide)
            }))
        let system_Configs_Write = new Class_Set_System_Configs_Write()
        system_Configs_Write.system_player_config_of_ui(
            db,
            player_Configs_of_UI.value)
        this.save_system_config_of_App_Configs()
        db.close();db = null;
    },
    save_system_config_of_Player_Configs_of_Audio_Info(){
        let db:any = null;
        db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');

        let player_Configs_of_Audio_Info = null
        if(store_server_user_model.model_server_type_of_web) {
            player_Configs_of_Audio_Info = ref(
                new Player_Configs_of_Audio_Info({
                    this_audio_file_path: String(''),
                    this_audio_file_medium_image_url: String(''),
                    this_audio_file_lyric: String(''),
                    this_audio_artist_name: String(''),
                    this_audio_artist_id: String(''),
                    this_audio_song_name: String(''),
                    this_audio_song_id: String(''),
                    this_audio_song_rating: String(0),
                    this_audio_song_favorite: String(false),
                    this_audio_album_name: String(''),
                    this_audio_album_id: String(''),
                    this_audio_Index_of_absolute_positioning_in_list: String(0),

                    page_top_album_image_url: String(store_player_audio_info.page_top_album_image_url),
                    page_top_album_id: String(store_player_audio_info.page_top_album_id),
                    page_top_album_name: String(store_player_audio_info.page_top_album_name),

                    page_songlists_selected: String(store_view_media_page_logic.page_songlists_selected),

                    player_mode_of_lock_playlist: String(store_player_appearance.player_mode_of_lock_playlist),
                    player_mode_of_medialist_from_external_import: String(store_player_appearance.player_mode_of_medialist_from_external_import),
                }));
        }else {
            player_Configs_of_Audio_Info = ref(
                new Player_Configs_of_Audio_Info({
                    this_audio_file_path: String(store_player_audio_info.this_audio_file_path),
                    this_audio_file_medium_image_url: String(store_player_audio_info.this_audio_file_medium_image_url),
                    this_audio_file_lyric: String(store_player_audio_info.this_audio_lyrics_string),
                    this_audio_artist_name: String(store_player_audio_info.this_audio_artist_name),
                    this_audio_artist_id: String(store_player_audio_info.this_audio_artist_id),
                    this_audio_song_name: String(store_player_audio_info.this_audio_song_name),
                    this_audio_song_id: String(store_player_audio_info.this_audio_song_id),
                    this_audio_song_rating: String(store_player_audio_info.this_audio_song_rating),
                    this_audio_song_favorite: String(store_player_audio_info.this_audio_song_favorite),
                    this_audio_album_name: String(store_player_audio_info.this_audio_album_name),
                    this_audio_album_id: String(store_player_audio_info.this_audio_album_id),
                    this_audio_Index_of_absolute_positioning_in_list: String(store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list),

                    page_top_album_image_url: String(store_player_audio_info.page_top_album_image_url),
                    page_top_album_id: String(store_player_audio_info.page_top_album_id),
                    page_top_album_name: String(store_player_audio_info.page_top_album_name),

                    page_songlists_selected: String(store_view_media_page_logic.page_songlists_selected),

                    player_mode_of_lock_playlist: String(store_player_appearance.player_mode_of_lock_playlist),
                    player_mode_of_medialist_from_external_import: String(store_player_appearance.player_mode_of_medialist_from_external_import),
                }));
        }
        let system_Configs_Write = new Class_Set_System_Configs_Write()
        system_Configs_Write.system_player_config_of_audio(
            db,
            player_Configs_of_Audio_Info.value)
        this.save_system_config_of_App_Configs()
        db.close();db = null;
    },
    save_system_playlist_item_id_config(){
        let db:any = null;
        db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');

        let system_Configs_Write = new Class_Set_System_Configs_Write();
        system_Configs_Write.system_playlist_item_id_config(
            db,
            store_playlist_list_info.playlist_datas_CurrentPlayList_ALLMediaIds
        )
        this.save_system_config_of_App_Configs()
        db.close();db = null;
    },
    save_system_config_of_View_Router_History(){
        let db:any = null;
        db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        let system_Configs_Write = new Class_Set_System_Configs_Write();
        system_Configs_Write.system_view_history(
            db,
            store_router_history_data_of_media.router_select_history_date_of_Media,
            [],
            undefined,
            // router_select_history_date_of_Album.value,
            [],
            undefined,
            // router_select_history_date_of_Artist.value,
            [],
        )
        this.save_system_config_of_App_Configs()
        db.close();db = null;
    },
    save_system_config_of_Servers_Config(){
        let db:any = null;
        db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
        db.pragma('journal_mode = WAL');
        db.exec('PRAGMA foreign_keys = OFF');


        let system_Configs_Write = new Class_Set_System_Configs_Write()
        system_Configs_Write.system_servers_config(
            db,
            store_server_users.server_config_of_all_user_of_sqlite)
        this.save_system_config_of_App_Configs()
        db.close();db = null;
    },
})