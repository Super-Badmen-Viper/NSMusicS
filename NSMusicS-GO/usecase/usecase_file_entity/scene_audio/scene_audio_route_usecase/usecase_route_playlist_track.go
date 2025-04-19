// scene_audio_route_usecase/playlist_track_usecase.go
package scene_audio_route_usecase

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type playlistTrackUsecase struct {
	repo    scene_audio_route_interface.PlaylistTrackRepository
	timeout time.Duration
}

func NewPlaylistTrackUsecase(repo scene_audio_route_interface.PlaylistTrackRepository, timeout time.Duration) scene_audio_route_interface.PlaylistTrackRepository {
	return &playlistTrackUsecase{
		repo:    repo,
		timeout: timeout,
	}
}

func (uc *playlistTrackUsecase) GetPlaylistTrackItems(
	ctx context.Context,
	end, order, sort, start, search, starred, albumId, artistId, year, playlistId string,
) ([]scene_audio_route_models.PlaylistTrackMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数验证链
	validations := []func() error{
		func() error {
			if _, err := primitive.ObjectIDFromHex(playlistId); err != nil {
				return errors.New("invalid playlist id format")
			}
			return nil
		},
		func() error {
			if _, err := strconv.Atoi(start); err != nil && start != "" {
				return errors.New("invalid start parameter")
			}
			if _, err := strconv.Atoi(end); err != nil && end != "" {
				return errors.New("invalid end parameter")
			}
			return nil
		},
	}

	for _, validate := range validations {
		if err := validate(); err != nil {
			return nil, err
		}
	}

	return uc.repo.GetPlaylistTrackItems(ctx, end, order, sort, start, search, starred, albumId, artistId, year, playlistId)
}
