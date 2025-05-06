package repository_app_config

import (
	"context"
	"errors"
	"fmt"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_config"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type AppServerConfigRepository interface {
	Update(ctx context.Context, config *domain_app_config.AppServerConfig) error // 新增接口方法
	GetAll(ctx context.Context) ([]*domain_app_config.AppServerConfig, error)
	DeleteByID(ctx context.Context, id primitive.ObjectID) error
}

type appServerConfigRepo struct {
	db         mongo.Database
	collection string
}

func NewAppServerConfigRepository(db mongo.Database, collection string) AppServerConfigRepository {
	return &appServerConfigRepo{db: db, collection: collection}
}

func (r *appServerConfigRepo) Update(ctx context.Context, config *domain_app_config.AppServerConfig) error {
	coll := r.db.Collection(r.collection)

	if config.ID.IsZero() {
		return errors.New("requires non-empty id")
	}

	filter := bson.M{"_id": config.ID}
	update := bson.M{"$set": config}
	opts := options.Update().SetUpsert(true)

	_, err := coll.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		return fmt.Errorf("update failed: %w", err)
	}
	return nil
}

func (r *appServerConfigRepo) GetAll(ctx context.Context) ([]*domain_app_config.AppServerConfig, error) {
	coll := r.db.Collection(r.collection)

	cursor, err := coll.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("find failed: %w", err)
	}
	defer cursor.Close(ctx)

	var configs []*domain_app_config.AppServerConfig
	if err := cursor.All(ctx, &configs); err != nil {
		return nil, fmt.Errorf("decode failed: %w", err)
	}

	if len(configs) == 0 {
		return nil, domain.ErrEmptyCollection
	}
	return configs, nil
}

func (r *appServerConfigRepo) DeleteByID(ctx context.Context, id primitive.ObjectID) error {
	coll := r.db.Collection(r.collection)

	filter := bson.M{"_id": id}
	result, err := coll.DeleteOne(ctx, filter)
	if err != nil {
		return fmt.Errorf("数据库操作失败：%w", err)
	}

	if result == 0 {
		return domain.ErrNotFound
	}
	return nil
}
