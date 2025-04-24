package usecase_app_config

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_config"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app/repository_app_config"
	"time"
)

type AppLibraryConfigUsecase struct {
	repo    repository_app_config.AppLibraryConfigRepository
	timeout time.Duration
}

func NewAppLibraryConfigUsecase(repo repository_app_config.AppLibraryConfigRepository, timeout time.Duration) domain_app_config.AppLibraryConfigUsecase {
	return &AppLibraryConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppLibraryConfigUsecase) ReplaceAll(ctx context.Context, configs []*domain_app_config.AppLibraryConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.ReplaceAll(ctx, configs)
}

func (uc *AppLibraryConfigUsecase) GetAll(ctx context.Context) ([]*domain_app_config.AppLibraryConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
