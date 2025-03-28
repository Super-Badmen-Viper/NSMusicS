package domain_file_entity_audio_models

type PlaylistTrackMetadata struct {
	ID          int    `bson:"_id"`
	PlaylistID  string `bson:"playlist_id"`
	MediaFileID string `bson:"media_file_id"`
}
