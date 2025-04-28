package scene_audio_route_usecase

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type AlbumUsecase struct {
	repo    scene_audio_route_interface.AlbumRepository
	timeout time.Duration
}

func NewAlbumUsecase(repo scene_audio_route_interface.AlbumRepository, timeout time.Duration) *AlbumUsecase {
	return &AlbumUsecase{
		repo:    repo,
		timeout: timeout,
	}
}

func (uc *AlbumUsecase) GetAlbumItems(
	ctx context.Context,
	end, order, sort, start, search, starred, artistId string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	if _, err := strconv.Atoi(start); start != "" && err != nil {
		return nil, errors.New("invalid start parameter")
	}

	if _, err := strconv.Atoi(end); end != "" && err != nil {
		return nil, errors.New("invalid end parameter")
	}

	if artistId != "" {
		if _, err := primitive.ObjectIDFromHex(artistId); err != nil {
			return nil, errors.New("invalid artist id format")
		}
	}

	validSortFields := map[string]bool{"name": true, "song_count": true, "created_at": true}
	if !validSortFields[sort] {
		sort = "name"
	}

	return uc.repo.GetAlbumItems(ctx, end, order, sort, start, search, starred, artistId)
}
