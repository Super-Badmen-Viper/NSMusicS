package domain_app_config

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AppUIConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key"`
	ConfigValue string             `bson:"config_value"`
}

type AppUIConfigUsecase interface {
	ReplaceAll(ctx context.Context, configs []*AppUIConfig) error
	GetAll(ctx context.Context) ([]*AppUIConfig, error)
}
