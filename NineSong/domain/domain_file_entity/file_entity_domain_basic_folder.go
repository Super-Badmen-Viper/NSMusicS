package domain_file_entity

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type FolderMeta struct {
	FileCount   int       `bson:"file_count"`
	LastScanned time.Time `bson:"last_scanned"`
}

type FolderMetadata struct {
	ID         primitive.ObjectID `bson:"_id,omitempty"`
	FolderPath string             `bson:"folder_path" validate:"dirpath"`
	FolderMeta FolderMeta         `bson:"folder_meta"`
}

type FolderRepository interface {
	Insert(ctx context.Context, folder *FolderMetadata) error
	FindByPath(ctx context.Context, path string) (*FolderMetadata, error)
	UpdateStats(ctx context.Context, folderID primitive.ObjectID, fileCount int) error
}
