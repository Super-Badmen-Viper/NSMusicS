import { reactive } from 'vue'
import { Audio_node_mpv } from "@/models/song_Audio_Out/Audio_node_mpv";
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