package system

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/internal/tokenutil"
)

type refreshTokenUsecase struct {
	userRepository system.UserRepository
	contextTimeout time.Duration
}

func NewRefreshTokenUsecase(userRepository system.UserRepository, timeout time.Duration) system.RefreshTokenUsecase {
	return &refreshTokenUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (rtu *refreshTokenUsecase) GetUserByID(c context.Context, email string) (system.User, error) {
	ctx, cancel := context.WithTimeout(c, rtu.contextTimeout)
	defer cancel()
	return rtu.userRepository.GetByID(ctx, email)
}

func (rtu *refreshTokenUsecase) CreateAccessToken(user *system.User, secret string, expiry int) (accessToken string, err error) {
	return tokenutil.CreateAccessToken(user, secret, expiry)
}

func (rtu *refreshTokenUsecase) CreateRefreshToken(user *system.User, secret string, expiry int) (refreshToken string, err error) {
	return tokenutil.CreateRefreshToken(user, secret, expiry)
}

func (rtu *refreshTokenUsecase) ExtractIDFromToken(requestToken string, secret string) (string, error) {
	return tokenutil.ExtractIDFromToken(requestToken, secret)
}
