package scene_audio_db_interface

import (
	"context"
)

type TempRepository interface {
	GetTempPath(
		ctx context.Context,
		metadataType string,
	) (string, error)

	UpdateTempPath(
		ctx context.Context,
		metadataType string,
		folderPath string,
	) (bool, error)
}
