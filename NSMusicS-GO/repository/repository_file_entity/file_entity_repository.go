package repository_file_entity

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type fileRepo struct {
	db         mongo.Database
	collection string
}

func NewFileRepo(db mongo.Database, collection string) domain_file_entity.FileRepository {
	return &fileRepo{db: db, collection: collection}
}

func (r *fileRepo) Upsert(ctx context.Context, file *domain_file_entity.FileMetadata) error {
	filter := bson.M{
		"folder_path": file.FolderPath,
		"checksum":    file.Checksum,
	}

	update := bson.M{
		"$set": bson.M{
			"size":       file.Size,
			"mod_time":   file.ModTime,
			"checksum":   file.Checksum,
			"updated_at": time.Now(),
		},
		"$setOnInsert": bson.M{
			"created_at": time.Now(),
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err := r.db.Collection(r.collection).UpdateOne(ctx, filter, update, opts)
	return err
}

func (r *fileRepo) Delete(ctx context.Context, filePath string) error {
	_, err := r.db.Collection(r.collection).DeleteOne(ctx, bson.M{"folder_path": filePath})
	return err
}
