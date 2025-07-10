import { store_player_audio_logic } from '@/views/view_app/music_page/page_player/store/store_player_audio_logic'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'

export class Audio_node_mpv {
  public isPlaying: boolean
  public isDuration: number | undefined
  public isCurrentTime: number | undefined
  constructor() {
    this.isPlaying = false
  }
  async load(path: string) {
    try {
      if (isElectron) {
        await ipcRenderer.invoke('mpv-fade', store_player_audio_logic.player_fade_value)
        if (store_player_audio_logic.player_samp_value < 8000) {
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
      } else {
        // other
      }
      this.isPlaying = true
    } catch {
      // 重新加载node-mpv，这玩意挺不稳重的
      await store_player_audio_logic.init_player()
    }

    try {
      if (isElectron) {
        await ipcRenderer.invoke('i18n-tray-music-pause', true)
      }
    } catch {}
  }
  async IsPlaying() {
    try {
      if (isElectron) {
        this.isPlaying = await ipcRenderer.invoke('mpv-isPlaying')
      }
    } catch {}
  }
  async play() {
    try {
      if (isElectron) {
        await ipcRenderer.invoke('mpv-play')
      }
      this.isPlaying = true
    } catch {
      this.isPlaying = false
    }

    try {
      if (isElectron) {
        await ipcRenderer.invoke('i18n-tray-music-pause', true)
      }
    } catch {}
  }
  async pause() {
    try {
      if (isElectron) {
        await ipcRenderer.invoke('mpv-pause')
      }
      this.isPlaying = false
    } catch {
      this.isPlaying = false
    }

    try {
      if (isElectron) {
        await ipcRenderer.invoke('i18n-tray-music-pause', false)
      }
    } catch {}
  }
  async getDuration(): Promise<number | undefined> {
    try {
      if (isElectron) {
        const temp = await ipcRenderer.invoke('mpv-get-duration')
        this.isDuration = temp >= 0 ? temp : 0
      } else {
        // other
      }
      return this.isDuration
    } catch {
      return this.isDuration
    }
  }
  async getCurrentTime(): Promise<number> {
    try {
      if (isElectron) {
        const temp = await ipcRenderer.invoke('mpv-get-time-pos')
        this.isCurrentTime = temp >= 0 ? temp : this.isCurrentTime
      } else {
        // other
      }
      return this.isCurrentTime
    } catch {
      return this.isCurrentTime
    }
  }
  async setCurrentTime(time: number) {
    try {
      if (isElectron) {
        await ipcRenderer.invoke('mpv-set-time-pos', time)
      }
    } catch {}
  }
  async setVolume(volume: number) {
    try {
      if (isElectron) {
        await ipcRenderer.invoke('mpv-set-volume', volume)
      }
    } catch {}
  }
}
