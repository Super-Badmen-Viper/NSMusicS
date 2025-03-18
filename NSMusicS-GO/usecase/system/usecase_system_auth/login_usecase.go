package usecase_system_auth

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system/domain_system_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/internal/internal_system/token_util"
	"time"
)

type loginUsecase struct {
	userRepository domain_system_auth.UserRepository
	contextTimeout time.Duration
}

func NewLoginUsecase(userRepository domain_system_auth.UserRepository, timeout time.Duration) domain_system_auth.LoginUsecase {
	return &loginUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (lu *loginUsecase) GetUserByEmail(c context.Context, email string) (domain_system_auth.User, error) {
	ctx, cancel := context.WithTimeout(c, lu.contextTimeout)
	defer cancel()
	return lu.userRepository.GetByEmail(ctx, email)
}

func (lu *loginUsecase) CreateAccessToken(user *domain_system_auth.User, secret string, expiry int) (accessToken string, err error) {
	return token_util.CreateAccessToken(user, secret, expiry)
}

func (lu *loginUsecase) CreateRefreshToken(user *domain_system_auth.User, secret string, expiry int) (refreshToken string, err error) {
	return token_util.CreateRefreshToken(user, secret, expiry)
}
