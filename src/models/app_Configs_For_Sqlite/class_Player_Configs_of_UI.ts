import { ref, type Ref } from "vue";

interface Player_Configs_of_UI_Props {
  player_collapsed_album: any,
  player_collapsed_skin: any,// disabled
  player_lyric_fontSize: string,
  player_lyric_fontWeight: string,
  player_lyric_color: string,
  player_theme_Styles_Selected: any,
  player_background_model_num: any,
};

export class Player_Configs_of_UI {
  [key: string]: Ref<any>;
  constructor(props: Player_Configs_of_UI_Props) {
    const defaultValues: Record<string, any> = props;
    Object.entries(defaultValues).forEach(([propertyName, defaultValue]) => {
      this[propertyName] = ref(defaultValue);
    });
  }
}