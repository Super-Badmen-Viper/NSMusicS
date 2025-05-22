package scene_audio_route_usecase

import (
	"context"
	"errors"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"strconv"
	"strings"
	"time"
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
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数验证
	if err := validateObjectID("playlistId", playlistId); err != nil {
		return nil, err
	}

	if _, err := strconv.Atoi(start); start != "" && err != nil {
		return nil, errors.New("invalid start parameter")
	}

	if _, err := strconv.Atoi(end); end != "" && err != nil {
		return nil, errors.New("invalid end parameter")
	}

	if albumId != "" {
		if err := validateObjectID("albumId", albumId); err != nil {
			return nil, err
		}
	}

	if artistId != "" {
		if err := validateObjectID("artistId", artistId); err != nil {
			return nil, err
		}
	}

	if year != "" {
		if _, err := strconv.Atoi(year); err != nil {
			return nil, errors.New("invalid year format")
		}
	}

	if starred != "" {
		if _, err := strconv.ParseBool(starred); err != nil {
			return nil, errors.New("invalid starred value")
		}
	}

	validSortFields := map[string]bool{
		"title":  true,
		"artist": true, "album": true,
		"year":       true,
		"rating":     true,
		"starred_at": true,
		"genre":      true,
		"play_count": true, "play_date": true,
		"duration": true, "bit_rate": true, "size": true,
		"created_at": true, "updated_at": true,
	}
	if !validSortFields[sort] {
		sort = "_id"
	}

	// 验证排序方向
	if order != "asc" && order != "desc" {
		order = "asc"
	}

	return uc.repo.GetPlaylistTrackItems(ctx, end, order, sort, start, search, starred, albumId, artistId, year, playlistId)
}

func (uc *playlistTrackUsecase) GetPlaylistTrackFilterItemsCount(
	ctx context.Context,
	search, albumId, artistId, year string,
) (*scene_audio_route_models.MediaFileFilterCounts, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数验证
	if albumId != "" {
		if err := validateObjectID("albumId", albumId); err != nil {
			return nil, err
		}
	}

	if artistId != "" {
		if err := validateObjectID("artistId", artistId); err != nil {
			return nil, err
		}
	}

	if year != "" {
		if _, err := strconv.Atoi(year); err != nil {
			return nil, errors.New("invalid year format")
		}
	}

	return uc.repo.GetPlaylistTrackFilterItemsCount(ctx, search, albumId, artistId, year)
}

func (uc *playlistTrackUsecase) AddPlaylistTrackItems(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数验证
	if err := validateObjectID("playlistId", playlistId); err != nil {
		return false, err
	}

	if mediaFileIds == "" {
		return false, errors.New("empty media file ids")
	}

	// 验证媒体文件ID列表
	ids := strings.Split(mediaFileIds, ",")
	for _, id := range ids {
		if err := validateObjectID("mediaFileId", strings.TrimSpace(id)); err != nil {
			return false, err
		}
	}

	return uc.repo.AddPlaylistTrackItems(ctx, playlistId, mediaFileIds)
}

func (uc *playlistTrackUsecase) RemovePlaylistTrackItems(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数验证
	if err := validateObjectID("playlistId", playlistId); err != nil {
		return false, err
	}

	if mediaFileIds == "" {
		return false, errors.New("empty media file ids")
	}

	// 验证媒体文件ID列表
	ids := strings.Split(mediaFileIds, ",")
	for _, id := range ids {
		if err := validateObjectID("mediaFileId", strings.TrimSpace(id)); err != nil {
			return false, err
		}
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

	// 参数验证
	if err := validateObjectID("playlistId", playlistId); err != nil {
		return false, err
	}

	if mediaFileIds == "" {
		return false, errors.New("empty media file ids")
	}

	// 验证媒体文件ID列表
	ids := strings.Split(mediaFileIds, ",")
	for _, id := range ids {
		if err := validateObjectID("mediaFileId", strings.TrimSpace(id)); err != nil {
			return false, err
		}
	}

	return uc.repo.SortPlaylistTrackItems(ctx, playlistId, mediaFileIds)
}

func validateObjectID(field, value string) error {
	if _, err := primitive.ObjectIDFromHex(value); err != nil {
		return fmt.Errorf("invalid %s format", field)
	}
	return nil
}
