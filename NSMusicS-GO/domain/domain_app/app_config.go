package domain_app

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AppConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key" validate:"required,min=3,max=50"`
	ConfigValue string             `bson:"config_value" validate:"required"`
}

type AppConfigUsecase interface {
	ReplaceAll(ctx context.Context, configs []*AppConfig) error
	GetAll(ctx context.Context) ([]*AppConfig, error)
}
