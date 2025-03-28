package repository_file_entity_audio

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AlbumRepository interface {
	Upsert(ctx context.Context, album *domain_file_entity_audio.Album) error
	GetByMBID(ctx context.Context, mbid string) (*domain_file_entity_audio.Album, error)
}

type ArtistRepository interface {
	Upsert(ctx context.Context, artist *domain_file_entity_audio.Artist) error
	GetOrCreate(ctx context.Context, name string) (primitive.ObjectID, error)
}

type MediaFileRepository interface {
	Upsert(ctx context.Context, file *domain_file_entity_audio.MediaFile) error
	GetByPath(ctx context.Context, path string) (*domain_file_entity_audio.MediaFile, error)
}
