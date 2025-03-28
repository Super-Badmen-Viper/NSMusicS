package example_audio_interface_media_file

import "context"

// Analytics 统计聚合接口
type Analytics interface {
	// 数据分析
	GenreDistribution(ctx context.Context) (map[string]float64, error)
	YearlyBitrateTrend(ctx context.Context, startYear, endYear int) (map[int]float64, error)

	// 高级统计
	ArtistProductivityReport(ctx context.Context, topN int) ([]ArtistStats, error)
	AlbumDurationAnalysis(ctx context.Context, minTracks int) ([]AlbumDuration, error)
}

// 艺术家统计
type ArtistStats struct {
	ArtistMBID         string
	Name               string
	TotalAlbums        int
	TotalTracks        int
	AvgTrackLength     float64
	GenreSpread        map[string]int
	DecadeDistribution map[int]int
}

// 专辑时长分析
type AlbumDuration struct {
	AlbumMBID      string
	Title          string
	TotalSeconds   float64
	TrackBreakdown []TrackDuration
	Consistency    DurationConsistency
}
type TrackDuration struct {
	Position  int
	Duration  float64
	Deviation float64 // 与专辑平均时长的偏差
}

type DurationConsistency struct {
	StdDev       float64
	MaxDeviation float64
	IsConsistent bool
}
