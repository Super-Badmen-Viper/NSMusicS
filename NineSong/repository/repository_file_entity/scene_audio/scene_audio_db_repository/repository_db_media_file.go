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
	now := time.Now().UTC()

	filter := bson.M{"path": file.Path}
	update := file.ToUpdateDoc()
	update["$setOnInsert"] = bson.M{
		"_id":        primitive.NewObjectID(),
		"created_at": now,
	}

	opts := options.Update().SetUpsert(true)
	result, err := coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return fmt.Errorf("upsert操作失败: %w", err)
	}

	if result.UpsertedID != nil {
		file.ID = result.UpsertedID.(primitive.ObjectID)
		file.CreatedAt = now
	} else {
		var existing struct{ ID primitive.ObjectID }
		if err := coll.FindOne(ctx, filter).Decode(&existing); err == nil {
			file.ID = existing.ID
		}
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

func (r *mediaFileRepository) UpdateByID(ctx context.Context, id primitive.ObjectID, update bson.M) (bool, error) {
	coll := r.db.Collection(r.collection)

	// 构建原子更新操作
	result, err := coll.UpdateOne(
		ctx,
		bson.M{"_id": id},
		update,
		options.Update().SetUpsert(false),
	)

	if err != nil {
		return false, fmt.Errorf("媒体文件更新失败: %w", err)
	}

	if result.MatchedCount == 0 {
		return false, nil
	}

	return true, nil
}
