package domain_app_config

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AppLibraryConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key"`
	ConfigValue string             `bson:"config_value"`
}

type AppLibraryConfigUsecase interface {
	ReplaceAll(ctx context.Context, configs []*AppLibraryConfig) error
	GetAll(ctx context.Context) ([]*AppLibraryConfig, error)
}
