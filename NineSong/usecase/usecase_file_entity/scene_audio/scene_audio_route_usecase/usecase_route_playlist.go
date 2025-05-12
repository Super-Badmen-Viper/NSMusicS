package scene_audio_route_usecase

import (
	"context"
	"errors"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"strings"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type playlistUsecase struct {
	repo    scene_audio_route_interface.PlaylistRepository
	timeout time.Duration
}

func NewPlaylistUsecase(repo scene_audio_route_interface.PlaylistRepository, timeout time.Duration) scene_audio_route_interface.PlaylistRepository {
	return &playlistUsecase{
		repo:    repo,
		timeout: timeout,
	}
}

func (uc *playlistUsecase) GetPlaylistsAll(ctx context.Context) ([]scene_audio_route_models.PlaylistMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	playlists, err := uc.repo.GetPlaylistsAll(ctx)
	if err != nil {
		return nil, domain.WrapDomainError(err, "failed to fetch playlists")
	}

	return playlists, nil
}

func (uc *playlistUsecase) GetPlaylist(ctx context.Context, playlistId string) (*scene_audio_route_models.PlaylistMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// ID格式验证（符合网页5的输入校验原则）
	if _, err := primitive.ObjectIDFromHex(playlistId); err != nil {
		return nil, errors.New("invalid playlist id format")
	}

	playlist, err := uc.repo.GetPlaylist(ctx, playlistId)
	if err != nil {
		return nil, domain.WrapDomainError(err, "playlist not found")
	}

	return playlist, nil
}

func (uc *playlistUsecase) CreatePlaylist(
	ctx context.Context,
	playlist scene_audio_route_models.PlaylistMetadata,
) (*scene_audio_route_models.PlaylistMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数校验（符合网页6的输入验证策略）
	if strings.TrimSpace(playlist.Name) == "" {
		return nil, errors.New("playlist name cannot be empty")
	}

	// 业务规则：名称长度限制（参考网页9的验证实践）
	if len(playlist.Name) > 100 {
		return nil, errors.New("playlist name exceeds maximum length")
	}

	created, err := uc.repo.CreatePlaylist(ctx, playlist)
	if err != nil {
		return nil, domain.WrapDomainError(err, "failed to create playlist")
	}
	return created, nil
}

func (uc *playlistUsecase) DeletePlaylist(ctx context.Context, playlistId string) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// ID格式验证
	if _, err := primitive.ObjectIDFromHex(playlistId); err != nil {
		return false, errors.New("invalid playlist id format")
	}

	// 获取当前播放列表状态，检测是否可删除
	_, err := uc.repo.GetPlaylist(ctx, playlistId)
	if err != nil {
		return false, domain.WrapDomainError(err, "failed to fetch playlist")
	}

	// 执行删除操作
	success, err := uc.repo.DeletePlaylist(ctx, playlistId)
	if err != nil || !success {
		return false, domain.WrapDomainError(err, "delete operation failed")
	}
	return true, nil
}

func (uc *playlistUsecase) UpdatePlaylistInfo(
	ctx context.Context,
	playlistId string,
	playlist scene_audio_route_models.PlaylistMetadata,
) (*scene_audio_route_models.PlaylistMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数校验
	if _, err := primitive.ObjectIDFromHex(playlistId); err != nil {
		return nil, errors.New("invalid playlist id format")
	}
	if strings.TrimSpace(playlist.Name) == "" {
		return nil, errors.New("playlist name cannot be empty")
	}

	// 保留原始所有权（符合网页4的数据一致性原则）
	_, err := uc.repo.GetPlaylist(ctx, playlistId)
	if err != nil {
		return nil, domain.WrapDomainError(err, "playlist not found")
	}

	// 执行更新并获取最新数据
	updated, err := uc.repo.UpdatePlaylistInfo(ctx, playlistId, playlist)
	if err != nil {
		return nil, domain.WrapDomainError(err, "update failed")
	}

	return updated, nil
}
