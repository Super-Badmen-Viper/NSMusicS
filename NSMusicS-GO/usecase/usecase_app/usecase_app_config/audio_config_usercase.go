package usecase_app_config

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_config"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app/repository_app_config"
	"time"
)

type AppAudioConfigUsecase struct {
	repo    repository_app_config.AppAudioConfigRepository
	timeout time.Duration
}

func NewAppAudioConfigUsecase(repo repository_app_config.AppAudioConfigRepository, timeout time.Duration) domain_app_config.AppAudioConfigUsecase {
	return &AppAudioConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppAudioConfigUsecase) ReplaceAll(ctx context.Context, configs []*domain_app_config.AppAudioConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.ReplaceAll(ctx, configs)
}

func (uc *AppAudioConfigUsecase) GetAll(ctx context.Context) ([]*domain_app_config.AppAudioConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
