package usecase_app_config

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_config"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app/repository_app_config"
	"time"
)

type AppPlaylistIDConfigUsecase struct {
	repo    repository_app_config.AppPlaylistIDConfigRepository
	timeout time.Duration
}

func NewAppPlaylistIDConfigUsecase(repo repository_app_config.AppPlaylistIDConfigRepository, timeout time.Duration) domain_app_config.AppPlaylistIDConfigUsecase {
	return &AppPlaylistIDConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppPlaylistIDConfigUsecase) ReplaceAll(ctx context.Context, configs []*domain_app_config.AppPlaylistIDConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.ReplaceAll(ctx, configs)
}

func (uc *AppPlaylistIDConfigUsecase) GetAll(ctx context.Context) ([]*domain_app_config.AppPlaylistIDConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
