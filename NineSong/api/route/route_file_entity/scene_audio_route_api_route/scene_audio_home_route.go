package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity/scene_audio/scene_audio_route_repository"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity/scene_audio/scene_audio_route_usecase"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewHomeRouter(
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewHomeRepository(db)
	uc := scene_audio_route_usecase.NewHomeUsecase(repo, timeout)
	ctrl := scene_audio_route_api_controller.NewHomeController(uc)

	router := group.Group("/homes")
	{
		router.GET("/artists/random", ctrl.GetRandomArtistList)
		router.GET("/albums/random", ctrl.GetRandomAlbumList)
		router.GET("/medias/random", ctrl.GetRandomMediaFileList)
	}
}
