package scene_audio_db_repository

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type mediaFileRepository struct {
	db         mongo.Database
	collection string
}

func NewMediaFileRepository(db mongo.Database, collection string) scene_audio_db_interface.MediaFileRepository {
	return &mediaFileRepository{
		db:         db,
		collection: collection,
	}
}

func (r *mediaFileRepository) Upsert(ctx context.Context, file *scene_audio_db_models.MediaFileMetadata) error {
	coll := r.db.Collection(r.collection)
	now := time.Now()

	// 构建以路径为唯一标识的查询条件（核心修改）
	filter := bson.M{"path": file.Path}

	// 构造更新文档（保留created_at）
	update := bson.M{
		"$set": file.ToUpdateDoc(),
		"$setOnInsert": bson.M{
			"_id":        primitive.NewObjectID(),
			"created_at": now,
		},
	}

	// 执行原子化更新插入
	opts := options.Update().SetUpsert(true)
	result, err := coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return fmt.Errorf("media file upsert failed: %w", err)
	}

	// 处理ID回填（关键逻辑）
	if result.UpsertedID != nil {
		file.ID = result.UpsertedID.(primitive.ObjectID)
	} else {
		// 查询已有记录的ID（防止竞态条件）
		var existing struct {
			ID primitive.ObjectID `bson:"_id"`
		}
		_ = coll.FindOne(ctx, filter).Decode(&existing)
		file.ID = existing.ID
	}

	// 时间字段处理
	if result.UpsertedID != nil {
		file.CreatedAt = now
	}
	file.UpdatedAt = now

	return nil
}

func (r *mediaFileRepository) BulkUpsert(ctx context.Context, files []*scene_audio_db_models.MediaFileMetadata) (int, error) {
	coll := r.db.Collection(r.collection)
	var successCount int

	for _, file := range files {
		filter := bson.M{"_id": file.ID}
		update := bson.M{"$set": file}

		_, err := coll.UpdateOne(
			ctx,
			filter,
			update,
			options.Update().SetUpsert(true),
		)

		if err != nil {
			return successCount, fmt.Errorf("bulk upsert失败于索引%d: %w", successCount, err)
		}
		successCount++
	}
	return successCount, nil
}

func (r *mediaFileRepository) DeleteByID(ctx context.Context, id primitive.ObjectID) error {
	coll := r.db.Collection(r.collection)
	_, err := coll.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("delete media file failed: %w", err)
	}
	return nil
}

func (r *mediaFileRepository) DeleteByPath(ctx context.Context, path string) error {
	coll := r.db.Collection(r.collection)
	_, err := coll.DeleteOne(ctx, bson.M{"path": path})
	if err != nil {
		return fmt.Errorf("delete by path failed: %w", err)
	}
	return nil
}

func (r *mediaFileRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*scene_audio_db_models.MediaFileMetadata, error) {
	coll := r.db.Collection(r.collection)
	result := coll.FindOne(ctx, bson.M{"_id": id})

	var file scene_audio_db_models.MediaFileMetadata
	if err := result.Decode(&file); err != nil {
		if domain.IsNotFound(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("get media file failed: %w", err)
	}
	return &file, nil
}

func (r *mediaFileRepository) GetByPath(ctx context.Context, path string) (*scene_audio_db_models.MediaFileMetadata, error) {
	coll := r.db.Collection(r.collection)
	result := coll.FindOne(ctx, bson.M{"path": path})

	var file scene_audio_db_models.MediaFileMetadata
	if err := result.Decode(&file); err != nil {
		if domain.IsNotFound(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("get by path failed: %w", err)
	}
	return &file, nil
}
