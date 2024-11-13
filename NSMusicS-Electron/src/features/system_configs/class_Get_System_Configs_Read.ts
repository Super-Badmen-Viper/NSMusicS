import { ref } from 'vue'
import { App_Configs } from '@/models/app_Configs/class_App_Configs';
import { Player_Configs_of_Audio_Info } from '@/models/app_Configs/class_Player_Configs_of_Audio_Info';
import { Player_Configs_of_UI } from '@/models/app_Configs/class_Player_Configs_of_UI';
import {Library_Configs} from "@/models/app_Configs/class_Library_Configs";
import {store_app_configs_info} from "@/store/app/store_app_configs_info";
import {store_player_appearance} from "@/store/player/store_player_appearance";

export class Class_Get_System_Configs_Read {
    public app_Configs = ref(
        new App_Configs({
            theme: null,
            lang: '',
            router_name: '',
            app_left_menu_select_activeKey: '',
            app_left_menu_collapsed: null,
            model_select: '',
            server_select: '',
            server_select_kind: '',
            username: '',
            password: '',
            play_order: '',
            play_volume: 0,
            selectd_props_app_sidebar: '',
            model_server_type_of_web: null,
            model_server_type_of_local: null,
            model_server_type_of_local_server_download: null,
            authorization: '',
            client_unique_id: '',
            media_page_sizes: 0,
            album_page_sizes: 0,
            artist_page_sizes: 0,
            clear_Memory_Model: null,
            clear_Equilibrium_Model: null,
            clear_UserExperience_Model: null,
            theme_auto_system: null,
            page_songlists_filter_year: 0,
            player_select: null,
            player_fade_value: 0,
            player_dolby: null,
            player_samp_value: 0,
            player_gaplessAudio: '',
            player_audioExclusiveMode: null,
            player_replayGainMode: '',
            player_replayGainPreamp: 0,
            player_replayGainClip: null,
            player_replayGainFallback: 0,
            player_mpvExtraParameters: '',
            player_audio_channel:''
        }))
    public library_Configs = ref(
        new Library_Configs({
            library: ''
        }))
    public player_Configs_of_UI = ref(
        new Player_Configs_of_UI({
            player_collapsed_album: null,
            player_collapsed_skin: null,
            player_lyric_fontSize: '',
            player_lyric_fontWeight: '',
            player_lyric_color: '',
            player_theme_Styles_Selected: null,
            player_background_model_num: null,
            player_use_lottie_animation: null,
            player_use_background_filter_blur: null,
            player_use_playbar_auto_hide: null,
        }))
    public player_Configs_of_Audio_Info = ref(
        new Player_Configs_of_Audio_Info({
            this_audio_file_path: '',
            this_audio_file_medium_image_url: '',
            this_audio_file_lyric: '',
            this_audio_artist_name: '',
            this_audio_artist_id: '',
            this_audio_song_name: '',
            this_audio_song_id: '',
            this_audio_song_rating: '',
            this_audio_song_favorite: '',
            this_audio_album_name: '',
            this_audio_album_id: '',
            this_audio_Index_of_absolute_positioning_in_list: null,
        
            page_top_album_image_url: '',
            page_top_album_id: '',
            page_top_album_name: '',

            page_songlists_selected: '',
        
            player_mode_of_lock_playlist: null,
            player_mode_of_medialist_from_external_import: null,
        }))
    public playlist_File_Configs = ref<string[]>([])
    public view_Media_History_Configs = ref<Interface_View_Router_Date[]>([])
    public view_Album_History_Configs = ref<Interface_View_Router_Date[]>([])
    public view_Artist_History_Configs = ref<Interface_View_Router_Date[]>([])
    public view_Media_History_select_Configs = ref<Interface_View_Router_Date>()
    public view_Album_History_select_Configs = ref<Interface_View_Router_Date>()
    public view_Artist_History_select_Configs = ref<Interface_View_Router_Date>()
    ///
    public server_Configs = ref<Server_Configs_Props[]>([])
    public server_Configs_Current = ref<Server_Configs_Props>()

    constructor() {
        let db_navidrome:any = null;
        db_navidrome = require('better-sqlite3')(store_app_configs_info.navidrome_db);
        db_navidrome.pragma('journal_mode = WAL');
        try {
            db_navidrome.exec('BEGIN');
            const tableSchema = db_navidrome.prepare(`PRAGMA table_info(media_file)`).all();
            const hasMediumImageUrlColumn = tableSchema.some(column => column.name === 'medium_image_url');
            if (!hasMediumImageUrlColumn) {
                db_navidrome.exec(`ALTER TABLE media_file ADD COLUMN medium_image_url TEXT`);
            }
            db_navidrome.exec('COMMIT');
        } catch (error) {
            db_navidrome.exec('ROLLBACK');
            console.error('Error modifying media_file table:', error);
        } finally {
            db_navidrome.close()
            db_navidrome = null;
        }

        let db:any = null;
        db = require('better-sqlite3')(store_app_configs_info.nsmusics_db);
        db.pragma('journal_mode = WAL');
        /// Modify user configuration
        try {
            db.exec('BEGIN');
            db.exec(`CREATE TABLE IF NOT EXISTS system_playlist_file_id (
                "media_file_id"	varchar(255) NOT NULL,
                "order_index"	INTEGER
            )`);
            const hasData = db.prepare(`SELECT COUNT(*) AS count FROM system_playlist_file_id_config`).get().count || 0;
            if (hasData > 0) {
                db.exec(`INSERT INTO system_playlist_file_id SELECT * FROM system_playlist_file_id_config`);
                db.exec(`DELETE FROM system_playlist_file_id_config`);
            }
            db.exec('COMMIT');
        } catch (error) {
            db.exec('ROLLBACK');
            console.error('Error modifying user configuration:', error);
        }
        ///
        db.prepare(`SELECT * FROM system_app_config`).all().forEach((row: Config_Props, index: number) => {
            const propertyName = row.config_key;
            if (this.app_Configs.value.hasOwnProperty(propertyName))
                this.app_Configs.value[propertyName] = row.config_value;// If this line of code ide displays an error, please ignore error
        });
        db.prepare(`SELECT * FROM system_library_config`).all().forEach((row: Config_Props, index: number) => {
            const propertyName = row.config_key;
            if (this.library_Configs.value.hasOwnProperty(propertyName))
                this.library_Configs.value[propertyName] = row.config_value;// If this line of code ide displays an error, please ignore error
        });
        db.prepare(`SELECT * FROM system_player_config_of_audio`).all().forEach((row: Config_Props, index: number) => {
            const propertyName = row.config_key;
            if (this.player_Configs_of_Audio_Info.value.hasOwnProperty(propertyName)) 
                this.player_Configs_of_Audio_Info.value[propertyName] = row.config_value;// If this line of code ide displays an error, please ignore error
        });
        db.prepare(`SELECT * FROM system_player_config_of_ui`).all().forEach((row: Config_Props, index: number) => {
            const propertyName = row.config_key;
            if (this.player_Configs_of_UI.value.hasOwnProperty(propertyName))
                this.player_Configs_of_UI.value[propertyName] = row.config_value;// If this line of code ide displays an error, please ignore error
        });
        /// play_list
        const stmt_playlist_tracks_media_file_id = db.prepare(`SELECT * FROM system_playlist_file_id`);
        this.playlist_File_Configs.value = stmt_playlist_tracks_media_file_id.all().map(item => item.media_file_id);

        /// view_router_hisotry
        db.prepare(`SELECT * FROM system_view_media_history`).all().forEach((row: Interface_View_Router_Date) => {
            this.view_Media_History_Configs.value.push(row);
        });
        db.prepare(`SELECT * FROM system_view_album_history`).all().forEach((row: Interface_View_Router_Date) => {
            this.view_Album_History_Configs.value.push(row);
        });
        db.prepare(`SELECT * FROM system_view_artist_history`).all().forEach((row: Interface_View_Router_Date) => {
            this.view_Artist_History_Configs.value.push(row);
        });
        db.prepare(`SELECT * FROM system_view_media_select_history`).all().forEach((row: Interface_View_Router_Date) => {
            this.view_Media_History_select_Configs.value = row;
        });
        db.prepare(`SELECT * FROM system_view_album_select_history`).all().forEach((row: Interface_View_Router_Date) => {
            this.view_Album_History_select_Configs.value = row;
        });
        db.prepare(`SELECT * FROM system_view_artist_select_history`).all().forEach((row: Interface_View_Router_Date) => {
            this.view_Artist_History_select_Configs.value = row;
        });
        ///
        db.prepare(`SELECT * FROM system_servers_config`).all().forEach((row: Server_Configs_Props, index: number) => {
            this.server_Configs.value.push(row);
        });
        db.prepare(`SELECT * FROM system_servers_config`).all().forEach((row: Server_Configs_Props) => {
            if(row.id === '' + this.app_Configs.value['server_select']) {
                this.server_Configs_Current.value = row;
            }
        });

        db.close();
        db = null;
    }
}