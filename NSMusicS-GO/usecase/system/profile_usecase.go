package system

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/system"
	"time"
)

type profileUsecase struct {
	userRepository system.UserRepository
	contextTimeout time.Duration
}

func NewProfileUsecase(userRepository system.UserRepository, timeout time.Duration) system.ProfileUsecase {
	return &profileUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (pu *profileUsecase) GetProfileByID(c context.Context, userID string) (*system.Profile, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	user, err := pu.userRepository.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &system.Profile{Name: user.Name, Email: user.Email}, nil
}
