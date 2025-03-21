package domain_app

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"time"
)

type AppServerConfig struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ServerName  string             `json:"serverName" bson:"server_name"`
	URL         string             `json:"url" bson:"url"`
	UserName    string             `json:"userName" bson:"user_name"`
	Password    string             `json:"password" bson:"password"`
	LastLoginAt time.Time          `json:"lastLoginAt" bson:"last_login_at,omitempty"`
	Type        string             `json:"type" bson:"type"`
}

type AppServerConfigUsecase interface {
	Update(ctx context.Context, config *AppServerConfig) error
	GetAll(ctx context.Context) ([]*AppServerConfig, error)
}
