package scene_audio_route_repository

import (
	"context"
	"fmt"
	"strconv"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

type artistRepository struct {
	db         mongo.Database
	collection string
}

func NewArtistRepository(db mongo.Database, collection string) scene_audio_route_interface.ArtistRepository {
	return &artistRepository{
		db:         db,
		collection: collection,
	}
}

func (r *artistRepository) GetArtistItems(
	ctx context.Context,
	end, order, sort, start, search, starred string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	coll := r.db.Collection(r.collection)

	pipeline := []bson.D{
		{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: domain.CollectionFileEntityAudioAnnotation},
				{Key: "let", Value: bson.D{{Key: "artistId", Value: "$_id"}}},
				{Key: "pipeline", Value: []bson.D{
					{
						{Key: "$match", Value: bson.D{
							{Key: "$expr", Value: bson.D{
								{Key: "$and", Value: bson.A{
									bson.D{{Key: "$eq", Value: bson.A{"$item_id", "$$artistId"}}},
									bson.D{{Key: "$eq", Value: bson.A{"$item_type", "artist"}}},
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

	// 添加过滤条件
	if match := buildArtistMatch(search, starred); len(match) > 0 {
		pipeline = append(pipeline, bson.D{{Key: "$match", Value: match}})
	}

	// 处理特殊排序
	validatedSort := validateArtistSortField(sort)
	if validatedSort == "play_date" {
		pipeline = append(pipeline, bson.D{
			{Key: "$match", Value: bson.D{
				{Key: "play_count", Value: bson.D{{Key: "$gt", Value: 0}}},
			}},
		})
	}

	// 添加排序阶段
	pipeline = append(pipeline, buildArtistSortStage(validatedSort, order))

	// 分页处理
	pipeline = append(pipeline, buildArtistPaginationStage(start, end)...)

	cursor, err := coll.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, fmt.Errorf("database query failed: %w", err)
	}
	defer func(cursor mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			fmt.Printf("error closing cursor: %v\n", err)
		}
	}(cursor, ctx)

	var results []scene_audio_route_models.ArtistMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	return results, nil
}

func (r *artistRepository) GetArtistFilterItemsCount(
	ctx context.Context,
	search, starred string,
) (*scene_audio_route_models.ArtistFilterCounts, error) {
	coll := r.db.Collection(r.collection)

	pipeline := []bson.D{
		{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: domain.CollectionFileEntityAudioAnnotation},
				{Key: "let", Value: bson.D{{Key: "artistId", Value: "$_id"}}},
				{Key: "pipeline", Value: []bson.D{
					{
						{Key: "$match", Value: bson.D{
							{Key: "$expr", Value: bson.D{
								{Key: "$and", Value: bson.A{
									bson.D{{Key: "$eq", Value: bson.A{"$item_id", "$$artistId"}}},
									bson.D{{Key: "$eq", Value: bson.A{"$item_type", "artist"}}},
								}},
							}},
						}},
					},
				}},
				{Key: "as", Value: "annotations"},
			}},
		},
		{
			{Key: "$match", Value: buildArtistBaseMatch(search, starred)},
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
	defer func(cursor mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			fmt.Printf("error closing cursor: %v\n", err)
		}
	}(cursor, ctx)

	var result []struct {
		Total      []map[string]int `bson:"total"`
		Starred    []map[string]int `bson:"starred"`
		RecentPlay []map[string]int `bson:"recent_play"`
	}

	if err := cursor.All(ctx, &result); err != nil {
		return nil, fmt.Errorf("decode count error: %w", err)
	}

	counts := &scene_audio_route_models.ArtistFilterCounts{}
	if len(result) > 0 {
		counts.Total = extractCount(result[0].Total)
		counts.Starred = extractCount(result[0].Starred)
		counts.RecentPlay = extractCount(result[0].RecentPlay)
	}

	return counts, nil
}

// Helper functions
func buildArtistMatch(search, starred string) bson.D {
	filter := bson.D{}

	if search != "" {
		filter = append(filter, bson.E{
			Key: "name",
			Value: bson.D{
				{Key: "$regex", Value: search},
				{Key: "$options", Value: "i"},
			},
		})
	}

	if starred != "" {
		if isStarred, err := strconv.ParseBool(starred); err == nil {
			filter = append(filter, bson.E{Key: "starred", Value: isStarred})
		}
	}

	return filter
}

func buildArtistBaseMatch(search, starred string) bson.D {
	return buildArtistMatch(search, starred)
}

func validateArtistSortField(sort string) string {
	validSortFields := map[string]bool{
		"name":        true,
		"album_count": true, "song_count": true,
		"play_count": true, "play_date": true,
		"rating":     true,
		"starred_at": true,
		"size":       true,
		"created_at": true, "updated_at": true,
	}
	if validSortFields[sort] {
		return sort
	}
	return "_id"
}

func buildArtistSortStage(sort, order string) bson.D {
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

func buildArtistPaginationStage(start, end string) []bson.D {
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
