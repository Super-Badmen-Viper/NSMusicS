package domain_file_entity_audio_interface

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AlbumRepository 专辑领域层接口
type AlbumRepository interface {
	// 创建/更新
	Upsert(ctx context.Context, album *domain_file_entity_audio_models.AlbumMetadata) error
	BulkUpsert(ctx context.Context, albums []*domain_file_entity_audio_models.AlbumMetadata) (int, error)

	// 删除
	DeleteByID(ctx context.Context, id primitive.ObjectID) error
	DeleteByName(ctx context.Context, name string) error

	// 查询
	GetByID(ctx context.Context, id primitive.ObjectID) (*domain_file_entity_audio_models.AlbumMetadata, error)
	GetByName(ctx context.Context, name string) (*domain_file_entity_audio_models.AlbumMetadata, error)
	GetByArtist(ctx context.Context, artistID string) ([]*domain_file_entity_audio_models.AlbumMetadata, error)

	UpdateSongCount(ctx context.Context, albumID primitive.ObjectID, increment int) (int64, error)
	GetByMBID(ctx context.Context, mbzID string) (*domain_file_entity_audio_models.AlbumMetadata, error)
	GetByFilter(ctx context.Context, filter interface{}) (*domain_file_entity_audio_models.AlbumMetadata, error)
}

// 查询参数结构
type AlbumFilterParams struct {
	MinYear       int
	MaxYear       int
	ArtistIDs     []string
	AlbumTypes    []string
	MBZAlbumTypes []string
	HasCoverArt   *bool
}

type AlbumSortParams struct {
	Field     string // 支持字段：name, artist, year 等
	Ascending bool
}
