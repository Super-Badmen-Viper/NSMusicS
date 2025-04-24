package repository_app_library

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_library"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

type AppMediaFileLibraryRepository interface {
	ReplaceAll(ctx context.Context, configs []*domain_app_library.AppMediaFileLibrary) error
	GetAll(ctx context.Context) ([]*domain_app_library.AppMediaFileLibrary, error)
}

type AppMediaFileLibraryRepo struct {
	db         mongo.Database
	collection string
}

func NewAppMediaFileLibraryRepository(db mongo.Database, collection string) AppMediaFileLibraryRepository {
	return &AppMediaFileLibraryRepo{db: db, collection: collection}
}

func (r *AppMediaFileLibraryRepo) ReplaceAll(ctx context.Context, configs []*domain_app_library.AppMediaFileLibrary) error {
	coll := r.db.Collection(r.collection)

	if _, err := coll.DeleteMany(ctx, bson.M{}); err != nil {
		return fmt.Errorf("replaceAll failed to delete: %w", err)
	}

	if len(configs) == 0 {
		return nil
	}

	if _, err := coll.InsertMany(ctx, convertToInterfaceSliceAppMediaFileLibrary(configs)); err != nil {
		return fmt.Errorf("replaceAll failed to insert: %w", err)
	}
	return nil
}
func convertToInterfaceSliceAppMediaFileLibrary(configs []*domain_app_library.AppMediaFileLibrary) []interface{} {
	docs := make([]interface{}, len(configs))
	for i, c := range configs {
		docs[i] = c
	}
	return docs
}

func (r *AppMediaFileLibraryRepo) GetAll(ctx context.Context) ([]*domain_app_library.AppMediaFileLibrary, error) {
	coll := r.db.Collection(r.collection)

	cursor, err := coll.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("find failed: %w", err)
	}
	defer cursor.Close(ctx)

	var configs []*domain_app_library.AppMediaFileLibrary
	if err := cursor.All(ctx, &configs); err != nil {
		return nil, fmt.Errorf("decode failed: %w", err)
	}

	if len(configs) == 0 {
		return nil, domain.ErrEmptyCollection
	}
	return configs, nil
}
