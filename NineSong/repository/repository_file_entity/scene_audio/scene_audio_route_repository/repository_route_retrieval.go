package scene_audio_route_repository

import (
	"context"
	"errors"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type retrievalRepository struct {
	db mongo.Database
}

func NewRetrievalRepository(db mongo.Database) scene_audio_route_interface.RetrievalRepository {
	return &retrievalRepository{db: db}
}

func (r *retrievalRepository) GetStream(ctx context.Context, mediaFileId string) (string, error) {
	objID, err := primitive.ObjectIDFromHex(mediaFileId)
	if err != nil {
		return "", errors.New("invalid media file id format")
	}

	collection := r.db.Collection("CollectionFileEntityAudioStream")
	var result scene_audio_route_models.RetrievalStreamMetadata
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&result)
	if err != nil {
		return "", fmt.Errorf("stream metadata not found: %w", err)
	}
	return result.Path, nil
}

func (r *retrievalRepository) GetCoverArt(ctx context.Context, coverArtId string) (string, error) {
	objID, err := primitive.ObjectIDFromHex(coverArtId)
	if err != nil {
		return "", errors.New("invalid cover art id format")
	}

	collection := r.db.Collection("CollectionFileEntityAudioCoverArt")
	var result scene_audio_route_models.RetrievalCoverArtMetadata
	err = collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&result)
	if err != nil {
		return "", fmt.Errorf("cover art metadata not found: %w", err)
	}
	return result.Path, nil
}

func (r *retrievalRepository) GetLyricsLrc(ctx context.Context, mediaFileId string) (string, error) {
	objID, err := primitive.ObjectIDFromHex(mediaFileId)
	if err != nil {
		return "", errors.New("invalid media file id format")
	}

	collection := r.db.Collection("CollectionFileEntityAudioLyrics")
	var result scene_audio_route_models.RetrievalLyricsMetadata
	err = collection.FindOne(ctx, bson.M{"media_file_id": objID}).Decode(&result)
	if err != nil {
		return "", fmt.Errorf("lyrics metadata not found: %w", err)
	}
	return result.Path, nil
}
