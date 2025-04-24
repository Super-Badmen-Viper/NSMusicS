package scene_audio_route_interface

import (
	"context"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type ArtistRepository interface {
	GetArtistItems(
		ctx context.Context,
		end string,
		order string,
		sort string,
		start string,
		search string,
		starred string,
	) ([]scene_audio_route_models.ArtistMetadata, error)
}
