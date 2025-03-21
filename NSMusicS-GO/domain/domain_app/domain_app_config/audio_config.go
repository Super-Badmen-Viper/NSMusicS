package domain_app_config

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AppAudioConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key"`
	ConfigValue string             `bson:"config_value"`
}

type AppAudioConfigUsecase interface {
	ReplaceAll(ctx context.Context, configs []*AppAudioConfig) error
	GetAll(ctx context.Context) ([]*AppAudioConfig, error)
}
