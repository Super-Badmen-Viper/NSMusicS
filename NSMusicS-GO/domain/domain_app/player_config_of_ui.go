package domain_app

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PlayerConfigOfUi struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key"`
	ConfigValue string             `bson:"config_value"`
}

func (a *PlayerConfigOfUi) ToBSON() primitive.M {
	return primitive.M{
		"config_key":   a.ConfigKey,
		"config_value": a.ConfigValue,
	}
}

type PlayerConfigOfUiRepository interface {
	Create(ctx context.Context, config *PlayerConfigOfUi) error
	Update(ctx context.Context, filter primitive.M, update primitive.M) error
	FindByKey(ctx context.Context, key string) (*PlayerConfigOfUi, error)
	FindAll(ctx context.Context) ([]*PlayerConfigOfUi, error)
}
