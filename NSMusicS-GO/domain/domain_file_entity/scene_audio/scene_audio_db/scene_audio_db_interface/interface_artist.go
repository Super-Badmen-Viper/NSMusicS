package scene_audio_db_interface

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ArtistRepository 艺术家领域层接口
type ArtistRepository interface {
	// 创建/更新
	Upsert(ctx context.Context, artist *scene_audio_db_models.ArtistMetadata) error
	BulkUpsert(ctx context.Context, artists []*scene_audio_db_models.ArtistMetadata) (int, error)

	// 删除
	DeleteByID(ctx context.Context, id primitive.ObjectID) error
	DeleteByName(ctx context.Context, name string) error

	// 查询
	GetByID(ctx context.Context, id primitive.ObjectID) (*scene_audio_db_models.ArtistMetadata, error)
	GetByName(ctx context.Context, name string) (*scene_audio_db_models.ArtistMetadata, error)

	UpdateAlbumCount(ctx context.Context, artistID primitive.ObjectID, increment int) (int64, error)
	GetByMBID(ctx context.Context, mbzID string) (*scene_audio_db_models.ArtistMetadata, error)
}
