package system

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/internal/tokenutil"
)

type loginUsecase struct {
	userRepository system.UserRepository
	contextTimeout time.Duration
}

func NewLoginUsecase(userRepository system.UserRepository, timeout time.Duration) system.LoginUsecase {
	return &loginUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (lu *loginUsecase) GetUserByEmail(c context.Context, email string) (system.User, error) {
	ctx, cancel := context.WithTimeout(c, lu.contextTimeout)
	defer cancel()
	return lu.userRepository.GetByEmail(ctx, email)
}

func (lu *loginUsecase) CreateAccessToken(user *system.User, secret string, expiry int) (accessToken string, err error) {
	return tokenutil.CreateAccessToken(user, secret, expiry)
}

func (lu *loginUsecase) CreateRefreshToken(user *system.User, secret string, expiry int) (refreshToken string, err error) {
	return tokenutil.CreateRefreshToken(user, secret, expiry)
}
