import { App_Configs } from '@/models/app_Configs_For_Sqlite/class_App_Configs';
import { Player_Configs_of_Audio_Info } from '@/models/app_Configs_For_Sqlite/class_Player_Configs_of_Audio_Info';
import { Player_Configs_of_UI } from '@/models/app_Configs_For_Sqlite/class_Player_Configs_of_UI';
import { ref } from 'vue'

export class System_Configs_Read {
    public app_Configs = ref(
        new App_Configs({
            theme: null,
            router_name: '',
            app_left_menu_select_activeKey: '',
            app_left_menu_collapsed: null
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
        }))
    public player_Configs_of_Audio_Info = ref(
        new Player_Configs_of_Audio_Info({
            this_audio_file_path: '',
            this_audio_file_medium_image_url: '',
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
        
            this_audio_file_path_from_playlist: null,
            fetchData_This_AlbumOrArtist_PlayMedia_Model: null,
        }))
    public playlist_File_Configs = ref<Media_File[]>([])

    constructor() {
        const path = require('path');
        let db:any = null;

        db = require('better-sqlite3')(path.resolve('resources/nsmusics.db'));
        db.pragma('journal_mode = WAL');

        db.prepare(`SELECT * FROM system_app_config`).all().forEach((row: Config, index: number) => {
            const propertyName = row.config_key;
            if (this.app_Configs.value.hasOwnProperty(propertyName))
                this.app_Configs.value[propertyName] = row.config_value;// If this line of code ide displays an error, please ignore error
        });
        db.prepare(`SELECT * FROM system_player_config_of_audio`).all().forEach((row: Config, index: number) => {
            const propertyName = row.config_key;
            if (this.player_Configs_of_Audio_Info.value.hasOwnProperty(propertyName)) 
                this.player_Configs_of_Audio_Info.value[propertyName] = row.config_value;// If this line of code ide displays an error, please ignore error
        });
        db.prepare(`SELECT * FROM system_player_config_of_ui`).all().forEach((row: Config, index: number) => {
            const propertyName = row.config_key;
            if (this.player_Configs_of_UI.value.hasOwnProperty(propertyName))
                this.player_Configs_of_UI.value[propertyName] = row.config_value;// If this line of code ide displays an error, please ignore error
        });
        db.prepare(`SELECT * FROM system_playlist_file_config`).all().forEach((row: Media_File, index: number) => {
            row.absoluteIndex = index;
            row.selected = false;
            row.duration_txt = this.formatTime(row.duration);
            if (row.path.indexOf('mp3') > 0)
                row.medium_image_url = row.path.replace('mp3', 'jpg');
            else if (row.path.indexOf('flac') > 0)
                row.medium_image_url = row.path.replace('flac', 'jpg');
            else
                row.medium_image_url = '../../../resources/img/error_album.jpg';
            this.playlist_File_Configs.value.push(row);
        });

        db.close();
        db = null;
    }

    formatTime(currentTime: number): string {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
    
        let formattedMinutes = String(minutes);
        let formattedSeconds = String(seconds);
    
        if(formattedMinutes.length == 1)
          formattedMinutes = '0' + formattedMinutes;
        formattedMinutes = formattedMinutes.replace('.','');
        formattedMinutes = formattedMinutes.substring(0, 2);
    
        formattedSeconds = formattedSeconds.substring(0,formattedSeconds.indexOf('.'));
        if(formattedSeconds.length == 1)
          formattedSeconds = '0' + formattedSeconds;
        formattedSeconds = formattedSeconds.substring(0, 2);
    
        return `${formattedMinutes}:${formattedSeconds}`;
      }
}