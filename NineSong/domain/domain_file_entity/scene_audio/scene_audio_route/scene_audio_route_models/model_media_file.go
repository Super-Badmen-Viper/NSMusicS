package scene_audio_route_models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MediaFileMetadata struct {
	ID            primitive.ObjectID `bson:"_id"`
	Path          string             `bson:"path"`
	Title         string             `bson:"title"`
	Album         string             `bson:"album"`
	Artist        string             `bson:"artist"`
	ArtistID      string             `bson:"artist_id"`
	AlbumArtist   string             `bson:"album_artist"`
	AlbumID       string             `bson:"album_id"`
	HasCoverArt   bool               `bson:"has_cover_art"`
	Year          int                `bson:"year"`
	Size          int                `bson:"size"`
	Suffix        string             `bson:"suffix"` // 文件后缀
	Duration      float64            `bson:"duration"`
	BitRate       int                `bson:"bit_rate"`
	Genre         string             `bson:"genre"`
	CreatedAt     time.Time          `bson:"created_at"`
	UpdatedAt     time.Time          `bson:"updated_at"`
	AlbumArtistID string             `bson:"album_artist_id"`
	Channels      int                `bson:"channels"`

	PlayCount int       `bson:"play_count"`
	PlayDate  time.Time `bson:"play_date"`
	Rating    int       `bson:"rating"`
	Starred   bool      `bson:"starred"`
	StarredAt time.Time `bson:"starred_at"`

	Index int `bson:"index" json:"Index"`
}

type MediaFileFilterCounts struct {
	Total      int `json:"total"`
	Starred    int `json:"starred"`
	RecentPlay int `json:"recent_play"`
}

type MediaFileListResponse struct {
	MediaFiles []MediaFileMetadata `json:"media_files"`
	Count      int                 `json:"count"`
}
