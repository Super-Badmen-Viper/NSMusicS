package domain_file_entity_audio_interface

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"time"
)

// MediaFileRepository 基础CRUD接口
type MediaFileRepository interface {
	// 创建/更新
	Upsert(ctx context.Context, file *domain_file_entity_audio_models.MediaFileMetadata) error
	BulkUpsert(ctx context.Context, files []*domain_file_entity_audio_models.MediaFileMetadata) (int, error)

	// 删除
	DeleteByID(ctx context.Context, id primitive.ObjectID) error
	DeleteByPath(ctx context.Context, path string) error

	// 查询
	GetByID(ctx context.Context, id primitive.ObjectID) (*domain_file_entity_audio_models.MediaFileMetadata, error)
	GetByPath(ctx context.Context, path string) (*domain_file_entity_audio_models.MediaFileMetadata, error)
	GetByMBZTrackID(ctx context.Context, mbzID string) ([]*domain_file_entity_audio_models.MediaFileMetadata, error)
}

// queryOptions 查询选项配置
type queryOptions struct {
	maxTimeout     time.Duration
	allowPartial   bool
	projection     []string
	readPreference *readpref.ReadPref
}

// QueryOption 查询选项类型
type QueryOption func(*queryOptions)
