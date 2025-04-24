package scene_audio_route_interface

import (
	"context"
)

type RetrievalRepository interface {
	getStream(
		ctx context.Context,
		media_file_id string,
	) (string, error)

	getCoverArt(
		ctx context.Context,
		cover_art_id string,
	) (string, error)

	getLyrics_lrc(
		ctx context.Context,
		media_file_id string,
	) (string, error)
}
