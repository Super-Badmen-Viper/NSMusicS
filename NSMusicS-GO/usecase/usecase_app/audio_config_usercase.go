package usecase_app

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app"
	"time"
)

type AppAudioConfigUsecase struct {
	repo    repository_app.AppAudioConfigRepository
	timeout time.Duration
}

func NewAppAudioConfigUsecase(repo repository_app.AppAudioConfigRepository, timeout time.Duration) domain_app.AppAudioConfigUsecase {
	return &AppAudioConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppAudioConfigUsecase) Create(ctx context.Context, configs []*domain_app.AppAudioConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.Create(ctx, configs)
}

func (uc *AppAudioConfigUsecase) ReplaceAll(ctx context.Context, configs []*domain_app.AppAudioConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.ReplaceAll(ctx, configs)
}

func (uc *AppAudioConfigUsecase) GetAll(ctx context.Context) ([]*domain_app.AppAudioConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
