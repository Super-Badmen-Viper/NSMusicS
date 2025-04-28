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

func NewPlaylistTrackUsecase(repo scene_audio_route_interface.PlaylistTrackRepository, timeout time.Duration) *playlistTrackUsecase {
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

	if _, err := primitive.ObjectIDFromHex(playlistId); err != nil {
		return nil, errors.New("invalid playlist id format")
	}
	if _, err := strconv.Atoi(start); start != "" && err != nil {
		return nil, errors.New("invalid start parameter")
	}
	if _, err := strconv.Atoi(end); end != "" && err != nil {
		return nil, errors.New("invalid end parameter")
	}

	validSortFields := map[string]bool{"created_at": true, "play_order": true}
	if !validSortFields[sort] {
		sort = "created_at"
	}

	return uc.repo.GetPlaylistTrackItems(ctx, end, order, sort, start, search, starred, albumId, artistId, year, playlistId)
}
