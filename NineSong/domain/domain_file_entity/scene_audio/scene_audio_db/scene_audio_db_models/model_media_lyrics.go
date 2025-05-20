package scene_audio_db_models

import "go.mongodb.org/mongo-driver/bson/primitive"

type MediaLyricsMetadata struct {
	ID         primitive.ObjectID `bson:"lyrics_id"`
	MediaID    string             `bson:"media_id"`
	Hash       string             `bson:"lyrics_hash"`
	Type       string             `bson:"lyrics_type"`
	Path       string             `bson:"lyrics_path"`
	ClimaxTime string             `bson:"lyrics_climax_time"`
	Lyrics     string             `bson:"lyrics"`
}
