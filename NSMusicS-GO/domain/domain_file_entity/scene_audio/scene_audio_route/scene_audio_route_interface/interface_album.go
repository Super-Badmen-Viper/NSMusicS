package scene_audio_route_interface

import (
	"context"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type AlbumRepository interface {
	GetAlbumItems(
		ctx context.Context,
		end string,
		order string,
		sort string,
		start string,
		search string,
		starred string,
		artistId string,
	) ([]scene_audio_route_models.AlbumMetadata, error)
}
