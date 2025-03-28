package example_audio_interface_media_file

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_models"
)

// MediaFileQuery 复杂查询接口
type MediaFileQuery interface {
	// 分页查询
	Search(ctx context.Context,
		filter domain_file_entity_audio_models.FilterParams,
		sort domain_file_entity_audio_models.SortParams,
		page, size int,
	) ([]*domain_file_entity_audio_models.MediaFileMetadata, int64, error)

	// 动态过滤
	FindByCriteria(ctx context.Context,
		criteria map[string]interface{},
		options ...domain.QueryOption,
	) ([]*domain_file_entity_audio_models.MediaFileMetadata, error)

	// 聚合统计
	CountByGenre(ctx context.Context) (map[string]int64, error)
	AverageBitrate(ctx context.Context, artistID string) (float64, error)
}
