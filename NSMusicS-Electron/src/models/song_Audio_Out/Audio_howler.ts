const { ipcRenderer } = require('electron');

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
                this.isPlaying = true;
                await ipcRenderer.invoke('i18n-tray-music-pause', true)
            }
        }catch{
            await ipcRenderer.invoke('i18n-tray-music-pause', false)
        }
    }
    async pause() {
        try {
            if (this.howl) {
                this.howl.pause();
                this.isPlaying = false;
            }
        }catch{

        }finally {
            await ipcRenderer.invoke('i18n-tray-music-pause', false)
        }
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
}