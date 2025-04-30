package scene_audio_route_interface

import (
	"context"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type PlaylistRepository interface {
	GetPlaylistsAll(
		ctx context.Context,
	) ([]scene_audio_route_models.PlaylistMetadata, error)

	GetPlaylist(
		ctx context.Context,
		playlistId string,
	) (*scene_audio_route_models.PlaylistMetadata, error)

	CreatePlaylist(
		ctx context.Context,
		playlist scene_audio_route_models.PlaylistMetadata,
	) (*scene_audio_route_models.PlaylistMetadata, error)

	DeletePlaylist(
		ctx context.Context,
		playlistId string,
	) (bool, error)

	UpdatePlaylistInfo(
		ctx context.Context,
		playlistId string,
		playlist scene_audio_route_models.PlaylistMetadata,
	) (*scene_audio_route_models.PlaylistMetadata, error)
}
