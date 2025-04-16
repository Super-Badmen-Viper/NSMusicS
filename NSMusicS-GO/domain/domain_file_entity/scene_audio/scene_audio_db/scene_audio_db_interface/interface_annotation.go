package scene_audio_db_interface

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AnnotationRepository 基础CRUD接口
type AnnotationRepository interface {
	// 创建/更新
	Upsert(ctx context.Context, file *scene_audio_db_models.AnnotationMetadata) error
	BulkUpsert(ctx context.Context, files []*scene_audio_db_models.AnnotationMetadata) (int, error)

	// 删除
	DeleteByID(ctx context.Context, id primitive.ObjectID) error
	DeleteByPath(ctx context.Context, path string) error

	// 查询
	GetByID(ctx context.Context, id primitive.ObjectID) (*scene_audio_db_models.AnnotationMetadata, error)
	GetByPath(ctx context.Context, path string) (*scene_audio_db_models.AnnotationMetadata, error)
}
