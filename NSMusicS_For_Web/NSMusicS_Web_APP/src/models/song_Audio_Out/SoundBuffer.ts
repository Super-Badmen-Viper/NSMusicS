export class SoundBuffer {
    private chunks : Array<AudioBufferSourceNode> = [];
    private isPlaying: boolean = false;
    private startTime: number = 0;
    private lastChunkOffset: number = 0;

    constructor(public ctx:AudioContext, public sampleRate:number,public bufferSize:number = 6, private debug = true) { }

    private createChunk(chunk:Float32Array)  {
        var audioBuffer = this.ctx.createBuffer(2, chunk.length, this.sampleRate);
        audioBuffer.getChannelData(0).set(chunk);
        var source = this.ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.ctx.destination);
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
            this.startTime = this.ctx.currentTime;
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