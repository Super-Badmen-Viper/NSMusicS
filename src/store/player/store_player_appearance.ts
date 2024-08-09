import { reactive } from 'vue'
import {Player_UI_Theme_State} from "@/features/player_configs/Player_UI_Theme_State";

export const store_player_appearance = reactive({
    player_show: false,
    player_show_complete: true,
    player_show_hight_animation_value: 100,
    player_collapsed_action_bar_of_Immersion_model: false,
    player_show_click: false,
    player_UI_Theme_State: new Player_UI_Theme_State(),
    player_use_lottie_animation: false,
});