package scene_audio_db_models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type ArtistMetadata struct {
	ID                    primitive.ObjectID `bson:"_id"`
	Name                  string             `bson:"name"`
	AlbumCount            int                `bson:"album_count"`
	FullText              string             `bson:"full_text"`
	OrderArtistName       string             `bson:"order_artist_name"`
	SortArtistName        string             `bson:"sort_artist_name"`
	SongCount             int                `bson:"song_count"`
	Size                  int                `bson:"size"`
	HasCoverArt           bool               `bson:"has_cover_art"`
	MBZArtistID           string             `bson:"mbz_artist_id"`
	Biography             string             `bson:"biography"`
	SmallImageURL         string             `bson:"small_image_url"`
	MediumImageURL        string             `bson:"medium_image_url"`
	LargeImageURL         string             `bson:"large_image_url"`
	SimilarArtists        string             `bson:"similar_artists"`
	ExternalURL           string             `bson:"external_url"`
	ExternalInfoUpdatedAt time.Time          `bson:"external_info_updated_at"`
}
