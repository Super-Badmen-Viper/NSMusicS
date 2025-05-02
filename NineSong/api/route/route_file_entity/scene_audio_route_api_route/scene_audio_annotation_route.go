package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity/scene_audio/scene_audio_route_repository"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity/scene_audio/scene_audio_route_usecase"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/bootstrap"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewAnnotationRouter(
	env *bootstrap.Env,
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	// 初始化依赖
	repo := scene_audio_route_repository.NewAnnotationRepository(db)
	uc := scene_audio_route_usecase.NewAnnotationUsecase(repo, timeout)
	ctrl := scene_audio_route_api_controller.NewAnnotationController(uc)

	// 路由分组
	router := group.Group("/annotations")
	{
		// 艺术家相关
		router.GET("/artists", ctrl.GetArtistList)
		router.GET("/artists/random", ctrl.GetRandomArtistList)

		// 专辑相关
		router.GET("/albums", ctrl.GetAlbumList)
		router.GET("/albums/random", ctrl.GetRandomAlbumList)

		// 媒体文件相关
		router.GET("/media", ctrl.GetMediaFileList)
		router.GET("/media/random", ctrl.GetRandomMediaFileList)

		// 标注操作
		router.POST("/star", ctrl.UpdateStarred)
		router.POST("/unstar", ctrl.UpdateUnStarred)
		router.POST("/rating", ctrl.UpdateRating)
		router.POST("/scrobble", ctrl.UpdateScrobble)
	}
}
