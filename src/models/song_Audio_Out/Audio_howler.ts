const { Howler } = require('howler');

export class Audio_howler {
    public howl: any;
    public isPlaying: boolean;
    constructor() {
        this.howl = null;
        this.isPlaying = false;
    }
    unload() {
        if (this.howl) {
            this.howl.unload();
        }
    } 
    play() {
        if (this.howl) {
            this.howl.play();
            this.isPlaying = true;
        }
    }
    pause() {
        if (this.howl) {
            this.howl.pause();
            this.isPlaying = false;
        }
    }
    stop() {
        if (this.howl) {
            this.howl.stop();
            this.isPlaying = false;
        }
    }
    getDuration(): number {
        if (this.howl) {
            return this.howl.duration();
        }
        return 0;
    }
    getCurrentTime(): number {
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
            this.howl.volume(volume);
        }
    }
    get_fade(from: any, to: any, duration: any){
        if (this.howl) {
            this.howl.fadein(from);
            this.howl.fadeout(to)
        }
    }
    set_fade(from: any, to: any, duration: any){
        if (this.howl) {
            // this.howl.volume(volume);
        }
    }
    mute() {
        Howler.mute(true);
    }
    unmute() {
        Howler.mute(false);
    }
}