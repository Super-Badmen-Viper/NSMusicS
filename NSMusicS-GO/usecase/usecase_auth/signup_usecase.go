package usecase_auth

import (
	"context"
	domain_system_auth2 "github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_auth"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/internal/internal_system/token_util"
	"time"
)

type signupUsecase struct {
	userRepository domain_system_auth2.UserRepository
	contextTimeout time.Duration
}

func NewSignupUsecase(userRepository domain_system_auth2.UserRepository, timeout time.Duration) domain_system_auth2.SignupUsecase {
	return &signupUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (su *signupUsecase) Create(c context.Context, user *domain_system_auth2.User) error {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()
	return su.userRepository.Create(ctx, user)
}

func (su *signupUsecase) GetUserByEmail(c context.Context, email string) (domain_system_auth2.User, error) {
	ctx, cancel := context.WithTimeout(c, su.contextTimeout)
	defer cancel()
	return su.userRepository.GetByEmail(ctx, email)
}

func (su *signupUsecase) CreateAccessToken(user *domain_system_auth2.User, secret string, expiry int) (accessToken string, err error) {
	return token_util.CreateAccessToken(user, secret, expiry)
}

func (su *signupUsecase) CreateRefreshToken(user *domain_system_auth2.User, secret string, expiry int) (refreshToken string, err error) {
	return token_util.CreateRefreshToken(user, secret, expiry)
}
