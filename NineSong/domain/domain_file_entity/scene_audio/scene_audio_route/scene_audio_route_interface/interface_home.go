package scene_audio_route_interface

import (
	"context"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type HomeRepository interface {
	GetArtistList(
		ctx context.Context,
		end string,
		start string,
	) ([]scene_audio_route_models.ArtistMetadata, error)
	GetAlbumList(
		ctx context.Context,
		end string,
		start string,
	) ([]scene_audio_route_models.AlbumMetadata, error)
	GetMediaFileList(
		ctx context.Context,
		end string,
		start string,
	) ([]scene_audio_route_models.MediaFileMetadata, error)

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
