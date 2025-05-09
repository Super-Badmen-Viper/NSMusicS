package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo/options"
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
