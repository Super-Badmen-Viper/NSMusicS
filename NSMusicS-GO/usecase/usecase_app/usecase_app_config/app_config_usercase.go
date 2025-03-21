package usecase_app_config

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_config"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app/repository_app_config"
	"time"
)

type AppConfigUsecase struct {
	repo    repository_app_config.AppConfigRepository
	timeout time.Duration
}

func NewAppConfigUsecase(repo repository_app_config.AppConfigRepository, timeout time.Duration) domain_app_config.AppConfigUsecase {
	return &AppConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppConfigUsecase) ReplaceAll(ctx context.Context, configs []*domain_app_config.AppConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.ReplaceAll(ctx, configs)
}

func (uc *AppConfigUsecase) GetAll(ctx context.Context) ([]*domain_app_config.AppConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
