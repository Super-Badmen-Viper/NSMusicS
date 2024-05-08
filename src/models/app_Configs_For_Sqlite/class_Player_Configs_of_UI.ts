import { ref, type Ref } from "vue";

const defaultValues_player_Configs_of_UI: Record<string, any> = {
    player_collapsed_album: null,
    player_collapsed_skin: null,// disabled
    player_lyric_fontSize: '',
    player_lyric_fontWeight: '',
    player_lyric_color: '',
    player_theme_Styles_Selected: null,
    player_background_model_num: null,
};

export class Player_Configs_of_UI {
    [key: string]: Ref<any>;
    constructor() {
      Object.entries(defaultValues_player_Configs_of_UI).forEach(([propertyName, defaultValue]) => {
        this[propertyName] = ref(defaultValue);
      });
    }
}