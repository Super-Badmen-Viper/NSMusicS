package scene_audio_route_repository

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"strconv"
)

type mediaFileRepository struct {
	db         mongo.Database
	collection string
}

func NewMediaFileRepository(db mongo.Database, collection string) scene_audio_route_interface.MediaFileRepository {
	return &mediaFileRepository{
		db:         db,
		collection: collection,
	}
}

func (r *mediaFileRepository) GetMediaFileItems(
	ctx context.Context,
	end, order, sort, start, search, starred, albumId, artistId, year string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {

	coll := r.db.Collection(r.collection)

	// 构建聚合管道（完全使用bson.D结构）
	pipeline := []bson.D{
		{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: domain.CollectionFileEntityAudioAnnotation},
				{Key: "let", Value: bson.D{{Key: "mediaId", Value: "$_id"}}},
				{Key: "pipeline", Value: []bson.D{
					{
						{Key: "$match", Value: bson.D{
							{Key: "$expr", Value: bson.D{
								{Key: "$and", Value: bson.A{
									bson.D{{Key: "$eq", Value: bson.A{"$item_id", "$$mediaId"}}},
									bson.D{{Key: "$eq", Value: bson.A{"$item_type", "media"}}},
								}},
							}},
						}},
					},
				}},
				{Key: "as", Value: "annotations"},
			}},
		},
		{
			{Key: "$unwind", Value: bson.D{
				{Key: "path", Value: "$annotations"},
				{Key: "preserveNullAndEmptyArrays", Value: true},
			}},
		},
		{
			{Key: "$addFields", Value: bson.D{
				{Key: "play_count", Value: "$annotations.play_count"},
				{Key: "play_date", Value: "$annotations.play_date"},
				{Key: "rating", Value: "$annotations.rating"},
				{Key: "starred", Value: "$annotations.starred"},
				{Key: "starred_at", Value: "$annotations.starred_at"},
			}},
		},
	}

	// 添加基础过滤条件
	if match := buildMatchStage(search, starred, albumId, artistId, year); len(match) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$match", Value: match}})
	}

	// 处理play_date排序的特殊过滤
	validatedSort := validateSortField(sort)
	if validatedSort == "play_date" {
		pipeline = append(pipeline, bson.D{
			{Key: "$match", Value: bson.D{
				{Key: "play_count", Value: bson.D{{Key: "$gt", Value: 0}}},
			}},
		})
	}

	// 添加排序阶段
	pipeline = append(pipeline, buildSortStage(validatedSort, order))

	// 添加分页阶段
	pipeline = append(pipeline, buildMediaPaginationStage(start, end)...)

	// 执行聚合查询
	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("database query failed: %w", err)
	}
	defer func() {
		if cerr := cursor.Close(ctx); cerr != nil {
			fmt.Printf("cursor close error: %v\n", cerr)
		}
	}()

	var results []scene_audio_route_models.MediaFileMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	return results, nil
}

func (r *mediaFileRepository) GetMediaFileFilterItemsCount(
	ctx context.Context,
	search, starred, albumId, artistId, year string,
) (*scene_audio_route_models.MediaFileFilterCounts, error) {
	coll := r.db.Collection(r.collection)

	pipeline := []bson.D{
		{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: domain.CollectionFileEntityAudioAnnotation},
				{Key: "let", Value: bson.D{{Key: "mediaId", Value: "$_id"}}},
				{Key: "pipeline", Value: []bson.D{
					{
						{Key: "$match", Value: bson.D{
							{Key: "$expr", Value: bson.D{
								{Key: "$and", Value: bson.A{
									bson.D{{Key: "$eq", Value: bson.A{"$item_id", "$$mediaId"}}},
									bson.D{{Key: "$eq", Value: bson.A{"$item_type", "media"}}},
								}},
							}},
						}},
					},
				}},
				{Key: "as", Value: "annotations"},
			}},
		},
		{
			{Key: "$match", Value: buildBaseMatch(search, albumId, artistId, year)},
		},
		{
			{Key: "$facet", Value: bson.D{
				{Key: "total", Value: []bson.D{
					{{Key: "$count", Value: "count"}},
				}},
				{Key: "starred", Value: []bson.D{
					{{Key: "$match", Value: bson.D{
						{Key: "annotations.starred", Value: true},
					}}},
					{{Key: "$count", Value: "count"}},
				}},
				{Key: "recent_play", Value: []bson.D{
					{{Key: "$match", Value: bson.D{
						{Key: "annotations.play_count", Value: bson.D{
							{Key: "$gt", Value: 0},
						}},
					}}},
					{{Key: "$count", Value: "count"}},
				}},
			}},
		},
	}

	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("count query failed: %w", err)
	}
	defer func() {
		if cerr := cursor.Close(ctx); cerr != nil {
			fmt.Printf("cursor close error: %v\n", cerr)
		}
	}()

	var result []struct {
		Total      []map[string]int `bson:"total"`
		Starred    []map[string]int `bson:"starred"`
		RecentPlay []map[string]int `bson:"recent_play"`
	}

	if err := cursor.All(ctx, &result); err != nil {
		return nil, fmt.Errorf("decode count error: %w", err)
	}

	counts := &scene_audio_route_models.MediaFileFilterCounts{}
	if len(result) > 0 {
		counts.Total = extractCount(result[0].Total)
		counts.Starred = extractCount(result[0].Starred)
		counts.RecentPlay = extractCount(result[0].RecentPlay)
	}
	return counts, nil
}

// Helper functions
func extractCount(data []map[string]int) int {
	if len(data) > 0 {
		return data[0]["count"]
	}
	return 0
}

func validateSortField(sort string) string {
	validSortFields := map[string]bool{
		"title":  true,
		"artist": true, "album": true,
		"year":       true,
		"rating":     true,
		"starred_at": true,
		"genre":      true,
		"play_count": true, "play_date": true,
		"duration": true, "bit_rate": true, "size": true,
		"created_at": true, "updated_at": true,
	}
	if validSortFields[sort] {
		return sort
	}
	return "_id"
}

func buildMatchStage(search, starred, albumId, artistId, year string) bson.D {
	filter := bson.D{}

	if artistId != "" {
		filter = append(filter, bson.E{Key: "artist_id", Value: artistId})
	}
	if albumId != "" {
		filter = append(filter, bson.E{Key: "album_id", Value: albumId})
	}
	if year != "" {
		if yearInt, err := strconv.Atoi(year); err == nil {
			filter = append(filter, bson.E{Key: "year", Value: yearInt})
		}
	}
	if search != "" {
		filter = append(filter, bson.E{Key: "$or", Value: []bson.D{
			{{Key: "title", Value: bson.D{{Key: "$regex", Value: search}, {Key: "$options", Value: "i"}}}},
			{{Key: "artist", Value: bson.D{{Key: "$regex", Value: search}, {Key: "$options", Value: "i"}}}},
			{{Key: "album", Value: bson.D{{Key: "$regex", Value: search}, {Key: "$options", Value: "i"}}}},
		}})
	}
	if starred != "" {
		if isStarred, err := strconv.ParseBool(starred); err == nil {
			filter = append(filter, bson.E{Key: "starred", Value: isStarred})
		}
	}

	return filter
}

func buildBaseMatch(search, albumId, artistId, year string) bson.D {
	return buildMatchStage(search, "", albumId, artistId, year)
}

func buildSortStage(sort, order string) bson.D {
	sortOrder := 1
	if order == "desc" {
		sortOrder = -1
	}
	return bson.D{
		{Key: "$sort", Value: bson.D{
			{Key: sort, Value: sortOrder},
		}},
	}
}

func buildMediaPaginationStage(start, end string) []bson.D {
	var stages []bson.D

	startInt, err := strconv.Atoi(start)
	endInt, err := strconv.Atoi(end)
	if err != nil {
		return stages
	}

	skip := startInt
	limit := endInt - startInt

	if skip > 0 {
		stages = append(stages, bson.D{{Key: "$skip", Value: skip}})
	}
	if limit > 0 {
		stages = append(stages, bson.D{{Key: "$limit", Value: limit}})
	}

	return stages
}
