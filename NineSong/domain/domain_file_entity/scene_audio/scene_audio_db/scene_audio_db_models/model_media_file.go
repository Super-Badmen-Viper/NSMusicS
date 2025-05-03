package scene_audio_db_models

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

// MediaFileMetadata 核心元数据结构
type MediaFileMetadata struct {
	ID                   primitive.ObjectID `bson:"_id"`
	Path                 string             `bson:"path"`
	Title                string             `bson:"title"`
	Album                string             `bson:"album"`
	Artist               string             `bson:"artist"`
	ArtistID             string             `bson:"artist_id"`
	AlbumArtist          string             `bson:"album_artist"`
	AlbumID              string             `bson:"album_id"`
	HasCoverArt          bool               `bson:"has_cover_art"`
	TrackNumber          int                `bson:"track_number"` // 当前轨道号
	TotalTracks          int                `bson:"total_tracks"` // 总轨道数
	DiscNumber           int                `bson:"disc_number"`  // 当前光盘号
	TotalDiscs           int                `bson:"total_discs"`  // 总光盘数
	Year                 int                `bson:"year"`
	Size                 int                `bson:"size"`
	Suffix               string             `bson:"suffix"`
	Duration             float64            `bson:"duration"`
	BitRate              int                `bson:"bit_rate"`
	Genre                string             `bson:"genre"`
	Compilation          bool               `bson:"compilation"`
	CreatedAt            time.Time          `bson:"created_at"`
	UpdatedAt            time.Time          `bson:"updated_at"`
	FullText             string             `bson:"full_text"`
	AlbumArtistID        string             `bson:"album_artist_id"`
	OrderAlbumName       string             `bson:"order_album_name"`
	OrderAlbumArtistName string             `bson:"order_album_artist_name"`
	OrderArtistName      string             `bson:"order_artist_name"`
	SortAlbumName        string             `bson:"sort_album_name"`
	SortArtistName       string             `bson:"sort_artist_name"`
	SortAlbumArtistName  string             `bson:"sort_album_artist_name"`
	SortTitle            string             `bson:"sort_title"`
	DiscSubtitle         string             `bson:"disc_subtitle"`
	MBZTrackID           string             `bson:"mbz_track_id"`
	MBZAlbumID           string             `bson:"mbz_album_id"`
	MBZArtistID          string             `bson:"mbz_artist_id"`
	MBZAlbumArtistID     string             `bson:"mbz_album_artist_id"`
	MBZAlbumType         string             `bson:"mbz_album_type"`
	MBZAlbumComment      string             `bson:"mbz_album_comment"`
	CatalogNum           string             `bson:"catalog_num"`
	Comment              string             `bson:"comment"`
	Lyrics               string             `bson:"lyrics"`
	BPM                  int                `bson:"bpm"`
	Channels             int                `bson:"channels"`
	OrderTitle           string             `bson:"order_title"`
	MBZReleaseTrackID    string             `bson:"mbz_release_track_id"`
	RGAlbumGain          float64            `bson:"rg_album_gain"`
	RGAlbumPeak          float64            `bson:"rg_album_peak"`
	RGTrackGain          float64            `bson:"rg_track_gain"`
	RGTrackPeak          float64            `bson:"rg_track_peak"`
	MediumImageURL       string             `bson:"medium_image_url"`
}

func (m *MediaFileMetadata) ToUpdateDoc() bson.M {
	now := time.Now()
	return bson.M{
		"path":                    m.Path,
		"title":                   m.Title,
		"album":                   m.Album,
		"artist":                  m.Artist,
		"artist_id":               m.ArtistID,
		"album_artist":            m.AlbumArtist,
		"album_id":                m.AlbumID,
		"has_cover_art":           m.HasCoverArt,
		"track_number":            m.TrackNumber,
		"total_tracks":            m.TotalTracks,
		"disc_number":             m.DiscNumber,
		"total_discs":             m.TotalDiscs,
		"year":                    m.Year,
		"size":                    m.Size,
		"suffix":                  m.Suffix,
		"duration":                m.Duration,
		"bit_rate":                m.BitRate,
		"genre":                   m.Genre,
		"compilation":             m.Compilation,
		"full_text":               m.FullText,
		"album_artist_id":         m.AlbumArtistID,
		"order_album_name":        m.OrderAlbumName,
		"order_album_artist_name": m.OrderAlbumArtistName,
		"order_artist_name":       m.OrderArtistName,
		"sort_album_name":         m.SortAlbumName,
		"sort_artist_name":        m.SortArtistName,
		"sort_album_artist_name":  m.SortAlbumArtistName,
		"sort_title":              m.SortTitle,
		"disc_subtitle":           m.DiscSubtitle,
		"mbz_track_id":            m.MBZTrackID,
		"mbz_album_id":            m.MBZAlbumID,
		"mbz_artist_id":           m.MBZArtistID,
		"mbz_album_artist_id":     m.MBZAlbumArtistID,
		"mbz_album_type":          m.MBZAlbumType,
		"mbz_album_comment":       m.MBZAlbumComment,
		"catalog_num":             m.CatalogNum,
		"comment":                 m.Comment,
		"lyrics":                  m.Lyrics,
		"bpm":                     m.BPM,
		"channels":                m.Channels,
		"order_title":             m.OrderTitle,
		"mbz_release_track_id":    m.MBZReleaseTrackID,
		"rg_album_gain":           m.RGAlbumGain,
		"rg_album_peak":           m.RGAlbumPeak,
		"rg_track_gain":           m.RGTrackGain,
		"rg_track_peak":           m.RGTrackPeak,
		"medium_image_url":        m.MediumImageURL,
		"updated_at":              now, // 强制更新修改时间
	}
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
