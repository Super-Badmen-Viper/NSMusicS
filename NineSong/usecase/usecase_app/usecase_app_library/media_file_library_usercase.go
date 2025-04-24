package usecase_app_library

import (
	"context"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_app/domain_app_library"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_app/repository_app_library"
	"time"
)

type AppMediaFileLibraryUsecase struct {
	repo    repository_app_library.AppMediaFileLibraryRepository
	timeout time.Duration
}

func NewAppMediaFileLibraryUsecase(repo repository_app_library.AppMediaFileLibraryRepository, timeout time.Duration) domain_app_library.AppMediaFileLibraryUsecase {
	return &AppMediaFileLibraryUsecase{repo: repo, timeout: timeout}
}

func (uc *AppMediaFileLibraryUsecase) ReplaceAll(ctx context.Context, configs []*domain_app_library.AppMediaFileLibrary) error {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()
	return uc.repo.ReplaceAll(ctx, configs)
}

func (uc *AppMediaFileLibraryUsecase) GetAll(ctx context.Context) ([]*domain_app_library.AppMediaFileLibrary, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAll(ctx)
}
