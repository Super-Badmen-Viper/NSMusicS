package example_audio_interface_media_file

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/type_audio/domain_file_entity_audio_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// MusicBrainzIntegration 音乐数据库集成接口
type MusicBrainzIntegration interface {
	// MBZ元数据同步
	SyncWithMBZ(ctx context.Context, id primitive.ObjectID) error
	GetMBZRelations(ctx context.Context, id primitive.ObjectID) (MBZRelations, error)

	// 高级查询
	FindByMBZAlbum(ctx context.Context, mbzAlbumID string) ([]*domain_file_entity_audio_models.MediaFileMetadata, error)
	FindByMBZArtist(ctx context.Context, mbzArtistID string) ([]*domain_file_entity_audio_models.MediaFileMetadata, error)
}

// MBZRelations 关系网络
type MBZRelations struct {
	ArtistRelations []MBZArtistRelation
	ReleaseGroups   []MBZReleaseGroup
	URLResources    []MBZURLResource
	Rating          MBZRating
}
type MBZArtistRelation struct {
	Type       string // "member", "collaborator" 等
	ArtistMBID string
	BeginDate  string
	EndDate    string
	Direction  string // "forward" 或 "backward"
}
type MBZReleaseGroup struct {
	MBID             string
	Type             string // album, ep, single 等
	Title            string
	FirstReleaseDate string
}
type MBZURLResource struct {
	URL          string
	RelationType string // "official homepage", "streaming" 等
}
type MBZRating struct {
	Value float64
	Votes int
}

//// MBZArtistLink
//type MBZArtistLink struct {
//	MBID      string
//	Type      string
//	Direction string
//}
//// MBZAlbumLink
//type MBZAlbumLink struct {
//	MBID      string
//	Relation  string
//	BeginDate time.Time
//}
//// MBZTrackLink
//type MBZTrackLink struct {
//	MBID       string
//	Attributes []string
//}
