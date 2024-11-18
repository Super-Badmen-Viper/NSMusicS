package usecase

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/basic"
	"time"
)

type profileUsecase struct {
	userRepository basic.UserRepository
	contextTimeout time.Duration
}

func NewProfileUsecase(userRepository basic.UserRepository, timeout time.Duration) basic.ProfileUsecase {
	return &profileUsecase{
		userRepository: userRepository,
		contextTimeout: timeout,
	}
}

func (pu *profileUsecase) GetProfileByID(c context.Context, userID string) (*basic.Profile, error) {
	ctx, cancel := context.WithTimeout(c, pu.contextTimeout)
	defer cancel()

	user, err := pu.userRepository.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return &basic.Profile{Name: user.Name, Email: user.Email}, nil
}
