import {reactive, watch} from 'vue'
import {store_app_configs_logic_save} from "@/store/app/store_app_configs_logic_save";
import {Audio_node_mpv} from "@/models/song_Audio_Out/Audio_node_mpv";
import {Audio_howler} from "@/models/song_Audio_Out/Audio_howler";
import {store_player_audio_info} from "@/store/player/store_player_audio_info";
const { ipcRenderer } = require('electron');

export const store_player_audio_logic = reactive({
    player: new Audio_node_mpv(),
    player_kind: [
        { label: 'mpv', value: 'mpv' },
        { label: 'web', value: 'web' },
    ],
    player_select: 'mpv',
    play_order: 'playback-2',
    play_volume: 100,
    player_fade_value: 2000,
    player_dolby: false,
    player_audio_channel: '',
    player_samp_value: 48000,
    player_gaplessAudio: 'weak',
    player_audioExclusiveMode: false,
    player_replayGainMode: 'no',
    player_replayGainPreamp: 0,
    player_replayGainClip: false,
    player_replayGainFallback: 0,
    player_mpvExtraParameters: '',

    total_play_time: '04:42',
    current_play_time: '01:36',
    slider_singleValue: 0,
    player_no_progress_jump: true,

    player_silder_currentTime_added_value: 0,
    player_go_lyricline_index_of_audio_play_progress: 0,

    player_save_new_data: false,
    this_audio_initial_trigger: false,

    drawer_order_show: false,
    drawer_volume_show: false,
});
watch(() => store_player_audio_logic.player_select, async (newValue) => {
    await store_player_audio_info.reset_data();

    if (store_player_audio_logic.player_select === 'mpv') {
        if (store_player_audio_logic.player.howl != null) {
            store_player_audio_logic.player.howl.unload();
        }
        await ipcRenderer.invoke('mpv-init');
        store_player_audio_logic.player = null;
        store_player_audio_logic.player = new Audio_node_mpv();
    } else if (store_player_audio_logic.player_select === 'web') {
        store_player_audio_logic.player = null;
        store_player_audio_logic.player = new Audio_howler();
        await ipcRenderer.invoke('mpv-quit');
    }

    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_fade_value,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_dolby,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_audio_channel,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_samp_value,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_gaplessAudio,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_audioExclusiveMode,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_replayGainMode,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_replayGainPreamp,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_replayGainClip,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_replayGainFallback,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_mpvExtraParameters,  (newValue) => {
    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.play_order, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_audio_logic.play_volume, async (newValue) => {
    await store_player_audio_logic.player.setVolume(Number(store_player_audio_logic.play_volume))
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
});
watch(() => store_player_audio_logic.player_save_new_data, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_Audio_Info()
    store_player_audio_logic.player_save_new_data = false
});
watch(() => store_player_audio_logic.player_silder_currentTime_added_value, (newValue) => {
    store_player_audio_logic.player_silder_currentTime_added_value = newValue
    console.log('player_silder_currentTime_added_value：'+newValue)
});
watch(() => store_player_audio_logic.player_go_lyricline_index_of_audio_play_progress, (newValue) => {
    store_player_audio_logic.player_go_lyricline_index_of_audio_play_progress = newValue
    console.log('get_play_go_index_time：'+newValue)
});