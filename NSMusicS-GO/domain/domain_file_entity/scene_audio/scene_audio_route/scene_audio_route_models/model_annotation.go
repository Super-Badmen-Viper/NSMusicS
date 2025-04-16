package scene_audio_route_models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type AnnotationMetadata struct {
	AnnID     primitive.ObjectID `bson:"ann_id"`
	UserID    string             `bson:"user_id"`
	ItemID    string             `bson:"item_id"`
	ItemType  string             `bson:"item_type"`
	PlayCount int                `bson:"play_count"`
	PlayDate  time.Time          `bson:"play_date"`
	Rating    int                `bson:"rating"`
	Starred   bool               `bson:"starred"`
	StarredAt time.Time          `bson:"starred_at"`
}
