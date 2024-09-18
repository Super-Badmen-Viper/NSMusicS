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
        try {
            await ipcRenderer.invoke('mpv-load', path)
            this.isPlaying = true;
            this.isResumeing = true;
        }catch{}
    }
    async IsResumeing() {
        try {
            this.isResumeing = await ipcRenderer.invoke('mpv-isResumeing');
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
        }catch{
            this.isPlaying = false;
        }
    }
    async pause() {
        try {
            await ipcRenderer.invoke('mpv-pause')
            this.isPlaying = false;
        }catch{
            this.isPlaying = false;
        }
    }
    async getDuration(): Promise<number | undefined> {
        try {
            this.isDuration = await ipcRenderer.invoke('mpv-get-duration')
            return this.isDuration;
        }catch{
            return 0
        }
    }
    async getCurrentTime(): Promise<number> {
        try {
            return await ipcRenderer.invoke('mpv-get-time-pos');
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