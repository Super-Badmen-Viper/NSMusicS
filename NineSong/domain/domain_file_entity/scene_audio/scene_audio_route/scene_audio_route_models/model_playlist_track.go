package scene_audio_route_models

import "go.mongodb.org/mongo-driver/bson/primitive"

type PlaylistTrackMetadata struct {
	ID          int                `bson:"_id"`
	PlaylistID  primitive.ObjectID `bson:"playlist_id"`
	MediaFileID primitive.ObjectID `bson:"media_file_id"`
}

type PlaylistTrackListResponse struct {
	PlaylistTracks []PlaylistTrackMetadata `json:"playlist_tracks"`
	Count          int                     `json:"count"`
}
