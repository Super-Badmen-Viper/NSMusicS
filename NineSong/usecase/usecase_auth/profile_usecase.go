package usecase_auth

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_auth"
	"time"
)

type profileUsecase struct {
	userRepository domain_auth.UserRepository
	contextTimeout time.Duration
}

func NewProfileUsecase(userRepository domain_auth.UserRepository, timeout time.Duration) domain_auth.ProfileUsecase {
	return &profileUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (pu *profileUsecase) GetProfileByID(c context.Context, userID string) (*domain_auth.Profile, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	user, err := pu.userRepository.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &domain_auth.Profile{Name: user.Name, Email: user.Email}, nil
}
