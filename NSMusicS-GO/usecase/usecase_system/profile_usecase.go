package usecase_system

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_system"
	"time"
)

type profileUsecase struct {
	userRepository domain_system.UserRepository
	contextTimeout time.Duration
}

func NewProfileUsecase(userRepository domain_system.UserRepository, timeout time.Duration) domain_system.ProfileUsecase {
	return &profileUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (pu *profileUsecase) GetProfileByID(c context.Context, userID string) (*domain_system.Profile, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	user, err := pu.userRepository.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &domain_system.Profile{Name: user.Name, Email: user.Email}, nil
}
