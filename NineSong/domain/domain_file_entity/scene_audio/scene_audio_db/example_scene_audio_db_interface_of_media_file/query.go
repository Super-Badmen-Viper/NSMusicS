package example_scene_audio_db_interface_of_media_file

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
)

// MediaFileQuery 复杂查询接口
type MediaFileQuery interface {
	// 分页查询
	Search(ctx context.Context,
		filter scene_audio_db_models.FilterParams,
		sort scene_audio_db_models.SortParams,
		page, size int,
	) ([]*scene_audio_db_models.MediaFileMetadata, int64, error)

	// 动态过滤
	FindByCriteria(ctx context.Context,
		criteria map[string]interface{},
		options ...domain.QueryOption,
	) ([]*scene_audio_db_models.MediaFileMetadata, error)

	// 聚合统计
	CountByGenre(ctx context.Context) (map[string]int64, error)
	AverageBitrate(ctx context.Context, artistID string) (float64, error)
}
