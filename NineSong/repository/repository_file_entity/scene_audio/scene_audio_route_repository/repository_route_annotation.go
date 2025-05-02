package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo/options"
	"strconv"
	"strings"
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

const (
	maxPageSize     = 1000
	defaultPageSize = 50
)

func NewAnnotationRepository(db mongo.Database) scene_audio_route_interface.AnnotationRepository {
	return &annotationRepository{db: db}
}

// region 通用工具方法
func (r *annotationRepository) parsePagination(startStr, endStr string) (int64, int64, error) {
	start, err := strconv.ParseInt(startStr, 10, 64)
	if err != nil || start < 0 {
		return 0, 0, errors.New("invalid start parameter")
	}

	limit, err := strconv.ParseInt(endStr, 10, 64)
	if err != nil || limit <= 0 {
		limit = defaultPageSize
	}
	if limit > maxPageSize {
		limit = maxPageSize
	}

	return start, limit, nil
}

func escapeSortField(field string) string {
	return strings.ReplaceAll(field, ".", "·")
}

// endregion

// region 查询基础实现
func (r *annotationRepository) baseListQuery(
	ctx context.Context,
	itemType string,
	targetCollection string,
	start, end, sort, order string,
) ([]bson.M, error) {
	skip, limit, err := r.parsePagination(start, end)
	if err != nil {
		return nil, err
	}

	pipeline := []bson.M{
		{"$match": bson.M{"item_type": itemType}},
		{"$lookup": bson.M{
			"from":         targetCollection,
			"localField":   "item_id",
			"foreignField": "_id",
			"as":           "related_data",
		}},
		{"$unwind": "$related_data"},
		{"$replaceRoot": bson.M{"newRoot": "$related_data"}},
	}

	if sort != "" {
		sortOrder := 1
		if strings.ToLower(order) == "desc" {
			sortOrder = -1
		}
		pipeline = append(pipeline, bson.M{"$sort": bson.M{escapeSortField(sort): sortOrder}})
	}

	pipeline = append(pipeline,
		bson.M{"$skip": skip},
		bson.M{"$limit": limit},
	)

	coll := r.db.Collection(domain.CollectionFileEntityAudioAnnotation)
	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("query failed: %w", err)
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode failed: %w", err)
	}

	return results, nil
}

// endregion

func (r *annotationRepository) GetArtistList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	rawResults, err := r.baseListQuery(
		ctx,
		"artist",
		domain.CollectionFileEntityAudioArtist,
		start, end, sort, order,
	)
	if err != nil {
		return nil, err
	}

	results := make([]scene_audio_route_models.ArtistMetadata, 0, len(rawResults))
	for _, raw := range rawResults {
		var artist scene_audio_route_models.ArtistMetadata
		bsonBytes, _ := bson.Marshal(raw)
		if err := bson.Unmarshal(bsonBytes, &artist); err != nil {
			return nil, fmt.Errorf("artist data unmarshal failed: %w", err)
		}
		results = append(results, artist)
	}

	return results, nil
}

func (r *annotationRepository) GetRandomArtistList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	skip, limit, err := r.parsePagination(start, end)
	if err != nil {
		return nil, err
	}

	pipeline := []bson.M{
		{"$match": bson.M{"item_type": "artist"}},
		{"$sample": bson.M{"size": limit + skip}},
		{"$skip": skip},
		{"$limit": limit},
		{"$lookup": bson.M{
			"from":         domain.CollectionFileEntityAudioArtist,
			"localField":   "item_id",
			"foreignField": "_id",
			"as":           "related_data",
		}},
		{"$unwind": "$related_data"},
		{"$replaceRoot": bson.M{"newRoot": "$related_data"}},
	}

	coll := r.db.Collection(domain.CollectionFileEntityAudioAnnotation)
	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("random artist query failed: %w", err)
	}

	var results []scene_audio_route_models.ArtistMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode random artists failed: %w", err)
	}

	return results, nil
}

// endregion

func (r *annotationRepository) GetAlbumList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	rawResults, err := r.baseListQuery(
		ctx,
		"album",
		domain.CollectionFileEntityAudioAlbum,
		start, end, sort, order,
	)
	if err != nil {
		return nil, err
	}

	results := make([]scene_audio_route_models.AlbumMetadata, 0, len(rawResults))
	for _, raw := range rawResults {
		var album scene_audio_route_models.AlbumMetadata
		bsonBytes, _ := bson.Marshal(raw)
		if err := bson.Unmarshal(bsonBytes, &album); err != nil {
			return nil, fmt.Errorf("album data unmarshal failed: %w", err)
		}
		results = append(results, album)
	}

	return results, nil
}

func (r *annotationRepository) GetRandomAlbumList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	skip, limit, err := r.parsePagination(start, end)
	if err != nil {
		return nil, err
	}

	pipeline := []bson.M{
		{"$match": bson.M{"item_type": "album"}},
		{"$sample": bson.M{"size": limit + skip}},
		{"$skip": skip},
		{"$limit": limit},
		{"$lookup": bson.M{
			"from":         domain.CollectionFileEntityAudioAlbum,
			"localField":   "item_id",
			"foreignField": "_id",
			"as":           "related_data",
		}},
		{"$unwind": "$related_data"},
		{"$replaceRoot": bson.M{"newRoot": "$related_data"}},
	}

	coll := r.db.Collection(domain.CollectionFileEntityAudioAnnotation)
	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("random album query failed: %w", err)
	}

	var results []scene_audio_route_models.AlbumMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode random albums failed: %w", err)
	}

	return results, nil
}

// endregion

func (r *annotationRepository) GetMediaFileList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	rawResults, err := r.baseListQuery(
		ctx,
		"media",
		domain.CollectionFileEntityAudioMediaFile,
		start, end, sort, order,
	)
	if err != nil {
		return nil, err
	}

	results := make([]scene_audio_route_models.MediaFileMetadata, 0, len(rawResults))
	for _, raw := range rawResults {
		var media scene_audio_route_models.MediaFileMetadata
		bsonBytes, _ := bson.Marshal(raw)
		if err := bson.Unmarshal(bsonBytes, &media); err != nil {
			return nil, fmt.Errorf("media file unmarshal failed: %w", err)
		}
		results = append(results, media)
	}

	return results, nil
}

func (r *annotationRepository) GetRandomMediaFileList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	skip, limit, err := r.parsePagination(start, end)
	if err != nil {
		return nil, err
	}

	pipeline := []bson.M{
		{"$match": bson.M{"item_type": "media"}},
		{"$sample": bson.M{"size": limit + skip}},
		{"$skip": skip},
		{"$limit": limit},
		{"$lookup": bson.M{
			"from":         domain.CollectionFileEntityAudioMediaFile,
			"localField":   "item_id",
			"foreignField": "_id",
			"as":           "related_data",
		}},
		{"$unwind": "$related_data"},
		{"$replaceRoot": bson.M{"newRoot": "$related_data"}},
	}

	coll := r.db.Collection(domain.CollectionFileEntityAudioAnnotation)
	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("random media query failed: %w", err)
	}

	var results []scene_audio_route_models.MediaFileMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode random media failed: %w", err)
	}

	return results, nil
}

// endregion

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
