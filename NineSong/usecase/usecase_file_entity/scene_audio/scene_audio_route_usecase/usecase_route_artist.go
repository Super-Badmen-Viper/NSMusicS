package scene_audio_route_usecase

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type ArtistUsecase struct {
	repo    scene_audio_route_interface.ArtistRepository
	timeout time.Duration
}

func NewArtistUsecase(repo scene_audio_route_interface.ArtistRepository, timeout time.Duration) *ArtistUsecase {
	return &ArtistUsecase{
		repo:    repo,
		timeout: timeout,
	}
}

func (uc *ArtistUsecase) GetArtistItems(
	ctx context.Context,
	end, order, sort, start, search, starred string,
) ([]scene_audio_route_models.ArtistMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	validations := []func() error{
		func() error {
			if _, err := strconv.Atoi(start); start != "" && err != nil {
				return errors.New("invalid start parameter")
			}
			return nil
		},
		func() error {
			if _, err := strconv.Atoi(end); end != "" && err != nil {
				return errors.New("invalid end parameter")
			}
			return nil
		},
		func() error {
			if starred != "" {
				if _, err := strconv.ParseBool(starred); err != nil {
					return errors.New("invalid starred parameter")
				}
			}
			return nil
		},
	}

	for _, validate := range validations {
		if err := validate(); err != nil {
			return nil, err
		}
	}

	return uc.repo.GetArtistItems(ctx, end, order, sort, start, search, starred)
}

func (uc *ArtistUsecase) GetArtistFilterItemsCount(
	ctx context.Context,
	search, starred string,
) (*scene_audio_route_models.ArtistFilterCounts, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// Starred参数验证
	if starred != "" {
		if _, err := strconv.ParseBool(starred); err != nil {
			return nil, errors.New("invalid starred parameter")
		}
	}

	return uc.repo.GetArtistFilterItemsCount(ctx, search, starred)
}
