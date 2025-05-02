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
	repo    scene_audio_route_interface.AnnotationRepository
	timeout time.Duration
}

func NewAnnotationUsecase(repo scene_audio_route_interface.AnnotationRepository, timeout time.Duration) scene_audio_route_interface.AnnotationRepository {
	return &annotationUsecase{
		repo:    repo,
		timeout: timeout,
	}
}

// region 参数校验
func (uc *annotationUsecase) validatePagination(start, end string) error {
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
func (uc *annotationUsecase) validateItemType(itemType string) error {
	validTypes := map[string]bool{"artist": true, "album": true, "media": true}
	if !validTypes[itemType] {
		return errors.New("invalid item_type, must be artist/album/media")
	}
	return nil
}
func validateRating(rating int) error {
	if rating < 0 || rating > 5 {
		return errors.New("rating must be between 0-5")
	}
	return nil
}

// endregion

func (uc *annotationUsecase) GetArtistList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	if err := uc.validatePagination(start, end); err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetArtistList(ctx, end, order, sort, start)
}

func (uc *annotationUsecase) GetRandomArtistList(
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

// endregion

func (uc *annotationUsecase) GetAlbumList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	if err := uc.validatePagination(start, end); err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetAlbumList(ctx, end, order, sort, start)
}

func (uc *annotationUsecase) GetRandomAlbumList(
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

// endregion

func (uc *annotationUsecase) GetMediaFileList(
	ctx context.Context,
	end, order, sort, start string,
) ([]scene_audio_route_models.MediaFileMetadata, error) {
	if err := uc.validatePagination(start, end); err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.GetMediaFileList(ctx, end, order, sort, start)
}

func (uc *annotationUsecase) GetRandomMediaFileList(
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

// endregion

func (uc *annotationUsecase) UpdateStarred(
	ctx context.Context,
	itemId, itemType string,
) (bool, error) {
	if err := uc.validateItemType(itemType); err != nil {
		return false, err
	}

	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.UpdateStarred(ctx, itemId, itemType)
}

func (uc *annotationUsecase) UpdateUnStarred(
	ctx context.Context,
	itemId, itemType string,
) (bool, error) {
	if err := uc.validateItemType(itemType); err != nil {
		return false, err
	}

	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.UpdateUnStarred(ctx, itemId, itemType)
}

func (uc *annotationUsecase) UpdateRating(
	ctx context.Context,
	itemId, itemType string,
	rating int,
) (bool, error) {
	if err := uc.validateItemType(itemType); err != nil {
		return false, err
	}

	if err := validateRating(rating); err != nil {
		return false, err
	}

	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.UpdateRating(ctx, itemId, itemType, rating)
}

func (uc *annotationUsecase) UpdateScrobble(
	ctx context.Context,
	itemId, itemType string,
) (bool, error) {
	if err := uc.validateItemType(itemType); err != nil {
		return false, err
	}

	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	return uc.repo.UpdateScrobble(ctx, itemId, itemType)
}

// endregion
