package usecase_auth

import (
	"context"
	domain_system_auth2 "github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_auth"
	"time"
)

type profileUsecase struct {
	userRepository domain_system_auth2.UserRepository
	contextTimeout time.Duration
}

func NewProfileUsecase(userRepository domain_system_auth2.UserRepository, timeout time.Duration) domain_system_auth2.ProfileUsecase {
	return &profileUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (pu *profileUsecase) GetProfileByID(c context.Context, userID string) (*domain_system_auth2.Profile, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	user, err := pu.userRepository.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &domain_system_auth2.Profile{Name: user.Name, Email: user.Email}, nil
}
