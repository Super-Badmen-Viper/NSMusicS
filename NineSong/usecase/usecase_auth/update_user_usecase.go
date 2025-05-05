package usecase_auth

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_auth"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type UpdateUsecase struct {
	userRepo   domain_auth.UserRepository
	updateRepo domain_auth.UpdateUserRepository
	timeout    time.Duration
}

func NewUpdateUsecase(
	userRepo domain_auth.UserRepository,
	updateRepo domain_auth.UpdateUserRepository,
	timeout time.Duration,
) *UpdateUsecase {
	return &UpdateUsecase{
		userRepo:   userRepo,
		updateRepo: updateRepo,
		timeout:    timeout,
	}
}

func (uc *UpdateUsecase) UpdateUsername(ctx context.Context, userID string, req domain_auth.UpdateUsernameRequest) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	return uc.updateRepo.UpdateName(ctx, objID, req.Name)
}

func (uc *UpdateUsecase) UpdateEmail(ctx context.Context, userID string, req domain_auth.UpdateEmailRequest) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	// 邮箱占用检查
	if taken, err := uc.updateRepo.IsEmailTaken(ctx, req.Email, objID); err != nil || taken {
		return domain_auth.ErrEmailAlreadyExists
	}

	return uc.updateRepo.UpdateEmail(ctx, objID, req.Email)
}

func (uc *UpdateUsecase) UpdatePassword(ctx context.Context, userID string, req domain_auth.UpdatePasswordRequest) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 获取当前用户
	currentUser, err := uc.userRepo.GetByID(ctx, userID)
	if err != nil {
		return err
	}

	// 验证旧密码
	if err := bcrypt.CompareHashAndPassword(
		[]byte(currentUser.Password),
		[]byte(req.OldPassword),
	); err != nil {
		return domain_auth.ErrInvalidCredentials
	}

	// 生成新密码
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(req.NewPassword),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}

	objID, _ := primitive.ObjectIDFromHex(userID)
	return uc.updateRepo.UpdatePassword(ctx, objID, string(hashedPassword))
}
