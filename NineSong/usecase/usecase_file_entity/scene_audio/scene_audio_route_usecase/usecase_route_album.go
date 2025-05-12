package scene_audio_route_usecase

import (
	"context"
	"errors"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AlbumUsecase struct {
	repo    scene_audio_route_interface.AlbumRepository
	timeout time.Duration
}

func NewAlbumUsecase(repo scene_audio_route_interface.AlbumRepository, timeout time.Duration) *AlbumUsecase {
	return &AlbumUsecase{
		repo:    repo,
		timeout: timeout,
	}
}

func (uc *AlbumUsecase) GetAlbumItems(
	ctx context.Context,
	end, order, sort, start, search, starred, artistId string,
	minYear, maxYear string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	validations := []func() error{
		// 分页参数验证
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
		// 艺术家ID格式验证
		func() error {
			if artistId != "" {
				if _, err := primitive.ObjectIDFromHex(artistId); err != nil {
					return errors.New("invalid artist id format")
				}
			}
			return nil
		},
		// 年份格式验证
		func() error {
			if minYear != "" {
				if _, err := strconv.Atoi(minYear); err != nil {
					return errors.New("invalid min_year format")
				}
			}
			return nil
		},
		func() error {
			if maxYear != "" {
				if _, err := strconv.Atoi(maxYear); err != nil {
					return errors.New("invalid max_year format")
				}
			}
			return nil
		},
		// Starred参数验证
		func() error {
			if starred != "" {
				if _, err := strconv.ParseBool(starred); err != nil {
					return errors.New("invalid starred format, must be true/false")
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

	return uc.repo.GetAlbumItems(ctx, end, order, sort, start, search, starred, artistId, minYear, maxYear)
}

func (uc *AlbumUsecase) GetAlbumFilterItemsCount(
	ctx context.Context,
	search, starred, artistId, minYear, maxYear string,
) (*scene_audio_route_models.AlbumFilterCounts, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 专项参数验证
	validations := []func() error{
		func() error {
			if starred != "" {
				if _, err := strconv.ParseBool(starred); err != nil {
					return errors.New("invalid starred parameter")
				}
			}
			return nil
		},
		func() error {
			if artistId != "" {
				if _, err := primitive.ObjectIDFromHex(artistId); err != nil {
					return errors.New("invalid artist id format")
				}
			}
			return nil
		},
		func() error {
			if minYear != "" {
				if _, err := strconv.Atoi(minYear); err != nil {
					return errors.New("invalid min_year format")
				}
			}
			return nil
		},
		func() error {
			if maxYear != "" {
				if _, err := strconv.Atoi(maxYear); err != nil {
					return errors.New("invalid max_year format")
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

	return uc.repo.GetAlbumFilterItemsCount(ctx, search, starred, artistId, minYear, maxYear)
}
