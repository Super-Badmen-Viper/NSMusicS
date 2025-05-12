package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity/scene_audio/scene_audio_route_repository"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity/scene_audio/scene_audio_route_usecase"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewAnnotationRouter(
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewAnnotationRepository(db)
	uc := scene_audio_route_usecase.NewAnnotationUsecase(repo, timeout)
	ctrl := scene_audio_route_api_controller.NewAnnotationController(uc)

	router := group.Group("/annotations")
	{
		router.POST("/star", ctrl.UpdateStarred)
		router.POST("/unstar", ctrl.UpdateUnStarred)
		router.POST("/rating", ctrl.UpdateRating)
		router.POST("/scrobble", ctrl.UpdateScrobble)
	}
}
