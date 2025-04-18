package scene_audio_route_models

import (
	"context"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type RetrievalRepository interface {
	GetPlaylistTrackItems(
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
		playlist_id string,
	) (*scene_audio_route_models.PlaylistTrackMetadata, error)

	getStream(
		ctx context.Context,
		media_file_id string,
	)

	getDownload(
		ctx context.Context,
		media_file_id string,
	)

	getCoverArt(
		ctx context.Context,
		cover_art_id string,
	)

	getLyrics_lrc(
		ctx context.Context,
		media_file_id string,
	)
}
