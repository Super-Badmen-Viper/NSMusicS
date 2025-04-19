package scene_audio_db_repository

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_db/scene_audio_db_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"strings"
)

type artistRepository struct {
	db         mongo.Database
	collection string
}

func NewArtistRepository(db mongo.Database, collection string) scene_audio_db_interface.ArtistRepository {
	return &artistRepository{
		db:         db,
		collection: collection,
	}
}

func (r *artistRepository) Upsert(ctx context.Context, artist *scene_audio_db_models.ArtistMetadata) error {
	coll := r.db.Collection(r.collection)
	filter := bson.M{"_id": artist.ID}
	update := bson.M{"$set": artist}

	opts := options.Update().SetUpsert(true)
	_, err := coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return fmt.Errorf("artist upsert failed: %w", err)
	}
	return nil
}

func (r *artistRepository) BulkUpsert(ctx context.Context, artists []*scene_audio_db_models.ArtistMetadata) (int, error) {
	coll := r.db.Collection(r.collection)

	var successCount int
	for _, artist := range artists {
		filter := bson.M{"_id": artist.ID}
		update := bson.M{"$set": artist}

		_, err := coll.UpdateOne(
			ctx,
			filter,
			update,
			options.Update().SetUpsert(true),
		)

		if err != nil {
			return successCount, fmt.Errorf("bulk upsert failed at index %d: %w", successCount, err)
		}
		successCount++
	}
	return successCount, nil
}

func (r *artistRepository) DeleteByID(ctx context.Context, id primitive.ObjectID) error {
	coll := r.db.Collection(r.collection)
	_, err := coll.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("artist delete by ID failed: %w", err)
	}
	return nil
}

func (r *artistRepository) DeleteByName(ctx context.Context, name string) error {
	coll := r.db.Collection(r.collection)
	_, err := coll.DeleteOne(ctx, bson.M{"name": name})
	if err != nil {
		return fmt.Errorf("artist delete by name failed: %w", err)
	}
	return nil
}

func (r *artistRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*scene_audio_db_models.ArtistMetadata, error) {
	coll := r.db.Collection(r.collection)
	result := coll.FindOne(ctx, bson.M{"_id": id})

	var artist scene_audio_db_models.ArtistMetadata
	if err := result.Decode(&artist); err != nil {
		if strings.Contains(err.Error(), "no documents in result") {
			return nil, nil
		}
		return nil, fmt.Errorf("get artist by ID failed: %w", err)
	}
	return &artist, nil
}

func (r *artistRepository) GetByName(ctx context.Context, name string) (*scene_audio_db_models.ArtistMetadata, error) {
	coll := r.db.Collection(r.collection)
	result := coll.FindOne(ctx, bson.M{"name": name})

	var artist scene_audio_db_models.ArtistMetadata
	if err := result.Decode(&artist); err != nil {
		if strings.Contains(err.Error(), "no documents in result") {
			return nil, nil
		}
		return nil, fmt.Errorf("get artist by name failed: %w", err)
	}
	return &artist, nil
}

func (r *artistRepository) UpdateAlbumCount(
	ctx context.Context,
	artistID primitive.ObjectID,
	increment int,
) (int64, error) {
	coll := r.db.Collection(r.collection)

	result, err := coll.UpdateByID(
		ctx,
		artistID,
		bson.M{
			"$inc": bson.M{"album_count": increment},
		},
	)

	if err != nil {
		return 0, fmt.Errorf("专辑计数更新失败: %w", err)
	}

	return result.ModifiedCount, nil
}

func (r *artistRepository) GetByMBID(ctx context.Context, mbzID string) (*scene_audio_db_models.ArtistMetadata, error) {
	coll := r.db.Collection(r.collection)
	result := coll.FindOne(ctx, bson.M{"mbz_artist_id": mbzID})

	var artist scene_audio_db_models.ArtistMetadata
	if err := result.Decode(&artist); err != nil {
		return nil, fmt.Errorf("通过MBID获取艺术家失败: %w", err)
	}
	return &artist, nil
}
