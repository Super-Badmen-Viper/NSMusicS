export class Audio_Players {
    // 声明一个私有的 AudioContext，用于音频处理
    public audioContext: AudioContext;
    // 音频缓冲区，存储解码后的音频数据 // buffer：未解码
    public audioBuffer: AudioBuffer | null = null;
    // BufferSourceNode 用于播放音频
    public bufferSourceNode: AudioBufferSourceNode | null = null;
    // GainNode 用于控制音量
    public volumeGainNode: GainNode | null = null;
    // GainNode 用于控制淡入淡出效果
    public fadeGainNode: GainNode | null = null;
    // GainNode 用于控制进度条
    public progressBarNode: GainNode | null = null;
    // 默认音量为 100
    public volume: number = 100;
    // 淡入时间
    public fadein: number = 0;
    // 淡出时间
    public fadeout: number = 0;
    // 开始播放时间
    public startTime: number = 0;
    // 音频总时长
    public audioDuration: number = 0;
    // 是否正在播放
    public isPlaying: boolean = false;
    // 频率数组，用于初始化均衡器
    public frequencies: number[] = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

    //
    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        this.progressBarNode = this.audioContext.createGain();
        this.fadeGainNode?.connect(this.progressBarNode);
        this.progressBarNode?.connect(this.audioContext.destination);
    }
    public async loadAudio(buffer:any,audioBuffer_clear:boolean): Promise<void> {
        if (this.bufferSourceNode) {
            this.bufferSourceNode.stop();
            this.isPlaying = false;
        }

        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        this.progressBarNode = this.audioContext.createGain();
        this.fadeGainNode?.connect(this.progressBarNode);
        this.progressBarNode?.connect(this.audioContext.destination);

        if(audioBuffer_clear){
            this.audioBuffer = await this.getAudioBuffer(buffer.buffer, this.audioContext);
            this.audioDuration = this.audioBuffer.duration;    
        }
        
        this.bufferSourceNode = this.audioContext.createBufferSource();
        this.volumeGainNode = this.audioContext.createGain();
        this.fadeGainNode = this.audioContext.createGain();

        this.bufferSourceNode.buffer = this.audioBuffer;
        this.bufferSourceNode.connect(this.volumeGainNode);
        this.volumeGainNode.connect(this.fadeGainNode);
        this.fadeGainNode.connect(this.audioContext.destination);   
    }
    private async getAudioBuffer(arrayBuffer: ArrayBuffer, audioContext: AudioContext): Promise<AudioBuffer> {
        let resolveFn
        const promise = new Promise(resolve => resolveFn = resolve)
        audioContext.decodeAudioData(arrayBuffer, resolveFn)
        return promise as Promise<AudioBuffer>
    }
    public releaseMemory(audioBuffer_clear:boolean): void {
        this.stop();
        this.disconnectNodes();

        this.bufferSourceNode = null;
        this.volumeGainNode = null;
        this.fadeGainNode = null;
        this.progressBarNode = null;

        if(audioBuffer_clear){
            this.audioBuffer = null;//手动清空
        }
        if (this.audioContext) {
            if(this.audioContext.state === 'running')
                this.audioContext.close();
        }
    }
    private stop(): void {
        if (this.bufferSourceNode) {
            this.bufferSourceNode.stop();
        }
    }
    private disconnectNodes(): void {
        if (this.volumeGainNode) {
            this.volumeGainNode.disconnect();
        }
        if (this.fadeGainNode) {
            this.fadeGainNode.disconnect();
        }
        if (this.progressBarNode) {
            this.progressBarNode.disconnect();
        }
    }
    //
    public setFadein(): void {
        // 淡入时间
        this.fadein = Math.min(this.fadein, this.audioDuration / 2, 5);
        if (this.fadein === 0 || !this.fadeGainNode) return;

        const waveArray = new Float32Array(2);
        waveArray[0] = 0.001;
        waveArray[1] = 1;

        // 使用 setValueCurveAtTime 方法设置音量的变化曲线，从当前时间开始，在 fadein 时间内完成淡入效果。
        this.fadeGainNode.gain.setValueCurveAtTime(waveArray, this.audioContext.currentTime, this.fadein);
    }
    public setFadeout(): void {
        this.fadeout = Math.min(this.fadeout, this.audioDuration / 2, 5);
        if (this.fadeout === 0 || !this.fadeGainNode) return;

        const waveArray = new Float32Array(2);
        waveArray[0] = 1;
        waveArray[1] = 0.001;
        this.fadeGainNode.gain.setValueCurveAtTime(waveArray, this.audioContext.currentTime + this.audioDuration - this.fadeout + 0.001, this.fadeout);
    }

    //
    public pause(): void {
        if (!this.isPlaying || !this.audioContext) return;

        this.audioContext.suspend();
        this.isPlaying = false;
    }
    public resume(): void {
        if (this.isPlaying || !this.audioContext) return;

        this.audioContext.resume();
        this.isPlaying = true;
    }

    public getVolume(): number {
        return this.volume / 100;
    }
    public setVolume(value?: number): void {
        this.volume = value ?? this.volume;
        if (this.volumeGainNode) {
            this.volumeGainNode.gain.value = this.volume / 100;
        }
    }

    public getCurrentTime(): number {
        // if (this.bufferSourceNode && this.isPlaying) {
        //     return this.currentTime;
        // }
        // return null;
        return this.audioContext.currentTime;
    }
    public async setCurrentTime(buffer: any): Promise<void> {
        const audioBuffer = await this.getAudioBuffer(buffer.buffer, this.audioContext);
        const currentTime = this.audioContext.currentTime;
    
        this.releaseMemory(false);
    
        this.bufferSourceNode = this.audioContext.createBufferSource();
        this.volumeGainNode = this.audioContext.createGain();
        this.fadeGainNode = this.audioContext.createGain();
    
        this.bufferSourceNode.buffer = audioBuffer;
        this.bufferSourceNode.connect(this.volumeGainNode);
        this.volumeGainNode.connect(this.fadeGainNode);
        this.fadeGainNode.connect(this.audioContext.destination);
    
        this.startTime = currentTime;
        this.audioDuration = audioBuffer.duration;
    
        if (this.isPlaying) {
            this.bufferSourceNode.start(0, this.startTime % this.audioDuration);
        }
    }
    
    public getDuration(): number {
        return this.audioDuration;
    }
    
    private chunks : Array<AudioBufferSourceNode> = [];
    private lastChunkOffset: number = 0;
    public sampleRate: number = 256;
    public bufferSize: number = 6;
    private debug = true;
    private createChunk(chunk:Float32Array)  {
        var audioBuffer = this.audioContext.createBuffer(2, chunk.length, this.sampleRate);
        audioBuffer.getChannelData(0).set(chunk);
        var source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        source.onended = (e:Event) => { 
            this.chunks.splice(this.chunks.indexOf(source),1);
            if (this.chunks.length == 0) {
                this.isPlaying = false;
                this.startTime = 0;
                this.lastChunkOffset = 0;
            }
        };

        return source;
    }
    private log(data:string) {
        if (this.debug) {
            console.log(new Date().toUTCString() + " : " + data);
        }
    }
    public addChunk(data: Float32Array) {
        if (this.isPlaying && (this.chunks.length > this.bufferSize)) {
            this.log("chunk discarded");
            return; // throw away
        } else if (this.isPlaying && (this.chunks.length <= this.bufferSize)) { // schedule & add right now
            this.log("chunk accepted");
            let chunk = this.createChunk(data);
            if (chunk.buffer) {
                chunk.start(this.startTime + this.lastChunkOffset);
                this.lastChunkOffset += chunk.buffer.duration;
                this.chunks.push(chunk);
            }
        } else if ((this.chunks.length < (this.bufferSize / 2)) && !this.isPlaying) {  // add & don't schedule
            this.log("chunk queued");
            let chunk = this.createChunk(data);
            this.chunks.push(chunk);
        } else  { // add & schedule entire buffer
            this.log("queued chunks scheduled");
            this.isPlaying = true;
            let chunk = this.createChunk(data);
            this.chunks.push(chunk);
            this.startTime = this.audioContext.currentTime;
            this.lastChunkOffset = 0;
            for (let i = 0;i<this.chunks.length;i++) {
                let chunk = this.chunks[i];
                if (chunk.buffer) {
                    chunk.start(this.startTime + this.lastChunkOffset);
                    this.lastChunkOffset += chunk.buffer.duration;
                }
            }
        }
    }
}