package domain_app

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const (
	CollectionAppConfigs = "app_configs"
)

var (
	ErrEmptyCollection = errors.New("config collection is empty")
)

type AppConfig struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`
	ConfigKey   string             `bson:"config_key" validate:"required,min=3,max=50"`
	ConfigValue string             `bson:"config_value" validate:"required"`
}

type AppConfigUsecase interface {
	Create(ctx context.Context, configs []*AppConfig) error
	ReplaceAll(ctx context.Context, configs []*AppConfig) error
	GetAll(ctx context.Context) ([]*AppConfig, error)
}
