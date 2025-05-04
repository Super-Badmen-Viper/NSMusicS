package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"os"
	"path/filepath"
)

type retrievalRepository struct {
	db mongo.Database
}

func NewRetrievalRepository(db mongo.Database) scene_audio_route_interface.RetrievalRepository {
	return &retrievalRepository{db: db}
}

func (r *retrievalRepository) GetStream(ctx context.Context, mediaFileId string) (string, error) {
	objID, err := primitive.ObjectIDFromHex(mediaFileId)
	if err != nil {
		return "", errors.New("invalid media file id format")
	}

	collection := r.db.Collection(domain.CollectionFileEntityAudioMediaFile)
	var result scene_audio_route_models.MediaFileMetadata
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&result)
	if err != nil {
		return "", fmt.Errorf("stream metadata not found: %w", err)
	}
	return result.Path, nil
}

func (r *retrievalRepository) GetDownload(ctx context.Context, mediaFileId string) (string, error) {
	objID, err := primitive.ObjectIDFromHex(mediaFileId)
	if err != nil {
		return "", errors.New("invalid media file id format")
	}

	collection := r.db.Collection(domain.CollectionFileEntityAudioMediaFile)
	var result scene_audio_route_models.MediaFileMetadata
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&result)
	if err != nil {
		return "", fmt.Errorf("download metadata not found: %w", err)
	}
	return result.Path, nil
}

func (r *retrievalRepository) GetCoverArt(ctx context.Context, coverArtId string) (string, error) {
	// 参数格式验证
	if _, err := primitive.ObjectIDFromHex(coverArtId); err != nil {
		return "", errors.New("invalid cover art id format")
	}

	// Step 1: 获取封面存储路径
	tempCollection := r.db.Collection(domain.CollectionFileEntityAudioTempMetadata)
	var tempMeta scene_audio_db_models.TempMetadata
	err := tempCollection.FindOne(
		ctx,
		bson.M{
			"metadata_type": "cover",
		},
	).Decode(&tempMeta)
	if err != nil {
		return "", fmt.Errorf("cover storage config not found: %w", err)
	}

	// Step 2: 构建完整文件路径
	fileName := fmt.Sprintf("%s.jpg", coverArtId)
	fullPath := filepath.Join(tempMeta.FolderPath, fileName)

	// Step 2: 验证文件存在性
	if _, err := os.Stat(fullPath); os.IsNotExist(err) {
		return "", fmt.Errorf("cover file not found: %s", fileName)
	}

	return fullPath, nil
}

func (r *retrievalRepository) GetLyricsLrcMetaData(ctx context.Context, mediaFileId string) (string, error) {
	// 参数验证
	objID, err := primitive.ObjectIDFromHex(mediaFileId)
	if err != nil {
		return "", errors.New("invalid media file id format")
	}

	// 查询媒体文件表
	collection := r.db.Collection(domain.CollectionFileEntityAudioMediaFile)
	var result scene_audio_route_models.RetrievalLyricsMetadata

	// 构建查询条件
	filter := bson.M{"_id": objID}

	// 执行查询
	err = collection.FindOne(ctx, filter).Decode(&result)
	if err != nil {
		return "", fmt.Errorf("database query failed: %w", err)
	}

	// 返回歌词内容
	return result.Lyrics, nil
}

func (r *retrievalRepository) GetLyricsLrcFile(ctx context.Context, mediaFileId string) (string, error) {
	//TODO implement me
	panic("implement me")
}
