package domain_app

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AppUIConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key" validate:"required,min=3,max=50"`
	ConfigValue string             `bson:"config_value" validate:"required"`
}

type AppUIConfigUsecase interface {
	ReplaceAll(ctx context.Context, configs []*AppUIConfig) error
	GetAll(ctx context.Context) ([]*AppUIConfig, error)
}
