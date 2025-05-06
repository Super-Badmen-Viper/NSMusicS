package domain_app_config

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type AppServerConfig struct {
	ID          primitive.ObjectID `bson:"_id"`
	ServerName  string             `bson:"serverName" bson:"server_name"`
	URL         string             `bson:"url" bson:"url"`
	UserName    string             `bson:"userName" bson:"user_name"`
	Password    string             `bson:"password" bson:"password"`
	LastLoginAt time.Time          `bson:"lastLoginAt" bson:"last_login_at,omitempty"`
	Type        string             `bson:"type" bson:"type"`
}

type AppServerConfigUsecase interface {
	Update(ctx context.Context, config *AppServerConfig) error
	GetAll(ctx context.Context) ([]*AppServerConfig, error)
	Delete(ctx context.Context, id primitive.ObjectID) error
}
