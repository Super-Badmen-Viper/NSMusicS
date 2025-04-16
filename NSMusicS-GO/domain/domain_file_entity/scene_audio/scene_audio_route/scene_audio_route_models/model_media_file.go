package scene_audio_route_models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

// MediaFileMetadata 核心元数据结构
type MediaFileMetadata struct {
	PlayCount int       `bson:"play_count"`
	PlayDate  time.Time `bson:"play_date"`
	Rating    int       `bson:"rating"`
	Starred   bool      `bson:"starred"`
	StarredAt time.Time `bson:"starred_at"`

	ID primitive.ObjectID `bson:"_id"`
	//Path        string             `bson:"path"`
	Title       string `bson:"title"`
	Album       string `bson:"album"`
	Artist      string `bson:"artist"`
	ArtistID    string `bson:"artist_id"`
	AlbumArtist string `bson:"album_artist"`
	AlbumID     string `bson:"album_id"`
	HasCoverArt bool   `bson:"has_cover_art"`
	//TrackNumber int     `bson:"track_number"` // 当前轨道号
	//DiscNumber  int     `bson:"disc_number"`  // 当前光盘号
	Year     int     `bson:"year"`
	Size     int     `bson:"size"`
	Suffix   string  `bson:"suffix"` // 文件后缀
	Duration float64 `bson:"duration"`
	BitRate  int     `bson:"bit_rate"`
	Genre    string  `bson:"genre"`
	//Compilation bool               `bson:"compilation"`
	CreatedAt time.Time `bson:"created_at"`
	UpdatedAt time.Time `bson:"updated_at"`
	//FullText      string             `bson:"full_text"`
	AlbumArtistID string `bson:"album_artist_id"`
	//Comment       string             `bson:"comment"`
	//Lyrics        string             `bson:"lyrics"`
	Channels int `bson:"channels"`
	//RGAlbumGain float64 `bson:"rg_album_gain"`
	//RGAlbumPeak float64 `bson:"rg_album_peak"`
	//RGTrackGain float64 `bson:"rg_track_gain"`
	//RGTrackPeak float64 `bson:"rg_track_peak"`
}

// FilterParams 基础过滤参数
type FilterParams struct {
	Genres       []string
	MinYear      int
	MaxYear      int
	ArtistIDs    []string
	MinDuration  float64
	MaxDuration  float64
	AlbumTypes   []string
	HasLyrics    *bool
	BitrateRange [2]int
}

// SortParams 排序参数
type SortParams struct {
	Field     string // 支持字段：title, artist, year, duration, bit_rate 等
	Ascending bool
	Collation string // 排序规则（如：nocase）
}
