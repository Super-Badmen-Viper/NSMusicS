package domain_app

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AppPlaylistIDConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key" validate:"required,min=3,max=50"`
	ConfigValue string             `bson:"config_value" validate:"required"`
}

type AppPlaylistIDConfigUsecase interface {
	Create(ctx context.Context, configs []*AppPlaylistIDConfig) error
	ReplaceAll(ctx context.Context, configs []*AppPlaylistIDConfig) error
	GetAll(ctx context.Context) ([]*AppPlaylistIDConfig, error)
}
