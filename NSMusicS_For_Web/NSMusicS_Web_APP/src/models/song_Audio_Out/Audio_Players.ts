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
    
    
    
    public getTotalTime(): number {
        return this.audioDuration;
    }
    
    private eqNodes: BiquadFilterNode[] = [];

    private initEqualizer(): void {
        const equalizerBands = this.createEqualizerBands();
        this.connectEqualizerBands(equalizerBands);
        if (this.volumeGainNode) {
            equalizerBands[0].connect(this.volumeGainNode);
        } 
        this.eqNodes = equalizerBands;
    }
    private createEqualizerBands(): BiquadFilterNode[] {
        const bands: BiquadFilterNode[] = [];

        for (const frequency of this.frequencies) {
            const band = this.audioContext.createBiquadFilter();
            band.type = 'peaking';
            band.frequency.value = frequency;
            band.Q.value = 1;
            band.gain.value = 0;

            bands.push(band);
        }

        return bands;
    }
    private connectEqualizerBands(bands: BiquadFilterNode[]): void {
        for (let i = 0; i < bands.length - 1; i++) {
            bands[i].connect(bands[i + 1]);
        }
        bands[bands.length - 1].connect(this.audioContext.destination);
    }
    public setEqualizerGain(frequency: number, gainValue: number): void {
        const targetNode = this.eqNodes.find((node) => node.frequency.value === frequency);
        if (targetNode) {
            targetNode.gain.value = gainValue;
        } else {
            this.frequencies.push(frequency);
            this.initEqualizer();
        }
    }
    public setEqualizerBandProperties(frequency: number, properties: BiquadFilterNode): void {
        const targetNode = this.eqNodes.find((node) => node.frequency.value === frequency);
        if (targetNode) {
            Object.assign(targetNode, properties);
        } else {
            this.frequencies.push(frequency);
            this.initEqualizer();
        }
    }
}
