package scene_audio_db_repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type tempRepository struct {
	db         mongo.Database
	collection string
}

func NewTempRepository(db mongo.Database, collection string) scene_audio_db_interface.TempRepository {
	return &tempRepository{
		db:         db,
		collection: collection,
	}
}

func (t *tempRepository) GetTempPath(
	ctx context.Context,
	metadataType string,
) (string, error) {
	collection := t.db.Collection(t.collection)

	filter := bson.M{"metadata_type": metadataType}

	var result scene_audio_db_models.ExternalResource
	err := collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		return "", fmt.Errorf("路径查询失败: %w | 类型: %s", err, metadataType)
	}

	if result.FolderPath == "" {
		return "", errors.New("数据库返回空路径")
	}

	return result.FolderPath, nil
}

func (t *tempRepository) UpdateTempPath(
	ctx context.Context,
	metadataType string,
	folderPath string,
) (bool, error) {
	if folderPath == "" {
		return false, errors.New("路径参数不能为空")
	}

	collection := t.db.Collection(t.collection)

	update := bson.M{
		"$set": bson.M{
			"folder_path": folderPath,
			"updated_at":  time.Now(),
		},
		"$setOnInsert": bson.M{
			"created_at":    time.Now(),
			"metadata_type": metadataType,
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err := collection.UpdateOne(
		ctx,
		bson.M{"metadata_type": metadataType},
		update,
		opts,
	)

	return err == nil, err
}
