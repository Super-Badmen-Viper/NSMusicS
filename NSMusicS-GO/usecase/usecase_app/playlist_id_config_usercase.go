package usecase_app

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app"
	"time"
)

type AppPlaylistIDConfigUsecase struct {
	repo    repository_app.AppPlaylistIDConfigRepository
	timeout time.Duration
}

func NewAppPlaylistIDConfigUsecase(repo repository_app.AppPlaylistIDConfigRepository, timeout time.Duration) domain_app.AppPlaylistIDConfigUsecase {
	return &AppPlaylistIDConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppPlaylistIDConfigUsecase) ReplaceAll(ctx context.Context, configs []*domain_app.AppPlaylistIDConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.ReplaceAll(ctx, configs)
}

func (uc *AppPlaylistIDConfigUsecase) GetAll(ctx context.Context) ([]*domain_app.AppPlaylistIDConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
