package scene_audio_route_interface

import (
	"context"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type MediaFileRepository interface {
	GetMediaFileItems(
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
	) ([]scene_audio_route_models.MediaFileMetadata, error)
}
