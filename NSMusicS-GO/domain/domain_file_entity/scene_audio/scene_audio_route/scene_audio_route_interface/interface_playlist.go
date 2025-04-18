package scene_audio_route_interface

import (
	"context"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type PlaylistRepository interface {
	GetPlaylistItems(
		ctx context.Context,
		end string,
		order string,
		sort string,
		start string,
		search string,
		starred string,
		albumId string,
		artistId string,
		year string,
	) (*scene_audio_route_models.PlaylistMetadata, error)

	getPlaylists_all(
		ctx context.Context,
	) (*scene_audio_route_models.PlaylistMetadata, error)

	getPlaylist_id(
		ctx context.Context,
		playlist_id string,
	) (*scene_audio_route_models.PlaylistMetadata, error)

	createPlaylist(
		ctx context.Context,
		playlist scene_audio_route_models.PlaylistMetadata,
	) (*scene_audio_route_models.PlaylistMetadata, error)

	deletePlaylist(
		ctx context.Context,
		playlist_id string,
	) (*scene_audio_route_models.PlaylistMetadata, error)

	updatePlaylist(
		ctx context.Context,
		playlist_id string,
		playlist scene_audio_route_models.PlaylistMetadata,
	) (*scene_audio_route_models.PlaylistMetadata, error)

	updatePlaylist_songIdToAdd(
		ctx context.Context,
		playlist_id string,
		songIds string,
	) (*scene_audio_route_models.PlaylistMetadata, error)

	updatePlaylist_songIndexToRemove(
		ctx context.Context,
		playlist_id string,
		songIds string,
	) (*scene_audio_route_models.PlaylistMetadata, error)
}
