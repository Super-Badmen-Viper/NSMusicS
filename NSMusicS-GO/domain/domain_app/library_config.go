package domain_app

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AppLibraryConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key" validate:"required,min=3,max=50"`
	ConfigValue string             `bson:"config_value" validate:"required"`
}

type AppLibraryConfigUsecase interface {
	ReplaceAll(ctx context.Context, configs []*AppLibraryConfig) error
	GetAll(ctx context.Context) ([]*AppLibraryConfig, error)
}
