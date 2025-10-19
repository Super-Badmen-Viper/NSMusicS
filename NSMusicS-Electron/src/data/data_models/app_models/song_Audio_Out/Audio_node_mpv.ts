import { usePlayerSettingStore } from '@/data/data_status/app_status/comment_status/player_store/usePlayerSettingStore'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'

export class Audio_node_mpv {
  public isPlaying: boolean
  public isDuration: number | undefined
  public isCurrentTime: number | undefined
  private playerSettingStore: any
  constructor() {
    this.isPlaying = false
    this.playerSettingStore = usePlayerSettingStore()
  }
  async load(path: string) {
    try {
      if (isElectron && ipcRenderer) {
        await ipcRenderer.invoke('mpv-fade', this.playerSettingStore.player_fade_value)
        if (this.playerSettingStore.player_samp_value < 8000) {
          this.playerSettingStore.player_samp_value = 48000
        }
        await ipcRenderer.invoke('mpv-parameters', {
          player_audio_channel: this.playerSettingStore.player_audio_channel,
          player_samp_value: this.playerSettingStore.player_samp_value,
          player_gaplessAudio: this.playerSettingStore.player_gaplessAudio,
          player_audioExclusiveMode: this.playerSettingStore.player_audioExclusiveMode,
          player_replayGainMode: this.playerSettingStore.player_replayGainMode,
          player_replayGainPreamp: this.playerSettingStore.player_replayGainPreamp,
          player_replayGainClip: this.playerSettingStore.player_replayGainClip,
          player_replayGainFallback: this.playerSettingStore.player_replayGainFallback,
          player_mpvExtraParameters: this.playerSettingStore.player_mpvExtraParameters,
        })
        await ipcRenderer.invoke('mpv-load', path)
      } else {
        // other
      }
      this.isPlaying = true
    } catch {
      // 重新加载node-mpv，这玩意挺不稳重的
      await this.playerSettingStore.init_player()
    }

    try {
      if (isElectron && ipcRenderer) {
        await ipcRenderer.invoke('i18n-tray-music-pause', true)
      }
    } catch {}
  }
  async IsPlaying() {
    try {
      if (isElectron && ipcRenderer) {
        this.isPlaying = await ipcRenderer.invoke('mpv-isPlaying')
      }
    } catch {}
  }
  async play() {
    try {
      if (isElectron && ipcRenderer) {
        await ipcRenderer.invoke('mpv-play')
      }
      this.isPlaying = true
    } catch {
      this.isPlaying = false
    }

    try {
      if (isElectron && ipcRenderer) {
        await ipcRenderer.invoke('i18n-tray-music-pause', true)
      }
    } catch {}
  }
  async pause() {
    try {
      if (isElectron && ipcRenderer) {
        await ipcRenderer.invoke('mpv-pause')
      }
      this.isPlaying = false
    } catch {
      this.isPlaying = false
    }

    try {
      if (isElectron && ipcRenderer) {
        await ipcRenderer.invoke('i18n-tray-music-pause', false)
      }
    } catch {}
  }
  async getDuration(): Promise<number | undefined> {
    try {
      if (isElectron && ipcRenderer) {
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
  async getCurrentTime(): Promise<number | undefined> {
    try {
      if (isElectron && ipcRenderer) {
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
      if (isElectron && ipcRenderer) {
        await ipcRenderer.invoke('mpv-set-time-pos', time)
      }
    } catch {}
  }
  async setVolume(volume: number) {
    try {
      if (isElectron && ipcRenderer) {
        await ipcRenderer.invoke('mpv-set-volume', volume)
      }
    } catch {}
  }
}