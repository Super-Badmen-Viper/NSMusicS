package scene_audio_route_repository

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
)

type annotationRepository struct {
	db mongo.Database
}

func NewAnnotationRepository(db mongo.Database) scene_audio_route_interface.AnnotationRepository {
	return &annotationRepository{db: db}
}

// 构建通用聚合管道
func (r *annotationRepository) buildPipeline(itemType string, targetCollection string, start, end, sortField, sortOrder string) []interface{} {
	pipeline := []interface{}{
		map[string]interface{}{"$match": map[string]string{"item_type": itemType}},
		map[string]interface{}{
			"$lookup": map[string]interface{}{
				"from":         targetCollection,
				"localField":   "item_id",
				"foreignField": "_id",
				"as":           "related_data",
			},
		},
		map[string]interface{}{
			"$unwind": map[string]interface{}{
				"path":                       "$related_data",
				"preserveNullAndEmptyArrays": false,
			},
		},
		map[string]interface{}{
			"$replaceRoot": map[string]string{"newRoot": "$related_data"},
		},
	}

	// 分页处理
	skip, _ := strconv.ParseInt(start, 10, 64)
	limit, _ := strconv.ParseInt(end, 10, 64)
	if limit > 0 {
		pipeline = append(pipeline,
			map[string]interface{}{"$skip": skip},
			map[string]interface{}{"$limit": limit},
		)
	}

	// 排序处理（支持嵌套字段）
	if sortField != "" {
		sortValue := 1
		if strings.ToLower(sortOrder) == "desc" {
			sortValue = -1
		}

		// 处理关联字段的点符号转义
		if strings.Contains(sortField, ".") {
			sortField = strings.ReplaceAll(sortField, ".", "·")
		}

		pipeline = append(pipeline,
			map[string]interface{}{"$sort": map[string]int{sortField: sortValue}},
		)
	}

	return pipeline
}

// 艺术家查询
func (r *annotationRepository) GetArtistList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	collection := r.db.Collection("CollectionFileEntityAnnotation")
	pipeline := r.buildPipeline("artist", "CollectionFileEntityAudioArtist", start, end, sort, order)

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("艺术家查询失败: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.ArtistMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("艺术家数据解析失败: %w", err)
	}

	return results, nil
}

// 专辑查询（完整实现）
func (r *annotationRepository) GetAlbumList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	collection := r.db.Collection("CollectionFileEntityAnnotation")
	pipeline := r.buildPipeline("album", "CollectionFileEntityAudioAlbum", start, end, sort, order)

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("专辑查询失败: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.AlbumMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("专辑数据解析失败: %w", err)
	}

	return results, nil
}

// 媒体文件查询（完整实现）
func (r *annotationRepository) GetMediaFileList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	collection := r.db.Collection("CollectionFileEntityAnnotation")
	pipeline := r.buildPipeline("media", "CollectionFileEntityAudioMediaFile", start, end, sort, order)

	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("媒体文件查询失败: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.MediaFileMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("媒体文件解析失败: %w", err)
	}

	return results, nil
}
