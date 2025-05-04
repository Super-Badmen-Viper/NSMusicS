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

type albumRepository struct {
	db         mongo.Database
	collection string
}

func NewAlbumRepository(db mongo.Database, collection string) scene_audio_route_interface.AlbumRepository {
	return &albumRepository{
		db:         db,
		collection: collection,
	}
}

func (r *albumRepository) GetAlbumItems(
	ctx context.Context,
	end, order, sort, start, search, starred, artistId string,
	minYear, maxYear string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	collection := r.db.Collection(r.collection)

	filter := bson.M{}
	if minYear != "" {
		if year, err := strconv.Atoi(minYear); err == nil {
			filter["min_year"] = bson.M{"$gte": year}
		}
	}
	if maxYear != "" {
		if year, err := strconv.Atoi(maxYear); err == nil {
			filter["max_year"] = bson.M{"$lte": year}
		}
	}
	if artistId != "" {
		filter["artist_id"] = artistId
	}
	if search != "" {
		filter["$or"] = []bson.M{
			{"name": bson.M{"$regex": search, "$options": "i"}},
			{"artist": bson.M{"$regex": search, "$options": "i"}},
			{"album_artist": bson.M{"$regex": search, "$options": "i"}},
		}
	}
	if starred != "" {
		if isStarred, err := strconv.ParseBool(starred); err == nil {
			filter["starred"] = isStarred
		}
	}

	skip, _ := strconv.Atoi(start)
	limit, _ := strconv.Atoi(end)

	validSortFields := map[string]bool{
		"name": true, "song_count": true, "created_at": true,
		"play_count": true, "rating": true, "starred_at": true,
		"min_year": true, "max_year": true, "duration": true,
		"updated_at": true, "genre": true,
	}

	if !validSortFields[sort] {
		sort = "name"
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

	var results []scene_audio_route_models.AlbumMetadata
	if err = cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	return results, nil
}
