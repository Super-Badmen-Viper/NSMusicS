package domain_file_entity_audio_interface

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

// AudioAnalysis 技术指标操作接口
type AudioAnalysis interface {
	// 更新技术参数
	UpdateAudioMetrics(ctx context.Context, id primitive.ObjectID,
		metrics AudioMetrics,
	) error

	// 增益处理
	GetReplayGain(ctx context.Context, id primitive.ObjectID) (RGInfo, error)
	BatchUpdateReplayGain(ctx context.Context, ids []primitive.ObjectID) error

	// BPM分析
	DetectBPM(ctx context.Context, path string) (int, error)
}

// AudioMetrics 音频技术指标
type AudioMetrics struct {
	BPM           int
	Channels      int
	RGAlbumGain   float64
	RGAlbumPeak   float64
	RGTrackGain   float64
	RGTrackPeak   float64
	DynamicRange  float64
	FrequencyData []float64 `bson:"-"` // 不持久化存储
}

// RGInfo 增益信息
type RGInfo struct {
	AlbumGain         float64
	AlbumPeak         float64
	TrackGain         float64
	TrackPeak         float64
	ReferenceLoudness float64
	MeasurementDate   time.Time
}

//// AdvancedAudioMetrics 高级音频指标
//type AdvancedAudioMetrics struct {
//	SpectralCentroid float64
//	ZeroCrossingRate float64
//	HarmonicRatio    float64
//}
//
//// SpectralAnalysis 频谱分析结果
//type SpectralAnalysis struct {
//	Centroid         float64
//	Rolloff          float64
//	Flux             float64
//	ZeroCrossingRate float64
//	MFCC             []float64
//}
