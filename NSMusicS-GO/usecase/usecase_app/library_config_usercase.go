package usecase_app

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app"
	"time"
)

type AppLibraryConfigUsecase struct {
	repo    repository_app.AppLibraryConfigRepository
	timeout time.Duration
}

func NewAppLibraryConfigUsecase(repo repository_app.AppLibraryConfigRepository, timeout time.Duration) domain_app.AppLibraryConfigUsecase {
	return &AppLibraryConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppLibraryConfigUsecase) ReplaceAll(ctx context.Context, configs []*domain_app.AppLibraryConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.ReplaceAll(ctx, configs)
}

func (uc *AppLibraryConfigUsecase) GetAll(ctx context.Context) ([]*domain_app.AppLibraryConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
