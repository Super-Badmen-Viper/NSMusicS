package scene_audio_route_usecase

import (
	"context"
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type retrievalUsecase struct {
	repo    scene_audio_route_interface.RetrievalRepository
	timeout time.Duration
}

func NewRetrievalUsecase(repo scene_audio_route_interface.RetrievalRepository, timeout time.Duration) scene_audio_route_interface.RetrievalRepository {
	return &retrievalUsecase{
		repo:    repo,
		timeout: timeout,
	}
}

func (uc *retrievalUsecase) GetStream(ctx context.Context, mediaFileId string) (string, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	if _, err := primitive.ObjectIDFromHex(mediaFileId); err != nil {
		return "", errors.New("invalid media file id format")
	}
	return uc.repo.GetStream(ctx, mediaFileId)
}

func (uc *retrievalUsecase) GetCoverArt(ctx context.Context, coverArtId string) (string, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	if _, err := primitive.ObjectIDFromHex(coverArtId); err != nil {
		return "", errors.New("invalid cover art id format")
	}
	return uc.repo.GetCoverArt(ctx, coverArtId)
}

func (uc *retrievalUsecase) GetLyricsLrc(ctx context.Context, mediaFileId string) (string, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	if _, err := primitive.ObjectIDFromHex(mediaFileId); err != nil {
		return "", errors.New("invalid media file id format")
	}
	return uc.repo.GetLyricsLrc(ctx, mediaFileId)
}
