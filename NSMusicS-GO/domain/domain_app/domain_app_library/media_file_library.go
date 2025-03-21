package domain_app_library

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type AppMediaFileLibrary struct {
	ID                   primitive.ObjectID `bson:"_id,omitempty"`
	Path                 string             `bson:"path"`
	Title                string             `bson:"title"`
	Album                string             `bson:"album"`
	Artist               string             `bson:"artist"`
	ArtistID             string             `bson:"artist_id"`
	AlbumArtist          string             `bson:"album_artist"`
	AlbumID              string             `bson:"album_id"`
	HasCoverArt          bool               `bson:"has_cover_art"`
	TrackNumber          int                `bson:"track_number"`
	DiscNumber           int                `bson:"disc_number"`
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
	RgAlbumGain          float64            `bson:"rg_album_gain"`
	RgAlbumPeak          float64            `bson:"rg_album_peak"`
	RgTrackGain          float64            `bson:"rg_track_gain"`
	RgTrackPeak          float64            `bson:"rg_track_peak"`
	MediumImageURL       string             `bson:"medium_image_url"`
}

type AppMediaFileLibraryUsecase interface {
	ReplaceAll(ctx context.Context, configs []*AppMediaFileLibrary) error
	GetAll(ctx context.Context) ([]*AppMediaFileLibrary, error)
}
