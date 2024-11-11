import {store_player_audio_logic} from "@/store/player/store_player_audio_logic";
const { ipcRenderer } = require('electron');

export class Audio_node_mpv {
    public isPlaying: boolean;
    public isDuration: number | undefined;
    public isCurrentTime: number | undefined;
    constructor() {
        this.isPlaying = false;
    }
    async load(path: string) {
        try {
            await ipcRenderer.invoke('mpv-fade', store_player_audio_logic.player_fade_value)
            if(store_player_audio_logic.player_samp_value < 8000){
                store_player_audio_logic.player_samp_value = 48000
            }
            await ipcRenderer.invoke('mpv-parameters', {
                player_audio_channel: store_player_audio_logic.player_audio_channel,
                player_samp_value: store_player_audio_logic.player_samp_value,
                player_gaplessAudio: store_player_audio_logic.player_gaplessAudio,
                player_audioExclusiveMode: store_player_audio_logic.player_audioExclusiveMode,
                player_replayGainMode: store_player_audio_logic.player_replayGainMode,
                player_replayGainPreamp: store_player_audio_logic.player_replayGainPreamp,
                player_replayGainClip: store_player_audio_logic.player_replayGainClip,
                player_replayGainFallback: store_player_audio_logic.player_replayGainFallback,
                player_mpvExtraParameters: store_player_audio_logic.player_mpvExtraParameters,
            })
            await ipcRenderer.invoke('mpv-load', path)
            this.isPlaying = true;
            await ipcRenderer.invoke('i18n-tray-music-pause', true)
        }catch{}
    }
    async IsPlaying() {
        try {
            this.isPlaying = await ipcRenderer.invoke('mpv-isPlaying');
        }catch{}
    }
    async play() {
        try {
            await ipcRenderer.invoke('mpv-play')
            this.isPlaying = true;
            await ipcRenderer.invoke('i18n-tray-music-pause', true)
        }catch{
            this.isPlaying = false;
            await ipcRenderer.invoke('i18n-tray-music-pause', false)
        }
    }
    async pause() {
        try {
            await ipcRenderer.invoke('mpv-pause')
            this.isPlaying = false;
            await ipcRenderer.invoke('i18n-tray-music-pause', false)
        }catch{
            this.isPlaying = false;
        }
    }
    async getDuration(): Promise<number | undefined> {
        try {
            let temp = await ipcRenderer.invoke('mpv-get-duration')
            this.isDuration = temp >= 0 ? temp : 0
            return this.isDuration;
        }catch{
            return 0
        }
    }
    async getCurrentTime(): Promise<number> {
        try {
            let temp = await ipcRenderer.invoke('mpv-get-time-pos');
            this.isCurrentTime = temp >= 0 ? temp : this.isCurrentTime
            return this.isCurrentTime;
        }catch{
            return 0
        }
    }
    async setCurrentTime(time: number) {
        try{
            await ipcRenderer.invoke('mpv-set-time-pos',time)
        }catch {}
    }
    async setVolume(volume: number) {
        try{
            await ipcRenderer.invoke('mpv-set-volume',volume)
        }catch {}
    }
}