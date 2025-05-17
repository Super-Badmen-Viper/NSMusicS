package scene_audio_db_models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type ExternalResource struct {
	ID           primitive.ObjectID `bson:"_id"`
	MetadataType string             `bson:"metadata_type"`
	FolderPath   string             `bson:"folder_path"`
	CreatedAt    time.Time          `bson:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at"`
}
