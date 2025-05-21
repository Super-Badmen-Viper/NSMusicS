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

type playlistTrackRepository struct {
	db         mongo.Database
	collection string
}

func NewPlaylistTrackRepository(db mongo.Database, collection string) scene_audio_db_interface.PlaylistTrackRepository {
	return &playlistTrackRepository{
		db:         db,
		collection: collection,
	}
}

func (r *playlistTrackRepository) Upsert(ctx context.Context, file *scene_audio_db_models.PlaylistTrackMetadata) error {
	coll := r.db.Collection(r.collection)

	// 获取当前时间
	now := time.Now()

	// 序列化结构体为BSON
	var doc bson.M
	data, err := bson.Marshal(file)
	if err != nil {
		return fmt.Errorf("marshal error: %w", err)
	}
	if err := bson.Unmarshal(data, &doc); err != nil {
		return fmt.Errorf("unmarshal error: %w", err)
	}

	// 构造更新文档
	update := bson.M{
		"$set":         make(bson.M),
		"$setOnInsert": bson.M{"created_at": now},
	}

	// 动态构建$set内容，排除特定字段
	for k, v := range doc {
		if k == "_id" || k == "created_at" {
			continue // 跳过ID和创建时间
		}
		update["$set"].(bson.M)[k] = v
	}

	// 强制设置更新时间
	update["$set"].(bson.M)["updated_at"] = now

	// 执行更新操作
	filter := bson.M{"_id": file.ID}
	opts := options.Update().SetUpsert(true)
	result, err := coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return fmt.Errorf("media file upsert failed: %w", err)
	}

	// 处理插入后的ID同步
	if result.UpsertedID != nil {
		if oid, ok := result.UpsertedID.(primitive.ObjectID); ok {
			file.ID = oid
		}
	}

	return nil
}

func (r *playlistTrackRepository) BulkUpsert(ctx context.Context, files []*scene_audio_db_models.PlaylistTrackMetadata) (int, error) {
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

func (r *playlistTrackRepository) DeleteByID(ctx context.Context, id primitive.ObjectID) error {
	coll := r.db.Collection(r.collection)
	_, err := coll.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("delete media file failed: %w", err)
	}
	return nil
}

func (r *playlistTrackRepository) DeleteByPath(ctx context.Context, path string) error {
	coll := r.db.Collection(r.collection)
	_, err := coll.DeleteOne(ctx, bson.M{"path": path})
	if err != nil {
		return fmt.Errorf("delete by path failed: %w", err)
	}
	return nil
}

func (r *playlistTrackRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*scene_audio_db_models.PlaylistTrackMetadata, error) {
	coll := r.db.Collection(r.collection)
	result := coll.FindOne(ctx, bson.M{"_id": id})

	var file scene_audio_db_models.PlaylistTrackMetadata
	if err := result.Decode(&file); err != nil {
		if domain.IsNotFound(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("get media file failed: %w", err)
	}
	return &file, nil
}

func (r *playlistTrackRepository) GetByPath(ctx context.Context, path string) (*scene_audio_db_models.PlaylistTrackMetadata, error) {
	coll := r.db.Collection(r.collection)
	result := coll.FindOne(ctx, bson.M{"path": path})

	var file scene_audio_db_models.PlaylistTrackMetadata
	if err := result.Decode(&file); err != nil {
		if domain.IsNotFound(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("get by path failed: %w", err)
	}
	return &file, nil
}
