package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity/scene_audio/scene_audio_route_repository"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity/scene_audio/scene_audio_route_usecase"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewAlbumRouter(
	env *bootstrap.Env,
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewAlbumRepository(db, domain.CollectionFileEntityAudioAlbum)

	usecase := scene_audio_route_usecase.NewAlbumUsecase(repo, timeout)
	ctrl := scene_audio_route_api_controller.NewAlbumController(usecase)

	albumGroup := group.Group("/albums")
	{
		albumGroup.GET("", ctrl.GetAlbumItems)
		// 可扩展其他路由
		// albumGroup.GET("/:id", ctrl.GetAlbumDetail)
	}
}
