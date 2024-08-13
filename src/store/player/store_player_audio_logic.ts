import {reactive, watch} from 'vue'
import { Audio_node_mpv } from "@/models/song_Audio_Out/Audio_node_mpv";
import {store_player_appearance} from "@/store/player/store_player_appearance";
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
// player: new Audio_howler();

export const store_player_audio_logic = reactive({
    player: new Audio_node_mpv(),
    play_order: 'playback-2',

    player_silder_currentTime_added_value: 0,
    player_go_lyricline_index_of_audio_play_progress: 0,

    player_use_lottie_animation: false,
    player_save_new_data: false,
    this_audio_initial_trigger: false,
});

watch(() => store_player_audio_logic.player_use_lottie_animation, (newValue) => {
    store_player_audio_logic.player_use_lottie_animation = newValue
    store_player_appearance.player_UI_Theme_State.player_use_lottie_animation = newValue
    console.log('实验性lottie动画状态：'+newValue)
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_audio_logic.player_save_new_data, (newValue) => {
    if(newValue)
        store_app_configs_logic_save.save_system_config_of_Player_Configs_of_Audio_Info()
});
watch(() => store_player_audio_logic.player_silder_currentTime_added_value, (newValue) => {
    store_player_audio_logic.player_silder_currentTime_added_value = newValue
    console.log('player_silder_currentTime_added_value：'+newValue)
});
watch(() => store_player_audio_logic.player_go_lyricline_index_of_audio_play_progress, (newValue) => {
    store_player_audio_logic.player_go_lyricline_index_of_audio_play_progress = newValue
    console.log('get_play_go_index_time：'+newValue)
});