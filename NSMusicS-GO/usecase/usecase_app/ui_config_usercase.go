package usecase_app

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app"
	"time"
)

type AppUIConfigUsecase struct {
	repo    repository_app.AppUIConfigRepository
	timeout time.Duration
}

func NewAppUIConfigUsecase(repo repository_app.AppUIConfigRepository, timeout time.Duration) domain_app.AppUIConfigUsecase {
	return &AppUIConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppUIConfigUsecase) Create(ctx context.Context, configs []*domain_app.AppUIConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.Create(ctx, configs)
}

func (uc *AppUIConfigUsecase) ReplaceAll(ctx context.Context, configs []*domain_app.AppUIConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.ReplaceAll(ctx, configs)
}

func (uc *AppUIConfigUsecase) GetAll(ctx context.Context) ([]*domain_app.AppUIConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
