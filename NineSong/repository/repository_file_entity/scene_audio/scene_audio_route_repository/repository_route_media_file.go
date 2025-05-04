// scene_audio_route_repository/mediafile_repository.go
package scene_audio_route_repository

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
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
	collection := r.db.Collection(r.collection)

	filter := bson.M{}
	if artistId != "" {
		filter["artist_id"] = artistId
	}
	if albumId != "" {
		filter["album_id"] = albumId
	}
	if year != "" {
		if yearInt, err := strconv.Atoi(year); err == nil {
			filter["year"] = yearInt
		}
	}
	if search != "" {
		filter["$or"] = []bson.M{
			{"title": bson.M{"$regex": search, "$options": "i"}},
			{"artist": bson.M{"$regex": search, "$options": "i"}},
			{"album": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	if starred != "" {
		isStarred, err := strconv.ParseBool(starred)
		if err != nil {
			return nil, fmt.Errorf("invalid starred parameter: %w", err)
		}
		filter["starred"] = isStarred
	}

	skip, _ := strconv.Atoi(start)
	limit, _ := strconv.Atoi(end)

	validSortFields := map[string]bool{
		// 播放相关
		"play_count": true, "play_date": true,
		// 用户互动
		"rating": true, "starred": true, "starred_at": true,
		// 核心元数据
		"title": true, "artist": true, "album": true, "year": true, "genre": true,
		// 技术属性
		"duration": true, "bit_rate": true, "size": true, "channels": true, "suffix": true,
		// 时间戳
		"created_at": true, "updated_at": true,
		// 关联ID
		"artist_id": true, "album_id": true, "album_artist_id": true,
		// 扩展属性
		"has_cover_art": true, "path": true,
	}
	if !validSortFields[sort] {
		sort = "title"
	}
	sortOrder := 1
	if order == "desc" {
		sortOrder = -1
	}
	opts := options.Find().
		SetSort(bson.D{{Key: sort, Value: sortOrder}}).
		SetSkip(int64(skip)).
		SetLimit(int64(limit))

	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, fmt.Errorf("database query failed: %w", err)
	}
	defer func(cursor mongo.Cursor, ctx context.Context) {
		err := cursor.Close(ctx)
		if err != nil {
			fmt.Printf("error closing cursor: %v\n", err)
		}
	}(cursor, ctx)

	var results []scene_audio_route_models.MediaFileMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	return results, nil
}
