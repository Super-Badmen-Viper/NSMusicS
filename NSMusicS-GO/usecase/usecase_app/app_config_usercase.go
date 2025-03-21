package usecase_app

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app"
	"time"
)

type AppConfigUsecase struct {
	repo    repository_app.AppConfigRepository
	timeout time.Duration
}

func NewAppConfigUsecase(repo repository_app.AppConfigRepository, timeout time.Duration) domain_app.AppConfigUsecase {
	return &AppConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppConfigUsecase) ReplaceAll(ctx context.Context, configs []*domain_app.AppConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.ReplaceAll(ctx, configs)
}

func (uc *AppConfigUsecase) GetAll(ctx context.Context) ([]*domain_app.AppConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
