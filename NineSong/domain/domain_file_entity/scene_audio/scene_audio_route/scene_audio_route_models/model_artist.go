package scene_audio_route_models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type ArtistMetadata struct {
	ID          primitive.ObjectID `bson:"_id"`
	Name        string             `bson:"name"`
	AlbumCount  int                `bson:"album_count"`
	SongCount   int                `bson:"song_count"`
	Size        int                `bson:"size"`
	HasCoverArt bool               `bson:"has_cover_art"`

	ImageFiles string `bson:"image_files"` // 为空则不存在cover封面，从媒体文件中提取

	PlayCount int       `bson:"play_count"`
	PlayDate  time.Time `bson:"play_date"`
	Rating    int       `bson:"rating"`
	Starred   bool      `bson:"starred"`
	StarredAt time.Time `bson:"starred_at"`
}

type ArtistFilterCounts struct {
	Total      int `json:"total"`
	Starred    int `json:"starred"`
	RecentPlay int `json:"recent_play"`
}

type ArtistListResponse struct {
	Artists []ArtistMetadata `json:"artists"`
	Count   int              `json:"count"`
}
