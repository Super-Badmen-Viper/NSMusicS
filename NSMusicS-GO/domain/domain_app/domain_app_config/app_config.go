package domain_app_config

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AppConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key"`
	ConfigValue string             `bson:"config_value"`
}

type AppConfigUsecase interface {
	ReplaceAll(ctx context.Context, configs []*AppConfig) error
	GetAll(ctx context.Context) ([]*AppConfig, error)
}
