import { usePlayerSettingStore } from '@/data/data_status/comment_status/player_store/usePlayerSettingStore'
import { usePlayerAudioStore } from '@/data/data_status/comment_status/player_store/usePlayerAudioStore'
import { ipcRenderer, isElectron } from '@/utils/electron/isElectron'
import { store_server_user_model } from '@/server/server_management/store_server_user_model'
import { store_server_users } from '@/server/server_management/store_server_users'

export class Audio_howler {
  public howl: any
  public isPlaying: boolean
  public isDuration: number | undefined
  private playerSettingStore: any
  constructor() {
    this.howl = null
    this.isPlaying = false
    this.playerSettingStore = usePlayerSettingStore()
  }
  IsPlaying() {
    try {
      this.isPlaying = this.howl.playing
    } catch {
      this.isPlaying = false
    }
  }
  async play() {
    try {
      if (this.howl) {
        this.howl.play()
      }
    } catch {}

    try {
      if (isElectron) {
        await ipcRenderer.invoke('i18n-tray-music-pause', true)
      }
    } catch {}
  }
  async pause() {
    try {
      if (this.howl) {
        this.howl.pause()
        this.isPlaying = false
      }
    } catch {}

    try {
      if (isElectron) {
        await ipcRenderer.invoke('i18n-tray-music-pause', false)
      }
    } catch {}
  }
  getDuration() {
    // // 检查是否满足特定条件：server_type_of_web为true，server_select_kind为'ninesong'，player_select为'web'，且音频格式不是mp3/flac/wav/aac
    // const supportedFormats = ['mp3', 'flac', 'wav', 'aac'];
    // const playerAudioStore = usePlayerAudioStore();
    // if (store_server_user_model.model_server_type_of_web &&
    //     store_server_users.server_select_kind === 'ninesong' &&
    //     this.playerSettingStore.player_select === 'web' &&
    //     !supportedFormats.includes(playerAudioStore.this_audio_song_suffix)) {
    //   // 在这些条件下，返回player_duration属性
    //   return this.playerSettingStore.player_duration
    // }
    
    if (this.howl) {
      this.isDuration = this.howl.duration()
      return this.isDuration
    }
    return 0
  }
  getCurrentTime() {
    if (this.howl) {
      return this.howl.seek()
    }
    return 0
  }
  setCurrentTime(time: number) {
    if (this.howl) {
      this.howl.seek(time)
      this.howl.play()
    }
  }
  setVolume(volume: number) {
    if (this.howl) {
      this.howl.volume(volume / 100)
    }
  }
  setFade(from: any, to: any, duration: any) {
    if (this.howl) {
      this.howl.fadein(from)
      this.howl.fadeout(to)
    }
  }

  async getDevices() {
    try {
      const getAudioDevice = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices()
        return (devices || []).filter((dev: MediaDeviceInfo) => dev.kind === 'audiooutput')
      }
      const getAudioDevices = async () => {
        await getAudioDevice()
          .then((dev) => {
            this.playerSettingStore.player_device_kind = dev.map((d) => ({
              label: d.label,
              value: d.deviceId,
            }))
          })
          .catch((error) => {
            console.error('Error fetching audio devices:', error)
          })
      }
      await getAudioDevices()
    } catch (error) {
      console.error(error)
    }
  }
}
