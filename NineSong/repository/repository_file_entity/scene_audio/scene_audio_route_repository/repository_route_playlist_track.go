// scene_audio_route_repository/playlist_track_repository.go
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

type playlistTrackRepository struct {
	db         mongo.Database
	collection string
}

func NewPlaylistTrackRepository(db mongo.Database, collection string) scene_audio_route_interface.PlaylistTrackRepository {
	return &playlistTrackRepository{
		db:         db,
		collection: collection,
	}
}

func (r *playlistTrackRepository) GetPlaylistTrackItems(
	ctx context.Context,
	end string, order string, sort string, start string, search string, starred string, albumId string, artistId string, year string,
	playlistId string) ([]scene_audio_route_models.PlaylistTrackMetadata, error) {

	collection := r.db.Collection(r.collection)

	filter := bson.M{"playlist_id": playlistId}

	if albumId != "" {
		filter["album_id"] = albumId
	}
	if artistId != "" {
		filter["artist_id"] = artistId
	}
	if search != "" {
		filter["$or"] = []bson.M{
			{"track_name": bson.M{"$regex": search, "$options": "i"}},
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
	if limit == 0 || limit > 100 {
		limit = 50
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
	defer cursor.Close(ctx)

	var results []scene_audio_route_models.PlaylistTrackMetadata
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("decode error: %w", err)
	}

	return results, nil
}
