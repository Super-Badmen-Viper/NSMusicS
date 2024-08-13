import {reactive, watch} from 'vue'
import { Player_UI_Theme_State } from "@/features/player_configs/Player_UI_Theme_State";
import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";

export const store_player_appearance = reactive({
    player_show: false,
    player_show_complete: true,
    player_show_hight_animation_value: 100,
    player_collapsed_action_bar_of_Immersion_model: false,
    player_show_click: false,
    player_UI_Theme_State: new Player_UI_Theme_State(),
    player_use_lottie_animation: false,

    player_mode_of_medialist_from_external_import: false,
    player_mode_of_lock_playlist: false,
});
watch(() => store_player_appearance.player_UI_Theme_State, (newValue) => {
    store_player_audio_logic.player_use_lottie_animation = store_player_appearance.player_UI_Theme_State.player_use_lottie_animation
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});