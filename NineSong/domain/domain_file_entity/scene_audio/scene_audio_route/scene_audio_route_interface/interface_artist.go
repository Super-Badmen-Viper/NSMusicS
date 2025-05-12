package scene_audio_route_interface

import (
	"context"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type ArtistRepository interface {
	GetArtistItems(
		ctx context.Context,
		end, order, sort, start,
		search, starred string,
	) ([]scene_audio_route_models.ArtistMetadata, error)

	GetArtistFilterItemsCount(
		ctx context.Context,
		search, starred string,
	) (*scene_audio_route_models.ArtistFilterCounts, error)
}
