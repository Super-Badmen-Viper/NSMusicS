import {store_player_audio_logic} from "../../../../views/view_app/page_metadata/page_folder/page_music/music_page/page_player/store/store_player_audio_logic";
import {ipcRenderer, isElectron} from '@/utils/electron/isElectron';

export class Audio_howler {
    public howl: any;
    public isPlaying: boolean;
    public isDuration: number | undefined;
    constructor() {
        this.howl = null;
        this.isPlaying = false;
    }
    IsPlaying() {
        try{
            this.isPlaying = this.howl.playing
        }catch{
            this.isPlaying = false
        }
    }
    async play() {
        try {
            if (this.howl) {
                this.howl.play();
            }
        }catch{  }

        try {
            if(isElectron) {
                await ipcRenderer.invoke('i18n-tray-music-pause', true)
            }
        }catch{  }
    }
    async pause() {
        try {
            if (this.howl) {
                this.howl.pause();
                this.isPlaying = false;
            }
        }catch{

        }

        try {
            if(isElectron) {
                await ipcRenderer.invoke('i18n-tray-music-pause', false)
            }
        }catch{  }
    }
    getDuration() {
        if (this.howl) {
            this.isDuration = this.howl.duration();
            return this.isDuration;
        }
        return 0;
    }
    getCurrentTime() {
        if (this.howl) {
            return this.howl.seek();
        }
        return 0;
    }
    setCurrentTime(time: number) {
        if (this.howl) {
            this.howl.seek(time);
        }
    }
    setVolume(volume: number) {
        if (this.howl) {
            this.howl.volume(volume / 100);
        }
    }
    setFade(from: any, to: any, duration: any){
        if (this.howl) {
            this.howl.fadein(from);
            this.howl.fadeout(to)
        }
    }

    async getDevices(){
        try {
            const getAudioDevice = async () => {
                const devices = await navigator.mediaDevices.enumerateDevices();
                return (devices || []).filter((dev: MediaDeviceInfo) => dev.kind === 'audiooutput');
            };
            const getAudioDevices = async () => {
                await getAudioDevice()
                    .then((dev) => {
                        store_player_audio_logic.player_device_kind = dev.map((d) => ({
                            label: d.label,
                            value: d.deviceId
                        }));
                    })
                    .catch((error) => {
                        console.error('Error fetching audio devices:', error);
                    });
            };
            await getAudioDevices();
        }catch (error) {console.error(error);}
    }
}