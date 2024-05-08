import { App_Configs } from '@/models/app_Configs_For_Sqlite/class_App_Configs';
import { Player_Configs_of_Audio_Info } from '@/models/app_Configs_For_Sqlite/class_Player_Configs_of_Audio_Info';
import { Player_Configs_of_UI } from '@/models/app_Configs_For_Sqlite/class_Player_Configs_of_UI';
import { ref, type Ref } from 'vue'

export class System_Configs {
    public app_Configs = ref(new App_Configs())
    public player_Configs_of_UI = ref(new Player_Configs_of_UI())
    public player_Configs_of_Audio_Info = ref(new Player_Configs_of_Audio_Info())
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