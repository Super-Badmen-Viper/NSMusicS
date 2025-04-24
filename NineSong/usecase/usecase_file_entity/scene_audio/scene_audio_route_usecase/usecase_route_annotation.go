package scene_audio_route_usecase

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type annotationUsecase struct {
	repo        scene_audio_route_interface.AnnotationRepository
	timeout     time.Duration
	maxPageSize int
}

func NewAnnotationUsecase(repo scene_audio_route_interface.AnnotationRepository, timeout time.Duration) scene_audio_route_interface.AnnotationRepository {
	return &annotationUsecase{
		repo:        repo,
		timeout:     timeout,
		maxPageSize: 1000,
	}
}

func (a *annotationUsecase) GetArtistList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, a.timeout)
	defer cancel()

	if err := validatePaginationParams(start, end); err != nil {
		return nil, err
	}

	return a.repo.GetArtistList(ctx, end, order, sort, start)
}

func (a *annotationUsecase) GetAlbumList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, a.timeout)
	defer cancel()

	if err := validatePaginationParams(start, end); err != nil {
		return nil, err
	}

	return a.repo.GetAlbumList(ctx, end, order, sort, start)
}

func (a *annotationUsecase) GetMediaFileList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, a.timeout)
	defer cancel()

	if err := validatePaginationParams(start, end); err != nil {
		return nil, err
	}

	return a.repo.GetMediaFileList(ctx, end, order, sort, start)
}

func validatePaginationParams(start, end string) error {
	if _, err := strconv.Atoi(start); err != nil {
		return errors.New("start must be integer")
	}

	limit, err := strconv.Atoi(end)
	if err != nil || limit <= 0 || limit > 1000 {
		return errors.New("end must be 1-1000")
	}

	return nil
}
