package scene_audio_route_usecase

import (
	"context"
	"errors"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
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
