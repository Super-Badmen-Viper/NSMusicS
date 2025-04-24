package repository_system

import (
	"context"
	"errors"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SystemConfigurationRepository interface {
	Find(ctx context.Context) (*domain_system.SystemConfiguration, error)
	Update(ctx context.Context, config *domain_system.SystemConfiguration) error
}

type systemConfigurationRepo struct {
	db         mongo.Database
	collection string
}

func NewSystemConfigurationRepository(db mongo.Database, collection string) SystemConfigurationRepository {
	return &systemConfigurationRepo{db: db, collection: collection}
}

func (r *systemConfigurationRepo) Find(ctx context.Context) (*domain_system.SystemConfiguration, error) {
	coll := r.db.Collection(r.collection)
	var config domain_system.SystemConfiguration
	err := coll.FindOne(ctx, bson.M{}).Decode(&config)
	if err != nil {
		return nil, errors.New("system configuration not found")
	}
	return &config, nil
}

func (r *systemConfigurationRepo) Update(ctx context.Context, config *domain_system.SystemConfiguration) error {
	if config.ID.IsZero() {
		return errors.New("requires non-empty user-id")
	}
	if userID, ok := ctx.Value("x-user-id").(string); ok {
		if config.ID.Hex() != userID {
			return errors.New("user mismatch with operation target")
		}
	} else {
		return errors.New("authentication required")
	}
	coll := r.db.Collection(r.collection)
	filter := bson.M{"_id": config.ID}
	update := bson.M{"$set": config}
	opts := options.Update().SetUpsert(true)
	_, err := coll.UpdateOne(ctx, filter, update, opts)
	return err
}
