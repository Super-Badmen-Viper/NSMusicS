package usecase_system_auth

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system/domain_system_auth"
	"time"
)

type profileUsecase struct {
	userRepository domain_system_auth.UserRepository
	contextTimeout time.Duration
}

func NewProfileUsecase(userRepository domain_system_auth.UserRepository, timeout time.Duration) domain_system_auth.ProfileUsecase {
	return &profileUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (pu *profileUsecase) GetProfileByID(c context.Context, userID string) (*domain_system_auth.Profile, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	user, err := pu.userRepository.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &domain_system_auth.Profile{Name: user.Name, Email: user.Email}, nil
}
