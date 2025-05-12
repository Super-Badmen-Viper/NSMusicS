package scene_audio_route_interface

import (
	"context"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type AlbumRepository interface {
	GetAlbumItems(
		ctx context.Context,
		end, order, sort, start,
		search, starred,
		artistId,
		minYear, maxYear string,
	) ([]scene_audio_route_models.AlbumMetadata, error)

	GetAlbumFilterItemsCount(
		ctx context.Context,
		search, starred, artistId,
		minYear, maxYear string,
	) (*scene_audio_route_models.AlbumFilterCounts, error)
}
