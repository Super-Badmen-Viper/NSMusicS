package scene_audio_route_usecase

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"strconv"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_interface"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain/domain_file_entity/scene_audio/scene_audio_route/scene_audio_route_models"
)

type albumUsecase struct {
	albumRepo scene_audio_route_interface.AlbumRepository
	timeout   time.Duration
}

func NewAlbumUsecase(repo scene_audio_route_interface.AlbumRepository, timeout time.Duration) scene_audio_route_interface.AlbumRepository {
	return &albumUsecase{
		albumRepo: repo,
		timeout:   timeout,
	}
}

func (uc *albumUsecase) GetAlbumItems(
	ctx context.Context,
	end, order, sort, start, search, starred, artistId string,
) ([]scene_audio_route_models.AlbumMetadata, error) {
	ctx, cancel := context.WithTimeout(ctx, uc.timeout)
	defer cancel()

	// 参数验证
	if _, err := strconv.Atoi(start); err != nil && start != "" {
		return nil, errors.New("invalid start parameter")
	}
	if _, err := strconv.Atoi(end); err != nil && end != "" {
		return nil, errors.New("invalid end parameter")
	}

	// 转换artistId为ObjectID格式
	if artistId != "" {
		if _, err := primitive.ObjectIDFromHex(artistId); err != nil {
			return nil, errors.New("invalid artist id format")
		}
	}

	return uc.albumRepo.GetAlbumItems(ctx, end, order, sort, start, search, starred, artistId)
}
