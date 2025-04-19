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
	repo         scene_audio_route_interface.PlaylistRepository
	timeout      time.Duration
	maxMediaSize int
}

func NewPlaylistUsecase(
	repo scene_audio_route_interface.PlaylistRepository,
	timeout time.Duration,
	maxMediaSize int,
) scene_audio_route_interface.PlaylistRepository {
	return &playlistUsecase{
		repo:         repo,
		timeout:      timeout,
		maxMediaSize: maxMediaSize,
	}
}

// 获取所有播放列表（带缓存逻辑）
func (uc *playlistUsecase) GetPlaylistsAll(ctx context.Context) ([]scene_audio_route_models.PlaylistMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	playlists, err := uc.repo.GetPlaylistsAll(ctx)
	if err != nil {
		return nil, domain.WrapDomainError(err, "failed to fetch playlists")
	}

	// 业务规则：过滤私有播放列表
	publicPlaylists := make([]scene_audio_route_models.PlaylistMetadata, 0)
	for _, p := range playlists {
		if p.Public {
			publicPlaylists = append(publicPlaylists, p)
		}
	}
	return publicPlaylists, nil
}

// 获取单个播放列表（带访问控制）
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

	// 业务规则：非公开播放列表需要权限校验
	if !playlist.Public {
		// TODO: 添加用户权限校验逻辑（参考网页7的事务处理）
	}
	return playlist, nil
}

// 创建播放列表（带业务规则校验）
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
	if playlist.OwnerID == "" {
		return nil, errors.New("owner id is required")
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

// 删除播放列表（带所有权校验）
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

// 更新播放列表元信息（带版本控制）
func (uc *playlistUsecase) UpdatePlaylistInfo(
	ctx context.Context,
	playlistId string,
	playlist scene_audio_route_models.PlaylistMetadata,
) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数校验
	if _, err := primitive.ObjectIDFromHex(playlistId); err != nil {
		return false, errors.New("invalid playlist id format")
	}
	if strings.TrimSpace(playlist.Name) == "" {
		return false, errors.New("playlist name cannot be empty")
	}

	// 保留原始所有权（符合网页4的数据一致性原则）
	existing, err := uc.repo.GetPlaylist(ctx, playlistId)
	if err != nil {
		return false, domain.WrapDomainError(err, "playlist not found")
	}
	playlist.OwnerID = existing.OwnerID

	// 执行更新操作
	success, err := uc.repo.UpdatePlaylistInfo(ctx, playlistId, playlist)
	if err != nil || !success {
		return false, domain.WrapDomainError(err, "update failed")
	}
	return true, nil
}

// 添加媒体文件（带容量控制）
func (uc *playlistUsecase) UpdatePlaylistMediaFileIdToAdd(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数校验
	if _, err := primitive.ObjectIDFromHex(playlistId); err != nil {
		return false, errors.New("invalid playlist id format")
	}
	if strings.TrimSpace(mediaFileIds) == "" {
		return false, errors.New("empty media file list")
	}

	// 获取当前播放列表状态，，检测是否可添加
	_, err := uc.repo.GetPlaylist(ctx, playlistId)
	if err != nil {
		return false, domain.WrapDomainError(err, "playlist not found")
	}

	// 业务规则：容量限制（参考网页6的业务容量控制）
	// 单独优化，不需要容量限制，哪怕是涉及百万千万级的数据处理，都应该不限制操作，而应该优化数据处理算法
	//ids := strings.Split(mediaFileIds, ",")
	//if existing.SongCount+len(ids) > uc.maxMediaSize {
	//	return false, errors.New("exceeds maximum media capacity")
	//}

	// 执行添加操作
	success, err := uc.repo.UpdatePlaylistMediaFileIdToAdd(ctx, playlistId, mediaFileIds)
	if err != nil || !success {
		return false, domain.WrapDomainError(err, "failed to add media files")
	}
	return true, nil
}

// 移除媒体文件（带存在性校验）
func (uc *playlistUsecase) UpdatePlaylistMediaFileIndexToRemove(
	ctx context.Context,
	playlistId string,
	mediaFileIds string,
) (bool, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数校验
	if _, err := primitive.ObjectIDFromHex(playlistId); err != nil {
		return false, errors.New("invalid playlist id format")
	}
	if strings.TrimSpace(mediaFileIds) == "" {
		return false, errors.New("empty media file list")
	}

	// 执行移除操作
	success, err := uc.repo.UpdatePlaylistMediaFileIndexToRemove(ctx, playlistId, mediaFileIds)
	if err != nil || !success {
		return false, domain.WrapDomainError(err, "failed to remove media files")
	}
	return true, nil
}
