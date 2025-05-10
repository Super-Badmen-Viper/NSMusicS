package scene_audio_route_interface

import (
	"context"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type HomeRepository interface {
	GetRandomArtistList(
		ctx context.Context,
		end string,
		start string,
	) ([]scene_audio_route_models.ArtistMetadata, error)
	GetRandomAlbumList(
		ctx context.Context,
		end string,
		start string,
	) ([]scene_audio_route_models.AlbumMetadata, error)
	GetRandomMediaFileList(
		ctx context.Context,
		end string,
		start string,
	) ([]scene_audio_route_models.MediaFileMetadata, error)
}
