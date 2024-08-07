import { ref } from 'vue'
import { App_Configs } from '@/models/app_Configs/class_App_Configs';
import { Player_Configs_of_Audio_Info } from '@/models/app_Configs/class_Player_Configs_of_Audio_Info';
import { Player_Configs_of_UI } from '@/models/app_Configs/class_Player_Configs_of_UI';
import { Server_Configs } from "@/models/server_Configs/class_Server_Configs";
import {Library_Configs} from "@/models/app_Configs/class_Library_Configs";

export class System_Configs_Read {
    public app_Configs = ref(
        new App_Configs({
            theme: null,
            lang: '',
            router_name: '',
            app_left_menu_select_activeKey: '',
            app_left_menu_collapsed: null,
            model_select: ''
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
        }))
    public player_Configs_of_Audio_Info = ref(
        new Player_Configs_of_Audio_Info({
            this_audio_file_path: '',
            this_audio_file_medium_image_url: '',
            this_audio_file_lyric: '',
            this_audio_singer_name: '',
            this_audio_singer_id: '',
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
        
            this_audio_file_path_from_playlist: null,
            fetchData_This_AlbumOrArtist_PlayMedia_Model: null,
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
        const path = require('path');
        let db:any = null;

        db = require('better-sqlite3')(path.resolve('resources/nsmusics.db'));
        db.pragma('journal_mode = WAL');

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
        const stmt_playlist_tracks_media_file_id = db.prepare(`SELECT * FROM system_playlist_file_id_config`);
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
        db.prepare(`SELECT * FROM system_servers_config ORDER BY last_login_at desc LIMIT 1`).all().forEach((row: Server_Configs_Props) => {
            this.server_Configs_Current.value = row;
        });

        db.close();
        db = null;
    }
}