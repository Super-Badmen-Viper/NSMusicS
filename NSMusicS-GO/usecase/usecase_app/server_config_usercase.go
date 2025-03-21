package usecase_app

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app"
	"time"
)

type AppServerConfigUsecase struct {
	repo    repository_app.AppServerConfigRepository
	timeout time.Duration
}

func NewAppServerConfigUsecase(repo repository_app.AppServerConfigRepository, timeout time.Duration) domain_app.AppServerConfigUsecase {
	return &AppServerConfigUsecase{repo: repo, timeout: timeout}
}

func (uc *AppServerConfigUsecase) Update(ctx context.Context, config *domain_app.AppServerConfig) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.Update(ctx, config)
}

func (uc *AppServerConfigUsecase) GetAll(ctx context.Context) ([]*domain_app.AppServerConfig, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
