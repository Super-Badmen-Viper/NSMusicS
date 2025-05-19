package scene_audio_db_models

import "go.mongodb.org/mongo-driver/bson/primitive"

type MediaKaraokeMetadata struct {
	ID                primitive.ObjectID `bson:"karaoke_id"`   // 唯一标识[4](@ref)
	AccompanimentHash string             `bson:"k_accmp_hash"` // 伴奏文件哈希[4](@ref)
	LyricsSyncMode    string             `bson:"lyrics_sync"`  // 歌词同步模式(逐字/逐行)[4](@ref)
	DuetMode          DuetConfig         `bson:"duet_config"`  // 合唱配置[4,5](@ref)
	RecordingMeta     RecordMeta         `bson:"rec_meta"`     // 录制元数据[4](@ref)
	AudioProcessing   AudioEngine        `bson:"audio_engine"` // 音频引擎参数[4,6](@ref)
	ScoreSystem       ScoreSystem        `bson:"k_score"`      // 多维评分体系[4,7](@ref)
}

type ScoreSystem struct {
	PitchScore     float64 `bson:"pitch_score"`     // 音准偏差(±50音分)[4](@ref)
	RhythmScore    float64 `bson:"rhythm_score"`    // 节奏偏差(毫秒级)[7](@ref)
	EmotionScore   float64 `bson:"emotion_score"`   // 情感匹配度(基于AI分析)[4](@ref)
	StabilityScore float64 `bson:"stability_score"` // 声音稳定性指数[4](@ref)
	TotalScore     float64 `bson:"total_score"`     // 综合加权评分[3](@ref)
}

type DuetConfig struct {
	Enable          bool    `bson:"enable"`           // 合唱开关[5](@ref)
	MaxParticipants int     `bson:"max_participants"` // 最大合唱人数(默认8人)[5](@ref)
	LatencyControl  float64 `bson:"latency"`          // 延迟控制(≤200ms)[4](@ref)
	VocalBalance    []struct {
		UserID string  `bson:"user_id"`
		Volume float64 `bson:"volume"` // 人声音量平衡[4](@ref)
	} `bson:"vocal_balance"`
}

type RecordMeta struct {
	DeviceType     string `bson:"rec_device"`    // 设备型号(如BlueYeti)[4](@ref)
	EffectPreset   string `bson:"effect_preset"` // 音效预设(流行/摇滚等)[3](@ref)
	NoiseReduction int    `bson:"noise_level"`   // 智能降噪等级[4](@ref)
	RecordingCodec string `bson:"codec"`         // 编码格式(AAC-LC/HE-AAC)[4](@ref)
}

type AudioEngine struct {
	VocalEnhancement struct {
		Reverb    float64 `bson:"reverb"`   // 混响强度[3](@ref)
		Equalizer []int   `bson:"eq_bands"` // 十段均衡器设置[4](@ref)
	} `bson:"vocal_enhance"`
	AccompAdjust struct {
		Tempo      float64 `bson:"tempo"` // 伴奏速度(±20%)[4](@ref)
		PitchShift int     `bson:"pitch"` // 升降调(-12~+12)[7](@ref)
	} `bson:"accomp_adjust"`
	OutputConfig struct {
		Bitrate int    `bson:"bitrate"` // 输出比特率(128/320kbps)[4](@ref)
		Format  string `bson:"format"`  // 输出格式(MP3/WAV)[6](@ref)
	} `bson:"output_config"`
}
