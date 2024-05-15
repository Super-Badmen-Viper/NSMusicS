import { ref } from "vue";

export class Player_UI_Theme_State {
  player_collapsed_album = ref(false);
  get_player_collapsed_album(value: any) {
    this.player_collapsed_album.value = value;
  }
  player_collapsed_skin = ref(true);// disabled
  get_player_collapsed_skin(value: any) {
    this.player_collapsed_skin.value = value;
  }

  player_lyric_fontSize = ref('22px');
  get_player_lyric_fontSize(value: any) {
    this.player_lyric_fontSize.value = value;
  }
  player_lyric_fontWeight = ref('800');
  get_player_lyric_fontWeight(value: any) {
    this.player_lyric_fontWeight.value = value;
  }
  player_lyric_color = ref('#FAFAFB60');
  get_player_lyric_color(value: any) {
    this.player_lyric_color.value = value;
  }

  ////// config info
  player_theme_Styles_Selected = ref<number>(0);
  get_player_theme_Styles_Selected(value: any) {
    this.player_theme_Styles_Selected.value = value;
  }
  player_background_model_num = ref(0);
  get_player_background_model_num(value: any) {
    this.player_background_model_num.value = value;
  }
}