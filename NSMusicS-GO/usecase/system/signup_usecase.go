package system

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/internal/tokenutil"
)

type signupUsecase struct {
	userRepository system.UserRepository
	contextTimeout time.Duration
}

func NewSignupUsecase(userRepository system.UserRepository, timeout time.Duration) system.SignupUsecase {
	return &signupUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (su *signupUsecase) Create(c context.Context, user *system.User) error {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()
	return su.userRepository.Create(ctx, user)
}

func (su *signupUsecase) GetUserByEmail(c context.Context, email string) (system.User, error) {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()
	return su.userRepository.GetByEmail(ctx, email)
}

func (su *signupUsecase) CreateAccessToken(user *system.User, secret string, expiry int) (accessToken string, err error) {
	return tokenutil.CreateAccessToken(user, secret, expiry)
}

func (su *signupUsecase) CreateRefreshToken(user *system.User, secret string, expiry int) (refreshToken string, err error) {
	return tokenutil.CreateRefreshToken(user, secret, expiry)
}
