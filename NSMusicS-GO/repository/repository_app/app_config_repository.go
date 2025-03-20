package repository_app

import (
	"context"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
)

type AppConfigRepository interface {
	Create(ctx context.Context, configs []*domain_app.AppConfig) error
	ReplaceAll(ctx context.Context, configs []*domain_app.AppConfig) error
	GetAll(ctx context.Context) ([]*domain_app.AppConfig, error)
}

type appConfigRepo struct {
	db         mongo.Database
	collection string
}

func NewAppConfigRepository(db mongo.Database, collection string) AppConfigRepository {
	return &appConfigRepo{db: db, collection: collection}
}

func (r *appConfigRepo) ReplaceAll(ctx context.Context, configs []*domain_app.AppConfig) error {
	coll := r.db.Collection(r.collection)

	if _, err := coll.DeleteMany(ctx, bson.M{}); err != nil {
		return fmt.Errorf("replaceAll failed to delete: %w", err)
	}

	if len(configs) == 0 {
		return nil
	}

	if _, err := coll.InsertMany(ctx, convertToInterfaceSlice(configs)); err != nil {
		return fmt.Errorf("replaceAll failed to insert: %w", err)
	}
	return nil
}
func convertToInterfaceSlice(configs []*domain_app.AppConfig) []interface{} {
	docs := make([]interface{}, len(configs))
	for i, c := range configs {
		docs[i] = c
	}
	return docs
}

func (r *appConfigRepo) Create(ctx context.Context, configs []*domain_app.AppConfig) error {
	documents := make([]interface{}, len(configs))
	for i, c := range configs {
		documents[i] = c
	}
	_, err := r.db.Collection(r.collection).InsertMany(ctx, documents)
	return err
}

func (r *appConfigRepo) GetAll(ctx context.Context) ([]*domain_app.AppConfig, error) {
	coll := r.db.Collection(r.collection)

	cursor, err := coll.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("find failed: %w", err)
	}
	defer cursor.Close(ctx)

	var configs []*domain_app.AppConfig
	if err := cursor.All(ctx, &configs); err != nil {
		return nil, fmt.Errorf("decode failed: %w", err)
	}

	if len(configs) == 0 {
		return nil, domain_app.ErrEmptyCollection // 或直接返回空切片
	}
	return configs, nil
}
