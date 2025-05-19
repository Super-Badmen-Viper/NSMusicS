package scene_audio_db_models

import "go.mongodb.org/mongo-driver/bson/primitive"

type MediaTrackMetadata struct {
	ID           primitive.ObjectID `bson:"track_id"`     // 音轨唯一标识[8](@ref)
	Codec        string             `bson:"codec"`        // 编码格式(AAC/Opus/FLAC)[4,8](@ref)
	BitDepth     int                `bson:"bit_depth"`    // 量化位深(16/24/32bit)[2,6](@ref)
	SampleRate   int                `bson:"sample_rate"`  // 采样率(44.1k/48k/96kHz)[2,8](@ref)
	Channels     int                `bson:"channels"`     // 声道配置(1单声道/2立体声/5.1环绕)[2,6](@ref)
	Bitrate      int                `bson:"bitrate"`      // 传输比特率(64-320kbps)[4,8](@ref)
	Pan          float64            `bson:"pan"`          // 声像定位(-1.0左~1.0右)[3,5](@ref)
	Gain         float64            `bson:"gain"`         // 增益补偿(-12dB~+12dB)[5,6](@ref)
	Latency      int                `bson:"latency"`      // 传输延迟(ms)[8](@ref)
	Timestamp    int64              `bson:"timestamp"`    // 时间戳(μs精度)[8](@ref)
	SyncMarkers  []int              `bson:"sync_markers"` // 同步标记点[8](@ref)
	IsActive     bool               `bson:"is_active"`    // 激活状态[5](@ref)
	Transmission struct {
		Protocol   string `bson:"protocol"`    // 传输协议(RTP/MADI/CobraNet)[7,8](@ref)
		PacketSize int    `bson:"packet_size"` // 数据包大小(128-2048字节)[8](@ref)
		CRC        string `bson:"crc"`         // 校验算法(CRC16/CRC32)[8](@ref)
	} `bson:"transmission"`
}
