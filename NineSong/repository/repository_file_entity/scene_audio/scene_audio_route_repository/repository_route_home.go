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

type homeRepository struct {
	db mongo.Database
}

func NewHomeRepository(db mongo.Database) scene_audio_route_interface.HomeRepository {
	return &homeRepository{db: db}
}

func (r *homeRepository) GetRandomArtistList(
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

func (r *homeRepository) GetRandomAlbumList(
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

func (r *homeRepository) GetRandomMediaFileList(
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
