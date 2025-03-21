package usecase_app_config

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_config"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app/repository_app_config"
	"time"
)

type AppServerConfigUsecase struct {
	repo    repository_app_config.AppServerConfigRepository
	timeout time.Duration
}

func NewAppServerConfigUsecase(repo repository_app_config.AppServerConfigRepository, timeout time.Duration) domain_app_config.AppServerConfigUsecase {
	return &AppServerConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppServerConfigUsecase) Update(ctx context.Context, config *domain_app_config.AppServerConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.Update(ctx, config)
}

func (uc *AppServerConfigUsecase) GetAll(ctx context.Context) ([]*domain_app_config.AppServerConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
