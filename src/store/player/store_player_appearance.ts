import {reactive, ref, watch} from 'vue'
import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";

export const store_player_appearance = reactive({
    player_show: false,
    player_show_complete: true,
    player_show_hight_animation_value: 100,

    player_collapsed_action_bar_of_Immersion_model: false,

    player_show_click: false,

    player_collapsed_album: false,
    player_collapsed_skin: true,

    player_lyric_fontSize: '24px',
    player_lyric_fontSize_Num: 24,

    player_lyric_fontWeight: '600',
    player_lyric_color: '#FAFAFB60',
    player_lyric_colorHover: '#FFFFFF',

    player_lyric_color_hidden_coefficient: 18,

    player_theme_Styles_Selected: 0,
    player_background_model_num: 0,

    player_use_lottie_animation: true,
    player_use_background_filter_blur: true,
    player_use_playbar_auto_hide: true,

    player_mode_of_medialist_from_external_import: false,

    player_mode_of_lock_playlist: false,
});
watch(() => store_player_appearance.player_collapsed_album, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_appearance.player_collapsed_skin, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_appearance.player_lyric_fontSize, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_appearance.player_lyric_fontSize_Num, (newValue) => {
    store_player_appearance.player_lyric_fontSize = newValue+'px'
});
watch(() => store_player_appearance.player_lyric_fontWeight, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_appearance.player_lyric_color, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_appearance.player_theme_Styles_Selected, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_appearance.player_background_model_num, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_appearance.player_use_lottie_animation, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_appearance.player_use_background_filter_blur, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_appearance.player_use_playbar_auto_hide, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});