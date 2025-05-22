import {reactive, watch} from 'vue'
import {store_app_configs_logic_save} from "@/data/data_stores/app/store_app_configs_logic_save";
import {Audio_node_mpv} from "@/data/data_models/app_models/song_Audio_Out/Audio_node_mpv";
import {Audio_howler} from "@/data/data_models/app_models/song_Audio_Out/Audio_howler";
import {store_player_audio_info} from "./store_player_audio_info";
import {store_player_view} from "./store_player_view";
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';
import {store_player_tag_modify} from "./store_player_tag_modify";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import error_album from '@/assets/img/error_album.jpg'
import {
    Audio_ApiService_of_Je
} from "@/data/data_access/servers_configs/jellyfin_api/services_web/Audio/index_service";
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {
    Retrieval_ApiService_of_NineSong
} from "@/data/data_access/servers_configs/ninesong_api/services_web/Scene/Music/Retrieval/index_service";
import {
    store_server_login_info
} from "@/views/view_server/page_metadata/page_login/store/store_server_login_info";
import {Howl} from "../../../../../../../../utils/howler/howlerLoader";

export const store_player_audio_logic = reactive({
    player: new Audio_howler(),
    player_state_play_click: false,
    player_state_skip_back_click: false,
    player_state_skip_forward_click: false,

    player_init_play: false,

    player_kind: [
        { label: 'mpv', value: 'mpv' },
        { label: 'web', value: 'web' },
    ],
    player_select: 'web',

    player_device_kind: [],
    player_device_select: 'default',

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

    player_is_play_ended: false,
    player_range_duration_isDragging: false,

    player_click_state_of_order: false,
    player_click_state_of_play_skip_back: false,
    player_click_state_of_play: false,
    player_click_state_of_play_skip_forward: false,

    total_play_time: '04:42',
    current_play_time: '01:36',
    slider_init_singleValue: 0,
    slider_singleValue: 0,
    player_no_progress_jump: true,

    player_back_ChevronDouble: '',
    
    player_slider_click: false,
    player_slider_currentTime_added_value: 0,
    player_go_lyric_line_index_of_audio_play_progress: 0,

    player_save_new_data: false,
    this_audio_initial_trigger: false,

    drawer_order_show: false,
    drawer_volume_show: false,
    drawer_theme_show: false,

    orderToolShow: true,
    voiceToolShow: true,
    langWidths: {
        zhHans: '122', zhHant: '122', en: '202',
        cs: '211',es: '233', de: '228',
        fr: '202', it: '240',
        ja: '166', nl: '206',
        fa: '169', ptBr: '224',
        pl: '252', ru: '330',
        sr: '232', sv: '242',
    },
    orderPanelWidath: '202',
    orderButonWidath: '202',

    boolHandleItemClick_Favorite: false,
    boolHandleItemClick_Played: false,

    async init_player(){
        if (store_player_audio_logic.player_select === 'mpv') {
            if(isElectron) {
                await ipcRenderer.invoke('mpv-quit');
                await ipcRenderer.invoke('mpv-init');
                store_player_audio_logic.player = new Audio_node_mpv();
            } else {
                // TODO: 添加非 Electron 环境下的处理逻辑
                console.log("Non-Electron environment logic not implemented yet.");
            }
        } else {
            // 采用web输出，更加稳定
            if (store_player_audio_logic.player && store_player_audio_logic.player.howl) {
                store_player_audio_logic.player.howl.unload();
            }
            store_player_audio_logic.player = new Audio_howler();
        }
    },
    formatTime(currentTime: number): string {
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);

        let formattedMinutes = String(minutes);
        let formattedSeconds = String(seconds);

        if (formattedMinutes.length == 1)
            formattedMinutes = '0' + formattedMinutes;

        if (formattedSeconds.length == 1)
            formattedSeconds = '0' + formattedSeconds;

        return `${formattedMinutes}:${formattedSeconds}`;
    },
    formatTime_RunTimeTicks(timestamp: number): string {
        const milliseconds = Math.floor(timestamp / 10000);
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    },
    async play_go_duration(slider_value: number, silder_path: boolean) {
        store_player_audio_logic.player_slider_click = true;
        store_player_audio_logic.player_no_progress_jump = false;
        store_player_audio_logic.player_slider_currentTime_added_value = 0;
        store_player_view.currentScrollIndex = 0;
        if (store_player_audio_logic.player.isPlaying) {
            // 注意，此时currentTime将从0开始，需要计算附加值
            if (silder_path) {
                let newTime = (Number(slider_value) / 100) * await store_player_audio_logic.player.getDuration();
                if (Number(slider_value) !== 0 && Number(slider_value) !== 100) {
                    store_player_audio_logic.player.setCurrentTime(newTime);
                } else {
                    store_player_audio_logic.player.setCurrentTime(0);
                }
            } else {
                let newTime = Number(slider_value) / 1000;
                if (Number(slider_value) !== 0 && Number(slider_value) !== 100) {
                    store_player_audio_logic.player.setCurrentTime(newTime);
                } else {
                    store_player_audio_logic.player.setCurrentTime(0);
                }
            }
        }
    },
    async update_current_media_info(media_file:any,index:number){
        if(store_server_user_model.model_server_type_of_web){
            if(store_server_users.server_select_kind === 'ninesong'){
                const retrieval = new Retrieval_ApiService_of_NineSong(
                    store_server_login_info.server_url
                )
                const lyrics = await retrieval.getLyrics_id(media_file.id);
                await store_player_audio_info.set_lyric(
                    lyrics
                )
            }else if(store_server_users.server_select_kind === 'jellyfin' || store_server_users.server_select_kind === 'emby') {
                try {
                    const audio_ApiService_of_Je = new Audio_ApiService_of_Je(
                        store_server_users.server_config_of_current_user_of_sqlite?.url
                    )
                    let lyrics = [];
                    try {
                        if (store_server_users.server_select_kind === 'jellyfin') {
                            const getAudio_lyrics_id_of_Je = await audio_ApiService_of_Je.getAudio_lyrics_id_of_Je(media_file.id);
                            lyrics = getAudio_lyrics_id_of_Je?.Lyrics ? this.convertToLRC_Array_of_Je(getAudio_lyrics_id_of_Je.Lyrics) : "";
                        } else if (store_server_users.server_select_kind === 'emby') {
                            const getAudio_lyrics_id_of_Em = await audio_ApiService_of_Je.getAudio_lyrics_id_of_Em(media_file.id);
                            lyrics = getAudio_lyrics_id_of_Em?.Lyrics || "";
                        }
                    } catch (error) {
                        console.error("Failed to fetch lyrics:", error);
                        lyrics = "";
                    }
                    await store_player_audio_info.set_lyric(
                        lyrics.length > 0 ? lyrics : ""
                    )
                }
                catch{
                    await store_player_audio_info.set_lyric(
                        media_file.lyrics
                    )
                }
            }else if(store_server_users.server_select_kind === 'navidrome'){
                await store_player_audio_info.set_lyric(
                    media_file.lyrics
                )
            }
        }else if(store_server_user_model.model_server_type_of_local){
            await store_player_audio_info.set_lyric(
                media_file.lyrics
            )
        }
        //
        store_player_audio_info.this_audio_play_id = media_file.play_id ?? ''
        store_player_audio_info.this_audio_file_path = media_file.path ?? ''
        store_player_audio_info.this_audio_file_medium_image_url = media_file.medium_image_url ?? error_album
        store_player_audio_info.this_audio_artist_name = media_file.artist ?? ''
        store_player_audio_info.this_audio_artist_id = media_file.artist_id ?? ''
        store_player_audio_info.this_audio_song_name = media_file.title ?? ''
        store_player_audio_info.this_audio_song_id = media_file.id ?? ''
        store_player_audio_info.this_audio_song_rating = media_file.rating ?? 0
        store_player_audio_info.this_audio_song_favorite = media_file.favorite ?? false
        store_player_audio_info.this_audio_album_id = media_file.album_id ?? ''
        store_player_audio_info.this_audio_album_name = media_file.album ?? ''
        store_player_audio_info.this_audio_Index_of_play_list = index
        //
        store_player_tag_modify.player_current_media_starred = media_file.favorite ?? false
        store_player_tag_modify.player_current_media_playCount = media_file.play_count ?? 0
        store_player_tag_modify.player_current_media_playDate = media_file.play_date ?? ''
    },
    convertToLRC_Array_of_Je(lyrics: {
        Text: string;
        Start: number;
    }[]): string {
        const SCALE_FACTOR = 0.0000001;
        const lrcLines = lyrics
            .map((item) => {
                const totalSeconds = item.Start * SCALE_FACTOR;
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = Math.floor(totalSeconds % 60);
                const centiseconds = Math.floor((totalSeconds * 100) % 100);
                const time = `[${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}]`;
                return `${time}${item.Text}`;
            })
            .join('\n');
        return `${lrcLines}`;
    },
});
watch(() => store_player_audio_logic.player_select, async (newValue) => {
    await store_player_audio_info.reset_data();
    if(isElectron) {
        if (store_player_audio_logic.player_select === 'mpv') {
            // init
            if (store_player_audio_logic.player.howl != null) {
                store_player_audio_logic.player.howl.unload();
            }
            await ipcRenderer.invoke('mpv-init');
            store_player_audio_logic.player = null;
            store_player_audio_logic.player = new Audio_node_mpv();
            // load device
            store_player_audio_logic.player_device_kind = []
        } else if (store_player_audio_logic.player_select === 'web') {
            // init
            store_player_audio_logic.player = null;
            store_player_audio_logic.player = new Audio_howler();
            //
            await ipcRenderer.invoke('mpv-quit');
            // load device
            store_player_audio_logic.player_device_kind = []
            await store_player_audio_logic.player.getDevices()
        }
    } else {
        // other
    }

    store_app_configs_logic_save.save_system_config_of_App_Configs()
});
watch(() => store_player_audio_logic.player_device_select, (newValue) => {
    if (store_player_audio_logic.player_select === 'web') {
        if (store_player_audio_logic.player_device_select != undefined &&
            store_player_audio_logic.player_device_select.length > 0
        ) {
            if (store_player_audio_logic.player.howl != null) {
                const audioElement = store_player_audio_logic.player.howl._sounds[0]._node;
                if (typeof audioElement.setSinkId === 'function') {
                    audioElement
                        .setSinkId(store_player_audio_logic.player_device_select)
                        .then( async () => {
                            await store_player_audio_logic.player.getDevices()
                            console.log('Audio output successfully redirected.');
                        })
                        .catch((error) => {
                            console.error('Failed to redirect audio output:', error);
                            store_player_audio_logic.player_device_select = 'default'
                        });
                }
            }
        }
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
    if(newValue && newValue.length > 0) {
        store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
    }
});
watch(() => store_player_audio_logic.play_volume, async (newValue) => {
    if(newValue && newValue >= 0) {
        await store_player_audio_logic.player.setVolume(Number(store_player_audio_logic.play_volume))
        store_app_configs_logic_save.save_system_config_of_Player_Configs_of_UI()
    }
});
watch(() => store_player_audio_logic.player_save_new_data, (newValue) => {
    store_app_configs_logic_save.save_system_config_of_Player_Configs_of_Audio_Info()
    store_player_audio_logic.player_save_new_data = false
});
watch(() => store_player_audio_logic.player_slider_currentTime_added_value, (newValue) => {
    store_player_audio_logic.player_slider_currentTime_added_value = newValue
    console.log('player_slider_currentTime_added_value：'+newValue)
});
watch(() => store_player_audio_logic.player_go_lyric_line_index_of_audio_play_progress, (newValue) => {
    store_player_audio_logic.player_go_lyric_line_index_of_audio_play_progress = newValue
    console.log('get_play_go_index_time：'+newValue)
});
watch(() => store_player_audio_logic.drawer_order_show, (newValue) => {
    store_player_audio_logic.orderToolShow = !store_player_audio_logic.drawer_order_show;
});
watch(() => store_player_audio_logic.drawer_volume_show, (newValue) => {
    store_player_audio_logic.voiceToolShow = !store_player_audio_logic.drawer_volume_show;
});