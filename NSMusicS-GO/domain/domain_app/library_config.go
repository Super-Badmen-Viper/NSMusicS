package domain_app

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LibraryConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key"`
	ConfigValue string             `bson:"config_value"`
}

func (a *LibraryConfig) ToBSON() primitive.M {
	return primitive.M{
		"config_key":   a.ConfigKey,
		"config_value": a.ConfigValue,
	}
}

type LibraryConfigRepository interface {
	Create(ctx context.Context, config *LibraryConfig) error
	Update(ctx context.Context, filter primitive.M, update primitive.M) error
	FindByKey(ctx context.Context, key string) (*LibraryConfig, error)
	FindAll(ctx context.Context) ([]*LibraryConfig, error)
}
