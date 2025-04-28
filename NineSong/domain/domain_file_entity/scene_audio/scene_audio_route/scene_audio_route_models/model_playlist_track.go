package scene_audio_route_models

import "go.mongodb.org/mongo-driver/bson/primitive"

type PlaylistTrackMetadata struct {
	ID          int                `bson:"_id"`
	PlaylistID  primitive.ObjectID `bson:"playlist_id"`
	PlayType    string             `bson:"play_type"` // 播放类型: MediaFile, Album, Artist
	MediaFileID primitive.ObjectID `bson:"media_file_id"`
	AlbumID     primitive.ObjectID `bson:"album_id"`
	ArtistID    primitive.ObjectID `bson:"artist_id"`
}

type PlaylistTrackListResponse struct {
	PlaylistTracks []PlaylistTrackMetadata `json:"playlist_tracks"`
	Count          int                     `json:"count"`
}
