package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo/options"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type annotationRepository struct {
	db mongo.Database
}

func NewAnnotationRepository(db mongo.Database) scene_audio_route_interface.AnnotationRepository {
	return &annotationRepository{db: db}
}

func (r *annotationRepository) getItemIDs(ctx context.Context, itemType string, start, end string) ([]primitive.ObjectID, error) {
	// 获取分页参数
	skip, _ := strconv.Atoi(start)
	limit, _ := strconv.Atoi(end)
	if limit <= 0 || limit > 1000 {
		limit = 50
	}

	// 从推荐表获取指定类型的ID列表
	annotationColl := r.db.Collection(domain.CollectionFileEntityAudioAnnotation)
	pipeline := []bson.M{
		{"$match": bson.M{"item_type": itemType}},
		{"$skip": skip},
		{"$limit": limit},
		{"$project": bson.M{"item_id": 1}},
	}

	cursor, err := annotationColl.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("获取推荐ID失败: %w", err)
	}
	defer cursor.Close(ctx)

	var results []struct {
		ItemID primitive.ObjectID `bson:"item_id"`
	}
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("解析推荐ID失败: %w", err)
	}

	// 提取ID列表
	ids := make([]primitive.ObjectID, 0, len(results))
	for _, item := range results {
		ids = append(ids, item.ItemID)
	}

	return ids, nil
}

func (r *annotationRepository) GetArtistList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	// 1. 获取推荐艺术家ID
	artistIDs, err := r.getItemIDs(ctx, "artist", start, end)
	if err != nil {
		return nil, err
	}

	// 2. 查询艺术家详情
	artistColl := r.db.Collection(domain.CollectionFileEntityAudioArtist)
	filter := bson.M{"_id": bson.M{"$in": artistIDs}}

	cursor, err := artistColl.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("查询艺术家失败: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.ArtistMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("解析艺术家数据失败: %w", err)
	}

	return results, nil
}

func (r *annotationRepository) GetAlbumList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	// 1. 获取推荐专辑ID
	albumIDs, err := r.getItemIDs(ctx, "album", start, end)
	if err != nil {
		return nil, err
	}

	// 2. 查询专辑详情
	albumColl := r.db.Collection(domain.CollectionFileEntityAudioAlbum)
	filter := bson.M{"_id": bson.M{"$in": albumIDs}}

	cursor, err := albumColl.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("查询专辑失败: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.AlbumMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("解析专辑数据失败: %w", err)
	}

	return results, nil
}

func (r *annotationRepository) GetMediaFileList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	// 1. 获取推荐媒体文件ID
	mediaIDs, err := r.getItemIDs(ctx, "media", start, end)
	if err != nil {
		return nil, err
	}

	// 2. 查询媒体文件详情
	mediaColl := r.db.Collection(domain.CollectionFileEntityAudioMediaFile)
	filter := bson.M{"_id": bson.M{"$in": mediaIDs}}

	cursor, err := mediaColl.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("查询媒体文件失败: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.MediaFileMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("解析媒体文件失败: %w", err)
	}

	return results, nil
}

func (r *annotationRepository) GetRandomArtistList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	collection := r.db.Collection(domain.CollectionFileEntityAudioArtist)

	// 转换分页参数
	skip, _ := strconv.Atoi(start)
	limit, _ := strconv.Atoi(end)
	if limit <= 0 || limit > 1000 {
		limit = 50
	}

	// 构建随机查询
	pipeline := []bson.M{
		{"$sample": bson.M{"size": limit + skip}},
		{"$skip": skip},
		{"$limit": limit},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("random query failed: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.ArtistMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	return results, nil
}

func (r *annotationRepository) GetRandomAlbumList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	collection := r.db.Collection(domain.CollectionFileEntityAudioAlbum)

	skip, _ := strconv.Atoi(start)
	limit, _ := strconv.Atoi(end)
	if limit <= 0 || limit > 1000 {
		limit = 50
	}

	pipeline := []bson.M{
		{"$sample": bson.M{"size": limit + skip}},
		{"$skip": skip},
		{"$limit": limit},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("random query failed: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.AlbumMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	return results, nil
}

func (r *annotationRepository) GetRandomMediaFileList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	collection := r.db.Collection(domain.CollectionFileEntityAudioMediaFile)

	skip, _ := strconv.Atoi(start)
	limit, _ := strconv.Atoi(end)
	if limit <= 0 || limit > 1000 {
		limit = 50
	}

	pipeline := []bson.M{
		{"$sample": bson.M{"size": limit + skip}},
		{"$skip": skip},
		{"$limit": limit},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("random query failed: %w", err)
	}
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.MediaFileMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	return results, nil
}

// region 通用工具
func (r *annotationRepository) createFilter(itemId, itemType string) (bson.M, error) {
	objID, err := primitive.ObjectIDFromHex(itemId)
	if err != nil {
		return nil, errors.New("invalid item_id format")
	}

	return bson.M{
		"item_id":   objID,
		"item_type": itemType,
	}, nil
}

// endregion

func (r *annotationRepository) UpdateStarred(
	ctx context.Context,
	itemId, itemType string,
) (bool, error) {
	filter, err := r.createFilter(itemId, itemType)
	if err != nil {
		return false, err
	}

	update := bson.M{
		"$set": bson.M{
			"starred":    true,
			"starred_at": time.Now().UTC(),
			"updated_at": time.Now().UTC(),
		},
		"$setOnInsert": bson.M{
			"created_at": time.Now().UTC(),
			"play_count": 0,
			"rating":     0,
		},
	}

	opts := options.Update().SetUpsert(true)
	coll := r.db.Collection(domain.CollectionFileEntityAudioAnnotation)

	res, err := coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return false, fmt.Errorf("update operation failed: %w", err)
	}

	var doc scene_audio_route_models.AnnotationMetadata
	if res.UpsertedID != nil {
		filter = bson.M{"_id": res.UpsertedID}
	}

	if err := coll.FindOne(ctx, filter).Decode(&doc); err != nil {
		return false, fmt.Errorf("fetch document failed: %w", err)
	}

	return true, nil
}

func (r *annotationRepository) UpdateUnStarred(
	ctx context.Context,
	itemId, itemType string,
) (bool, error) {
	filter, err := r.createFilter(itemId, itemType)
	if err != nil {
		return false, err
	}

	update := bson.M{
		"$set": bson.M{
			"starred":    false,
			"starred_at": time.Time{},
			"updated_at": time.Now().UTC(),
		},
	}

	coll := r.db.Collection(domain.CollectionFileEntityAudioAnnotation)

	res, err := coll.UpdateOne(ctx, filter, update)
	if err != nil {
		return false, fmt.Errorf("update operation failed: %w", err)
	}

	if res.MatchedCount == 0 {
		return false, errors.New("annotation not found")
	}

	var doc scene_audio_route_models.AnnotationMetadata
	if err := coll.FindOne(ctx, filter).Decode(&doc); err != nil {
		return false, fmt.Errorf("fetch document failed: %w", err)
	}

	return true, nil
}

func (r *annotationRepository) UpdateRating(
	ctx context.Context,
	itemId, itemType string,
	rating int,
) (bool, error) {
	filter, err := r.createFilter(itemId, itemType)
	if err != nil {
		return false, err
	}

	update := bson.M{
		"$set": bson.M{
			"rating":     rating,
			"updated_at": time.Now().UTC(),
		},
		"$setOnInsert": bson.M{
			"created_at": time.Now().UTC(),
			"starred":    false,
			"play_count": 0,
		},
	}

	opts := options.Update().SetUpsert(true)
	coll := r.db.Collection(domain.CollectionFileEntityAudioAnnotation)

	res, err := coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return false, fmt.Errorf("update operation failed: %w", err)
	}

	var doc scene_audio_route_models.AnnotationMetadata
	if res.UpsertedID != nil {
		filter = bson.M{"_id": res.UpsertedID}
	}

	if err := coll.FindOne(ctx, filter).Decode(&doc); err != nil {
		return false, fmt.Errorf("fetch document failed: %w", err)
	}

	return true, nil
}

func (r *annotationRepository) UpdateScrobble(
	ctx context.Context,
	itemId, itemType string,
) (bool, error) {
	filter, err := r.createFilter(itemId, itemType)
	if err != nil {
		return false, err
	}

	update := bson.M{
		"$inc": bson.M{"play_count": 1},
		"$set": bson.M{
			"play_date":  time.Now().UTC(),
			"updated_at": time.Now().UTC(),
		},
		"$setOnInsert": bson.M{
			"created_at": time.Now().UTC(),
			"starred":    false,
			"rating":     0,
		},
	}

	opts := options.Update().SetUpsert(true)
	coll := r.db.Collection(domain.CollectionFileEntityAudioAnnotation)

	res, err := coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return false, fmt.Errorf("update operation failed: %w", err)
	}

	var doc scene_audio_route_models.AnnotationMetadata
	if res.UpsertedID != nil {
		filter = bson.M{"_id": res.UpsertedID}
	}

	if err := coll.FindOne(ctx, filter).Decode(&doc); err != nil {
		return false, fmt.Errorf("fetch document failed: %w", err)
	}

	return true, nil
}

// endregion
