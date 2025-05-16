package scene_audio_db_models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type AlbumMetadata struct {
	ID                    primitive.ObjectID `bson:"_id"`
	Name                  string             `bson:"name"`
	ArtistID              string             `bson:"artist_id"`
	EmbedArtPath          string             `bson:"embed_art_path"`
	Artist                string             `bson:"artist"`
	AlbumArtist           string             `bson:"album_artist"`
	HasCoverArt           bool               `bson:"has_cover_art"`
	MinYear               int                `bson:"min_year"`
	MaxYear               int                `bson:"max_year"`
	Compilation           bool               `bson:"compilation"`
	SongCount             int                `bson:"song_count"`
	Duration              float64            `bson:"duration"`
	Size                  int                `bson:"size"`
	Genre                 string             `bson:"genre"`
	CreatedAt             time.Time          `bson:"created_at"`
	UpdatedAt             time.Time          `bson:"updated_at"`
	FullText              string             `bson:"full_text"`
	AlbumArtistID         string             `bson:"album_artist_id"`
	OrderAlbumName        string             `bson:"order_album_name"`
	OrderAlbumArtistName  string             `bson:"order_album_artist_name"`
	SortAlbumName         string             `bson:"sort_album_name"`
	SortArtistName        string             `bson:"sort_artist_name"`
	SortAlbumArtistName   string             `bson:"sort_album_artist_name"`
	MBZAlbumID            string             `bson:"mbz_album_id"`
	MBZAlbumArtistID      string             `bson:"mbz_album_artist_id"`
	MBZAlbumType          string             `bson:"mbz_album_type"`
	MBZAlbumComment       string             `bson:"mbz_album_comment"`
	CatalogNum            string             `bson:"catalog_num"`
	Comment               string             `bson:"comment"`
	AllArtistIDs          string             `bson:"all_artist_ids"`
	ImageFiles            string             `bson:"image_files"`
	Paths                 string             `bson:"paths"`
	Description           string             `bson:"description"`
	SmallImageURL         string             `bson:"small_image_url"`
	MediumImageURL        string             `bson:"medium_image_url"`
	LargeImageURL         string             `bson:"large_image_url"`
	ExternalURL           string             `bson:"external_url"`
	ExternalInfoUpdatedAt time.Time          `bson:"external_info_updated_at"`
}
