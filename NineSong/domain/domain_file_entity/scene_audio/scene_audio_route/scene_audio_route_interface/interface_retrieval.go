package scene_audio_route_interface

import (
	"context"
)

type RetrievalRepository interface {
	GetStream(
		ctx context.Context,
		mediaFileId string,
	) (string, error)

	GetCoverArt(
		ctx context.Context,
		coverArtId string,
	) (string, error)

	GetLyricsLrc(
		ctx context.Context,
		mediaFileId string,
	) (string, error)
}
