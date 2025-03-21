package domain_app_config

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AppPlaylistIDConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key"`
	ConfigValue string             `bson:"config_value"`
}

type AppPlaylistIDConfigUsecase interface {
	ReplaceAll(ctx context.Context, configs []*AppPlaylistIDConfig) error
	GetAll(ctx context.Context) ([]*AppPlaylistIDConfig, error)
}
