package scene_audio_route_api_route

import (
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/api/controller/controller_file_entity/scene_audio_route_api_controller"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/domain"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/repository/repository_file_entity/scene_audio/scene_audio_route_repository"
	"github.com/amitshekhariitbhu/go-backend-clean-architecture/usecase/usecase_file_entity/scene_audio/scene_audio_route_usecase"
	"time"

	"github.com/amitshekhariitbhu/go-backend-clean-architecture/mongo"
	"github.com/gin-gonic/gin"
)

func NewMediaFileRouter(
	timeout time.Duration,
	db mongo.Database,
	group *gin.RouterGroup,
) {
	repo := scene_audio_route_repository.NewMediaFileRepository(db, domain.CollectionFileEntityAudioMediaFile)
	usecase := scene_audio_route_usecase.NewMediaFileUsecase(repo, timeout)
	ctrl := scene_audio_route_api_controller.NewMediaFileController(usecase)

	mediaGroup := group.Group("/medias")
	{
		mediaGroup.GET("", ctrl.GetMediaFiles)
		mediaGroup.GET("/filter_counts", ctrl.GetMediaFilterCounts)
	}
}
