// scene_audio_route_usecase/playlist_track_usecase.go
package scene_audio_route_usecase

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"
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
) ([]scene_audio_route_models.MediaFileMetadata, error) {
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

func (uc *playlistTrackUsecase) AddPlaylistTrackItems(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	success, err := uc.repo.AddPlaylistTrackItems(ctx, playlistId, mediaFileIds)
	if err != nil && !success { // 完全失败时返回错误
		return false, fmt.Errorf("operation failed: %w", err)
	}

	return success, nil // 部分成功视为成功
}

func (uc *playlistTrackUsecase) RemovePlaylistTrackItems(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	if _, err := primitive.ObjectIDFromHex(playlistId); err != nil {
		return false, errors.New("invalid playlist id format")
	}
	if strings.TrimSpace(mediaFileIds) == "" {
		return false, errors.New("empty media file list")
	}

	return uc.repo.RemovePlaylistTrackItems(ctx, playlistId, mediaFileIds)
}

func (uc *playlistTrackUsecase) SortPlaylistTrackItems(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	if _, err := primitive.ObjectIDFromHex(playlistId); err != nil {
		return false, errors.New("invalid playlist id format")
	}
	if strings.TrimSpace(mediaFileIds) == "" {
		return false, errors.New("empty media file list")
	}

	return uc.repo.SortPlaylistTrackItems(ctx, playlistId, mediaFileIds)
}
