package scene_audio_route_models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PlaylistMetadata struct {
	ID        primitive.ObjectID `bson:"_id"`
	Name      string             `bson:"name"`
	Comment   string             `bson:"comment"`
	Duration  float64            `bson:"duration"`
	SongCount float64            `bson:"song_count"`
	CreatedAt time.Time          `bson:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at"`
	Path      string             `bson:"path"`
	Size      int                `bson:"size"`
	//OwnerID   string             `bson:"owner_id"`
}

type PlaylistListResponse struct {
	Playlists []PlaylistMetadata `json:"playlists"`
	Count     int                `json:"count"`
}
