package domain_auth

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrInvalidCredentials = errors.New("invalid credentials")
)

type (
	UpdateUsernameRequest struct {
		Name string `form:"name" binding:"required,min=1,max=20"`
	}

	UpdateEmailRequest struct {
		Email string `form:"email" binding:"required,email"`
	}

	UpdatePasswordRequest struct {
		OldPassword string `form:"old_password" binding:"required"`
		NewPassword string `form:"new_password" binding:"required"`
	}

	UpdateResponse struct {
		Message string `form:"message"`
	}
)

type UpdateUserRepository interface {
	UpdateName(ctx context.Context, id primitive.ObjectID, name string) error
	UpdateEmail(ctx context.Context, id primitive.ObjectID, email string) error
	UpdatePassword(ctx context.Context, id primitive.ObjectID, password string) error
	IsEmailTaken(ctx context.Context, email string, excludeID primitive.ObjectID) (bool, error)
}
