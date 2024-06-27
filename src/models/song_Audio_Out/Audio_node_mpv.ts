const { ipcRenderer } = require('electron');

export class Audio_node_mpv {
    public isPlaying: boolean;
    public isResumeing: boolean;
    public isDuration: number | undefined;
    constructor() {
        this.isPlaying = false;
        this.isResumeing = false;
    }
    async load(path: string) {
        await ipcRenderer.invoke('mpv-load', path)
        this.isPlaying = true;
        this.isResumeing = true;
    }
    async IsResumeing() {
        this.isResumeing = await ipcRenderer.invoke('mpv-isResumeing');
    }
    async IsPlaying() {
        this.isPlaying = await ipcRenderer.invoke('mpv-isPlaying');
    }
    async play() {
        await ipcRenderer.invoke('mpv-play')
        this.isPlaying = true;
    }
    async pause() {
        await ipcRenderer.invoke('mpv-pause')
        this.isPlaying = false;
    }
    async getDuration(): Promise<number | undefined> {
        this.isDuration = await ipcRenderer.invoke('mpv-get-duration')
        return this.isDuration;
    }
    async getCurrentTime(): Promise<number> {
        return await ipcRenderer.invoke('mpv-get-time-pos');;
    }
    async setCurrentTime(time: number) {
        await ipcRenderer.invoke('mpv-set-time-pos',time)
    }
    async setVolume(volume: number) {
        await ipcRenderer.invoke('mpv-set-volume',volume)
    }
}