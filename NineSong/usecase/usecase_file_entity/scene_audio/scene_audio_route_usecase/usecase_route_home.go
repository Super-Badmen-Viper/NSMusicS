package scene_audio_route_usecase

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type homeUsecase struct {
	repo    scene_audio_route_interface.HomeRepository
	timeout time.Duration
}

func NewHomeUsecase(repo scene_audio_route_interface.HomeRepository, timeout time.Duration) scene_audio_route_interface.HomeRepository {
	return &homeUsecase{
		repo:    repo,
		timeout: timeout,
	}
}

func (uc *homeUsecase) validatePagination(start, end string) error {
	if _, err := strconv.Atoi(start); err != nil {
		return errors.New("invalid start parameter")
	}

	endInt, err := strconv.Atoi(end)
	if err != nil {
		return errors.New("invalid end parameter")
	}
	if endInt <= 0 || endInt > 1000 {
		return errors.New("end must be between 1-1000")
	}

	return nil
}

func (uc *homeUsecase) GetRandomArtistList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	if err := uc.validatePagination(start, end); err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetRandomArtistList(ctx, end, start)
}

func (uc *homeUsecase) GetRandomAlbumList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	if err := uc.validatePagination(start, end); err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetRandomAlbumList(ctx, end, start)
}

func (uc *homeUsecase) GetRandomMediaFileList(
	ctx context.Context,
	end, start string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	if err := uc.validatePagination(start, end); err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetRandomMediaFileList(ctx, end, start)
}
