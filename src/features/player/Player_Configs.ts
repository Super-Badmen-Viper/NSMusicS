import { Player_Configs_of_UI } from '@/models/app_Configs_For_Sqlite/class_Player_Configs_of_UI';
import { ref, type Ref } from 'vue'

export class Player_Configs {
    public player_Configs_of_UI = ref(new Player_Configs_of_UI())

    constructor() {
        const path = require('path');
        let db:any = null;

        db = require('better-sqlite3')(path.resolve('resources/nsmusics.db'));
        db.pragma('journal_mode = WAL');

        db.prepare(`SELECT * FROM system_player_config_of_ui`).all().forEach((row: Config, index: number) => {
            const propertyName = row.config_key;
            if (this.player_Configs_of_UI.value.hasOwnProperty(propertyName))
                this.player_Configs_of_UI.value[propertyName] = row.config_value;
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