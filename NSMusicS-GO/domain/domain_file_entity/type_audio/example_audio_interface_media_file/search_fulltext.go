package example_audio_interface_media_file

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_models"
)

// FullTextSearch 全文搜索接口
type FullTextSearch interface {
	// 搜索功能
	IndexAllMetadata(ctx context.Context) error
	SearchByLyrics(ctx context.Context, query string) ([]*domain_file_entity_audio_models.MediaFileMetadata, error)
	FuzzySearch(ctx context.Context, term string, threshold float64) ([]*domain_file_entity_audio_models.MediaFileMetadata, error)
}

// SearchConfig 全文搜索配置
type SearchConfig struct {
	BoostTitle  float64
	BoostArtist float64
	BoostLyrics float64
	FuzzySlop   int
}

//// 歌词搜索上下文
//type LyricsSearchContext struct {
//	Query           string
//	Language        string
//	MatchExact      bool
//	IncludeVerses   bool
//	IncludeChorus   bool
//	ProximitySearch bool
//}
