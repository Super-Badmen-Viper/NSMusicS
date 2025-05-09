package scene_audio_route_interface

import (
	"context"
)

type AnnotationRepository interface {
	UpdateStarred(
		ctx context.Context,
		itemId string,
		itemType string,
	) (bool, error)
	UpdateUnStarred(
		ctx context.Context,
		itemId string,
		itemType string,
	) (bool, error)
	UpdateRating(
		ctx context.Context,
		itemId string,
		itemType string,
		rating int,
	) (bool, error)
	UpdateScrobble(
		ctx context.Context,
		itemId string,
		itemType string,
	) (bool, error)
}
