import { ref } from "vue";

export class Player_UI_Theme_State {
  player_collapsed_album = ref(false);
  player_collapsed_skin = ref(true);// disabled

  player_lyric_fontSize = ref('22px');
  player_lyric_fontWeight = ref('800');
  player_lyric_color = ref('#FAFAFB60');

  ////// config info
  player_theme_Styles_Selected = ref<number>(0);
  player_background_model_num = ref(0);
}