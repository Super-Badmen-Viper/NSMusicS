package domain_file_entity_audio_models

import (
	"time"
)

type AnnotationMetadata struct {
	AnnID     string    `bson:"ann_id"`
	UserID    string    `bson:"user_id"`
	ItemID    string    `bson:"item_id"`
	ItemType  string    `bson:"item_type"`
	PlayCount int       `bson:"play_count"`
	PlayDate  time.Time `bson:"play_date"`
	Rating    int       `bson:"rating"`
	Starred   bool      `bson:"starred"`
	StarredAt time.Time `bson:"starred_at"`
}
